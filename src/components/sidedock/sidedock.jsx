import { useCallback, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { classNames } from '@blockcode/utils';
import { useAppContext, setAppState } from '@blockcode/core';
import { StageConfig } from '../emulator/emulator-config';

import { Stage } from '../stage/stage';
import { StageSelector } from '../stage-selector/stage-selector';
import { SpriteSelector } from '../sprite-selector/sprite-selector';
import styles from './sidedock.module.css';

export function Sidedock() {
  const { appState } = useAppContext();

  useEffect(() => {
    setAppState({
      stageSize: window.innerWidth < 1280 ? StageConfig.Small : StageConfig.Large,
    });
  }, []);

  return (
    <div className={styles.sidedockWrapper}>
      <Stage className={styles.stageWrapper} />

      <div
        className={classNames(styles.selectorWrapper, {
          [styles.small]: appState.value?.stageSize !== StageConfig.Large,
        })}
      >
        <SpriteSelector />

        <StageSelector />
      </div>
    </div>
  );
}
