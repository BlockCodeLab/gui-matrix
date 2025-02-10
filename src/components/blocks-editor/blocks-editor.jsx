import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useLocalesContext, useProjectContext, translate } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { ArcademuGenerator } from '../../generators/arcademu';
import { ArcadepyGenerator } from '../../generators/arcadepy';
import { makeToolboxXML } from '../../lib/make-toolbox-xml';
import { buildBlocks } from '../../blocks/blocks';

import { BlocksEditor } from '@blockcode/blocks';
import styles from './blocks-editor.module.css';

// 需要动态更新的XY坐标积木IDs
const XYBlocks = ['glide', 'move', 'set'];

// 扩展过滤
const handleExtensionsFilter = () => ['arcade', 'communication', 'data', ['sensor', '!multipin']];

// 动态更新XY坐标积木
const updateToolboxBlockValue = (workspace, id, value) => {
  const block = workspace.getBlockById(id);
  if (block) {
    block.inputList[0].fieldRow[0].setValue(value);
  }
};

// 代码转换
const emulator = new ArcademuGenerator();
const generator = new ArcadepyGenerator();

const escape = (name) => name.replaceAll(/[^a-z0-9]/gi, '_');

export function ArcadeBlocksEditor() {
  const { translator } = useLocalesContext();

  const { name, files, fileId, file, assets, modified } = useProjectContext();

  const messages = {
    LOOKS_TEXTBUBLLE: translate('arcade.blocks.textBubble', '%1 %2'),
    LOOKS_TEXTBUBLLE_FORSECS: translate('arcade.blocks.textBubbleAndWait', '%1 %2 for %3 seconds'),
    LOOKS_SAY_TEXT: translate('arcade.blocks.say', 'say'),
    LOOKS_SHOUT_TEXT: translate('arcade.blocks.shout', 'shout'),
    LOOKS_THINK_TEXT: translate('arcade.blocks.think', 'think'),
    LOOKS_SPARK_TEXT: translate('arcade.blocks.spark', 'spark'),
    WIFI_ISCONNECTED: translate('arcade.blocks.isConnected', 'Wi-Fi is connected?'),
    WIFI_WHENCONNECTED: translate('arcade.blocks.whenConnected', 'when Wi-Fi connected'),
    WIFI_CONNECTTO: translate('arcade.blocks.connectTo', 'connect Wi-Fi: %1 password: %2'),
    WIFI_DISCONNECT: translate('arcade.blocks.disconnect', 'disconnect Wi-Fi'),
    EVENT_WHENKEYPRESSED_FN: translate('arcade.blocks.fnButton', 'fn'),
    CONTROL_STOP_OTHER: translate('arcade.blocks.stopOther', 'other scripts in sprite'),
    SENSING_TOUCHINGOBJECT_EXACT: translate('arcade.blocks.touchingExact', 'touching %1 (careful)'),
    SENSING_OF_DISTANCETO_CENTER: translate('arcade.blocks.sensingOfDistanceto.center', 'center'),
    SENSING_JOYSTICK_X: translate('arcade.blocks.joystick.x', 'joystick x axis'),
    SENSING_JOYSTICK_Y: translate('arcade.blocks.joystick.y', 'joystick y axis'),
    SOUND_EFFECTS_TEMPO: translate('arcade.blocks.soundEffects.tempo', 'tempo'),
    UNSUPPORTED: translate('arcade.blocks.unsupported', 'unsupported block'),
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
  const handleDefinitions = useCallback(
    (genName, defer, resources, index) => {
      const res = files.value?.[index];
      if (!res) return;

      // 模拟器代码
      if (genName === emulator.name_) {
        defer('target_utils', 'const targetUtils = runtime.targetUtils;');
        defer('define_stage', `const stage = runtime.querySelector('#_stage_');`);
        defer('defing_target', `const target = ${index === 0 ? 'stage;' : `runtime.querySelector('#${res.id}');`}`);
        return;
      }

      // 设备代码
      if (genName === generator.name_) {
        defer('import_blocks', 'from scratch import *');

        // 根据编辑目标的资源表收集资源导入文件
        const imageModules = [];

        let imageName;
        for (const id of res.assets) {
          imageName = `image${id}`;
          imageModules.push(imageName);
        }

        // 舞台
        if (index === 0) {
          const stageName = name.value || translate('gui.project.shortname', 'Untitled', translator);
          defer(
            'define_stage',
            `stage = Stage(runtime, "${stageName}", (${imageModules.join(',')},), ${res.frame})\ntarget = stage`,
          );
        } else {
          // 角色
          const spriteProps = [
            `(${imageModules.join(',')},)`,
            res.frame,
            Math.round(res.x),
            Math.round(res.y),
            Math.round(res.size),
            Math.round(res.direction),
            res.rotationStyle,
            res.hidden ? 'True' : 'False',
          ];
          defer('import_stage', 'from _stage_ import stage');
          defer(
            'define_sprite',
            `target = Sprite(runtime, stage, "${res.id}", "${res.name}", ${spriteProps.join(',')})`,
          );
        }

        // 导入资源
        defer(`import_images`, imageModules.map((imageName) => `import ${imageName}`).join('\n'));

        // 导入使用的扩展
        for (const id in resources) {
          for (const extModule of resources[id]) {
            defer(`import_${id}_${extModule.name}`, `from ext.${escape(id)} import ${extModule.name}`);
          }
        }
      }
    },
    [translator],
  );

  return (
    <>
      <BlocksEditor
        enableMultiTargets
        enableMyBlockWarp
        messages={messages}
        emulator={emulator}
        generator={generator}
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
