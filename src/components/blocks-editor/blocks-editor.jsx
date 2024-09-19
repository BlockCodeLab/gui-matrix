import { useLocale, useLayout, useEditor } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from '@blockcode/blocks-player';
import { codeTab, pythonGenerator } from '@blockcode/workspace-blocks/app';
import uid from '../../lib/uid';

import makeToolboxXML from '../../lib/make-toolbox-xml';
import buildBlocks from '../../blocks';

import styles from './blocks-editor.module.css';

const Editor = codeTab.Content;

export default function BlocksEditor() {
  const { getText, maybeLocaleText } = useLocale();
  const { selectTab } = useLayout();
  const { name, fileList, assetList, selectedFileId, modifyFile, addAsset } = useEditor();
  const isStage = selectedFileId === fileList[0].id;

  const messages = {
    WIFI_ISCONNECTED: getText('arcade.blocks.isConnected', 'Wi-Fi is connected?'),
    WIFI_WHENCONNECTED: getText('arcade.blocks.whenConnected', 'when Wi-Fi connected'),
    WIFI_CONNECTTO: getText('arcade.blocks.connectTo', 'connect Wi-Fi: %1 password: %2'),
    WIFI_DISCONNECT: getText('arcade.blocks.disconnect', 'disconnect Wi-Fi'),
    EVENT_WHENKEYPRESSED_FN: getText('arcade.blocks.fnButton', 'fn'),
    CONTROL_STOP_OTHER: getText('arcade.blocks.stopOther', 'other scripts in sprite'),
    SENSING_TOUCHINGOBJECT_EXACT: getText('arcade.blocks.touchingExact', 'touching %1 (careful)'),
    SENSING_OF_DISTANCETO_CENTER: getText('arcade.blocks.sensingOfDistanceto.center', 'center'),
    SENSING_JOYSTICK_X: getText('arcade.blocks.joystick.x', 'joystick x axis'),
    SENSING_JOYSTICK_Y: getText('arcade.blocks.joystick.y', 'joystick y axis'),
    SOUND_EFFECTS_TEMPO: getText('arcade.blocks.soundEffects.tempo', 'tempo'),
    SOUND_MENU_DADADADUM: getText('arcade.blocks.musicMenu.dadadadum', 'dadadadum'),
    SOUND_MENU_ENTERTAINER: getText('arcade.blocks.musicMenu.entertainer', 'entertainer'),
    SOUND_MENU_PRELUDE: getText('arcade.blocks.musicMenu.prelude', 'prelude'),
    SOUND_MENU_ODE: getText('arcade.blocks.musicMenu.ode', 'ode'),
    SOUND_MENU_NYAN: getText('arcade.blocks.musicMenu.nyan', 'nyan'),
    SOUND_MENU_RINGTONE: getText('arcade.blocks.musicMenu.ringtone', 'ringtone'),
    SOUND_MENU_FUNK: getText('arcade.blocks.musicMenu.funk', 'funk'),
    SOUND_MENU_BLUES: getText('arcade.blocks.musicMenu.blues', 'blues'),
    SOUND_MENU_BIRTHDAY: getText('arcade.blocks.musicMenu.birthday', 'birthday'),
    SOUND_MENU_WEDDING: getText('arcade.blocks.musicMenu.wedding', 'wedding'),
    SOUND_MENU_FUNERAL: getText('arcade.blocks.musicMenu.funeral', 'funeral'),
    SOUND_MENU_PUNCHLINE: getText('arcade.blocks.musicMenu.punchline', 'punchline'),
    SOUND_MENU_PYTHON: getText('arcade.blocks.musicMenu.python', 'python'),
    SOUND_MENU_BADDY: getText('arcade.blocks.musicMenu.baddy', 'baddy'),
    SOUND_MENU_CHASE: getText('arcade.blocks.musicMenu.chase', 'chase'),
    SOUND_MENU_BA_DING: getText('arcade.blocks.musicMenu.baDing', 'ba ding'),
    SOUND_MENU_WAWAWAWAA: getText('arcade.blocks.musicMenu.wawawawaa', 'wawawawaa'),
    SOUND_MENU_JUMP_UP: getText('arcade.blocks.musicMenu.jumpUp', 'jump up'),
    SOUND_MENU_JUMP_DOWN: getText('arcade.blocks.musicMenu.jumpDown', 'jump down'),
    SOUND_MENU_POWER_UP: getText('arcade.blocks.musicMenu.powerUp', 'power up'),
    SOUND_MENU_POWER_DOWN: getText('arcade.blocks.musicMenu.powerDown', 'power down'),
  };

  buildBlocks(assetList, fileList, selectedFileId, maybeLocaleText, () => {
    addAsset({
      id: uid(),
      type: 'audio/wav',
      name: getText(`waveSurfer.surfer.sound`, 'Sound'),
      data: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQAAAAA=',
      rate: 11025,
      sampleCount: 0,
      record: true,
    });
    selectTab(2);
  });

  const stage = fileList[0];
  const target = fileList.find((file) => file.id === selectedFileId); // stage or sprite

  let thumb;
  if (target) {
    const image = assetList.find((asset) => asset.id === target.assets[target.frame]);
    if (image) {
      thumb = `data:${image.type};base64,${image.data}`;
    }
  }

  const backdropValue = stage.assets[stage.frame];
  const costumeValue = target.assets[target.frame];
  const soundValue = assetList.find((asset) => asset.type === 'audio/wav');
  const toolbox = makeToolboxXML(
    isStage,
    fileList.length - 1,
    backdropValue,
    costumeValue,
    soundValue ? soundValue.id : '',
  );

  const updateToolboxBlockValue = (id, value) => {
    const workspace = ScratchBlocks.getMainWorkspace();
    const block = workspace.getBlockById(id);
    if (block) {
      block.inputList[0].fieldRow[0].setValue(value);
    }
  };
  setTimeout(() => {
    const workspace = ScratchBlocks.getMainWorkspace();
    if (workspace) {
      if (!isStage) {
        ['glide', 'move', 'set'].forEach((prefix) => {
          updateToolboxBlockValue(`${prefix}x`, Math.round(target.x).toString());
          updateToolboxBlockValue(`${prefix}y`, Math.round(target.y).toString());
        });
      }

      const newCode = pythonGenerator.workspaceToCode(workspace);
      if (target.content !== newCode) {
        modifyFile({ content: newCode });
      }
    }
  }, 1);

  const handleLoadExtension = ({ id: extensionId, blocks }) => {
    // generate javascript for player
    blocks.forEach((block) => {
      const blockId = `${extensionId}_${block.id.toLowerCase()}`;
      if (block.vm) {
        javascriptGenerator[blockId] = block.vm.bind(javascriptGenerator);
      } else {
        javascriptGenerator[blockId] = () => '';
      }
    });
  };

  const listAssets = (assets) => {
    const res = {
      imports: [],
      modules: [],
    };
    for (const assetId of assets) {
      const asset = assetList.find((asset) => asset.id === assetId);
      if (asset) {
        const moduleName = `image${asset.id}`;
        res.imports.push(`import ${moduleName}`);
        res.modules.push(moduleName);
      }
    }
    return res;
  };

  const targetAssets = listAssets(target.assets);
  pythonGenerator.additionalDefinitions_ = isStage
    ? [
        ['import_backdrops', targetAssets.imports.join('\n')],
        ['create_stage', `stage = target = Stage(runtime, "${name}", (${targetAssets.modules},), ${stage.frame})`],
      ]
    : [
        ['import_stage', 'from stage import stage'],
        ['import_costumes', targetAssets.imports.join('\n')],
        [
          'create_sprite',
          `target = Sprite(runtime, stage, "${target.id}", "${maybeLocaleText(target.name)}", ${[
            `(${targetAssets.modules.join(',')},)`,
            target.frame,
            Math.round(target.x),
            Math.round(target.y),
            Math.round(target.size),
            Math.round(target.direction),
            target.rotationStyle,
            target.hidden ? 'True' : 'False',
          ].join(', ')})`,
        ],
      ];

  return (
    <>
      <Editor
        disableThumb
        enableMultiTargets
        enableLocalVariable={!isStage}
        toolbox={toolbox}
        messages={messages}
        deviceId="arcade"
        onExtensionsFilter={() => ['blocks', ['arcade', 'pwm', 'adc', 'signal', 'data']]}
        onLoadExtension={handleLoadExtension}
      />

      {thumb && (
        <div className={styles.targetThumb}>
          <img
            className={styles.thumbImage}
            src={thumb}
          />
        </div>
      )}
    </>
  );
}
