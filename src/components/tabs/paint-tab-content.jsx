import { useCallback, useEffect } from 'preact/hooks';
import { batch, useSignal } from '@preact/signals';
import { nanoid } from '@blockcode/utils';
import { useProjectContext, setAlert, delAlert, openAsset, addAsset, setFile } from '@blockcode/core';
import { loadImageFromURL, EditorModes } from '@blockcode/paint';
import { getAssetUrl } from '../../lib/get-asset-url';
import { StageConfig } from '../emulator/emulator-config';

import { PaintEditor } from '@blockcode/paint';
import { BackdropsLibrary } from '../libraries/backdrops-library';
import { CostumesLibrary } from '../libraries/costumes-library';

export function PaintTabContent() {
  const { file, fileIndex, assetId } = useProjectContext();

  const libraryVisible = useSignal(false);

  const target = file.value;

  // 打开当前角色选中的
  useEffect(() => {
    openAsset(target.assets[target.frame]);
  }, [fileIndex.value, assetId.value === null]);

  const handleChange = useCallback(
    (changedId) => {
      if (target.assets.includes(changedId)) {
        setFile({
          frame: target.assets.indexOf(changedId),
        });
      } else {
        target.assets.push(changedId);
        setFile({
          assets: target.assets,
          frame: target.assets.length - 1,
        });
      }
    },
    [target],
  );

  const handleDelete = useCallback(
    (changedId) => {
      const index = target.assets.indexOf(changedId);
      if (index === target.frame) {
        if (index + 1 < target.assets.length) {
          target.frame = index;
        } else if (index - 1 > -1) {
          target.frame = index - 1;
        } else {
          target.frame = 0;
        }
      }
      batch(() => {
        target.assets.splice(index, 1);
        setFile({
          assets: target.assets,
          frame: target.frame,
        });
      });
    },
    [target],
  );

  const handleImagesFilter = useCallback((image) => target.assets.includes(image.id), [target]);

  const handleLibrarySelect = useCallback(
    async (asset) => {
      const alertId = nanoid();
      setAlert('importing', { id: alertId });
      const image = await loadImageFromURL(getAssetUrl(asset, 'png'));
      delAlert(alertId);

      batch(() => {
        addAsset({
          ...asset,
          id: image.id,
          type: 'image/png',
          data: image.dataset.data,
          width: image.width,
          height: image.height,
        });
        target.assets.push(image.id);
        setFile({
          assets: target.assets,
          frame: target.assets.length - 1,
        });
      });
    },
    [target],
  );

  return (
    <>
      <PaintEditor
        mode={fileIndex.value === 0 ? EditorModes.Backdrop : EditorModes.Costume}
        maxSize={{
          width: StageConfig.Width,
          height: StageConfig.Height,
        }}
        onImagesFilter={handleImagesFilter}
        onShowLibrary={() => (libraryVisible.value = true)}
        onSurprise={() =>
          handleLibrarySelect(fileIndex.value === 0 ? BackdropsLibrary.surprise() : CostumesLibrary.surprise())
        }
        onChange={handleChange}
        onDelete={handleDelete}
      />

      {libraryVisible.value &&
        (fileIndex.value === 0 ? (
          <BackdropsLibrary
            onClose={() => (libraryVisible.value = false)}
            onSelect={handleLibrarySelect}
          />
        ) : (
          <CostumesLibrary
            onClose={() => (libraryVisible.value = false)}
            onSelect={handleLibrarySelect}
          />
        ))}
    </>
  );
}
