import { nanoid, classNames } from '@blockcode/utils';
import { setAlert, delAlert, openPromptModal } from '@blockcode/core';
import { ESPTool, MPYUtils } from '@blockcode/board';
import { firmware } from '../../../package.json';
import deviceFilters from '../../lib/device-filters.yaml';

import { Text, Spinner, MenuSection, MenuItem } from '@blockcode/core';
import styles from './firmware-section.module.css';

import firmwareImage1 from './images/firmware1.jpg';
import firmwareImage2 from './images/firmware2.jpg';
import firmwareImage3 from './images/firmware3.jpg';

let alertId = null;

const uploadAlert = (progress, isRestore = false) => {
  if (!alertId) {
    alertId = nanoid();
  }
  if (progress < 100) {
    setAlert({
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
    setAlert({
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
  delAlert(alertId);
  alertId = null;
};

const errorAlert = (err) => {
  if (err === 'NotFoundError') return;
  setAlert(
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

export function FirmwareSection({ itemClassName }) {
  const handleUploadFirmware = (isRestore = false) => {
    if (alertId) return;

    openPromptModal({
      title: isRestore ? (
        <Text
          id="arcade.menu.device.restore"
          defaultMessage="Restore firmware"
        />
      ) : (
        <Text
          id="arcade.menu.device.update"
          defaultMessage="Upload firmware"
        />
      ),
      label: isRestore ? (
        <Text
          id="arcade.menu.device.firmwareRestoreLabal"
          defaultMessage="Ready to resotre your firmware? After restoration, all projects in the Arcade will be erased. Follow the steps below to prepare your Arcade."
        />
      ) : (
        <Text
          id="arcade.menu.device.firmwareUpdateLabal"
          defaultMessage="Ready to update your firmware? Follow the steps below to prepare your Arcade."
        />
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
          esploader = await ESPTool.connect(deviceFilters);
        } catch (err) {
          errorAlert(err.name);
        }
        if (!esploader) return;

        const checker = ESPTool.check(esploader).catch(() => {
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
              setAlert({
                id: alertId,
                icon: <Spinner level="success" />,
                message: (
                  <Text
                    id="arcade.menu.device.erasing"
                    defaultMessage="Erasing..."
                  />
                ),
              });
            }
            try {
              await esploader.main();
              await ESPTool.writeFlash(esploader, data, isRestore, (val) => uploadAlert(val, isRestore));
              setAlert({
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
            await ESPTool.disconnect(esploader);
          });
        });
      },
    });
  };

  const handleEraseFlash = () => {
    if (alertId) return;

    openPromptModal({
      title: (
        <Text
          id="arcade.menu.device.erase"
          defaultMessage="Erase Arcade"
        />
      ),
      label: (
        <Text
          id="arcade.menu.device.eraseLabel"
          defaultMessage="Do you want to erase all projects in the Arcade?"
        />
      ),
      onSubmit: async () => {
        let currentDevice;
        try {
          currentDevice = await MPYUtils.connect(deviceFilters);
        } catch (err) {
          errorAlert(err.name);
        }
        if (!currentDevice) return;

        const checker = MPYUtils.check(currentDevice).catch(() => {
          errorAlert();
          closeAlert();
        });

        try {
          alertId = nanoid();
          setAlert({
            id: alertId,
            icon: <Spinner level="success" />,
            message: (
              <Text
                id="arcade.menu.device.erasing"
                defaultMessage="Erasing..."
              />
            ),
          });
          await MPYUtils.eraseAll(currentDevice, ['boot.py', 'lib', 'res', 'io_config.py']);
          currentDevice.hardReset();
          setAlert({
            id: alertId,
            icon: null,
            message: (
              <Text
                id="arcade.menu.device.erased"
                defaultMessage="Erase completed."
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
