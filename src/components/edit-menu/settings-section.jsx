import { useEffect, useCallback } from 'preact/hooks';
import { useProjectContext, setMeta, Text, MenuSection, MenuItem } from '@blockcode/core';

export function SettingsSection({ itemClassName }) {
  const { meta } = useProjectContext();

  useEffect(() => {
    if (meta.value.joystick == null) {
      setMeta({
        turboMode: false, // 默认关闭加速模式
        joystick: true, // 默认启用摇杆
      });
    }
  }, []);

  const handleToggleTurbo = useCallback(() => {
    const turboMode = !meta.value.turboMode;
    setMeta({ turboMode });
  }, []);

  const handleToggleJoystick = useCallback(() => {
    const joystick = !meta.value.joystick;
    setMeta({ joystick });
  }, []);

  return (
    <MenuSection>
      <MenuItem
        className={itemClassName}
        onClick={handleToggleJoystick}
      >
        {meta.value.joystick !== false ? (
          <Text
            id="arcade.menu.edit.joystickClose"
            defaultMessage="Turn off Joystick"
          />
        ) : (
          <Text
            id="arcade.menu.edit.joystickOpen"
            defaultMessage="Turn on Joystick"
          />
        )}
      </MenuItem>

      <MenuItem
        disabled
        className={itemClassName}
        onClick={handleToggleTurbo}
      >
        {meta.value.turboMode !== true ? (
          <Text
            id="arcade.menu.edit.turboModeOpen"
            defaultMessage="Turn on Turbo Mode"
          />
        ) : (
          <Text
            id="arcade.menu.edit.turboModeClose"
            defaultMessage="Turn off Turbo Mode"
          />
        )}
      </MenuItem>
    </MenuSection>
  );
}
