import { Text } from '@blockcode/core';
import { RotationStyle, SpriteDefaultConfig } from '../../components/emulator/emulator-config';

export default {
  name: (
    <>
      <Text
        id="matrix.defaultProject.spriteName"
        defaultMessage="Sprite"
      />
      1
    </>
  ),
  type: 'text/x-python',
  frame: 0,
  x: 0,
  y: 0,
  size: 100,
  direction: SpriteDefaultConfig.Direction,
  rotationStyle: RotationStyle.AllAround,
  hidden: false,
  zIndex: 0,
};
