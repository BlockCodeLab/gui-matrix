import { useEffect, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { nanoid } from '@blockcode/utils';
import { useLocalesContext, useProjectContext, translate, setAlert, delAlert, openPromptModal } from '@blockcode/core';
import { MPYUtils } from '@blockcode/board';
import { generateMain } from '../../lib/generate-main';
import { generateAssets } from '../../lib/generate-assets';
import { firmware } from '../../../package.json';
import deviceFilters from './device-filters.yaml';

import { Spinner, Text, MenuSection, MenuItem } from '@blockcode/core';
import { ConfigSection } from './config-section';
import { FirmwareSection } from './firmware-section';

let downloadAlertId = null;

let downloadStart = Infinity;

const removeDownloading = () => {
  delAlert(downloadAlertId);
  downloadAlertId = null;
};

const downloadingAlert = (progress) => {
  if (!downloadAlertId) {
    downloadAlertId = nanoid();
  }
  if (progress < 100) {
    setAlert({
      id: downloadAlertId,
      icon: <Spinner level="success" />,
      message: (
        <Text
          id="gui.alert.downloadingProgress"
          defaultMessage="Downloading...{progress}%"
          progress={progress}
        />
      ),
    });
  } else {
    setAlert('downloadCompleted', { id: downloadAlertId });
    setTimeout(removeDownloading, 2000);
  }
};

const errorAlert = (err) => {
  if (err === 'NotFoundError') return;
  setAlert('connectionError', 1000);
};

export function DeviceMenu({ itemClassName }) {
  const { language } = useLocalesContext();

  const { meta, key, name, files, assets } = useProjectContext();

  const firmwareJson = useSignal(null);

  useEffect(async () => {
    downloadAlertId = null;
    const baseUrl = firmware.mirrors?.[language.value]?.download ?? firmware.download;
    firmwareJson.value = await fetch(`${baseUrl}version.json`).then((res) => res.json());
  }, [language.value]);

  const handleDownload = useCallback(async () => {
    if (downloadAlertId) return;

    let currentDevice;
    try {
      currentDevice = await MPYUtils.connect(deviceFilters);
    } catch (err) {
      errorAlert(err.name);
    }
    if (!currentDevice) return;

    const checker = MPYUtils.check(currentDevice).catch(() => {
      errorAlert();
      removeDownloading();
      MPYUtils.disconnect(currentDevice);
    });

    const projectName = name.value || translate('gui.project.shortname', 'Untitled');
    const projectFiles = []
      .concat(
        generateMain(projectName, files.value[0], files.value.slice(1), meta.value.monitors),
        ...generateAssets(assets.value),
      )
      .map((file) => ({
        ...file,
        filename: file.id.startsWith('lib/')
          ? file.id // 库文件不放入项目文件夹
          : `proj${key.value}/${file.id}`,
      }));

    downloadingAlert(0);

    try {
      await MPYUtils.enterDownloadMode(currentDevice);

      // 检查版本，强制更新
      if (
        firmwareJson.value?.forcedUpdate &&
        !(await MPYUtils.checkVersion(currentDevice, firmwareJson.value.version))
      ) {
        openPromptModal({
          title: (
            <Text
              id="arcade.menu.device"
              defaultMessage="Arcade"
            />
          ),
          label: (
            <Text
              id="blocks.downloadPrompt.firmwareOutdated"
              defaultMessage="The firmware is outdated. Please update it."
            />
          ),
        });
      }

      // 检查空间
      else if (!(await MPYUtils.flashFree(currentDevice, projectFiles))) {
        openPromptModal({
          title: (
            <Text
              id="arcade.menu.device"
              defaultMessage="Arcade"
            />
          ),
          label: (
            <Text
              id="blocks.downloadPrompt.flashOutSpace"
              defaultMessage="The flash is running out of space."
            />
          ),
        });
      }

      // 开始下载
      else {
        // 下载计时开始
        if (DEBUG || BETA) {
          downloadStart = Date.now();
          console.log('Download start...');
        }

        const timeout = currentDevice.timeout;
        currentDevice.timeout = 30000; // 增加时长，避免传输大文件导致的等待超时
        await MPYUtils.write(currentDevice, projectFiles, downloadingAlert);
        await MPYUtils.config(currentDevice, { 'latest-project': key });
        currentDevice.timeout = timeout;

        // 下载计时结束
        if (DEBUG || BETA) {
          console.log(`Download completed: ${Date.now() - downloadStart}ms`);
        }
      }

      await MPYUtils.disconnect(currentDevice, true);
    } catch (err) {
      errorAlert(err.name);
    }

    removeDownloading();
    checker.cancel();
  }, []);

  return (
    <>
      <MenuSection>
        <MenuItem
          disabled={downloadAlertId}
          className={itemClassName}
          label={
            <Text
              id="gui.menubar.device.download"
              defaultMessage="Download program"
            />
          }
          onClick={handleDownload}
        />
      </MenuSection>

      <ConfigSection itemClassName={itemClassName} />

      <FirmwareSection itemClassName={itemClassName} />

      <MenuSection>
        <MenuItem
          className={itemClassName}
          label={
            <Text
              id="arcade.menu.device.manual"
              defaultMessage="Arcade manual"
            />
          }
          onClick={useCallback(() => window.open('https://arcade.blockcode.fun/'), [])}
        />
      </MenuSection>
    </>
  );
}
