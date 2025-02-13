import { useMemo } from 'preact/hooks';
import { batch, useSignal } from '@preact/signals';
import { classNames, nanoid } from '@blockcode/utils';
import {
  useLocalesContext,
  useAppContext,
  useProjectContext,
  translate,
  setAppState,
  openTab,
  setAlert,
  delAlert,
  openFile,
  setFile,
  addAsset,
} from '@blockcode/core';
import { loadImageFromFile, loadImageFromURL, BlankImageData } from '@blockcode/paint';
import { getAssetUrl } from '../../lib/get-asset-url';
import { StageConfig } from '../emulator/emulator-config';

import { Text, ActionButton } from '@blockcode/core';
import { BackdropsLibrary } from '../libraries/backdrops-library';
import styles from './stage-selector.module.css';

import backdropIcon from './icon-backdrop.svg';
import surpriseIcon from '../sprite-selector/icons/icon-surprise.svg';
import searchIcon from '../sprite-selector/icons/icon-search.svg';
import paintIcon from '../sprite-selector/icons/icon-paint.svg';
import fileUploadIcon from '../sprite-selector/icons/icon-file-upload.svg';

const maxSize = {
  width: StageConfig.Width,
  height: StageConfig.Height,
};

export function StageSelector() {
  const { translator } = useLocalesContext();

  const { splashVisible } = useAppContext();

  const { files, fileId, assets, modified } = useProjectContext();

  const backdropsLibraryVisible = useSignal(false);

  const stage = files.value[0];

  const backdropThumb = useMemo(() => {
    const backdrop = assets.value.find((res) => res.id === stage.assets[stage.frame]);
    if (backdrop) {
      return `data:${backdrop.type};base64,${backdrop.data}`;
    }
  }, [splashVisible.value === false, modified.value]);

  const handleShowLibrary = () => {
    setAppState({ running: false });
    backdropsLibraryVisible.value = true;
  };

  const handleSelectBackdrop = async ({ tags, ...backdrop }) => {
    setAlert('importing', { id: stage.id });
    const image = await loadImageFromURL(getAssetUrl(backdrop));
    delAlert(stage.id);

    batch(() => {
      addAsset({
        ...backdrop,
        id: image.id,
        type: 'image/png',
        data: image.dataset.data,
        width: image.width,
        height: image.height,
      });
      stage.assets.push(image.id);

      setFile({
        id: stage.id,
        assets: stage.assets,
        frame: stage.assets.length - 1,
      });
      openFile(stage.id);
    });
  };

  const handleUploadFile = () => {
    setAppState({ running: false });

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener('change', async (e) => {
      const alertId = nanoid();
      setAlert('importing', { id: alertId });

      const totalCount = e.target.files.length;
      let failedCount = e.target.files.length;

      const images = [];

      // 依次解析上传的文件并加入项目
      let image;
      for (const file of e.target.files) {
        image = await loadImageFromFile(file, maxSize);
        if (!image) {
          setAlert(
            {
              message: (
                <Text
                  id="matrix.actionButton.uploadError"
                  defaultMessage='Upload "{file}" failed.'
                  file={file.name}
                />
              ),
            },
            2000,
          );
          // 上传的文件解析有问题用空白图片代替
          image = {
            dataset: {
              data: BlankImageData,
            },
            width: 1,
            height: 1,
          };
        }
        image.name = file.name.slice(0, file.name.lastIndexOf('.'));
        images.push(image);
        failedCount--;
      }
      delAlert(alertId);

      batch(() => {
        for (const image of images) {
          addAsset({
            id: image.id,
            type: 'image/png',
            name: image.name,
            data: image.dataset.data,
            width: image.width,
            height: image.height,
            centerX: Math.floor(image.width / 2),
            centerY: Math.floor(image.height / 2),
          });
          stage.assets.push(image.id);
        }

        if (failedCount < totalCount) {
          setFile({
            id: stage.id,
            assets: stage.assets,
            frame: stage.assets.length - 1,
          });
          openFile(stage.id);
        }
      });
    });
  };

  const handlePaintImage = () => {
    setAppState({ running: false });

    const imageId = nanoid();
    batch(() => {
      openFile(stage.id);
      addAsset({
        id: imageId,
        type: 'image/png',
        name: translate('matrix.defaultProject.backdropName', 'backdrop', translator),
        data: BlankImageData,
        width: 1,
        height: 1,
        centerX: 1,
        centerY: 1,
      });
      stage.assets.push(imageId);
      setFile({
        assets: stage.assets,
        frame: stage.assets.length - 1,
      });
      openTab(1);
    });
  };

  const handleSurprise = () => {
    setAppState({ running: false });
    handleSelectBackdrop(BackdropsLibrary.surprise());
  };

  return (
    <>
      <div
        className={classNames(styles.stageSelector, {
          [styles.isSelected]: fileId.value === stage.id,
        })}
        onClick={() => openFile(stage.id)}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Text
              id="matrix.stageSelector.title"
              defaultMessage="Stage"
            />
          </div>
        </div>
        <img
          className={styles.backdropImage}
          src={backdropThumb}
        />
        <div className={styles.label}>
          <Text
            id="matrix.stageSelector.backdrops"
            defaultMessage="Backdrops"
          />
        </div>
        <div className={styles.count}>{stage.assets.length}</div>

        <ActionButton
          className={styles.addButton}
          icon={backdropIcon}
          tooltip={
            <Text
              id="matrix.actionButton.backdrop"
              defaultMessage="Choose a Backdrop"
            />
          }
          onClick={handleShowLibrary}
          moreButtons={[
            {
              icon: fileUploadIcon,
              tooltip: (
                <Text
                  id="matrix.actionButton.uploadBackdrop"
                  defaultMessage="Upload Backdrop"
                />
              ),
              onClick: handleUploadFile,
            },
            {
              icon: surpriseIcon,
              tooltip: (
                <Text
                  id="matrix.actionButton.surprise"
                  defaultMessage="Surprise"
                />
              ),
              onClick: handleSurprise,
            },
            {
              icon: paintIcon,
              tooltip: (
                <Text
                  id="matrix.actionButton.paint"
                  defaultMessage="Paint"
                />
              ),
              onClick: handlePaintImage,
            },
            {
              icon: searchIcon,
              tooltip: (
                <Text
                  id="matrix.actionButton.backdrop"
                  defaultMessage="Choose a Backdrop"
                />
              ),
              onClick: handleShowLibrary,
            },
          ]}
        />
      </div>

      {backdropsLibraryVisible.value && (
        <BackdropsLibrary
          onSelect={handleSelectBackdrop}
          onClose={() => (backdropsLibraryVisible.value = false)}
        />
      )}
    </>
  );
}
