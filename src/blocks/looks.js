import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['looks_sayforsecs'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.LOOKS_TEXTBUBLLE_FORSECS,
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPTION',
          options: [
            [ScratchBlocks.Msg.LOOKS_SAY_TEXT, 'say'],
            [ScratchBlocks.Msg.LOOKS_SHOUT_TEXT, 'shout'],
          ],
        },
        {
          type: 'input_value',
          name: 'MESSAGE',
        },
        {
          type: 'input_value',
          name: 'SECS',
        },
      ],
      category: ScratchBlocks.Categories.looks,
      extensions: ['colours_looks', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['looks_say'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.LOOKS_TEXTBUBLLE,
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPTION',
          options: [
            [ScratchBlocks.Msg.LOOKS_SAY_TEXT, 'say'],
            [ScratchBlocks.Msg.LOOKS_SHOUT_TEXT, 'shout'],
          ],
        },
        {
          type: 'input_value',
          name: 'MESSAGE',
        },
      ],
      category: ScratchBlocks.Categories.looks,
      extensions: ['colours_looks', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['looks_thinkforsecs'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.LOOKS_TEXTBUBLLE_FORSECS,
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPTION',
          options: [
            [ScratchBlocks.Msg.LOOKS_THINK_TEXT, 'think'],
            [ScratchBlocks.Msg.LOOKS_SPARK_TEXT, 'spark'],
          ],
        },
        {
          type: 'input_value',
          name: 'MESSAGE',
        },
        {
          type: 'input_value',
          name: 'SECS',
        },
      ],
      category: ScratchBlocks.Categories.looks,
      extensions: ['colours_looks', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['looks_think'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.LOOKS_TEXTBUBLLE,
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPTION',
          options: [
            [ScratchBlocks.Msg.LOOKS_THINK_TEXT, 'think'],
            [ScratchBlocks.Msg.LOOKS_SPARK_TEXT, 'spark'],
          ],
        },
        {
          type: 'input_value',
          name: 'MESSAGE',
        },
      ],
      category: ScratchBlocks.Categories.looks,
      extensions: ['colours_looks', 'shape_statement'],
    });
  },
};
