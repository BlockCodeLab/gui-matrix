import { mime } from '@blockcode/core';
import { WaveFile } from '@blockcode/wave-surfer';

export default function ({ id, type, data }) {
  const wav = new WaveFile();
  const extname = mime.getExtension(type);
  wav.fromBase64(data);
  return {
    id: `${id}.${extname}`,
    type,
    content: wav.toBuffer(),
  };
}
