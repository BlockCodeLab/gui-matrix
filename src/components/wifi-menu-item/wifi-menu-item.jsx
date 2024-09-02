import { useLayout, useLocale, useEditor } from '@blockcode/core';
import { Text, MenuItem } from '@blockcode/ui';
import { connectDevice, configDevice } from '@blockcode/device-pyboard';
import deviceFilters from '../../lib/device-filters.yaml';

export default function WifiMenuItem({ className }) {
  const { createAlert, createPrompt } = useLayout();
  const { getText } = useLocale();
  const { device, setDevice } = useEditor();

  const ssid = localStorage.getItem('device.wifi.ssid');
  const password = localStorage.getItem('device.wifi.password');

  return (
    <MenuItem
      className={className}
      label={
        <Text
          id="arcade.menu.device.wifi"
          defaultMessage="Arcade Wi-Fi config"
        />
      }
      onClick={() => {
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
          onClose: () => {
            createAlert(
              {
                mode: 'warn',
                message: getText('arcade.menu.device.wifiCancel', 'Deconfigure Wi-Fi.'),
              },
              1500,
            );
          },
          onSubmit: async (wifi) => {
            if (wifi) {
              const currentDevice = device || (await connectDevice(deviceFilters, setDevice));
              await configDevice(currentDevice, {
                'wifi-ssid': wifi.ssid,
                'wifi-password': wifi.password,
              });
              localStorage.setItem('device.wifi.ssid', wifi.ssid);
              localStorage.setItem('device.wifi.password', wifi.password);
              createAlert(
                {
                  message: getText('arcade.menu.device.wifiOk', 'The Wi-Fi configuration is saved.'),
                },
                2000,
              );
            }
          },
        });
      }}
    />
  );
}
