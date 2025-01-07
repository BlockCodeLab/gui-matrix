import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'matrix.name': 'Matrix',
    'matrix.description': 'Welcome to matrix world.',
  },
  'zh-Hans': {
    'matrix.name': 'Matrix',
    'matrix.description': '欢迎来到虚拟与现实的世界。',
  },
  'zh-Hant': {
    'matrix.name': 'Matrix',
    'matrix.description': '欢迎来到虚拟与现实的世界。',
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
