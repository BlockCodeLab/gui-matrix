import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['event_whenkeypressed'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.EVENT_WHENKEYPRESSED,
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
      category: ScratchBlocks.Categories.event,
      extensions: ['colours_event', 'shape_hat'],
    });
  },
};
