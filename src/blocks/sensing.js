import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['sensing_touchingobject_exact'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_TOUCHINGOBJECT_EXACT,
      args0: [
        {
          type: 'input_value',
          name: 'TOUCHINGOBJECTMENU',
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};

ScratchBlocks.Blocks['sensing_keyoptions'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'KEY_OPTION',
          options: [
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_UP, 'up'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_DOWN, 'down'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_LEFT, 'left'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_RIGHT, 'right'],
            ['a', 'a'],
            ['b', 'b'],
            ['x', 'x'],
            ['y', 'y'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_FN, 'fn'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_ANY, 'any'],
          ],
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_string'],
    });
  },
};

ScratchBlocks.Blocks['sensing_joystick_x'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_JOYSTICK_X,
      checkboxInFlyout: true,
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_number'],
    });
  },
};

ScratchBlocks.Blocks['sensing_joystick_y'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_JOYSTICK_Y,
      checkboxInFlyout: true,
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_number'],
    });
  },
};
