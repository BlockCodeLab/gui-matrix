import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useLocalesContext, useProjectContext, translate } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { MatrixemuGenerator } from '../../generators/matrixemu';
import { makeToolboxXML } from '../../lib/make-toolbox-xml';
import { buildBlocks } from '../../blocks/blocks';

import { BlocksEditor } from '@blockcode/blocks';
import styles from './blocks-editor.module.css';

// 需要动态更新的XY坐标积木IDs
const XYBlocks = ['glide', 'move', 'set'];

// 扩展过滤
const handleExtensionsFilter = () => [['emulator', '!device']];

// 动态更新XY坐标积木
const updateToolboxBlockValue = (workspace, id, value) => {
  const block = workspace.getBlockById(id);
  if (block) {
    block.inputList[0].fieldRow[0].setValue(value);
  }
};

// 代码转换
const emulator = new MatrixemuGenerator();

export function MatrixBlocksEditor() {
  const { translator } = useLocalesContext();

  const { files, fileId, file, assets, modified } = useProjectContext();

  const messages = {
    LOOKS_TEXTBUBLLE: translate('matrix.blocks.textBubble', '%1 %2'),
    LOOKS_TEXTBUBLLE_FORSECS: translate('matrix.blocks.textBubbleAndWait', '%1 %2 for %3 seconds'),
    LOOKS_SAY_TEXT: translate('matrix.blocks.say', 'say'),
    LOOKS_SHOUT_TEXT: translate('matrix.blocks.shout', 'shout'),
    LOOKS_THINK_TEXT: translate('matrix.blocks.think', 'think'),
    LOOKS_SPARK_TEXT: translate('matrix.blocks.spark', 'spark'),
    CONTROL_STOP_OTHER: translate('matrix.blocks.stopOther', 'other scripts in sprite'),
    UNSUPPORTED: translate('matrix.blocks.unsupported', 'unsupported block'),
  };

  const stage = files.value[0];
  const target = file.value; // 统一舞台或角色
  const isStage = stage && fileId.value === stage.id;

  // 右上角缩略图
  const thumbUrl = useMemo(() => {
    const image = assets.value.find((asset) => asset.id === file.value.assets[target.frame]);
    if (image) {
      return `data:${image.type};base64,${image.data}`;
    }
    return null;
  }, [fileId.value, target.frame, modified.value]);

  // 动态更新XY坐标积木
  useEffect(() => {
    if (isStage) return;

    const workspace = ScratchBlocks.getMainWorkspace();
    if (workspace) {
      XYBlocks.forEach((prefix) => {
        updateToolboxBlockValue(workspace, `${prefix}x`, Math.round(target.x).toString());
        updateToolboxBlockValue(workspace, `${prefix}y`, Math.round(target.y).toString());
      });
    }
  }, [modified.value]);

  // 生成积木栏
  const backdropId = stage.assets[0];
  const soundRes = assets.value.find?.((res) => res.type.startsWith('audio/')); // 第一个声音资源

  const handleMakeToolboxXML = useCallback(() => {
    // 编译动态积木
    buildBlocks(assets.value, files.value, fileId.value, translator);

    return makeToolboxXML(
      // 舞台信息
      isStage,
      backdropId,
      // 角色信息
      files.value.length - 1,
      target.assets[0],
      target.x,
      target.y,
      // 声音信息
      soundRes ? soundRes.id : '',
    );
  }, [isStage, translator, target, backdropId, soundRes]);

  // 根据选中的舞台或角色过滤积木
  const handleExtensionBlockFilter = useCallback(
    (block) => {
      if (isStage) {
        return block.forStage !== false;
      }
      return block.forSprite !== false;
    },
    [isStage],
  );

  // 为舞台和角色分别预处理编译程序
  const handleDefinitions = useCallback((emuName, defer, resources, index) => {
    const res = files.value?.[index];
    if (!res) return;

    // 模拟器代码
    if (emuName === emulator.name_) {
      defer('target_utils', 'const targetUtils = runtime.targetUtils;');
      defer('define_stage', `const stage = runtime.querySelector('#_stage_');`);
      defer('defing_target', `const target = ${index === 0 ? 'stage;' : `runtime.querySelector('#${res.id}');`}`);
      return;
    }
  }, []);

  return (
    <>
      <BlocksEditor
        enableMultiTargets
        enableMyBlockWarp
        messages={messages}
        emulator={emulator}
        enableLocalVariable={!isStage}
        dataMonitorClassName={styles.dataMonitor}
        onExtensionBlockFilter={handleExtensionBlockFilter}
        onMakeToolboxXML={handleMakeToolboxXML}
        onDefinitions={handleDefinitions}
        onExtensionsFilter={handleExtensionsFilter}
      />

      {thumbUrl && (
        <div className={styles.targetThumb}>
          <img
            className={styles.thumbImage}
            src={thumbUrl}
          />
        </div>
      )}
    </>
  );
}
