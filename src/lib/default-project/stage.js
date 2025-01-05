import { Text } from '@blockcode/core';
import backdrop from './backdrop';

export default {
  id: '_stage_',
  type: 'text/x-python',
  name: (
    <Text
      id="arcade.defaultProject.stageName"
      defaultMessage="Stage"
    />
  ),
  assets: [backdrop.id],
  frame: 0,
};
