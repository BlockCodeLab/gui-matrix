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

const maxSize = {
  width: StageConfig.Width,
  height: StageConfig.Height,
};

export function PaintTabContent() {
  const { file, fileIndex, assetId } = useProjectContext();

  const libraryVisible = useSignal(false);

  const target = file.value;

  // 打开当前角色选中的
  useEffect(() => {
    openAsset(target.assets[target.frame]);
  }, [fileIndex.value, !target.assets.includes(assetId.value)]);

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
    (deleteId, changedId) => {
      const index = target.assets.indexOf(deleteId);
      target.assets.splice(index, 1);
      setFile({
        assets: target.assets,
        frame: target.assets.indexOf(changedId),
      });
    },
    [target],
  );

  const handleImagesFilter = useCallback(() => target.assets, [target]);

  const handleLibrarySelect = useCallback(
    async ({ tags, bpr, copyright, ...asset }) => {
      const alertId = nanoid();
      setAlert('importing', { id: alertId });

      const scale = 1 / (bpr || 1);
      const image = await loadImageFromURL(getAssetUrl(asset, { copyright }), scale);

      delAlert(alertId);

      batch(() => {
        addAsset({
          ...asset,
          id: image.id,
          type: 'image/png',
          data: image.dataset.data,
          width: image.width,
          height: image.height,
          height: image.height,
          centerX: asset.centerX * scale,
          centerY: asset.centerY * scale,
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
        maxSize={maxSize}
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
