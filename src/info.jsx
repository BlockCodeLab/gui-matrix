import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'arcade.name': 'Scratch Arcade',
    'arcade.description': 'Game creating via Scratch blocks.',
    'arcade.collaborator': 'SA Studio',
  },
  'zh-Hans': {
    'arcade.name': '编程学习掌机',
    'arcade.description': '在小掌机上学习游戏编程。',
    'arcade.collaborator': 'Scratch Arcade 工作室',
  },
  'zh-Hant': {
    'arcade.name': '編程學習掌機',
    'arcade.description': '在掌機上創造游戲。',
    'arcade.collaborator': 'Scratch Arcade 工作室',
  },
});

export default {
  version,
  sortIndex: 4,
  image: featureImage,
  name: (
    <Text
      id="arcade.name"
      defaultMessage="Scratch Arcade"
    />
  ),
  description: (
    <Text
      id="arcade.description"
      defaultMessage="Game creating via Scratch blocks."
    />
  ),
  collaborator: (
    <Text
      id="arcade.collaborator"
      defaultMessage="SA Studio"
    />
  ),
  blocksRequired: true,
};
