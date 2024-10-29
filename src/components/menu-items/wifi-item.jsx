import { useLayout, useLocale, useEditor } from '@blockcode/core';
import { Text, MenuItem } from '@blockcode/ui';
import { connectDevice, configDevice } from '@blockcode/device-pyboard';
import deviceFilters from '../../lib/device-filters.yaml';

const STORAGE_WIFI_SSID = 'device.wifi.ssid';
const STORAGE_WIFI_PASSWORD = 'device.wifi.password';

export default function WifiItem({ className }) {
  const { createAlert, createPrompt } = useLayout();
  const { getText } = useLocale();

  const ssid = localStorage.getItem(STORAGE_WIFI_SSID);
  const password = localStorage.getItem(STORAGE_WIFI_PASSWORD);

  const errorAlert = (err) => {
    if (err === 'NotFoundError') return;
    createAlert(
      {
        message:
          err === 'NotFoundError' ? (
            <Text
              id="blocks.alert.connectionCancel"
              defaultMessage="Connection cancel."
            />
          ) : (
            <Text
              id="blocks.alert.connectionError"
              defaultMessage="Connection error."
            />
          ),
      },
      1000,
    );
  };

  const handleConfigWifi = () => {
    createPrompt({
      title: getText('arcade.menu.device.wifi', 'Arcade Wi-Fi config'),
      label: getText('arcade.menu.device.wifiNamePassword', 'Wi-Fi name and password'),
      inputMode: [
        {
          name: 'ssid',
          placeholder: getText('arcade.menu.device.wifiName', 'Wi-Fi name'),
          defaultValue: ssid || '',
        },
        {
          name: 'password',
          placeholder: getText('arcade.menu.device.wifiPassword', 'Wi-Fi password'),
          defaultValue: password || '',
        },
      ],
      // onClose: () => {
      //   createAlert(
      //     {
      //       mode: 'warn',
      //       message: getText('arcade.menu.device.wifiCancel', 'Deconfigure Wi-Fi.'),
      //     },
      //     1500,
      //   );
      // },
      onSubmit: async (wifi) => {
        if (wifi) {
          let currentDevice;
          try {
            currentDevice = await connectDevice(deviceFilters);
          } catch (err) {
            errorAlert(err.name);
          }
          if (!currentDevice) return;

          const checker = checkDevice(currentDevice).catch(() => {
            errorAlert();
          });

          localStorage.setItem(STORAGE_WIFI_SSID, wifi.ssid);
          localStorage.setItem(STORAGE_WIFI_PASSWORD, wifi.password);

          try {
            await configDevice(currentDevice, {
              'setting-wifi': true,
              'wifi-ssid': wifi.ssid,
              'wifi-password': wifi.password,
            });
            currentDevice.hardReset();
            createAlert(
              {
                message: getText('arcade.menu.device.wifiOk', 'The Wi-Fi configuration is saved.'),
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
  };

  return (
    <MenuItem
      className={className}
      label={
        <Text
          id="arcade.menu.device.wifi"
          defaultMessage="Arcade Wi-Fi config"
        />
      }
      onClick={handleConfigWifi}
    />
  );
}
