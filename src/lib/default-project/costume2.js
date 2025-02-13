import { nanoid } from '@blockcode/utils';

export default {
  id: nanoid(),
  type: 'image/png',
  width: 92,
  height: 105,
  centerX: 46,
  centerY: 53,
  data: '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',
};
