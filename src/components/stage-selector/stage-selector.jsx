import { useState } from 'preact/hooks';
import { useLocale, useLayout, useEditor } from '@blockcode/core';
import { classNames, Text, ActionButton } from '@blockcode/ui';
import BackdropsLibrary from '../libraries/backdrops-library';

import uid from '../../lib/uid';
import { uploadImage, loadImageFromURL } from '../../lib/load-image';

import styles from './stage-selector.module.css';
import backdropIcon from './icon-backdrop.svg';
import surpriseIcon from '../sprite-selector/icon-surprise.svg';
import searchIcon from '../sprite-selector/icon-search.svg';
import paintIcon from '../sprite-selector/icon-paint.svg';
import fileUploadIcon from '../sprite-selector/icon-file-upload.svg';

const DEFAULT_BACKDROP_THUMB =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

export default function StageSelector({ onStop }) {
  const [backdropsLibrary, setBackdropsLibrary] = useState(false);
  const { getText } = useLocale();
  const { selectTab, createAlert, removeAlert } = useLayout();
  const { fileList, assetList, selectedFileId, openFile, addAsset, modifyFile } = useEditor();

  let backdropIdList, thumb, count;
  const stage = fileList[0];

  if (stage) {
    backdropIdList = stage.assets;
    const image = assetList.find((asset) => asset.id === backdropIdList[stage.frame]);
    if (image) {
      thumb = `data:${image.type};base64,${image.data}`;
      count = backdropIdList.length;
    }
  }

  const handleShowLibrary = () => {
    onStop();
    setBackdropsLibrary(true);
  };
  const handleCloseLibrary = () => setBackdropsLibrary(false);

  const handleSelectBackdrop = async ({ tags, ...backdrop }) => {
    const backdropId = uid();
    createAlert('importing', { id: backdropId });

    const image = await loadImageFromURL(`./assets/${backdrop.id}.png`);
    addAsset({
      ...backdrop,
      id: backdropId,
      type: 'image/png',
      data: image.dataset.data,
      width: image.width,
      height: image.height,
    });
    backdropIdList.push(backdropId);
    removeAlert(backdropId);

    modifyFile({
      id: stage.id,
      assets: backdropIdList,
      frame: backdropIdList.length - 1,
    });
    openFile(stage.id);
  };

  const handleUploadFile = () => {
    onStop();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener('change', async ({ target }) => {
      const alertId = uid();
      createAlert('importing', { id: alertId });

      const totalCount = target.files.length;
      let failedCount = target.files.length;
      for (const file of target.files) {
        const imageId = uid();
        const imageName = file.name.slice(0, file.name.lastIndexOf('.'));
        let image = await uploadImage(file);
        if (!image) {
          createAlert(
            {
              message: getText('arcade.actionButton.uploadError', 'Upload "{file}" failed.', { file: file.name }),
            },
            2000,
          );
          image = {
            dataset: {
              data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC',
            },
            width: 1,
            height: 1,
          };
        }
        addAsset({
          id: imageId,
          type: 'image/png',
          name: imageName,
          data: image.dataset.data,
          width: image.width,
          height: image.height,
          centerX: Math.floor(image.width / 2),
          centerY: Math.floor(image.height / 2),
        });
        backdropIdList.push(imageId);
        failedCount--;
      }
      removeAlert(alertId);

      if (failedCount < totalCount) {
        modifyFile({
          id: stage.id,
          assets: backdropIdList,
          frame: backdropIdList.length - 1,
        });
        openFile(stage.id);
      }
    });
  };

  const handlePaintImage = () => {
    onStop();
    openFile(stage.id);

    const imageId = uid();
    addAsset({
      id: imageId,
      type: 'image/png',
      name: getText(`arcade.defaultProject.backdropName`, 'backdrop'),
      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC',
      width: 1,
      height: 1,
      centerX: 1,
      centerY: 1,
    });
    modifyFile({
      assets: backdropIdList.concat(imageId),
      frame: count,
    });
    selectTab(1);
  };

  const handleSurprise = () => {
    onStop();
    handleSelectBackdrop(BackdropsLibrary.surprise());
  };

  return (
    <>
      <div
        className={classNames(styles.stageSelector, {
          [styles.isSelected]: selectedFileId === stage.id,
        })}
        onClick={() => openFile(stage.id)}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Text
              id="arcade.stageSelector.title"
              defaultMessage="Stage"
            />
          </div>
        </div>
        <img
          className={styles.backdropImage}
          src={thumb || DEFAULT_BACKDROP_THUMB}
        />
        <div className={styles.label}>
          <Text
            id="arcade.stageSelector.backdrops"
            defaultMessage="Backdrops"
          />
        </div>
        <div className={styles.count}>{count || 0}</div>

        <ActionButton
          className={styles.addButton}
          icon={backdropIcon}
          tooltip={getText('arcade.actionButton.backdrop', 'Choose a Backdrop')}
          onClick={handleShowLibrary}
          moreButtons={[
            {
              icon: fileUploadIcon,
              tooltip: getText('arcade.actionButton.uploadBackdrop', 'Upload Backdrop'),
              onClick: handleUploadFile,
            },
            {
              icon: surpriseIcon,
              tooltip: getText('arcade.actionButton.surprise', 'Surprise'),
              onClick: handleSurprise,
            },
            {
              icon: paintIcon,
              tooltip: getText('arcade.actionButton.paint', 'Paint'),
              onClick: handlePaintImage,
            },
            {
              icon: searchIcon,
              tooltip: getText('arcade.actionButton.backdrop', 'Choose a Backdrop'),
              onClick: handleShowLibrary,
            },
          ]}
        />
      </div>

      {backdropsLibrary && (
        <BackdropsLibrary
          onSelect={handleSelectBackdrop}
          onClose={handleCloseLibrary}
        />
      )}
    </>
  );
}
