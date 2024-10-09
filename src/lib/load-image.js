import { VIEW_WIDTH, VIEW_HEIGHT } from './default-project';

const IMAGE_DATA_OFFSET = 'data:image/png;base64,'.length;
const EMPTY_IMAGE = 'data:,';

export function uploadImage(file) {
  return new Promise(async (resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      const image = new Image();
      image.src = reader.result;
      image.addEventListener('load', () => {
        if (image.dataset.data) {
          resolve(image);
          return;
        }

        let width = image.width;
        let height = image.height;

        if (image.width > VIEW_WIDTH || image.height > VIEW_HEIGHT) {
          width = VIEW_WIDTH;
          height = VIEW_HEIGHT;

          const sw = image.width / VIEW_WIDTH;
          const sh = image.height / VIEW_HEIGHT;
          if (sw > sh) {
            height = image.height / sw;
          } else {
            width = image.width / sh;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/png');
        if (dataUrl === EMPTY_IMAGE) {
          resolve(null);
          return;
        }
        image.dataset.data = dataUrl.slice(IMAGE_DATA_OFFSET);
        image.src = dataUrl;
      });
    });
  });
}

export function loadImageFromDataURL(dataurl) {
  return new Promise(async (resolve) => {
    const image = new Image();
    let type = 'image/png';
    if (typeof dataurl === 'string') {
      image.src = dataurl;
    } else {
      type = dataurl.type;
      image.src = `data:${type};base64,${dataurl.data}`;
    }
    image.addEventListener('load', () => {
      image.dataset.data = image.src.slice(`data:${type};base64,`.length);
      resolve(image);
    });
  });
}

export function loadImageFromURL(url) {
  return new Promise(async (resolve) => {
    const image = new Image();
    image.src = url;
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const dataUrl = canvas.toDataURL('image/png');
      image.dataset.data = dataUrl.slice(IMAGE_DATA_OFFSET);
      resolve(image);
    });
  });
}
