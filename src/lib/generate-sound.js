import { mime, base64ToUint8Array } from '@blockcode/utils';

export function generateSound({ id, type, data }) {
  const extname = mime.getExtension(type);
  return {
    id: `${id}.${extname}`,
    type,
    content: base64ToUint8Array(data),
  };
}
