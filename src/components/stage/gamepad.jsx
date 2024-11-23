import { classNames, Button } from '@blockcode/ui';
import styles from './gamepad.module.css';

const MIN_AXIS = 15;
const MAX_AXIS = 22;

const isMac = /Mac/i.test(navigator.platform || navigator.userAgent);

let pressTimer = null;
let longdownTimer = null;

export default function Gamepad({ runtime }) {
  const pressKey = (code) =>
    runtime?.handleKeyDown({
      altKey: code === 'KeyFn',
      code,
    });

  const releaseKey = (code) =>
    runtime?.handleKeyUp({
      altKey: code === 'KeyFn',
      code,
    });

  const updateJoystick = (dx, dy) => {
    if (runtime?.joystick) {
      runtime.joystick.x = Math.floor((dx / MAX_AXIS) * 100);
      runtime.joystick.y = -Math.floor((dy / MAX_AXIS) * 100);
    }
  };

  const handleMouseDown = (e) => {
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
          pressKey('ArrowUp');
          target.dataset.up = true;
        }
        if (dy < -MAX_AXIS) dy = -MAX_AXIS;
      } else {
        delete target.dataset.up;
        releaseKey('ArrowUp');
      }
      if (dy > MIN_AXIS) {
        if (!target.dataset.down) {
          pressKey('ArrowDown');
          target.dataset.down = true;
        }
        if (dy > MAX_AXIS) dy = MAX_AXIS;
      } else {
        delete target.dataset.down;
        releaseKey('ArrowDown');
      }
      if (dx < -MIN_AXIS) {
        if (!target.dataset.left) {
          pressKey('ArrowLeft');
          target.dataset.left = true;
        }
        if (dx < -MAX_AXIS) dx = -MAX_AXIS;
      } else {
        delete target.dataset.left;
        releaseKey('ArrowLeft');
      }
      if (dx > MIN_AXIS) {
        if (!target.dataset.right) {
          pressKey('ArrowRight');
          target.dataset.right = true;
        }
        if (dx > MAX_AXIS) dx = MAX_AXIS;
      } else {
        delete target.dataset.right;
        releaseKey('ArrowRight');
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
        releaseKey('ArrowRight');
      }
      if (target.dataset.left) {
        releaseKey('ArrowLeft');
      }
      if (target.dataset.down) {
        releaseKey('ArrowDown');
      }
      if (target.dataset.up) {
        releaseKey('ArrowUp');
      }
      delete target.dataset.up;
      delete target.dataset.down;
      delete target.dataset.left;
      delete target.dataset.right;
      target.parentElement.focus();
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  };

  const mouseDownHandler = (code) => () => {
    pressKey(code);
    pressTimer = setTimeout(() => {
      longdownTimer = setInterval(() => pressKey(code), 30);
    }, 1000);
  };

  const mouseUpHandler = (code) => (e) => {
    e.target.parentElement.focus();
    pressTimer && clearTimeout(pressTimer);
    longdownTimer && clearInterval(longdownTimer);
    pressTimer = null;
    longdownTimer = null;
    releaseKey(code);
  };

  return (
    <div className={styles.gamepadWrapper}>
      {IDEAL ? (
        <div className={styles.buttonsGroup}>
          <Button
            title="↑"
            className={classNames(styles.button, styles.up)}
            onMouseDown={mouseDownHandler('ArrowUp')}
            onMouseUp={mouseUpHandler('ArrowUp')}
          >
            ▲
          </Button>
          <Button
            title="↓"
            className={classNames(styles.button, styles.down)}
            onMouseDown={mouseDownHandler('ArrowDown')}
            onMouseUp={mouseUpHandler('ArrowDown')}
          >
            ▼
          </Button>
          <Button
            title="←"
            className={classNames(styles.button, styles.left)}
            onMouseDown={mouseDownHandler('ArrowLeft')}
            onMouseUp={mouseUpHandler('ArrowLeft')}
          >
            ◀︎
          </Button>
          <Button
            title="→"
            className={classNames(styles.button, styles.right)}
            onMouseDown={mouseDownHandler('ArrowRight')}
            onMouseUp={mouseUpHandler('ArrowRight')}
          >
            ►
          </Button>
        </div>
      ) : (
        <div className={styles.buttonsGroup}>
          <div className={styles.joystickXLeft}></div>
          <div className={styles.joystickY}></div>
          <div className={styles.joystickXRight}></div>
          <Button
            className={classNames(styles.button, styles.joystick)}
            onMouseDown={handleMouseDown}
          ></Button>
        </div>
      )}
      <div className={styles.buttonsGroup}>
        <Button
          title={isMac ? '⌥' : 'Alt'}
          className={classNames(styles.button, styles.fn)}
          onMouseDown={mouseDownHandler('KeyFn')}
          onMouseUp={mouseUpHandler('KeyFn')}
        >
          FN
        </Button>
        <Button
          title="A"
          className={classNames(styles.button, styles.a)}
          onMouseDown={mouseDownHandler('KeyA')}
          onMouseUp={mouseUpHandler('KeyA')}
        >
          A
        </Button>
        <Button
          title="B"
          className={classNames(styles.button, styles.b)}
          onMouseDown={mouseDownHandler('KeyB')}
          onMouseUp={mouseUpHandler('KeyB')}
        >
          B
        </Button>
        <Button
          title="X"
          className={classNames(styles.button, styles.x)}
          onMouseDown={mouseDownHandler('KeyX')}
          onMouseUp={mouseUpHandler('KeyX')}
        >
          X
        </Button>
        <Button
          title="Y"
          className={classNames(styles.button, styles.y)}
          onMouseDown={mouseDownHandler('KeyY')}
          onMouseUp={mouseUpHandler('KeyY')}
        >
          Y
        </Button>
      </div>
    </div>
  );
}
