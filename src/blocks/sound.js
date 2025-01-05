import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['sound_sounds_menu'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SOUND_MENU',
          options: [
            [ScratchBlocks.Msg.SOUND_MENU_DADADADUM, 'DADADADUM'],
            [ScratchBlocks.Msg.SOUND_MENU_ENTERTAINER, 'ENTERTAINER'],
            [ScratchBlocks.Msg.SOUND_MENU_PRELUDE, 'PRELUDE'],
            [ScratchBlocks.Msg.SOUND_MENU_ODE, 'ODE'],
            [ScratchBlocks.Msg.SOUND_MENU_NYAN, 'NYAN'],
            [ScratchBlocks.Msg.SOUND_MENU_RINGTONE, 'RINGTONE'],
            [ScratchBlocks.Msg.SOUND_MENU_FUNK, 'FUNK'],
            [ScratchBlocks.Msg.SOUND_MENU_BLUES, 'BLUES'],
            [ScratchBlocks.Msg.SOUND_MENU_BIRTHDAY, 'BIRTHDAY'],
            [ScratchBlocks.Msg.SOUND_MENU_WEDDING, 'WEDDING'],
            [ScratchBlocks.Msg.SOUND_MENU_FUNERAL, 'FUNERAL'],
            [ScratchBlocks.Msg.SOUND_MENU_PUNCHLINE, 'PUNCHLINE'],
            [ScratchBlocks.Msg.SOUND_MENU_PYTHON, 'PYTHON'],
            [ScratchBlocks.Msg.SOUND_MENU_BADDY, 'BADDY'],
            [ScratchBlocks.Msg.SOUND_MENU_CHASE, 'CHASE'],
            [ScratchBlocks.Msg.SOUND_MENU_BA_DING, 'BA_DING'],
            [ScratchBlocks.Msg.SOUND_MENU_WAWAWAWAA, 'WAWAWAWAA'],
            [ScratchBlocks.Msg.SOUND_MENU_JUMP_UP, 'JUMP_UP'],
            [ScratchBlocks.Msg.SOUND_MENU_JUMP_DOWN, 'JUMP_DOWN'],
            [ScratchBlocks.Msg.SOUND_MENU_POWER_UP, 'POWER_UP'],
            [ScratchBlocks.Msg.SOUND_MENU_POWER_DOWN, 'POWER_DOWN'],
          ],
        },
      ],
      colour: ScratchBlocks.Colours.sounds.secondary,
      colourSecondary: ScratchBlocks.Colours.sounds.secondary,
      colourTertiary: ScratchBlocks.Colours.sounds.tertiary,
      colourQuaternary: ScratchBlocks.Colours.sounds.quaternary,
      extensions: ['output_string'],
    });
  },
};
