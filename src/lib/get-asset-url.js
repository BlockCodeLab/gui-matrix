export function getAssetUrl(asset, options) {
  if (typeof options === 'string') {
    options = {
      type: options,
    };
  }
  let { mediaPath, copyright, id, type } = options ?? {};

  if (asset.type) {
    type = asset.type;
  }

  if (asset.copyright || copyright) {
    if (!copyright) {
      copyright = asset.copyright;
    }
    mediaPath = `${copyright.toLowerCase()}-`;
  }

  return `./${mediaPath ?? ''}media/${id ?? asset.id}.${type}`;
}
