import { classNames, isMac } from '@blockcode/utils';
import { Keys, Button } from '@blockcode/core';
import styles from './gamepad.module.css';
import { useCallback } from 'preact/hooks';

const MIN_AXIS = 15;
const MAX_AXIS = 22;

let pressTimer = null;
let longpressTimer = null;

export function Gamepad({ runtime }) {
  const pressKey = useCallback(
    (code) => {
      runtime.handleKeyDown?.({
        altKey: code === 'fn',
        code,
      });
    },
    [runtime],
  );

  const releaseKey = useCallback(
    (code) => {
      runtime.handleKeyUp?.({
        altKey: code === 'fn',
        code,
      });
    },
    [runtime],
  );

  const updateJoystick = useCallback(
    (dx, dy) => {
      if (runtime.joystick) {
        runtime.joystick.x = Math.floor((dx / MAX_AXIS) * 100);
        runtime.joystick.y = -Math.floor((dy / MAX_AXIS) * 100);
      }
    },
    [runtime],
  );

  const handleMouseDown = useCallback(
    (e) => {
      e.stopPropagation();

      const target = e.target;
      const left = target.offsetLeft;
      const top = target.offsetTop;
      const cx = e.clientX;
      const cy = e.clientY;

      const mouseMove = (e) => {
        e.preventDefault();
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        if (dy < -MIN_AXIS) {
          if (!target.dataset.up) {
            pressKey(Keys.UP);
            target.dataset.up = true;
          }
          if (dy < -MAX_AXIS) dy = -MAX_AXIS;
        } else {
          delete target.dataset.up;
          releaseKey(Keys.UP);
        }
        if (dy > MIN_AXIS) {
          if (!target.dataset.down) {
            pressKey(Keys.DOWN);
            target.dataset.down = true;
          }
          if (dy > MAX_AXIS) dy = MAX_AXIS;
        } else {
          delete target.dataset.down;
          releaseKey(Keys.DOWN);
        }
        if (dx < -MIN_AXIS) {
          if (!target.dataset.left) {
            pressKey(Keys.LEFT);
            target.dataset.left = true;
          }
          if (dx < -MAX_AXIS) dx = -MAX_AXIS;
        } else {
          delete target.dataset.left;
          releaseKey(Keys.LEFT);
        }
        if (dx > MIN_AXIS) {
          if (!target.dataset.right) {
            pressKey(Keys.RIGHT);
            target.dataset.right = true;
          }
          if (dx > MAX_AXIS) dx = MAX_AXIS;
        } else {
          delete target.dataset.right;
          releaseKey(Keys.RIGHT);
        }
        updateJoystick(dx, dy);

        target.style.left = `${dx + left}px`;
        target.style.top = `${dy + top}px`;
      };

      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        updateJoystick(0, 0);
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        if (target.dataset.right) {
          releaseKey(Keys.RIGHT);
        }
        if (target.dataset.left) {
          releaseKey(Keys.LEFT);
        }
        if (target.dataset.down) {
          releaseKey(Keys.DOWN);
        }
        if (target.dataset.up) {
          releaseKey(Keys.UP);
        }
        delete target.dataset.up;
        delete target.dataset.down;
        delete target.dataset.left;
        delete target.dataset.right;
        target.parentElement.focus();
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    },
    [pressKey, releaseKey],
  );

  const wrapMouseDown = useCallback(
    (code) => () => {
      pressKey(code);
      pressTimer = setTimeout(() => {
        longpressTimer = setInterval(() => pressKey(code), 30);
      }, 1000);
    },
    [pressKey],
  );

  const wrapMouseUp = useCallback(
    (code) => (e) => {
      e.target.parentElement.focus();
      pressTimer && clearTimeout(pressTimer);
      longpressTimer && clearInterval(longpressTimer);
      pressTimer = null;
      longpressTimer = null;
      releaseKey(code);
    },
    [releaseKey],
  );

  return (
    <div className={styles.gamepadWrapper}>
      <div className={styles.buttonsGroup}>
        <div className={styles.joystickXLeft}></div>
        <div className={styles.joystickY}></div>
        <div className={styles.joystickXRight}></div>
        <Button
          className={classNames(styles.button, styles.joystick)}
          onMouseDown={handleMouseDown}
        ></Button>
      </div>

      <div className={styles.buttonsGroup}>
        <Button
          title={isMac ? '⌥' : 'Alt'}
          className={classNames(styles.button, styles.fn)}
          onMouseDown={wrapMouseDown('fn')}
          onMouseUp={wrapMouseUp('fn')}
        >
          Fn
        </Button>
        <Button
          title="A"
          className={classNames(styles.button, styles.a)}
          onMouseDown={wrapMouseDown(Keys.A)}
          onMouseUp={wrapMouseUp(Keys.A)}
        >
          A
        </Button>
        <Button
          title="B"
          className={classNames(styles.button, styles.b)}
          onMouseDown={wrapMouseDown(Keys.B)}
          onMouseUp={wrapMouseUp(Keys.B)}
        >
          B
        </Button>
        <Button
          title="X"
          className={classNames(styles.button, styles.x)}
          onMouseDown={wrapMouseDown(Keys.X)}
          onMouseUp={wrapMouseUp(Keys.X)}
        >
          X
        </Button>
        <Button
          title="Y"
          className={classNames(styles.button, styles.y)}
          onMouseDown={wrapMouseDown(Keys.Y)}
          onMouseUp={wrapMouseUp(Keys.Y)}
        >
          Y
        </Button>
      </div>
    </div>
  );
}
