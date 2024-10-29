import featureImage from './feature.png';
import { version } from '../package.json';

export default {
  version,
  sortIndex: 3,
  image: featureImage,
  name: 'Scratch Arcade',
  description: 'Game editing via blocks.',
  collaborator: 'Scratch Arcade Studio',
  blocksRequired: true,

  // l10n
  translations: {
    en: {
      name: 'Scratch Arcade',
      description: 'Game editing via blocks.',
      collaborator: 'Scratch Arcade Studio',
    },
    'zh-Hans': {
      name: '编程学习掌机',
      description: '在小掌机上学习游戏编程。',
      collaborator: 'Scratch Arcade 工作室',
    },
  },
};
