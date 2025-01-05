import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useComputed } from '@preact/signals';
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
    SOUND_MENU_DADADADUM: translate('arcade.blocks.musicMenu.dadadadum', 'dadadadum'),
    SOUND_MENU_ENTERTAINER: translate('arcade.blocks.musicMenu.entertainer', 'entertainer'),
    SOUND_MENU_PRELUDE: translate('arcade.blocks.musicMenu.prelude', 'prelude'),
    SOUND_MENU_ODE: translate('arcade.blocks.musicMenu.ode', 'ode'),
    SOUND_MENU_NYAN: translate('arcade.blocks.musicMenu.nyan', 'nyan'),
    SOUND_MENU_RINGTONE: translate('arcade.blocks.musicMenu.ringtone', 'ringtone'),
    SOUND_MENU_FUNK: translate('arcade.blocks.musicMenu.funk', 'funk'),
    SOUND_MENU_BLUES: translate('arcade.blocks.musicMenu.blues', 'blues'),
    SOUND_MENU_BIRTHDAY: translate('arcade.blocks.musicMenu.birthday', 'birthday'),
    SOUND_MENU_WEDDING: translate('arcade.blocks.musicMenu.wedding', 'wedding'),
    SOUND_MENU_FUNERAL: translate('arcade.blocks.musicMenu.funeral', 'funeral'),
    SOUND_MENU_PUNCHLINE: translate('arcade.blocks.musicMenu.punchline', 'punchline'),
    SOUND_MENU_PYTHON: translate('arcade.blocks.musicMenu.python', 'python'),
    SOUND_MENU_BADDY: translate('arcade.blocks.musicMenu.baddy', 'baddy'),
    SOUND_MENU_CHASE: translate('arcade.blocks.musicMenu.chase', 'chase'),
    SOUND_MENU_BA_DING: translate('arcade.blocks.musicMenu.baDing', 'ba ding'),
    SOUND_MENU_WAWAWAWAA: translate('arcade.blocks.musicMenu.wawawawaa', 'wawawawaa'),
    SOUND_MENU_JUMP_UP: translate('arcade.blocks.musicMenu.jumpUp', 'jump up'),
    SOUND_MENU_JUMP_DOWN: translate('arcade.blocks.musicMenu.jumpDown', 'jump down'),
    SOUND_MENU_POWER_UP: translate('arcade.blocks.musicMenu.powerUp', 'power up'),
    SOUND_MENU_POWER_DOWN: translate('arcade.blocks.musicMenu.powerDown', 'power down'),
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
  const backdropId = stage.assets[stage.frame];
  const costumeId = target.assets[target.frame];
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
      costumeId,
      target.x,
      target.y,
      // 声音信息
      soundRes ? soundRes.id : '',
    );
  }, [translator, target, backdropId, costumeId, soundRes]);

  // 为舞台和角色分别预处理编译程序
  const handleDefinitions = useCallback(
    (emuName, defer, useExtensions, index) => {
      const res = files.value?.[index];
      if (!res) return;

      // 模拟器代码
      if (emuName === emulator.name_) {
        defer('target_utils', 'const targetUtils = runtime.targetUtils;');
        defer('define_stage', `const stage = runtime.querySelector('#_stage_');`);
        defer('defing_target', `const target = ${index === 0 ? 'stage;' : `runtime.querySelector('#${res.id}');`}`);
        return;
      }

      // 设备代码
      if (emuName === generator.name_) {
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
        for (const id in useExtensions) {
          for (const extModule of useExtensions[id]) {
            defer(`import_${id}_${extModule.name}`, `from ${id} import ${extModule.name}`);
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
        onMakeToolboxXML={handleMakeToolboxXML}
        onDefinitions={handleDefinitions}
        onExtensionsFilter={() => ['arcade', 'communication', 'data', ['sensor', '!multipin']]}
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
