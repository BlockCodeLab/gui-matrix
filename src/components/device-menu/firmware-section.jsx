import { useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { nanoid, classNames, sleep, arrayBufferToBinaryString, getBinaryCache, setBinaryCache } from '@blockcode/utils';
import { useLocalesContext, setAlert, delAlert, openPromptModal } from '@blockcode/core';
import { ESPTool, MPYUtils } from '@blockcode/board';
import { firmware } from '../../../package.json';
import deviceFilters from './device-filters.yaml';

import { Text, Spinner, MenuSection, MenuItem } from '@blockcode/core';
import styles from './firmware-section.module.css';

import firmwareImage1 from './images/firmware1.jpg';
import firmwareImage2 from './images/firmware2.jpg';
import firmwareImage3 from './images/firmware3.jpg';

let alertId = null;

const uploadingAlert = (progress, isRestore = false) => {
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
  setAlert('connectionError', 1000);
};

// 下载固件
const getFirmware = async (downloadUrl) => {
  try {
    return await fetch(downloadUrl, {
      method: 'GET',
    });
  } catch (err) {
    await sleep(1);
    return getFirmware(downloadUrl);
  }
};

// 查询是否有缓存固件
const getFirmwareCache = async (downloadUrl, firmwareHash, firmwareVersion, readyForUpdate) => {
  if (readyForUpdate.value) return;

  const data = await getBinaryCache('arcadeFirmware');

  // 比对缓存固件版本
  if (data?.hash === firmwareHash && data?.binaryString) {
    readyForUpdate.value = true;
    delete getFirmwareCache.downloading;
    return;
  }

  // 缓存固件不存在或版本不匹配，下载固件
  // 防止重复下载
  if (getFirmwareCache.downloading) return;

  // 下载中
  getFirmwareCache.downloading = true;

  const res = await getFirmware(downloadUrl);
  const buffer = await res.arrayBuffer();

  delete getFirmwareCache.downloading;

  // 检查hash值
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  if (hash !== firmwareHash) {
    getFirmwareCache(downloadUrl, firmwareHash, firmwareVersion, readyForUpdate);
    return;
  }

  // 进行缓存
  await setBinaryCache('arcadeFirmware', {
    version: firmwareVersion,
    hash: firmwareHash,
    binaryString: arrayBufferToBinaryString(buffer),
  });
  readyForUpdate.value = true;
};

const uploadFirmware = (isRestore = false, releaseUrl = firmware.release) => {
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
    body: (
      <>
        <div
          className={classNames(styles.tipsRom, styles.tipsLabel, {
            [styles.tipsCol3]: isRestore,
            [styles.tipsCol2]: !isRestore,
          })}
        >
          {isRestore ? (
            <Text
              id="arcade.menu.device.firmwareRestoreLabal"
              defaultMessage="After restoration, all projects in the Arcade will be erased. Follow the steps below to prepare your Arcade."
            />
          ) : (
            <Text
              id="arcade.menu.device.firmwareUpdateLabal"
              defaultMessage="Follow the steps below to prepare your Arcade."
            />
          )}
        </div>
        <div className={classNames(styles.tipsRom)}>
          {isRestore && (
            <div className={styles.tipItem}>
              <img src={firmwareImage1} />
              <span>
                <a
                  target="_blank"
                  href={releaseUrl}
                >
                  <Text
                    id="arcade.menu.device.firmwareTip1-1"
                    defaultMessage="Download"
                  />
                </a>
                &nbsp;
                <Text
                  id="arcade.menu.device.firmwareTip1-2"
                  defaultMessage="latest firmware."
                />
              </span>
            </div>
          )}
          <div className={styles.tipItem}>
            <img src={firmwareImage2} />
            <Text
              id="arcade.menu.device.firmwareTip2"
              defaultMessage="Press and hold Fn key."
            />
          </div>
          <div className={styles.tipItem}>
            <img src={firmwareImage3} />
            <Text
              id="arcade.menu.device.firmwareTip3"
              defaultMessage="Connect to USB."
            />
          </div>
        </div>
      </>
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
        ESPTool.disconnect(esploader);
      });

      const upload = async (data) => {
        // uploadingAlert('0.0', isRestore);
        try {
          await esploader.main();
          await ESPTool.writeFlash(esploader, data, isRestore, (val) => uploadingAlert(val, isRestore));
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
            onClose: closeAlert,
          });
        } catch (err) {
          errorAlert(err.name);
          closeAlert();
        } finally {
          checker.cancel();
        }
        await ESPTool.disconnect(esploader);
      };

      // 从缓存中升级到最新固件
      if (!isRestore) {
        const data = await getBinaryCache('arcadeFirmware');
        if (data) {
          upload([
            {
              data: data.binaryString,
              address: 0,
            },
          ]);
        }
        return;
      }

      // 还原用户上传固件
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.bin';
      fileInput.multiple = false;
      fileInput.click();
      fileInput.addEventListener('cancel', () => ESPTool.disconnect(esploader));
      fileInput.addEventListener('change', async (e) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.addEventListener('load', async (e) => {
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
          upload([
            {
              data: arrayBufferToBinaryString(e.target.result),
              address: 0,
            },
          ]);
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
        await MPYUtils.enterDownloadMode(currentDevice);
      } catch (err) {
        errorAlert(err.name);
      }
      if (!currentDevice) return;

      const checker = MPYUtils.check(currentDevice).catch(() => {
        errorAlert();
        closeAlert();
        MPYUtils.disconnect(currentDevice);
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
        await MPYUtils.disconnect(currentDevice, true);
        setAlert({
          id: alertId,
          icon: null,
          message: (
            <Text
              id="arcade.menu.device.erased"
              defaultMessage="Erase completed."
            />
          ),
          onClose: closeAlert,
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

export function FirmwareSection({ itemClassName }) {
  const { language } = useLocalesContext();

  const readyForUpdate = useSignal(false);

  const firmwareJson = useSignal(null);

  const releaseUrl = useMemo(() => {
    return firmware.mirrors?.[language.value]?.release ?? firmware.release;
  }, [language.value]);

  useEffect(() => (alertId = null), []);

  useEffect(async () => {
    readyForUpdate.value = false;
    const baseUrl = firmware.mirrors?.[language.value]?.download ?? firmware.download;
    if (!firmwareJson.value) {
      firmwareJson.value = await fetch(`${baseUrl}version.json`).then((res) => res.json());
    }
    const downloadUrl = `${baseUrl}${firmwareJson.value.download}`
      .replaceAll('{language}', language.value)
      .replaceAll('{version}', firmwareJson.value.version);
    const firmwareHash = firmwareJson.value.hash[language.value];
    getFirmwareCache(downloadUrl, firmwareHash, firmwareJson.value.version, readyForUpdate);
  }, [language.value]);

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
        disabled={alertId || !readyForUpdate.value}
        className={itemClassName}
        label={
          readyForUpdate.value ? (
            <Text
              id="arcade.menu.device.update"
              defaultMessage="Update firmware"
            />
          ) : (
            <Text
              id="arcade.menu.device.caching"
              defaultMessage="Caching latest firmware..."
            />
          )
        }
        onClick={() => uploadFirmware(false)}
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
        onClick={() => uploadFirmware(true, releaseUrl)}
      />
    </MenuSection>
  );
}
