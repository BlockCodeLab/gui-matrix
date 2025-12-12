import { mime, Base64Utils } from '@blockcode/utils';

export function generateSound({ id, type, data }) {
  const extname = mime.getExtension(type);
  return {
    type,
    id: `${id}.${extname}`,
    content: Base64Utils.base64ToUint8Array(data),
  };
}
