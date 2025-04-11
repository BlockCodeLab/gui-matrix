import { useCallback } from 'preact/hooks';
import { setEditorConfig, getEditorConfig } from '@blockcode/utils';
import { useProjectContext, setAlert, openPromptModal } from '@blockcode/core';
import { MPYUtils } from '@blockcode/board';
import deviceFilters from '../../lib/device-filters.yaml';

import { Text, MenuSection, MenuItem } from '@blockcode/core';

const STORAGE_WIFI_SSID = 'wifi.ssid';
const STORAGE_WIFI_PASSWORD = 'wifi.password';

const errorAlert = (err) => {
  if (err === 'NotFoundError') return;
  setAlert('connectionError', 1000);
};

export function ConfigSection({ itemClassName }) {
  const { meta } = useProjectContext();

  const handleConfigWifi = useCallback(() => {
    const ssid = getEditorConfig(meta.value.editor, STORAGE_WIFI_SSID) ?? '';
    const password = getEditorConfig(meta.value.editor, STORAGE_WIFI_PASSWORD) ?? '';

    openPromptModal({
      title: (
        <Text
          id="arcade.menu.device.wifi"
          defaultMessage="Arcade Wi-Fi config"
        />
      ),
      content: (
        <Text
          id="arcade.menu.device.wifiInfo"
          defaultMessage="Only supports <b>2.4G Wi-Fi</b> network."
        />
      ),
      inputItems: [
        {
          name: 'ssid',
          label: (
            <Text
              id="arcade.menu.device.wifiName"
              defaultMessage="Wi-Fi name"
            />
          ),
          placeholder: (
            <Text
              id="arcade.menu.device.wifiName"
              defaultMessage="Wi-Fi name"
            />
          ),
          defaultValue: ssid,
        },
        {
          name: 'password',
          label: (
            <Text
              id="arcade.menu.device.wifiPassword"
              defaultMessage="Wi-Fi password"
            />
          ),
          placeholder: (
            <Text
              id="arcade.menu.device.wifiPassword"
              defaultMessage="Wi-Fi password"
            />
          ),
          defaultValue: password,
        },
      ],
      // onClose: () => {
      //   setAlert(
      //     {
      //       mode: 'warn',
      //       message: <Text id='arcade.menu.device.wifiCancel', 'Deconfigure Wi-Fi.' />,
      //     },
      //     1500,
      //   );
      // },
      onSubmit: async (wifi) => {
        if (wifi) {
          let currentDevice;
          try {
            currentDevice = await MPYUtils.connect(deviceFilters);
            await MPYUtils.enterDownloadMode(currentDevice);
          } catch (err) {
            errorAlert(err.name);
          }
          if (!currentDevice) return;

          const checker = MPYUtils.check(currentDevice).catch(errorAlert);

          setEditorConfig(meta.value.editor, STORAGE_WIFI_SSID, wifi.ssid);
          setEditorConfig(meta.value.editor, STORAGE_WIFI_PASSWORD, wifi.password);

          try {
            await MPYUtils.config(currentDevice, {
              'setting-wifi': true,
              'wifi-ssid': wifi.ssid,
              'wifi-password': wifi.password,
            });
            currentDevice.hardReset();
            setAlert(
              {
                message: (
                  <Text
                    id="arcade.menu.device.wifiOk"
                    defaultMessage="The Wi-Fi configuration is saved."
                  />
                ),
              },
              2000,
            );
          } catch (err) {
            errorAlert(err.name);
          } finally {
            checker.cancel();
          }
        }
      },
    });
  }, []);

  return (
    <MenuSection>
      <MenuItem
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.wifi"
            defaultMessage="Arcade Wi-Fi config"
          />
        }
        onClick={handleConfigWifi}
      />

      <MenuItem
        disabled
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.config"
            defaultMessage="System config"
          />
        }
      />
    </MenuSection>
  );
}
