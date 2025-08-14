import { generateImage } from './generate-image';
import { generateSound } from './generate-sound';

export function generateAssets(assets) {
  return assets
    .map((asset) => {
      switch (asset.type) {
        case 'image/png':
          return generateImage(asset);
        case 'audio/mp3':
          return generateSound(asset);
        default:
          return asset;
      }
    })
    .filter((asset) => {
      if (
        typeof asset.content === 'string' ||
        asset.content instanceof ArrayBuffer ||
        asset.content instanceof Uint8Array
      ) {
        return true;
      }
      return !asset.content;
    });
}
