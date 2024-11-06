import { useState } from 'preact/hooks';
import { useLocale, useLayout, useEditor, exportFile } from '@blockcode/core';
import { classNames, IconSelector, ActionButton } from '@blockcode/ui';
import SpriteInfo from '../sprite-info/sprite-info';

import uid from '../../lib/uid';
import { uploadImage, loadImageFromURL } from '../../lib/load-image';
import RotationStyle from '../../lib/rotation-style';

import styles from './sprite-selector.module.css';
import spriteIcon from './icon-sprite.svg';
import surpriseIcon from './icon-surprise.svg';
import searchIcon from './icon-search.svg';
import paintIcon from './icon-paint.svg';
import fileUploadIcon from './icon-file-upload.svg';
import SpritesLibrary from '../libraries/sprites-library';

export default function SpriteSelector({ playing, stageSize, onStop }) {
  const [spritesLibrary, setSpritesLibrary] = useState(false);
  const { getText } = useLocale();
  const { selectTab, createAlert, removeAlert, createPrompt } = useLayout();
  const { fileList, assetList, selectedFileId, addFile, openFile, deleteFile, addAsset, deleteAsset } = useEditor();

  const handleShowLibrary = () => {
    onStop();
    setSpritesLibrary(true);
  };
  const handleCloseLibrary = () => setSpritesLibrary(false);

  const handleSelectSprite = async ({ tags, ...sprite }) => {
    const spriteId = uid();
    createAlert('importing', { id: spriteId });

    const assetIdList = [];
    for (const costume of sprite.costumes) {
      const costumeId = uid();
      const image = await loadImageFromURL(`./assets/${costume.id}.png`);
      addAsset({
        ...costume,
        id: costumeId,
        type: 'image/png',
        data: image.dataset.data,
        width: image.width,
        height: image.height,
      });
      assetIdList.push(costumeId);
    }

    addFile({
      id: spriteId,
      type: 'text/x-python',
      name: sprite.name,
      assets: assetIdList,
      frame: 0,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      rotationStyle: RotationStyle.ALL_AROUND,
    });
    removeAlert(spriteId);
  };

  const handleUploadFile = () => {
    onStop();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // TODO: .sprite file
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener('change', async (e) => {
      const alertId = uid();
      createAlert('importing', { id: alertId });

      for (const file of e.target.files) {
        const spriteId = uid();
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
        addFile({
          id: spriteId,
          type: 'text/x-python',
          name: imageName,
          assets: [imageId],
          frame: 0,
          x: 0,
          y: 0,
          size: 100,
          direction: 90,
          rotationStyle: RotationStyle.ALL_AROUND,
        });
      }
      removeAlert(alertId);
    });
  };

  const handlePaintImage = () => {
    onStop();

    const spriteId = uid();
    const imageId = uid();
    addAsset({
      id: imageId,
      type: 'image/png',
      name: getText(`arcade.defaultProject.costumeName`, 'costume'),
      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC',
      width: 1,
      height: 1,
      centerX: 1,
      centerY: 1,
    });
    addFile({
      id: spriteId,
      type: 'text/x-python',
      name: getText(`arcade.defaultProject.spriteName`, 'Sprite'),
      assets: [imageId],
      frame: 0,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      rotationStyle: RotationStyle.ALL_AROUND,
    });
    selectTab(1);
  };

  const handleSurprise = () => {
    onStop();
    handleSelectSprite(SpritesLibrary.surprise());
  };

  const handleDuplicate = (index) => {
    onStop();

    const spriteId = uid();
    const sprite = fileList[index];
    addFile({
      ...sprite,
      id: spriteId,
      assets: sprite.assets.map((assetId) => {
        const image = assetList.find((asset) => asset.id === assetId);
        const imageId = uid();
        addAsset({
          ...image,
          id: imageId,
        });
        return imageId;
      }),
      x: Math.floor(Math.random() * (240 + 1)) - 120,
      y: Math.floor(Math.random() * (160 + 1)) - 80,
      content: '',
    });
  };

  const handleDelete = (index) => {
    const { id, name, assets } = fileList[index];
    createPrompt({
      title: getText('arcade.deletePrompt.title', 'Delete {name}', { name }),
      label: getText('arcade.deletePrompt.label', 'Do you want to delete the sprite?'),
      onSubmit: () => {
        onStop();
        deleteAsset(assets);
        deleteFile(id);
      },
    });
  };

  const getFileIcon = (id) => {
    const asset = assetList.find((asset) => asset.id === id);
    if (asset) {
      return `data:${asset.type};base64,${asset.data}`;
    }
  };

  return (
    <>
      <div className={styles.spriteSelector}>
        <SpriteInfo
          playing={playing}
          stageSize={stageSize}
        />

        <IconSelector
          id="sprite-selector"
          className={classNames(styles.selectorItemsWrapper, {
            [styles.small]: stageSize === 'small',
          })}
          items={fileList.map((sprite, index) =>
            index === 0
              ? { __hidden__: true }
              : {
                  ...sprite,
                  icon: getFileIcon(sprite.assets[sprite.frame]),
                  order: sprite.order || index,
                  contextMenu: [
                    [
                      {
                        label: getText('arcade.contextMenu.duplicate', 'duplicate'),
                        onClick: () => handleDuplicate(index),
                      },
                      {
                        label: getText('arcade.contextMenu.export', 'export'),
                        disabled: true,
                        onClick: () => {},
                      },
                    ],
                    [
                      {
                        label: getText('arcade.contextMenu.delete', 'delete'),
                        disabled: fileList.length <= 2,
                        className: styles.deleteMenuItem,
                        onClick: () => handleDelete(index),
                      },
                    ],
                  ],
                },
          )}
          selectedIndex={fileList.findIndex((file) => file.id === selectedFileId)}
          onSelect={(index) => openFile(fileList[index].id)}
          onDelete={fileList.length > 2 ? handleDelete : null}
        />

        <ActionButton
          className={styles.addButton}
          icon={spriteIcon}
          tooltip={getText('arcade.actionButton.sprite', 'Choose a Sprite')}
          onClick={handleShowLibrary}
          moreButtons={[
            {
              icon: fileUploadIcon,
              tooltip: getText('arcade.actionButton.uploadSprite', 'Upload Sprite'),
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
              tooltip: getText('arcade.actionButton.sprite', 'Choose a Sprite'),
              onClick: handleShowLibrary,
            },
          ]}
        />
      </div>

      {spritesLibrary && (
        <SpritesLibrary
          onClose={handleCloseLibrary}
          onSelect={handleSelectSprite}
        />
      )}
    </>
  );
}
