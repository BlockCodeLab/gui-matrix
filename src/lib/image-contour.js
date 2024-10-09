export const ALPHA_THRESHOLD = 20;

const MOVE_NONE = 0;
const MOVE_UP = 1;
const MOVE_LEFT = 2;
const MOVE_DOWN = 3;
const MOVE_RIGHT = 4;

/*
  +---+---+
  | 4 | 8 |
  +---+---+
  | 2 | 1 |
  +---+---+
*/
const NEXT_TRACING = [
  /* 0 */
  MOVE_RIGHT,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_LEFT,
  MOVE_UP,
  [MOVE_DOWN, MOVE_UP], // 5
  MOVE_UP,
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_DOWN,
  [MOVE_RIGHT, MOVE_LEFT], // 10
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_DOWN,
  MOVE_RIGHT,
  MOVE_NONE,
  /* 15 */
];

const getStartPixel = (data, width, height) => {
  let i;
  for (let y = 0; y < height; y++) {
    i = y * width;
    for (let x = 0; x < width; x++) {
      if (data[i]) return { x, y };
      i++;
    }
  }
};

const getEdgeTracing = (data, width, height, start) => {
  const points = [];

  let { x, y } = start;
  let i, state, tracing;
  do {
    i = x + y * width;

    state = 0;
    if (data[i]) state |= 1;
    if (x > 0 && data[i - 1]) state |= 2;
    if (x > 0 && y > 0 && data[i - width - 1]) state |= 4;
    if (y > 0 && data[i - width]) state |= 8;

    if (state === 5) {
      tracing = NEXT_TRACING[state][~~(tracing === MOVE_LEFT)];
    } else if (state === 10) {
      tracing = NEXT_TRACING[state][~~(tracing === MOVE_UP)];
    } else {
      tracing = NEXT_TRACING[state];
    }

    if (tracing === MOVE_NONE) break;

    if (x >= 0 && x < width && y >= 0 && y < height) {
      points.push([x, y]);
    }

    if (points.length > width * height) break;

    switch (tracing) {
      case MOVE_UP:
        y--;
        break;
      case MOVE_LEFT:
        x--;
        break;
      case MOVE_DOWN:
        y++;
        break;
      case MOVE_RIGHT:
        x++;
        break;
    }
  } while (x !== start.x || y != start.y);

  points.push([x, y]);
  return points;
};

const clearShape = (data, width, height, start) => {
  const pixels = [];

  const checkPixel = (x, y) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const i = x + y * width;
      if (!pixels.includes(i) && data[i]) {
        pixels.push(i);
      }
    }
  };
  checkPixel(start.x, start.y);

  let i, x, y;
  while (pixels.length > 0) {
    i = pixels.shift();
    data[i] = false;

    y = Math.floor(i / width);
    x = i - y * width;
    checkPixel(x, y - 1);
    checkPixel(x, y + 1);
    checkPixel(x - 1, y);
    checkPixel(x + 1, y);
  }
};

export default function (imageData) {
  const { width, height } = imageData;
  const data = new Uint8Array(width * height);
  for (let i = 0; i < data.length; i++) {
    data[i] = imageData.data[(i << 2) + 3] > ALPHA_THRESHOLD;
  }

  const contour = [];

  while (true) {
    const start = getStartPixel(data, width, height);
    if (!start) break;
    const points = getEdgeTracing(data, width, height, start);
    contour.push(points);
    clearShape(data, width, height, start);
  }

  return contour;
}
