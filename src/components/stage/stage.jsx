import { useSignal } from '@preact/signals';
import { classNames } from '@blockcode/utils';
import { useAppContext } from '@blockcode/core';
import { StageConfig } from '../emulator/emulator-config';

import { MatrixEmulator } from '../emulator/emulator';
import { Toolbar } from './toolbar';
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
        <MatrixEmulator
          runtime={runtime.value}
          onRuntime={(val) => (runtime.value = val)}
        />
      </div>
    </div>
  );
}
