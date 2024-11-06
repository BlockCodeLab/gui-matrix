import UPNG from 'upng-js';
import imageContour from './image-contour';

const base64ToArrayBuffer = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
};

export default function ({ id, name, type, data, width, height, centerX, centerY }) {
  const buffer = base64ToArrayBuffer(data);
  const rgba = new Uint8Array(UPNG.toRGBA8(UPNG.decode(buffer))[0]);

  const contour = imageContour({
    width,
    height,
    data: rgba,
  });
  const contourData = JSON.stringify(contour).replaceAll('[', '(').replaceAll(']', ',)').replaceAll('(,)', '()');

  let imageModule = '';
  imageModule += 'from scratch import runtime\n';
  imageModule += 'from micropython import const\n';
  imageModule += `ID = "${id}"\n`;
  imageModule += `NAME = "${name}"\n`;
  imageModule += `WIDTH = const(${width})\n`;
  imageModule += `HEIGHT = const(${height})\n`;
  imageModule += `CENTER_X = const(${centerX})\n`;
  imageModule += `CENTER_Y = const(${centerY})\n`;
  imageModule += `CONTOUR = ${contourData}\n`;
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
