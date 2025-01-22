// from https://github.com/scratchfoundation/scratch-vm/blob/develop/src/serialization/sb3.js
const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a unique ID, from Blockly.  This should be globally unique.
 * 87 characters ^ 20 length > 128 bits (better than a UUID).
 * @return {string} A globally unique ID string.
 */
const uid = () => {
  const length = 20;
  const soupLength = soup_.length;
  const id = [];
  for (let i = 0; i < length; i++) {
    id[i] = soup_.charAt(Math.random() * soupLength);
  }
  return id.join('');
};

const Variable = {
  SCALAR_TYPE: '',
  LIST_TYPE: 'list',
  BROADCAST_MESSAGE_TYPE: 'broadcast_msg',
};

// Constants used during serialization and deserialization
const INPUT_SAME_BLOCK_SHADOW = 1; // unobscured shadow
const INPUT_BLOCK_NO_SHADOW = 2; // no shadow
const INPUT_DIFF_BLOCK_SHADOW = 3; // obscured shadow
// There shouldn't be a case where block is null, but shadow is present...

// Constants referring to 'primitive' blocks that are usually shadows,
// or in the case of variables and lists, appear quite often in projects
// math_number
const MATH_NUM_PRIMITIVE = 4; // there's no reason these constants can't collide
// math_positive_number
const POSITIVE_NUM_PRIMITIVE = 5; // with the above, but removing duplication for clarity
// math_whole_number
const WHOLE_NUM_PRIMITIVE = 6;
// math_integer
const INTEGER_NUM_PRIMITIVE = 7;
// math_angle
const ANGLE_NUM_PRIMITIVE = 8;
// colour_picker
const COLOR_PICKER_PRIMITIVE = 9;
// text
const TEXT_PRIMITIVE = 10;
// event_broadcast_menu
const BROADCAST_PRIMITIVE = 11;
// data_variable
const VAR_PRIMITIVE = 12;
// data_listcontents
const LIST_PRIMITIVE = 13;

/**
 * Deserialize a block input descriptors. This is either a
 * block id or a serialized primitive, e.g. an array
 * (see serializePrimitiveBlock function).
 * @param {string | array} inputDescOrId The block input descriptor to be serialized.
 * @param {string} parentId The id of the parent block for this input block.
 * @param {boolean} isShadow Whether or not this input block is a shadow.
 * @param {object} blocks The entire blocks object currently in the process of getting serialized.
 * @return {object} The deserialized input descriptor.
 */
const deserializeInputDesc = function (inputDescOrId, parentId, isShadow, blocks) {
  if (!Array.isArray(inputDescOrId)) return inputDescOrId;
  const primitiveObj = Object.create(null);
  const newId = uid();
  primitiveObj.id = newId;
  primitiveObj.next = null;
  primitiveObj.parent = parentId;
  primitiveObj.shadow = isShadow;
  primitiveObj.inputs = Object.create(null);
  // need a reference to parent id
  switch (inputDescOrId[0]) {
    case MATH_NUM_PRIMITIVE: {
      primitiveObj.opcode = 'math_number';
      primitiveObj.fields = {
        NUM: {
          name: 'NUM',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case POSITIVE_NUM_PRIMITIVE: {
      primitiveObj.opcode = 'math_positive_number';
      primitiveObj.fields = {
        NUM: {
          name: 'NUM',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case WHOLE_NUM_PRIMITIVE: {
      primitiveObj.opcode = 'math_whole_number';
      primitiveObj.fields = {
        NUM: {
          name: 'NUM',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case INTEGER_NUM_PRIMITIVE: {
      primitiveObj.opcode = 'math_integer';
      primitiveObj.fields = {
        NUM: {
          name: 'NUM',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case ANGLE_NUM_PRIMITIVE: {
      primitiveObj.opcode = 'math_angle';
      primitiveObj.fields = {
        NUM: {
          name: 'NUM',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case COLOR_PICKER_PRIMITIVE: {
      primitiveObj.opcode = 'colour_picker';
      primitiveObj.fields = {
        COLOUR: {
          name: 'COLOUR',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case TEXT_PRIMITIVE: {
      primitiveObj.opcode = 'text';
      primitiveObj.fields = {
        TEXT: {
          name: 'TEXT',
          value: inputDescOrId[1],
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case BROADCAST_PRIMITIVE: {
      primitiveObj.opcode = 'event_broadcast_menu';
      primitiveObj.fields = {
        BROADCAST_OPTION: {
          name: 'BROADCAST_OPTION',
          value: inputDescOrId[1],
          id: inputDescOrId[2],
          variableType: Variable.BROADCAST_MESSAGE_TYPE,
        },
      };
      primitiveObj.topLevel = false;
      break;
    }
    case VAR_PRIMITIVE: {
      primitiveObj.opcode = 'data_variable';
      primitiveObj.fields = {
        VARIABLE: {
          name: 'VARIABLE',
          value: inputDescOrId[1],
          id: inputDescOrId[2],
          variableType: Variable.SCALAR_TYPE,
        },
      };
      if (inputDescOrId.length > 3) {
        primitiveObj.topLevel = true;
        primitiveObj.x = inputDescOrId[3];
        primitiveObj.y = inputDescOrId[4];
      }
      break;
    }
    case LIST_PRIMITIVE: {
      primitiveObj.opcode = 'data_listcontents';
      primitiveObj.fields = {
        LIST: {
          name: 'LIST',
          value: inputDescOrId[1],
          id: inputDescOrId[2],
          variableType: Variable.LIST_TYPE,
        },
      };
      if (inputDescOrId.length > 3) {
        primitiveObj.topLevel = true;
        primitiveObj.x = inputDescOrId[3];
        primitiveObj.y = inputDescOrId[4];
      }
      break;
    }
    default: {
      log.error(`Found unknown primitive type during deserialization: ${JSON.stringify(inputDescOrId)}`);
      return null;
    }
  }
  blocks[newId] = primitiveObj;
  return newId;
};

/**
 * Deserialize the given block inputs.
 * @param {object} inputs The inputs to deserialize.
 * @param {string} parentId The block id of the parent block
 * @param {object} blocks The object representing the entire set of blocks currently
 * in the process of getting deserialized.
 * @return {object} The deserialized and uncompressed inputs.
 */
const deserializeInputs = function (inputs, parentId, blocks) {
  // Explicitly not using Object.create(null) here
  // because we call prototype functions later in the vm
  const obj = {};
  for (const inputName in inputs) {
    if (!hasOwnProperty.call(inputs, inputName)) continue;
    const inputDescArr = inputs[inputName];
    // If this block has already been deserialized (it's not an array) skip it
    if (!Array.isArray(inputDescArr)) continue;
    let block = null;
    let shadow = null;
    const blockShadowInfo = inputDescArr[0];
    if (blockShadowInfo === INPUT_SAME_BLOCK_SHADOW) {
      // block and shadow are the same id, and only one is provided
      block = shadow = deserializeInputDesc(inputDescArr[1], parentId, true, blocks);
    } else if (blockShadowInfo === INPUT_BLOCK_NO_SHADOW) {
      block = deserializeInputDesc(inputDescArr[1], parentId, false, blocks);
    } else {
      // assume INPUT_DIFF_BLOCK_SHADOW
      block = deserializeInputDesc(inputDescArr[1], parentId, false, blocks);
      shadow = deserializeInputDesc(inputDescArr[2], parentId, true, blocks);
    }
    obj[inputName] = {
      name: inputName,
      block: block,
      shadow: shadow,
    };
  }
  return obj;
};

/**
 * Deserialize the given block fields.
 * @param {object} fields The fields to be deserialized
 * @return {object} The deserialized and uncompressed block fields.
 */
const deserializeFields = function (fields) {
  // Explicitly not using Object.create(null) here
  // because we call prototype functions later in the vm
  const obj = {};
  for (const fieldName in fields) {
    if (!hasOwnProperty.call(fields, fieldName)) continue;
    const fieldDescArr = fields[fieldName];
    // If this block has already been deserialized (it's not an array) skip it
    if (!Array.isArray(fieldDescArr)) continue;
    obj[fieldName] = {
      name: fieldName,
      value: fieldDescArr[0],
    };
    if (fieldDescArr.length > 1) {
      obj[fieldName].id = fieldDescArr[1];
    }
    if (fieldName === 'BROADCAST_OPTION') {
      obj[fieldName].variableType = Variable.BROADCAST_MESSAGE_TYPE;
    } else if (fieldName === 'VARIABLE') {
      obj[fieldName].variableType = Variable.SCALAR_TYPE;
    } else if (fieldName === 'LIST') {
      obj[fieldName].variableType = Variable.LIST_TYPE;
    }
  }
  return obj;
};

/**
 * Covnert serialized INPUT and FIELD primitives back to hydrated block templates.
 * Should be able to deserialize a format that has already been deserialized.  The only
 * "east" path to adding new targets/code requires going through deserialize, so it should
 * work with pre-parsed deserialized blocks.
 *
 * @param {object} blocks Serialized SB3 "blocks" property of a target. Will be mutated.
 * @return {object} input is modified and returned
 */
export function deserializeBlocks(blocks) {
  for (const blockId in blocks) {
    if (!Object.prototype.hasOwnProperty.call(blocks, blockId)) {
      continue;
    }
    const block = blocks[blockId];
    if (Array.isArray(block)) {
      // this is one of the primitives
      // delete the old entry in object.blocks and replace it w/the
      // deserialized object
      delete blocks[blockId];
      deserializeInputDesc(block, null, false, blocks);
      continue;
    }
    block.id = blockId; // add id back to block since it wasn't serialized
    block.inputs = deserializeInputs(block.inputs, blockId, blocks);
    block.fields = deserializeFields(block.fields);
  }
  return blocks;
}
