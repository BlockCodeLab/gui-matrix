import { useState } from 'preact/hooks';
import { useLayout, useLocale, useEditor } from '@blockcode/core';
import { classNames, Text, Spinner, MenuSection, MenuItem } from '@blockcode/ui';
import { connectESP32Device, disconnectESP32Device, eraseFlash, writeFlash } from '@blockcode/device-pyboard';
import deviceFilters from '../../lib/device-filters.yaml';
import { firmware } from '../../../package.json';

import styles from './firmware-section.module.css';
import firmwareImage1 from './firmware1.jpg';
import firmwareImage2 from './firmware2.jpg';
import firmwareImage3 from './firmware3.jpg';

let uploadAlertId = null;

export default function FirmwareSection({ itemClassName }) {
  const [uploading, setUploading] = useState(false);
  const [erasing, setErasing] = useState(false);

  const { createAlert, removeAlert, createPrompt } = useLayout();
  const { getText } = useLocale();

  const uploadAlert = (progress) => {
    if (!uploadAlertId) {
      uploadAlertId = `upload_${Date.now()}`;
      setUploading(true);
    }
    if (progress < 100) {
      createAlert({
        id: uploadAlertId,
        icon: <Spinner level="success" />,
        message: (
          <Text
            id="arcade.menu.device.firmwareUpdating"
            defaultMessage="Firmware updating...{progress}%"
            progress={progress}
          />
        ),
      });
    } else {
      createAlert({
        id: uploadAlertId,
        icon: <Spinner level="success" />,
        message: (
          <Text
            id="arcade.menu.device.firmwareRestoring"
            defaultMessage="Restoring the Arcade..."
          />
        ),
      });
    }
  };

  const removeUpload = () => {
    removeAlert(uploadAlertId);
    setUploading(false);
    uploadAlertId = null;
  };

  const errorAlert = () => {
    createAlert(
      {
        message: (
          <Text
            id="blocks.alert.connectionError"
            defaultMessage="Connection error."
          />
        ),
      },
      1000,
    );
  };

  const handleUploadFirmware = () => {
    createPrompt({
      title: getText('arcade.menu.device.firmware', 'Upload firmware'),
      label: getText(
        'arcade.menu.device.firmwareLabal',
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
        const esploader = await connectESP32Device(deviceFilters);
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.bin';
        fileInput.multiple = false;
        fileInput.click();
        fileInput.addEventListener('change', async (e) => {
          setUploading(true);
          uploadAlert(0);
          const reader = new FileReader();
          reader.readAsBinaryString(e.target.files[0]);
          reader.addEventListener('load', async (e) => {
            try {
              await esploader.main();
              await writeFlash(esploader, [{ data: e.target.result, address: 0 }], false, uploadAlert);
              await esploader.hardReset();
              createAlert({
                id: uploadAlertId,
                icon: null,
                message: (
                  <Text
                    id="arcade.menu.device.firmwareDone"
                    defaultMessage="Firmware update completed!"
                  />
                ),
              });
              setTimeout(removeUpload, 1000);
            } catch (err) {
              errorAlert();
              removeUpload();
            }
            await disconnectESP32Device();
          });
        });
      },
    });
  };

  const handleEraseFlash = () => {
    createPrompt({
      title: getText('arcade.menu.device.erase', 'Erase flash'),
      label: getText(
        'arcade.menu.device.eraseLabel',
        'Do you want to erase the firmware and all programs in the flash?',
      ),
      body: (
        <div className={classNames(styles.tipsRom, styles.tipsCol2)}>
          <div className={styles.tipItem}>
            <img src={firmwareImage2} />
            1.&nbsp;
            <Text
              id="arcade.menu.device.firmwareTip2"
              defaultMessage="Press and hold Fn key."
            />
          </div>
          <div className={styles.tipItem}>
            <img src={firmwareImage3} />
            2.&nbsp;
            <Text
              id="arcade.menu.device.firmwareTip3"
              defaultMessage="Connect to USB."
            />
          </div>
        </div>
      ),
      onSubmit: async () => {
        const esploader = await connectESP32Device(deviceFilters);
        const alertId = `erase_${Date.now()}`;
        const removeErase = () => {
          removeAlert(alertId);
          setErasing(false);
        };
        setErasing(true);
        createAlert({
          id: alertId,
          icon: <Spinner level="success" />,
          message: getText('arcade.menu.device.erasing', 'Erasing...'),
        });
        try {
          await esploader.main();
          await eraseFlash(esploader);
        } catch (err) {
          errorAlert();
          setTimeout(removeErase, 1000);
        }
        await disconnectESP32Device();
        createAlert({
          id: alertId,
          icon: null,
          message: getText('arcade.menu.device.erased', 'Erase completed.'),
        });
        setTimeout(removeErase, 1000);
      },
    });
  };

  return (
    <MenuSection>
      <MenuItem
        disabled={uploading}
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.firmware"
            defaultMessage="Upload firmware"
          />
        }
        onClick={handleUploadFirmware}
      />
      <MenuItem
        disabled={erasing}
        className={itemClassName}
        label={
          <Text
            id="arcade.menu.device.erase"
            defaultMessage="Erase flash"
          />
        }
        onClick={handleEraseFlash}
      />
    </MenuSection>
  );
}
