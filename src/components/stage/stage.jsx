import { useSignal } from '@preact/signals';
import { classNames } from '@blockcode/utils';
import { useAppContext } from '@blockcode/core';
import { StageConfig } from '../emulator/emulator-config';

import { ArcadeEmulator } from '../emulator/emulator';
import { Toolbar } from './toolbar';
import { Gamepad } from './gamepad';
import styles from './stage.module.css';

export function Stage() {
  const { appState } = useAppContext();

  const runtime = useSignal(null);

  return (
    <div className={styles.stageWrapper}>
      <Toolbar />

      <div
        className={classNames(styles.stage, {
          [styles.smallStage]: appState.value?.stageSize !== StageConfig.Large,
        })}
      >
        <ArcadeEmulator
          runtime={runtime.value}
          onRuntime={(val) => (runtime.value = val)}
        />
      </div>

      <Gamepad runtime={runtime.value} />
    </div>
  );
}
