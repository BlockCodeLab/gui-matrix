import { useCallback } from 'preact/hooks';
import { RotationStyle } from '../emulator/emulator-config';

import { ToggleButtons, Tooltip } from '@blockcode/core';
import styles from './direction-picker.module.css';

import dialIcon from './icons/icon-dial.svg';
import handleIcon from './icons/icon-handle.svg';
import allAroundIcon from './icons/icon-all-around.svg';
import dontRotateIcon from './icons/icon-dont-rotate.svg';
import leftRightIcon from './icons/icon-left-right.svg';

const RADIUS = 56;

const createGaugePath = (direction) => {
  const rads = direction * (Math.PI / 180);
  const path = [];
  path.push(`M ${RADIUS} 0`);
  path.push(`L ${RADIUS} ${RADIUS}`);
  path.push(`L ${RADIUS + RADIUS * Math.sin(rads)} ${RADIUS - RADIUS * Math.cos(rads)}`);
  path.push(`A ${RADIUS} ${RADIUS} 0 0 ${direction < 0 ? 1 : 0} ${RADIUS} 0`);
  path.push(`Z`);
  return path.join(' ');
};

export function DirectionPicker({ direction, rotationStyle, children, onChange, onChangeRotationStyle }) {
  const directionToMouse = useCallback((target, cx, cy) => {
    const bbox = target.parentElement.getBoundingClientRect();
    const dy = bbox.top + bbox.height / 2;
    const dx = bbox.left + bbox.width / 2;
    const angle = Math.atan2(cy - dy, cx - dx);
    const degrees = angle * (180 / Math.PI);
    return degrees + 90; // To correspond with scratch coordinate system
  }, []);

  const handleDirectionMouseDown = useCallback((e) => {
    e.stopPropagation();
    const target = e.target;
    const mouseMove = (e) => {
      e.preventDefault();
      let newDirection = directionToMouse(target, e.clientX, e.clientY);
      if (newDirection > 180) newDirection += -360;
      if (newDirection < -180) newDirection += 360;
      onChange(newDirection);
    };
    const mouseUp = () => {
      document.removeEventListener('pointermove', mouseMove);
      document.removeEventListener('pointerup', mouseUp);
    };
    document.addEventListener('pointermove', mouseMove);
    document.addEventListener('pointerup', mouseUp);
  }, []);

  return (
    <Tooltip
      clickable
      placement="top"
      className={styles.pickerTooltip}
      content={
        <>
          <div className={styles.dialWrapper}>
            <img
              draggable={false}
              src={dialIcon}
            />
            <svg
              className={styles.dialGauge}
              width={RADIUS * 2}
              height={RADIUS * 2}
            >
              <path
                className={styles.dialGaugePath}
                d={createGaugePath(direction)}
              />
            </svg>
            <img
              draggable={false}
              className={styles.dialHandle}
              src={handleIcon}
              style={{
                top: `${RADIUS - RADIUS * Math.cos(direction * (Math.PI / 180))}px`,
                left: `${RADIUS + RADIUS * Math.sin(direction * (Math.PI / 180))}px`,
                transform: `rotate(${direction}deg)`,
              }}
              onMouseDown={handleDirectionMouseDown}
            />
          </div>
          <div className={styles.buttonGroup}>
            <ToggleButtons
              items={[
                {
                  icon: allAroundIcon,
                  title: (
                    <Text
                      id="matrix.directionPicker.allAround"
                      defaultMessage="All Around"
                    />
                  ),
                  value: RotationStyle.ALL_AROUND,
                },
                {
                  icon: leftRightIcon,
                  title: (
                    <Text
                      id="matrix.directionPicker.leftRight"
                      defaultMessage="Left/Right"
                    />
                  ),
                  value: RotationStyle.HORIZONTAL_FLIP,
                },
                {
                  icon: dontRotateIcon,
                  title: (
                    <Text
                      id="matrix.directionPicker.dontRotate"
                      defaultMessage="Do not rotate"
                    />
                  ),
                  value: RotationStyle.DONOT_ROTATE,
                },
              ]}
              value={rotationStyle}
              onChange={onChangeRotationStyle}
            />
          </div>
        </>
      }
    >
      {children}
    </Tooltip>
  );
}
