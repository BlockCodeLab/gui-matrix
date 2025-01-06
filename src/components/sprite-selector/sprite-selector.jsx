import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';
import { batch, useSignal } from '@preact/signals';
import { nanoid, MathUtils } from '@blockcode/utils';
import {
  useLocalesContext,
  useProjectContext,
  translate,
  setAppState,
  openTab,
  setAlert,
  delAlert,
  openPromptModal,
  openFile,
  addFile,
  delFile,
  addAsset,
  delAsset,
} from '@blockcode/core';
import { loadImageFromFile, loadImageFromURL, BlankImageData } from '@blockcode/paint';
import { getAssetUrl } from '../../lib/get-asset-url';
import { StageConfig, RotationStyle } from '../emulator/emulator-config';

import { Text, IconSelector, ActionButton } from '@blockcode/core';
import { SpriteInfo } from '../sprite-info/sprite-info';
import { SpritesLibrary } from '../libraries/sprites-library';
import styles from './sprite-selector.module.css';

import spriteIcon from './icons/icon-sprite.svg';
import surpriseIcon from './icons/icon-surprise.svg';
import searchIcon from './icons/icon-search.svg';
import paintIcon from './icons/icon-paint.svg';
import fileUploadIcon from './icons/icon-file-upload.svg';

const DefaultSpriteIcon = `data:image/png;base64,${BlankImageData}`;

export function SpriteSelector() {
  const { translator } = useLocalesContext();

  const { files, assets, fileId, modified } = useProjectContext();

  const ref = useRef();

  const spritesLibraryVisiable = useSignal(false);

  const getSpriteIcon = useCallback((id) => {
    const asset = assets.value.find((asset) => asset.id === id);
    if (asset) {
      return `data:${asset.type};base64,${asset.data}`;
    }
  }, []);

  const spriteIcons = useMemo(
    () => files.value.map((sprite) => getSpriteIcon(sprite.assets[sprite.frame])),
    [modified.value],
  );

  const handleShowLibrary = useCallback(() => {
    setAppState({ running: false });
    spritesLibraryVisiable.value = true;
  }, []);

  const handleSelectSprite = useCallback(async (sprite) => {
    const spriteId = nanoid();
    setAlert('importing', { id: spriteId });

    // 添加角色的每一个造型
    const costumes = [];
    for (const costume of sprite.costumes) {
      const image = await loadImageFromURL(
        getAssetUrl(costume, {
          copyright: sprite.copyright,
          extname: 'png',
        }),
      );
      costumes.push({
        ...costume,
        id: image.id,
        data: image.dataset.data,
        width: image.width,
        height: image.height,
      });
    }

    delAlert(spriteId);

    batch(() => {
      const assetIds = [];
      for (const costume of costumes) {
        addAsset({
          ...costume,
          type: 'image/png',
        });
        assetIds.push(costume.id);
      }

      addFile({
        id: spriteId,
        type: 'text/x-python',
        name: sprite.name,
        assets: assetIds,
        frame: 0,
        x: MathUtils.random(-180, 180),
        y: MathUtils.random(-100, 100),
        size: 100,
        direction: 90,
        rotationStyle: RotationStyle.ALL_AROUND,
      });
    });
  }, []);

  const handleUploadFile = useCallback(() => {
    setAppState({ running: false });

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // TODO: .sprite file
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener('change', async (e) => {
      const alertId = nanoid();
      setAlert('importing', { id: alertId });

      const images = [];

      // 将每一张上传的图片都添加为一个角色
      for (const file of e.target.files) {
        let image = await loadImageFromFile(file, {
          width: StageConfig.Width,
          height: StageConfig.Height,
        });
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
          // 如果上传的图片解析失败，则用空白图片代替
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
          addFile({
            id: nanoid(),
            type: 'text/x-python',
            name: image.name,
            assets: [image.id],
            frame: 0,
            x: MathUtils.random(-100, 100),
            y: MathUtils.random(-60, 60),
            size: 100,
            direction: 90,
            rotationStyle: RotationStyle.ALL_AROUND,
          });
        }
      });
    });
  }, []);

  const handlePaintImage = useCallback(() => {
    batch(() => {
      setAppState({ running: false });

      const spriteId = nanoid();
      const costumeId = nanoid();
      addAsset({
        id: costumeId,
        type: 'image/png',
        name: translate('matrix.defaultProject.costumeName', 'costume', translator),
        data: BlankImageData,
        width: 1,
        height: 1,
        centerX: 1,
        centerY: 1,
      });
      addFile({
        id: spriteId,
        type: 'text/x-python',
        name: translate('matrix.defaultProject.spriteName', 'Sprite', translator),
        assets: [costumeId],
        frame: 0,
        x: 0,
        y: 0,
        size: 100,
        direction: 90,
        rotationStyle: RotationStyle.ALL_AROUND,
      });
      openTab(1);
    });
  }, []);

  const handleSurprise = useCallback(() => {
    setAppState({ running: false });
    handleSelectSprite(SpritesLibrary.surprise());
  }, []);

  const handleDuplicate = useCallback((index) => {
    batch(() => {
      setAppState({ running: false });

      const sprite = files.value[index];
      addFile({
        ...sprite,
        id: nanoid(),
        assets: sprite.assets.map((assetId) => {
          const image = assets.value.find((asset) => asset.id === assetId);
          const costumeId = nanoid();
          addAsset({
            ...image,
            id: costumeId,
          });
          return costumeId;
        }),
        x: MathUtils.random(-100, 100),
        y: MathUtils.random(-60, 60),
        content: '',
        script: '',
      });
    });
  }, []);

  const deleteSprite = useCallback((index) => {
    const sprite = files.value[index];
    batch(() => {
      setAppState({ running: false });
      for (const assetId of sprite.assets) {
        delAsset(assetId);
      }
      delFile(sprite.id);
    });
  }, []);

  const handleDelete = useCallback((index) => {
    const sprite = files.value[index];
    openPromptModal({
      title: (
        <Text
          id="matrix.deletePrompt.title"
          defaultMessage="Delete {name}"
          name={sprite.name}
        />
      ),
      label: (
        <Text
          id="matrix.deletePrompt.label"
          defaultMessage="Do you want to delete the sprite?"
        />
      ),
      onSubmit: () => deleteSprite(index),
    });
  }, []);

  if (ref.current) {
    const rect = ref.current.base.getBoundingClientRect();
    ref.current.base.style.height = `${window.innerHeight - rect.top}px`;
  }

  return (
    <>
      <div className={styles.spriteSelector}>
        <SpriteInfo />

        <IconSelector
          id="sprite-selector"
          ref={ref}
          className={styles.selectorItemsWrapper}
          items={files.value.map((sprite, i) =>
            i === 0 // 第一个为舞台，隐藏不显示
              ? { __hidden__: true }
              : {
                  ...sprite,
                  icon: spriteIcons[i] ?? DefaultSpriteIcon,
                  order: sprite.order || i,
                  contextMenu: [
                    [
                      {
                        label: (
                          <Text
                            id="matrix.contextMenu.duplicate"
                            defaultMessage="duplicate"
                          />
                        ),
                        onClick: () => handleDuplicate(i),
                      },
                      {
                        label: (
                          <Text
                            id="matrix.contextMenu.export"
                            defaultMessage="export"
                          />
                        ),
                        disabled: true,
                        onClick: () => {},
                      },
                    ],
                    [
                      {
                        label: (
                          <Text
                            id="matrix.contextMenu.delete"
                            defaultMessage="delete"
                          />
                        ),
                        disabled: files.value.length <= 2,
                        className: styles.deleteMenuItem,
                        onClick: () => handleDelete(i),
                      },
                    ],
                  ],
                },
          )}
          selectedId={fileId.value}
          onSelect={useCallback((i) => openFile(files.value[i].id), [])}
          onDelete={files.value.length > 2 ? handleDelete : null}
        />

        <ActionButton
          className={styles.addButton}
          icon={spriteIcon}
          tooltip={
            <Text
              id="matrix.actionButton.sprite"
              defaultMessage="Choose a Sprite"
            />
          }
          onClick={handleShowLibrary}
          moreButtons={[
            {
              icon: fileUploadIcon,
              tooltip: (
                <Text
                  id="matrix.actionButton.uploadSprite"
                  defaultMessage="Upload Sprite"
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
                  id="matrix.actionButton.sprite"
                  defaultMessage="Choose a Sprite"
                />
              ),
              onClick: handleShowLibrary,
            },
          ]}
        />
      </div>

      {spritesLibraryVisiable.value && (
        <SpritesLibrary
          onClose={useCallback(() => (spritesLibraryVisiable.value = false), [])}
          onSelect={handleSelectSprite}
        />
      )}
    </>
  );
}