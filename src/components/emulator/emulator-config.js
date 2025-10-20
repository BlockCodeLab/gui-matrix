export const StageConfig = {
  Width: 320,
  Height: 240,
  Small: 'small',
  Large: 'large',
  Scale: 320 / 480,
};

const DONOT_ROTATE = 0;
const HORIZONTAL_FLIP = 1;
const ALL_AROUND = 2;

export const RotationStyle = {
  DONOT_ROTATE,
  HORIZONTAL_FLIP,
  ALL_AROUND,
  NotRotate: DONOT_ROTATE,
  HorizontalFlip: HORIZONTAL_FLIP,
  AllAround: ALL_AROUND,
  "don't rotate": DONOT_ROTATE,
  'left-right': HORIZONTAL_FLIP,
  'all around': ALL_AROUND,
};

export const SpriteDefaultConfig = {
  Direction: 90,
  RotationStyle: RotationStyle.AllAround,
};
