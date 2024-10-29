import { useState } from 'preact/hooks';
import { useLayout, useLocale, useEditor } from '@blockcode/core';
import { classNames, Text, Spinner, MenuSection, MenuItem } from '@blockcode/ui';
import {
  connectESP32Device,
  disconnectESP32Device,
  checkESP32Device,
  writeESP32Flash,
  connectDevice,
  checkDevice,
  eraseAll,
} from '@blockcode/device-pyboard';
import { firmware } from '../../../package.json';
import deviceFilters from '../../lib/device-filters.yaml';

import styles from './firmware-section.module.css';
import firmwareImage1 from './firmware1.jpg';
import firmwareImage2 from './firmware2.jpg';
import firmwareImage3 from './firmware3.jpg';

let alertId = null;

export default function FirmwareSection({ itemClassName }) {
  const { createAlert, removeAlert, createPrompt } = useLayout();
  const { getText } = useLocale();

  const uploadAlert = (progress, isRestore = false) => {
    if (!alertId) {
      alertId = `upload_${Date.now()}`;
    }
    if (progress < 100) {
      createAlert({
        id: alertId,
        icon: <Spinner level="success" />,
        message: isRestore ? (
          <Text
            id="arcade.menu.device.firmwareRestoring"
            defaultMessage="Firmware restoring...{progress}%"
            progress={progress}
          />
        ) : (
          <Text
            id="arcade.menu.device.firmwareUpdating"
            defaultMessage="Firmware updating...{progress}%"
            progress={progress}
          />
        ),
      });
    } else {
      createAlert({
        id: alertId,
        icon: <Spinner level="success" />,
        message: (
          <Text
            id="arcade.menu.device.firmwareRecovering"
            defaultMessage="Recovering the Arcade..."
          />
        ),
      });
    }
  };

  const closeAlert = () => {
    removeAlert(alertId);
  };

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

  const handleUploadFirmware = (isRestore = false) => {
    if (alertId) return;

    createPrompt({
      title: isRestore
        ? getText('arcade.menu.device.restore', 'Restore firmware')
        : getText('arcade.menu.device.update', 'Upload firmware'),
      label: isRestore
        ? getText(
            'arcade.menu.device.firmwareRestoreLabal',
            'Ready to resotre your firmware? After restoration, all projects in the Arcade will be erased. Follow the steps below to prepare your Arcade.',
          )
        : getText(
            'arcade.menu.device.firmwareUpdateLabal',
            'Ready to update your firmware? Follow the steps below to prepare your Arcade.',
          ),
      body: (
        <div className={classNames(styles.tipsRom, styles.tipsCol3)}>
          <div className={styles.tipItem}>
            <img src={firmwareImage1} />
            <span>
              1.&nbsp;
              <a
                target="_blank"
                href={firmware.url}
                title={firmware.version}
              >
                <Text
                  id="arcade.menu.device.firmwareTip1-1"
                  defaultMessage="Download"
                />
              </a>
              <Text
                id="arcade.menu.device.firmwareTip1-2"
                defaultMessage="latest firmware."
              />
            </span>
          </div>
          <div className={styles.tipItem}>
            <img src={firmwareImage2} />
            2.&nbsp;
            <Text
              id="arcade.menu.device.firmwareTip2"
              defaultMessage="Press and hold Fn key."
            />
          </div>
          <div className={styles.tipItem}>
            <img src={firmwareImage3} />
            3.&nbsp;
            <Text
              id="arcade.menu.device.firmwareTip3"
              defaultMessage="Connect to USB."
            />
          </div>
        </div>
      ),
      onSubmit: async () => {
        let esploader;
        try {
          esploader = await connectESP32Device(deviceFilters);
        } catch (err) {
          errorAlert(err.name);
        }
        if (!esploader) return;

        const checker = checkESP32Device(esploader).catch(() => {
          errorAlert();
          closeAlert();
        });

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.bin';
        fileInput.multiple = false;
        fileInput.click();
        fileInput.addEventListener('change', async (e) => {
          uploadAlert(0);
          const reader = new FileReader();
          reader.readAsBinaryString(e.target.files[0]);
          reader.addEventListener('load', async (e) => {
            const data = [{ data: e.target.result, address: 0 }];
            if (isRestore) {
              createAlert({
                id: alertId,
                icon: <Spinner level="success" />,
                message: getText('arcade.menu.device.erasing', 'Erasing...'),
              });
            }
            try {
              await esploader.main();
              await writeESP32Flash(esploader, data, isRestore, (val) => uploadAlert(val, isRestore));
              createAlert({
                id: alertId,
                icon: null,
                message: isRestore ? (
                  <Text
                    id="arcade.menu.device.firmwareRestoreDone"
                    defaultMessage="Firmware resotre completed! Now press RESET key."
                  />
                ) : (
                  <Text
                    id="arcade.menu.device.firmwareUpdateDone"
                    defaultMessage="Firmware update completed! Now press RESET key."
                  />
                ),
                button: {
                  label: (
                    <Text
                      id="gui.prompt.ok"
                      defaultMessage="OK"
                    />
                  ),
                  onClick() {
                    closeAlert();
                  },
                },
              });
            } catch (err) {
              errorAlert(err.name);
              closeAlert();
            } finally {
              checker.cancel();
            }
            await disconnectESP32Device(esploader);
          });
        });
      },
    });
  };

  const handleEraseFlash = () => {
    if (alertId) return;

    createPrompt({
      title: getText('arcade.menu.device.erase', 'Erase Arcade'),
      label: getText('arcade.menu.device.eraseLabel', 'Do you want to erase all projects in the Arcade?'),
      onSubmit: async () => {
        let currentDevice;
        try {
          currentDevice = await connectDevice(deviceFilters);
        } catch (err) {
          errorAlert(err.name);
        }
        if (!currentDevice) return;

        const checker = checkDevice(currentDevice).catch(() => {
          errorAlert();
          closeAlert();
        });

        try {
          alertId = `erase_${Date.now()}`;
          createAlert({
            id: alertId,
            icon: <Spinner level="success" />,
            message: getText('arcade.menu.device.erasing', 'Erasing...'),
          });
          await eraseAll(currentDevice, ['boot.py', 'lib', 'res', 'io_config.py']);
          currentDevice.hardReset();
          createAlert({
            id: alertId,
            icon: null,
            message: getText('arcade.menu.device.erased', 'Erase completed.'),
            button: {
              label: (
                <Text
                  id="gui.prompt.ok"
                  defaultMessage="OK"
                />
              ),
              onClick() {
                closeAlert();
              },
            },
          });
        } catch (err) {
          errorAlert(err.name);
          closeAlert();
        } finally {
          checker.cancel();
        }
      },
    });
  };

  return (
    <MenuSection>
      <MenuItem
        disabled={alertId}
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.erase"
            defaultMessage="Erase flash"
          />
        }
        onClick={handleEraseFlash}
      />
      <MenuItem
        disabled={alertId}
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.update"
            defaultMessage="Update firmware"
          />
        }
        onClick={() => handleUploadFirmware(false)}
      />
      <MenuItem
        disabled={alertId}
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.restore"
            defaultMessage="Restore firmware"
          />
        }
        onClick={() => handleUploadFirmware(true)}
      />
    </MenuSection>
  );
}
