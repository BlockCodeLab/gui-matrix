import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'arcade2.name': 'Scratch Arcade 2',
    'arcade2.description': 'Game creating via Scratch blocks.',
    'arcade2.collaborator': 'Scratch Arcade Team',
  },
  'zh-Hans': {
    'arcade2.name': '编程学习掌机 2',
    'arcade2.description': '在小掌机上学习游戏编程。',
    'arcade2.collaborator': 'Scratch Arcade 工作室',
  },
  'zh-Hant': {
    'arcade2.name': '編程學習掌機 2',
    'arcade2.description': '在掌機上創造游戲。',
    'arcade2.collaborator': 'Scratch Arcade 工作室',
  },
});

export default {
  version,
  disabled: true,
  sortIndex: 21,
  image: featureImage,
  name: (
    <Text
      id="arcade2.name"
      defaultMessage="Scratch Arcade 2"
    />
  ),
  description: (
    <Text
      id="arcade2.description"
      defaultMessage="Game creating via Scratch blocks."
    />
  ),
  collaborator: (
    <Text
      id="arcade2.collaborator"
      defaultMessage="Scratch Arcade Team"
    />
  ),
  blocksRequired: true,
};
