const sb3BlocksToArcadeBlocks = {
  motion_goto_menu: {
    TO: {
      _mouse_: '_random_',
    },
  },
  motion_glideto_menu: {
    TO: {
      _mouse_: '_random_',
    },
  },
  motion_pointtowards_menu: {
    TOWARDS: {
      _mouse_: '_random_',
    },
  },
  // looks_changeeffectby: 'unsupported_statement',
  // looks_seteffectto: 'unsupported_statement',
  // looks_cleargraphiceffects: 'unsupported_statement',
  sound_changeeffectby: 'unsupported_statement',
  sound_seteffectto: 'unsupported_statement',
  sound_cleareffects: 'unsupported_statement',
  sound_setvolumeto: 'unsupported_statement',
  event_whenthisspriteclicked: 'unsupported_hat',
  event_whenkeypressed: {
    KEY_OPTION: {
      space: 'fn',
      'up arrow': 'up',
      'down arrow': 'down',
      'right arrow': 'right',
      'left arrow': 'left',
      c: 'a',
      d: 'a',
      e: 'a',
      f: 'a',
      g: 'a',
      h: 'a',
      i: 'a',
      j: 'a',
      k: 'a',
      l: 'a',
      m: 'a',
      n: 'a',
      o: 'a',
      p: 'a',
      q: 'a',
      r: 'a',
      s: 'a',
      t: 'a',
      u: 'a',
      v: 'a',
      w: 'a',
      z: 'a',
      0: 'b',
      1: 'b',
      2: 'b',
      3: 'b',
      4: 'b',
      5: 'b',
      6: 'b',
      7: 'b',
      8: 'b',
      9: 'b',
    },
  },
  event_whengreaterthan: {
    WHENGREATERTHANMENU: {
      LOUDNESS: 'TIMER',
    },
  },
  sensing_touchingobjectmenu: {
    TOUCHINGOBJECTMENU: {
      _mouse_: '_edge_',
    },
  },
  sensing_distancetomenu: {
    DISTANCETOMENU: {
      _mouse_: '_center_',
    },
  },
  sensing_touchingcolor: 'unsupported_boolean',
  sensing_coloristouchingcolor: 'unsupported_boolean',
  sensing_keyoptions: {
    KEY_OPTION: {
      space: 'fn',
      'up arrow': 'up',
      'down arrow': 'down',
      'right arrow': 'right',
      'left arrow': 'left',
      c: 'a',
      d: 'a',
      e: 'a',
      f: 'a',
      g: 'a',
      h: 'a',
      i: 'a',
      j: 'a',
      k: 'a',
      l: 'a',
      m: 'a',
      n: 'a',
      o: 'a',
      p: 'a',
      q: 'a',
      r: 'a',
      s: 'a',
      t: 'a',
      u: 'a',
      v: 'a',
      w: 'a',
      z: 'a',
      0: 'b',
      1: 'b',
      2: 'b',
      3: 'b',
      4: 'b',
      5: 'b',
      6: 'b',
      7: 'b',
      8: 'b',
      9: 'b',
    },
  },
  sensing_askandwait: 'unsupported_statement',
  sensing_answer: 'unsupported_string',
  sensing_mousedown: 'unsupported_boolean',
  sensing_mousex: 'unsupported_number',
  sensing_mousey: 'unsupported_number',
  sensing_setdragmode: 'unsupported_statement',
  sensing_loudness: 'unsupported_number',
  sensing_of: {
    PROPERTY: {
      volume: '',
    },
  },
  sensing_current: [
    '@blockcode/blocks-time',
    'getTime',
    {
      CURRENTMENU: [
        'OPTION',
        {
          YEAR: 'year',
          MONTH: 'month',
          DATE: 'date',
          DAYOFWEED: 'weekday',
          HOUR: 'hour',
          MINUTE: 'minute',
          SECOND: 'second',
        },
      ],
    },
  ],
  sensing_dayssince2000: ['@blockcode/blocks-time', 'days'],
  sensing_username: 'unsupported_string',
  data_showvariable: 'unsupported_statement',
  data_hidevariable: 'unsupported_statement',
  data_showlist: 'unsupported_statement',
  data_hidelist: 'unsupported_statement',
  // extensions
  // music
  music_playDrumForBeats: 'unsupported_statement',
  music_menu_DRUM: 'unsupported_string',
  music_restForBeats: 'unsupported_statement',
  music_playNoteForBeats: 'unsupported_statement',
  music_setInstrument: 'unsupported_statement',
  music_menu_INSTRUMENT: 'unsupported_string',
  music_setTempo: 'unsupported_statement',
  music_changeTempo: 'unsupported_statement',
  music_getTempo: 'unsupported_number',
  // pen
  pen_clear: ['@blockcode/blocks-pen', 'erase'],
  pen_stamp: ['@blockcode/blocks-pen', 'stamp'],
  pen_penDown: ['@blockcode/blocks-pen', 'down'],
  pen_penUp: ['@blockcode/blocks-pen', 'up'],
  pen_setPenColorToColor: ['@blockcode/blocks-pen', 'penColor'],
  pen_changePenColorParamBy: [
    '@blockcode/blocks-pen',
    'changePen',
    {
      COLOR_PARAM: 'OPTION',
    },
  ],
  pen_setPenColorParamTo: [
    '@blockcode/blocks-pen',
    'setPen',
    {
      COLOR_PARAM: 'OPTION',
    },
  ],
  pen_menu_colorParam: [
    '@blockcode/blocks-pen',
    'menu_colorParam',
    {
      colorParam: [
        'colorParam',
        {
          color: 'hue',
          transparency: 'hue',
        },
      ],
    },
  ],
  pen_changePenSizeBy: ['@blockcode/blocks-pen', 'changeSize'],
  pen_setPenSizeTo: ['@blockcode/blocks-pen', 'setSize'],
  // video sensing
  videoSensing_whenMotionGreaterThan: 'unsupported_hat',
  videoSensing_videoOn: 'unsupported_statement',
  videoSensing_menu_SUBJECT: 'unsupported_string',
  videoSensing_menu_ATTRIBUTE: 'unsupported_string',
  videoSensing_videoToggle: 'unsupported_statement',
  videoSensing_menu_VIDEO_STATE: 'unsupported_string',
  videoSensing_setVideoTransparency: 'unsupported_statement',
  // text to speech
  text2speech_speakAndWait: 'unsupported_statement',
  text2speech_setVoice: 'unsupported_statement',
  text2speech_menu_voices: 'unsupported_string',
  text2speech_setLanguage: 'unsupported_statement',
  text2speech_menu_languages: 'unsupported_string',
  // translate
  translate_getTranslate: 'unsupported_string',
  translate_menu_languages: 'unsupported_string',
  translate_getViewerLanguage: 'unsupported_string',
  // makey makey
  makeymakey_whenMakeyKeyPressed: 'unsupported_hat',
  makeymakey_menu_KEY: 'unsupported_string',
  makeymakey_whenCodePressed: 'unsupported_hat',
  makeymakey_menu_SEQUENCE: 'unsupported_string',
  // micro:bit
  microbit_whenButtonPressed: 'unsupported_hat',
  microbit_isButtonPressed: 'unsupported_boolean',
  microbit_menu_buttons: 'unsupported_string',
  microbit_whenGesture: 'unsupported_hat',
  microbit_menu_gestures: 'unsupported_string',
  microbit_displaySymbol: 'unsupported_statement',
  microbit_displayText: 'unsupported_statement',
  microbit_displayClear: 'unsupported_statement',
  microbit_whenTilted: 'unsupported_hat',
  microbit_isTilted: 'unsupported_boolean',
  microbit_menu_tiltDirectionAny: 'unsupported_string',
  microbit_getTiltAngle: 'unsupported_number',
  microbit_menu_tiltDirection: 'unsupported_string',
  microbit_whenPinConnected: 'unsupported_hat',
  microbit_menu_touchPins: 'unsupported_string',
  // lego ev3
  ev3_motorTurnClockwise: 'unsupported_statement',
  ev3_motorTurnCounterClockwise: 'unsupported_statement',
  ev3_motorSetPower: 'unsupported_statement',
  ev3_getMotorPosition: 'unsupported_number',
  ev3_menu_motorPorts: 'unsupported_string',
  ev3_whenButtonPressed: 'unsupported_hat',
  ev3_whenDistanceLessThan: 'unsupported_hat',
  ev3_whenBrightnessLessThan: 'unsupported_hat',
  ev3_buttonPressed: 'unsupported_boolean',
  ev3_menu_sensorPorts: 'unsupported_string',
  ev3_getDistance: 'unsupported_number',
  ev3_getBrightness: 'unsupported_number',
  ev3_beep: 'unsupported_statement',
  // lego boost
  boost_motorOnFor: 'unsupported_statement',
  boost_motorOnForRotation: 'unsupported_statement',
  boost_motorOn: 'unsupported_statement',
  boost_motorOff: 'unsupported_statement',
  boost_setMotorPower: 'unsupported_statement',
  boost_setMotorDirection: 'unsupported_statement',
  boost_menu_MOTOR_ID: 'unsupported_string',
  boost_menu_MOTOR_DIRECTION: 'unsupported_string',
  boost_getMotorPosition: 'unsupported_number',
  boost_menu_MOTOR_REPORTER_ID: 'unsupported_string',
  boost_whenColor: 'unsupported_hat',
  boost_seeingColor: 'unsupported_boolean',
  boost_menu_COLOR: 'unsupported_string',
  boost_whenTilted: 'unsupported_hat',
  boost_menu_TILT_DIRECTION_ANY: 'unsupported_string',
  boost_getTiltAngle: 'unsupported_number',
  boost_menu_TILT_DIRECTION: 'unsupported_string',
  boost_setLightHue: 'unsupported_statement',
  // lego wedo 2.0
  wedo2_motorOnFor: ['@blockcode/blocks-wedo2', 'motorOnSec'],
  wedo2_motorOn: ['@blockcode/blocks-wedo2', 'motorOn'],
  wedo2_motorOff: ['@blockcode/blocks-wedo2', 'motorOff'],
  wedo2_startMotorPower: ['@blockcode/blocks-wedo2', 'startMotorPower'],
  wedo2_setMotorDirection: ['@blockcode/blocks-wedo2', 'setMotorDirection'],
  wedo2_menu_MOTOR_ID: ['@blockcode/blocks-wedo2', 'menu_MOTOR_ID'],
  wedo2_menu_MOTOR_DIRECTION: ['@blockcode/blocks-wedo2', 'menu_MOTOR_DIRECTION'],
  wedo2_setLightHue: ['@blockcode/blocks-wedo2', 'setLightHue'],
  wedo2_whenDistance: ['@blockcode/blocks-wedo2', 'whenDistance'],
  wedo2_menu_OP: ['@blockcode/blocks-wedo2', 'menu_OP'],
  wedo2_whenTilted: ['@blockcode/blocks-wedo2', 'whenTilted'],
  wedo2_getDistance: ['@blockcode/blocks-wedo2', 'getDistance'],
  wedo2_isTilted: ['@blockcode/blocks-wedo2', 'isTilted'],
  wedo2_getTiltAngle: ['@blockcode/blocks-wedo2', 'getTiltAngle'],
  wedo2_menu_TILT_DIRECTION: ['@blockcode/blocks-wedo2', 'menu_TILT_DIRECTION'],
  wedo2_menu_TILT_DIRECTION_ANY: ['@blockcode/blocks-wedo2', 'menu_TILT_DIRECTION_ANY'],
  // go direct force & acceleration
  gdxfor_whenGesture: 'unsupported_hat',
  gdxfor_menu_gestureOptions: 'unsupported_string',
  gdxfor_whenForcePushedOrPulled: 'unsupported_hat',
  gdxfor_menu_pushPullOptions: 'unsupported_string',
  gdxfor_getForce: 'unsupported_number',
  gdxfor_whenTilted: 'unsupported_hat',
  gdxfor_isTilted: 'unsupported_boolean',
  gdxfor_menu_tiltAnyOptions: 'unsupported_string',
  gdxfor_getTilt: 'unsupported_number',
  gdxfor_menu_tiltOptions: 'unsupported_string',
  gdxfor_isFreeFalling: 'unsupported_boolean',
  gdxfor_getSpinSpeed: 'unsupported_number',
  gdxfor_getAcceleration: 'unsupported_number',
  gdxfor_menu_axisOptions: 'unsupported_string',
};

export const getBlockByOpcode = (opcode, meta) => {
  const blockOpcode = sb3BlocksToArcadeBlocks[opcode] ?? opcode;
  if (typeof blockOpcode === 'string') {
    return blockOpcode;
  }
  if (Array.isArray(blockOpcode)) {
    const extensionId = blockOpcode[0];
    const blockId = blockOpcode[1];
    meta.extensions.push(extensionId);
    return `${extensionId}_${blockId}`;
  }
  return opcode;
};

export const getInputOrFieldByOpcode = (opcode, blockInputOrField) => {
  let item = sb3BlocksToArcadeBlocks[opcode];
  if (item && Array.isArray(item)) {
    item = item[2];
  }
  item = item?.[blockInputOrField.name];
  if (item) {
    if (typeof item === 'string') {
      blockInputOrField.name = item;
    } else if (Array.isArray(item)) {
      const [name, values] = item;
      blockInputOrField.name = name;
      blockInputOrField.value = values[blockInputOrField.value] ?? blockInputOrField.value;
    } else {
      blockInputOrField.value = item[blockInputOrField.value] ?? blockInputOrField.value;
    }
  }
  return blockInputOrField;
};
