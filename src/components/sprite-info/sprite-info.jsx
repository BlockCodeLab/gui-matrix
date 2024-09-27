import { useLocale, useEditor } from '@blockcode/core';
import { classNames, ToggleButtons, Button, Label, BufferedInput } from '@blockcode/ui';
import { ScratchBlocks } from '@blockcode/blocks-editor';
import { pythonGenerator } from '../../generators/python';
import RotationStyle from '../../lib/rotation-style';

import DirectionPicker from '../direction-picker/direction-picker';

import styles from './sprite-info.module.css';
import hideIcon from './icon-hide.svg';
import showIcon from './icon-show.svg';
import xIcon from './icon-x.svg';
import yIcon from './icon-y.svg';

export default function SpriteInfo({ playing, stageSize }) {
  const { getText, maybeLocaleText } = useLocale();
  const { fileList, selectedFileId, modifyFile } = useEditor();

  const isStage = selectedFileId === fileList[0].id;
  const disabled = playing || isStage;

  const sprite = isStage
    ? {
        name: '',
        x: '',
        y: '',
        size: '',
        direction: '',
        rotationStyle: RotationStyle.ALL_AROUND,
      }
    : fileList.find((file) => file.id === selectedFileId);

  const handleChangeInfo = (key, value) => {
    if (key === 'name') {
      value = value.trim();
      if (value.length === 0) {
        value = getText('arcade.spriteInfo.sprite', 'Sprite');
      }
    }
    if (key === 'size' && value < 5) {
      value = 5;
    }

    setTimeout(() => {
      const workspace = ScratchBlocks.getMainWorkspace();
      if (workspace) {
        const content = pythonGenerator.workspaceToCode(workspace);
        modifyFile({ content });
      }
    });
    modifyFile({ [key]: value });
  };

  const nameInput = (
    <BufferedInput
      disabled={disabled}
      className={stageSize === 'small' ? styles.fullInput : styles.nameInput}
      placeholder={getText('arcade.spriteInfo.name', 'Name')}
      onSubmit={(value) => handleChangeInfo('name', value)}
      value={maybeLocaleText(sprite.name)}
    />
  );

  const xInput = (
    <Label
      text={
        <>
          <img
            className={styles.labelImage}
            src={xIcon}
          />
          {getText('arcade.spriteInfo.x', 'x')}
        </>
      }
    >
      <BufferedInput
        small
        disabled={disabled}
        placeholder={getText('arcade.spriteInfo.x', 'x')}
        onSubmit={(value) => handleChangeInfo('x', value)}
        value={Math.round(sprite.x)}
      />
    </Label>
  );

  const yInput = (
    <Label
      text={
        <>
          <img
            className={styles.labelImage}
            src={yIcon}
          />
          {getText('arcade.spriteInfo.y', 'y')}
        </>
      }
    >
      <BufferedInput
        small
        disabled={disabled}
        placeholder={getText('arcade.spriteInfo.y', 'y')}
        onSubmit={(value) => handleChangeInfo('y', value)}
        value={Math.round(sprite.y)}
      />
    </Label>
  );

  if (stageSize === 'small') {
    return (
      <div className={styles.spriteInfoWrapper}>
        <div className={classNames(styles.row, styles.rowPrimary)}>{nameInput}</div>
        <div className={styles.row}>
          <Button
            disabled={disabled}
            className={classNames(styles.button, {
              [styles.groupButtonToggledOff]: disabled || sprite.hidden,
            })}
            onClick={() => handleChangeInfo('hidden', !sprite.hidden)}
          >
            <img
              src={sprite.hidden ? hideIcon : showIcon}
              className={styles.buttonIcon}
              title={
                sprite.hidden ? getText('arcade.spriteInfo.hide', 'Hide') : getText('arcade.spriteInfo.show', 'Show')
              }
            />
          </Button>
          {xInput}
          {yInput}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.spriteInfoWrapper}>
      <div className={classNames(styles.row, styles.rowPrimary)}>
        <Label text={getText('arcade.spriteInfo.sprite', 'Sprite')}>{nameInput}</Label>
        {xInput}
        {yInput}
      </div>
      <div className={styles.row}>
        <Label
          secondary
          text={getText('arcade.spriteInfo.display', 'Show')}
        >
          <ToggleButtons
            items={[
              {
                icon: showIcon,
                title: getText('arcade.spriteInfo.show', 'Show sprite'),
                value: false,
              },
              {
                icon: hideIcon,
                title: getText('arcade.spriteInfo.hide', 'Hide sprite'),
                value: true,
              },
            ]}
            disabled={disabled}
            value={!!sprite.hidden}
            onChange={(value) => handleChangeInfo('hidden', value)}
          />
        </Label>
        <Label
          secondary
          text={getText('arcade.spriteInfo.size', 'Size')}
        >
          <BufferedInput
            small
            disabled={disabled}
            className={styles.largeInput}
            onSubmit={(value) => handleChangeInfo('size', value)}
            value={Math.round(sprite.size)}
          />
        </Label>
        <Label
          secondary
          text={getText('arcade.spriteInfo.direction', 'Direction')}
        >
          <DirectionPicker
            direction={sprite.direction}
            rotationStyle={sprite.rotationStyle}
            onChange={(value) => handleChangeInfo('direction', value)}
            onChangeRotationStyle={(value) => handleChangeInfo('rotationStyle', value)}
          >
            <BufferedInput
              small
              disabled={disabled}
              className={styles.largeInput}
              onSubmit={(value) => handleChangeInfo('direction', value)}
              value={Math.round(sprite.direction)}
            />
          </DirectionPicker>
        </Label>
      </div>
    </div>
  );
}
