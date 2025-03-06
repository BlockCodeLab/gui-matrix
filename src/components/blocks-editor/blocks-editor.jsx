import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useProjectContext, translate } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { MatrixEmulatorGenerator, buildBlocks } from '../../blocks/blocks';

import { BlocksEditor } from '@blockcode/blocks';
import styles from './blocks-editor.module.css';

// 扩展过滤
const handleExtensionsFilter = () => ['emulator', '!device'];

// 需要动态更新的XY坐标积木IDs
const XYBlocks = ['glide', 'move', 'set'];

// 动态更新XY坐标积木
const updateToolboxBlockValue = (workspace, id, value) => {
  const block = workspace.getBlockById(id);
  if (block) {
    block.inputList[0].fieldRow[0].setValue(value);
  }
};

// 代码转换
const emulator = new MatrixEmulatorGenerator();

// 变量监视偏移
const monitorOffset = { top: 'calc(1.25rem + 48px + var(--space))' };

export function MatrixBlocksEditor() {
  const { files, fileId, file, assets, modified } = useProjectContext();

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
    if (files.value[0]?.id === fileId.value) return;

    const workspace = ScratchBlocks.getMainWorkspace();
    if (workspace) {
      XYBlocks.forEach((prefix) => {
        updateToolboxBlockValue(workspace, `${prefix}x`, Math.round(target.x).toString());
        updateToolboxBlockValue(workspace, `${prefix}y`, Math.round(target.y).toString());
      });
    }
  }, [modified.value]);

  // 编译动态积木
  const handleBuildinExtensions = useCallback(() => {
    return buildBlocks(assets.value, files.value, file.value);
  }, []);

  // 根据选中的舞台或角色过滤积木
  const handleExtensionBlockFilter = useCallback((block) => {
    if (files.value[0]?.id === fileId.value) {
      return block.forStage !== false;
    }
    return block.forSprite !== false;
  }, []);

  // 为舞台和角色分别预处理编译程序
  const handleDefinitions = useCallback((name, define, resources, index) => {
    const res = files.value?.[index];
    if (!res) return;

    // 模拟器代码
    if (name === emulator.name_) {
      define('target_utils', 'const targetUtils = runtime.targetUtils;');
      define('define_stage', `const stage = runtime.querySelector('#_stage_');`);
      define('defing_target', `const target = ${index === 0 ? 'stage;' : `runtime.querySelector('#${res.id}');`}`);
      return;
    }
  }, []);

  return (
    <>
      <BlocksEditor
        enableMyBlockWarp
        enableMultiTargets
        enableStringBlocks
        emulator={emulator}
        enableCloneBlocks={!isStage}
        enableLocalVariable={!isStage}
        monitorOffset={monitorOffset}
        onDefinitions={handleDefinitions}
        onBuildinExtensions={handleBuildinExtensions}
        onExtensionBlockFilter={handleExtensionBlockFilter}
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
