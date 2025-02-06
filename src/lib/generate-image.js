import { UPNG, base64ToUint8Array } from '@blockcode/utils';

export function generateImage({ id, name, type, data, width, height, centerX, centerY }) {
  const image = UPNG.decode(base64ToUint8Array(data).buffer);

  const rgba = new Uint8Array(UPNG.toRGBA8(image)[0]);

  // change black(#000, 0x0000) to black(#000400, 0x0020), 0x0000 is transparent
  const len = width * height;
  for (let i = 0; i < len; i++) {
    const j = i << 2;
    if (rgba[j] === 0 && rgba[j + 1] === 0 && rgba[j + 2] === 0 && rgba[j + 3] !== 0) {
      rgba[j + 1] = 4;
    }
  }
  const buffer = UPNG.encode([rgba], width, height, 65535);

  let imageModule = '';
  imageModule += 'from scratch import runtime\n';
  imageModule += 'from micropython import const\n';
  imageModule += `ID = "${id}"\n`;
  imageModule += `NAME = "${name}"\n`;
  imageModule += `WIDTH = const(${Math.round(width)})\n`;
  imageModule += `HEIGHT = const(${Math.round(height)})\n`;
  imageModule += `CENTER_X = const(${Math.round(centerX)})\n`;
  imageModule += `CENTER_Y = const(${Math.round(centerY)})\n`;
  // imageModule += `CONTOUR = ${contourData}\n`;
  imageModule += `CONTOUR = ()\n`;
  imageModule += `dirpath = '/'.join(__file__.split('/')[0:-1])\n`;
  imageModule += `res = runtime.display._lcd.png_decode(f"{dirpath}/${id}.png")\n`;
  imageModule += `BITMAP = memoryview(res[0])\n`;

  return [
    {
      id: `${id}.png`,
      type,
      content: buffer, // Uint8Array.from(imageData),
    },
    {
      id: `image${id}`,
      type: 'text/x-python',
      content: imageModule,
    },
  ];
}
