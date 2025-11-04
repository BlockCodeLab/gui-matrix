import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'matrix.name': 'Matrix',
    'matrix.description': 'Connect your projects with the world.',
  },
  'zh-Hans': {
    'matrix.name': 'Matrix',
    'matrix.description': '把作品连接到真实世界。',
  },
  'zh-Hant': {
    'matrix.name': 'Matrix',
    'matrix.description': '讓你的專案與真實世界連接。',
  },
});

export default {
  version,
  sortIndex: 10,
  disabled: true,
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
      defaultMessage="Connect your projects with the world."
    />
  ),
  blocksRequired: true,
};
