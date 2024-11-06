import { WaveFile } from '@blockcode/wave-surfer';

export default function ({ id, type, data }) {
  const wav = new WaveFile();
  wav.fromBase64(data);
  return {
    id: `${id}.wav`,
    type,
    content: wav.toBuffer(),
  };
}
