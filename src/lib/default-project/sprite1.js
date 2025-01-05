import { nanoid } from '@blockcode/utils';
import { Text } from '@blockcode/core';
import { RotationStyle, SpriteDefaultConfig } from '../../components/emulator/emulator-config';
import costume1 from './costume1';
import costume2 from './costume2';

export default {
  id: nanoid(),
  type: 'text/x-python',
  name: (
    <>
      <Text
        id="arcade.defaultProject.spriteName"
        defaultMessage="Sprite"
      />
      1
    </>
  ),
  assets: [costume1.id, costume2.id],
  frame: 0,
  x: 0,
  y: 0,
  size: 100,
  direction: SpriteDefaultConfig.Direction,
  rotationStyle: RotationStyle.AllAround,
  hidden: false,
  zIndex: 0,
};
