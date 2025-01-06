import { useSignal } from '@preact/signals';
import { classNames } from '@blockcode/utils';
import {
  useLocalesContext,
  useAppContext,
  useProjectContext,
  translate,
  maybeTranslate,
  setFile,
} from '@blockcode/core';
import { StageConfig, RotationStyle } from '../emulator/emulator-config';

import { Text, ToggleButtons, Button, Label, BufferedInput } from '@blockcode/core';
import { DirectionPicker } from '../direction-picker/direction-picker';
import styles from './sprite-info.module.css';

import hideIcon from './icons/icon-hide.svg';
import showIcon from './icons/icon-show.svg';
import xIcon from './icons/icon-x.svg';
import yIcon from './icons/icon-y.svg';
import { useCallback, useEffect } from 'preact/hooks';

const BLANK_INFO = {
  name: '',
  x: '',
  y: '',
  size: '',
  direction: '',
  hidden: false,
  rotationStyle: RotationStyle.ALL_AROUND,
};

export function SpriteInfo() {
  const { translator } = useLocalesContext();

  const { appState } = useAppContext();

  const { fileIndex, file, modified } = useProjectContext();

  const sprite = useSignal(BLANK_INFO);

  const isStage = fileIndex.value === 0;
  const disabled = appState.value?.running || isStage;

  useEffect(() => {
    sprite.value = isStage ? BLANK_INFO : file.value;
  }, [fileIndex.value, modified.value]);

  const handleChangeInfo = useCallback((key, value) => {
    if (key === 'name') {
      value = value.trim();
      if (value.length === 0) {
        value = translate('matrix.spriteInfo.sprite', 'Sprite', translator);
      }
    }
    if (key === 'size' && value < 5) {
      value = 5;
    }
    setFile({ [key]: value });
  }, []);

  const nameInput = (
    <BufferedInput
      disabled={disabled}
      className={appState.value?.stageSize !== StageConfig.Large ? styles.fullInput : styles.nameInput}
      placeholder={translate('matrix.spriteInfo.name', 'Name')}
      onSubmit={(val) => handleChangeInfo('name', val)}
      value={maybeTranslate(sprite.value.name)}
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
          {
            <Text
              id="matrix.spriteInfo.x"
              defaultMessage="x"
            />
          }
        </>
      }
    >
      <BufferedInput
        small
        type="number"
        disabled={disabled}
        placeholder={translate('matrix.spriteInfo.x', 'x')}
        onSubmit={(val) => handleChangeInfo('x', val)}
        value={Math.round(sprite.value.x)}
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
          {
            <Text
              id="matrix.spriteInfo.y"
              defaultMessage="y"
            />
          }
        </>
      }
    >
      <BufferedInput
        small
        type="number"
        disabled={disabled}
        placeholder={translate('matrix.spriteInfo.y', 'y')}
        onSubmit={(val) => handleChangeInfo('y', val)}
        value={Math.round(sprite.value.y)}
      />
    </Label>
  );

  return (
    <div className={styles.spriteInfoWrapper}>
      {appState.value?.stageSize !== StageConfig.Large ? (
        <>
          <div className={classNames(styles.row, styles.rowPrimary)}>{nameInput}</div>
          <div className={styles.row}>
            {/* <Button
              disabled={disabled}
              className={classNames(styles.button, {
                [styles.groupButtonToggledOff]: disabled || sprite.value.hidden,
              })}
              onClick={() => handleChangeInfo('hidden', !sprite.value.hidden)}
            >
              <img
                src={sprite.value.hidden ? hideIcon : showIcon}
                className={styles.buttonIcon}
                title={
                  sprite.value.hidden
                    ? translate('matrix.spriteInfo.hide', 'Hide')
                    : translate('matrix.spriteInfo.show', 'Show')
                }
              />
            </Button> */}
            {xInput}
            {yInput}
          </div>
        </>
      ) : (
        <>
          <div className={classNames(styles.row, styles.rowPrimary)}>
            <Label
              text={
                <Text
                  id="matrix.spriteInfo.sprite"
                  defaultMessage="Sprite"
                />
              }
            >
              {nameInput}
            </Label>
            {xInput}
            {yInput}
          </div>
          <div className={styles.row}>
            <Label
              secondary
              text={
                <Text
                  id="matrix.spriteInfo.display"
                  defaultMessage="Show"
                />
              }
            >
              <ToggleButtons
                items={[
                  {
                    icon: showIcon,
                    title: (
                      <Text
                        id="matrix.spriteInfo.show"
                        defaultMessage="Show sprite"
                      />
                    ),
                    value: false,
                  },
                  {
                    icon: hideIcon,
                    title: (
                      <Text
                        id="matrix.spriteInfo.hide"
                        defaultMessage="Hide sprite"
                      />
                    ),
                    value: true,
                  },
                ]}
                disabled={disabled}
                value={!!sprite.value.hidden}
                onChange={(val) => handleChangeInfo('hidden', val)}
              />
            </Label>
            <Label
              secondary
              text={
                <Text
                  id="matrix.spriteInfo.size"
                  defaultMessage="Size"
                />
              }
            >
              <BufferedInput
                small
                type="number"
                disabled={disabled}
                className={styles.largeInput}
                onSubmit={(val) => handleChangeInfo('size', val)}
                value={Math.round(sprite.value.size)}
              />
            </Label>
            <Label
              secondary
              text={
                <Text
                  id="matrix.spriteInfo.direction"
                  defaultMessage="Direction"
                />
              }
            >
              <DirectionPicker
                direction={sprite.value.direction}
                rotationStyle={sprite.value.rotationStyle}
                onChange={(val) => handleChangeInfo('direction', val)}
                onChangeRotationStyle={(val) => handleChangeInfo('rotationStyle', val)}
              >
                <BufferedInput
                  small
                  type="number"
                  disabled={disabled}
                  className={styles.largeInput}
                  onSubmit={(val) => handleChangeInfo('direction', val)}
                  value={Math.round(sprite.value.direction)}
                />
              </DirectionPicker>
            </Label>
          </div>
        </>
      )}
    </div>
  );
}
