import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['wifi_whenconnected'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.WIFI_WHENCONNECTED,
      category: ScratchBlocks.Categories.event,
      extensions: ['colours_event', 'shape_hat'],
    });
  },
};

ScratchBlocks.Blocks['wifi_connectto'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.WIFI_CONNECTTO,
      args0: [
        {
          type: 'input_value',
          name: 'SSID',
        },
        {
          type: 'input_value',
          name: 'PASSWORD',
        },
      ],
      category: ScratchBlocks.Categories.event,
      extensions: ['colours_event', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['wifi_disconnect'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.WIFI_DISCONNECT,
      category: ScratchBlocks.Categories.event,
      extensions: ['colours_event', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['wifi_isconnected'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.WIFI_ISCONNECTED,
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};
