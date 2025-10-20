import { useCallback, useMemo } from 'preact/hooks';
import { classNames } from '@blockcode/utils';
import { useAppContext, useProjectContext, translate, maybeTranslate, setFile } from '@blockcode/core';
import { StageConfig, RotationStyle } from '../emulator/emulator-config';

import { Text, ToggleButtons, Button, Label, BufferedInput } from '@blockcode/core';
import { DirectionPicker } from '../direction-picker/direction-picker';
import styles from './sprite-info.module.css';

import hideIcon from './icons/icon-hide.svg';
import showIcon from './icons/icon-show.svg';
import xIcon from './icons/icon-x.svg';
import yIcon from './icons/icon-y.svg';

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
  const { splashVisible, appState } = useAppContext();

  const { fileIndex, file, modified } = useProjectContext();

  const isStage = fileIndex.value === 0;
  const disabled = appState.value?.running || isStage;

  const sprite = useMemo(
    () => (isStage ? BLANK_INFO : file.value),
    [splashVisible.value === false, fileIndex.value, modified.value],
  );

  const wrapChangeInfo = useCallback(
    (key) => (value) => {
      if (key === 'name') {
        value = value.trim();
        if (value.length === 0) {
          value = translate('arcade2.spriteInfo.sprite', 'Sprite');
        }
      }
      if (key === 'size' && value < 5) {
        value = 5;
      }
      setFile({ [key]: value });
    },
    [],
  );

  const nameInput = (
    <BufferedInput
      disabled={disabled}
      className={appState.value?.stageSize !== StageConfig.Large ? styles.fullInput : styles.nameInput}
      placeholder={translate('arcade2.spriteInfo.name', 'Name')}
      value={maybeTranslate(sprite.name)}
      onSubmit={wrapChangeInfo('name')}
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
              id="arcade2.spriteInfo.x"
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
        placeholder={translate('arcade2.spriteInfo.x', 'x')}
        value={Math.round(sprite.x)}
        onSubmit={wrapChangeInfo('x')}
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
              id="arcade2.spriteInfo.y"
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
        placeholder={translate('arcade2.spriteInfo.y', 'y')}
        value={Math.round(sprite.y)}
        onSubmit={wrapChangeInfo('y')}
      />
    </Label>
  );

  return (
    <div className={styles.spriteInfoWrapper}>
      {appState.value?.stageSize !== StageConfig.Large ? (
        <>
          <div className={classNames(styles.row, styles.rowPrimary)}>{nameInput}</div>
          <div className={styles.row}>
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
                  id="arcade2.spriteInfo.sprite"
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
                  id="arcade2.spriteInfo.display"
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
                        id="arcade2.spriteInfo.show"
                        defaultMessage="Show sprite"
                      />
                    ),
                    value: false,
                  },
                  {
                    icon: hideIcon,
                    title: (
                      <Text
                        id="arcade2.spriteInfo.hide"
                        defaultMessage="Hide sprite"
                      />
                    ),
                    value: true,
                  },
                ]}
                disabled={disabled}
                value={!!sprite.hidden}
                onChange={wrapChangeInfo('hidden')}
              />
            </Label>
            <Label
              secondary
              text={
                <Text
                  id="arcade2.spriteInfo.size"
                  defaultMessage="Size"
                />
              }
            >
              <BufferedInput
                small
                type="number"
                disabled={disabled}
                className={styles.largeInput}
                value={Math.round(sprite.size)}
                onSubmit={wrapChangeInfo('size')}
              />
            </Label>
            <Label
              secondary
              text={
                <Text
                  id="arcade2.spriteInfo.direction"
                  defaultMessage="Direction"
                />
              }
            >
              <DirectionPicker
                direction={sprite.direction}
                rotationStyle={sprite.rotationStyle}
                onChange={wrapChangeInfo('direction')}
                onChangeRotationStyle={wrapChangeInfo('rotationStyle')}
              >
                <BufferedInput
                  small
                  type="number"
                  disabled={disabled}
                  className={styles.largeInput}
                  value={Math.round(sprite.direction)}
                  onSubmit={wrapChangeInfo('direction')}
                />
              </DirectionPicker>
            </Label>
          </div>
        </>
      )}
    </div>
  );
}
