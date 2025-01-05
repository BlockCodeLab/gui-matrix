import { useSignal } from '@preact/signals';
import { nanoid } from '@blockcode/utils';
import { setAlert, delAlert, addAsset } from '@blockcode/core';
import { loadSoundFromURL } from '@blockcode/sound';
import { getAssetUrl } from '../../lib/get-asset-url';

import { SoundEditor } from '@blockcode/sound';
import { SoundsLibrary } from '../libraries/sounds-library';

export function SoundTabContent() {
  const soundsLibraryVisible = useSignal(false);

  const handleLibrarySelect = async (asset) => {
    const assetId = nanoid();
    setAlert('importing', { id: assetId });

    const sound = await loadSoundFromURL(getAssetUrl(asset, 'wav'));
    addAsset({
      ...asset,
      ...sound,
      id: assetId,
    });

    delAlert(assetId);
  };

  return (
    <>
      <SoundEditor
        onShowLibrary={() => (soundsLibraryVisible.value = true)}
        onSurprise={() => handleLibrarySelect(SoundsLibrary.surprise())}
      />

      {soundsLibraryVisible.value && (
        <SoundsLibrary
          onClose={() => (soundsLibraryVisible.value = false)}
          onSelect={handleLibrarySelect}
        />
      )}
    </>
  );
}
