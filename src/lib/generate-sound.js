import { WaveFile } from 'wavefile';
import { mime } from '@blockcode/utils';

export function generateSound({ id, type, data }) {
  const wav = new WaveFile();
  const extname = mime.getExtension(type);
  wav.fromBase64(data);
  return {
    id: `${id}.${extname}`,
    type,
    content: wav.toBuffer(),
  };
}
