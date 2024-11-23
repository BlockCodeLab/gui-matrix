import { useState } from 'preact/hooks';

import Stage from '../stage/stage';
import SpriteSelector from '../sprite-selector/sprite-selector';
import StageSelector from '../stage-selector/stage-selector';

import styles from './sidebar.module.css';

export default function Sidebar() {
  const [playing, setPlaying] = useState(false);
  const [stageSize, setStageSize] = useState(window.innerWidth < 1600 ? 'small' : 'large');

  const handleStop = () => setPlaying(false);

  return (
    <div className={styles.sidebarWrapper}>
      <Stage
        className={styles.stageWrapper}
        playing={playing}
        size={stageSize}
        onSizeToggle={setStageSize}
        onPlay={setPlaying}
      />

      <div className={styles.selectorWrapper}>
        <SpriteSelector
          playing={playing}
          stageSize={stageSize}
          onStop={handleStop}
        />
        <StageSelector onStop={handleStop} />
      </div>
    </div>
  );
}
