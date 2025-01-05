import { mime } from '@blockcode/utils';

export function getAssetUrl(asset, options) {
  if (typeof options === 'string') {
    options = {
      extname: options,
    };
  }
  let { mediaPath, copyright, id, extname } = options;

  if (asset.type) {
    extname = mime.getExtension(asset.type);
  }

  if (asset.copyright || copyright) {
    if (!copyright) {
      copyright = asset.copyright;
    }
    mediaPath = `${copyright.toLowerCase()}-media/`;
  }

  return `./assets/${mediaPath ?? ''}${id ?? asset.id}.${extname}`;
}
