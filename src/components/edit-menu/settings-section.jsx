import { useEffect, useCallback } from 'preact/hooks';
import { useProjectContext, setMeta, Text, MenuSection, MenuItem } from '@blockcode/core';

export function SettingsSection({ itemClassName }) {
  const { meta } = useProjectContext();

  useEffect(() => {
    if (meta.value.turboMode == null) {
      setMeta('turboMode', false); // 默认关闭加速模式
    }
  }, []);

  const handleToggleTurbo = useCallback(() => {
    const turboMode = !meta.value.turboMode;
    setMeta({ turboMode });
  }, []);

  return (
    <MenuSection>
      <MenuItem
        disabled
        className={itemClassName}
        onClick={handleToggleTurbo}
      >
        {meta.value.turboMode !== true ? (
          <Text
            id="matrix.menu.edit.turboModeOpen"
            defaultMessage="Turn on Turbo Mode"
          />
        ) : (
          <Text
            id="matrix.menu.edit.turboModeClose"
            defaultMessage="Turn off Turbo Mode"
          />
        )}
      </MenuItem>
    </MenuSection>
  );
}
