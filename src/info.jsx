import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'matrix.name': 'Matrix',
    'matrix.description': 'The border between fantasy and reality.',
  },
  'zh-Hans': {
    'matrix.name': 'Matrix',
    'matrix.description': '欢迎来到虚幻与真实的边境。',
  },
  'zh-Hant': {
    'matrix.name': 'Matrix',
    'matrix.description': '歡迎來到虛幻與真實的邊境。',
  },
});

export default {
  version,
  sortIndex: 4,
  beta: true,
  image: featureImage,
  name: (
    <Text
      id="matrix.name"
      defaultMessage="Matrix"
    />
  ),
  description: (
    <Text
      id="matrix.description"
      defaultMessage="Welcome to matrix."
    />
  ),
  blocksRequired: true,
};
