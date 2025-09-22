import { useEffect, useCallback } from 'preact/hooks';
import { useProjectContext, setMeta, Text, MenuSection, MenuItem } from '@blockcode/core';

export function SettingsSection({ itemClassName }) {
  const { meta } = useProjectContext();

  useEffect(() => {
    if (meta.value.joystick == null) {
      setMeta('joystick', true); // 默认启用摇杆
    }
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
    </MenuSection>
  );
}
