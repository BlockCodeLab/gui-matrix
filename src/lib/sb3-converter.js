import JSZip from 'jszip';
import mime from 'mime/lite';
import uid from './uid';
import RotationStyle from './rotation-style';
import deserializeBlocks from './sb3-deserializer';
import { getBlockByOpcode, getInputOrFieldByOpcode } from './sb3-blocks';

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 240;
const IMAGE_SCALE = 320 / 480;
const IMAGE_DATA_OFFSET = 'data:image/png;base64,'.length;
const EMPTY_IMAGE = 'data:,';

const XYBlocks = ['motion_gotoxy', 'motion_glidesecstoxy', 'motion_setx', 'motion_sety'];

const xmlEscape = (unsafe) => {
  if (typeof unsafe !== 'string') {
    if (Array.isArray(unsafe)) {
      unsafe = String(unsafe);
    } else {
      log.error('Unexpected input recieved in replaceUnsafeChars');
      return unsafe;
    }
  }
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
    }
  });
};

const mutationToXML = (mutation) => {
  let mutationString = `<${mutation.tagName}`;
  for (const prop in mutation) {
    if (prop === 'children' || prop === 'tagName') continue;
    let mutationValue = typeof mutation[prop] === 'string' ? xmlEscape(mutation[prop]) : mutation[prop];

    // Handle dynamic extension blocks
    if (prop === 'blockInfo') {
      mutationValue = xmlEscape(JSON.stringify(mutation[prop]));
    }

    mutationString += ` ${prop}="${mutationValue}"`;
  }
  mutationString += '>';
  for (let i = 0; i < mutation.children.length; i++) {
    mutationString += mutationToXML(mutation.children[i]);
  }
  mutationString += `</${mutation.tagName}>`;
  return mutationString;
};

const blockToXML = (blockId, blocks, editor, isScale = false) => {
  const block = blocks[blockId];
  // block should exist, but currently some blocks' next property point
  // to a blockId for non-existent blocks. Until we track down that behavior,
  // this early exit allows the project to load.
  if (!block) return;
  // Encode properties of this block.
  const tagName = block.shadow ? 'shadow' : 'block';
  const blockType = getBlockByOpcode(block.opcode, editor);
  const blockXY = `${block.topLevel ? `x="${block.x}" y="${block.y}"` : ''}`;
  let xmlString = `<${tagName} id="${block.id}" type="${blockType}" ${blockXY}>`;
  // Add any mutation. Must come before inputs.
  if (block.mutation) {
    xmlString += mutationToXML(block.mutation);
  }
  // Scale x/y
  if (XYBlocks.indexOf(blockType) !== -1) {
    isScale = true;
  }
  // Add any inputs on this block.
  for (const input in block.inputs) {
    if (!Object.prototype.hasOwnProperty.call(block.inputs, input)) continue;
    const blockInput = getInputOrFieldByOpcode(block.opcode, block.inputs[input]);
    // Only encode a value tag if the value input is occupied.
    if (blockInput.block || blockInput.shadow) {
      xmlString += `<value name="${blockInput.name}">`;
      if (blockInput.block) {
        xmlString += blockToXML(blockInput.block, blocks, editor, isScale);
      }
      if (blockInput.shadow && blockInput.shadow !== blockInput.block) {
        // Obscured shadow.
        xmlString += blockToXML(blockInput.shadow, blocks, editor, isScale);
      }
      xmlString += '</value>';
    }
  }
  // Add any fields on this block.
  for (const field in block.fields) {
    if (!Object.prototype.hasOwnProperty.call(block.fields, field)) continue;
    const blockField = getInputOrFieldByOpcode(block.opcode, block.fields[field]);
    xmlString += `<field name="${blockField.name}"`;
    const fieldId = blockField.id;
    if (fieldId) {
      xmlString += ` id="${fieldId}"`;
    }
    const varType = blockField.variableType;
    if (typeof varType === 'string') {
      xmlString += ` variabletype="${varType}"`;
    }
    let value = blockField.value;
    if (typeof value === 'string') {
      value = xmlEscape(blockField.value);
    }
    if (isScale && blockField.name === 'NUM') {
      value = Math.round(+value * IMAGE_SCALE);
    }
    xmlString += `>${value}</field>`;
  }
  // Add blocks connected to the next connection.
  if (block.next) {
    xmlString += `<next>${blockToXML(block.next, blocks, editor)}</next>`;
  }
  xmlString += `</${tagName}>`;
  return xmlString;
};

const sb3Parse = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.addEventListener('load', async () => {
      const sb3File = {};
      try {
        const files = [];
        const zip = await JSZip.loadAsync(reader.result);
        zip.forEach((pathname, file) => files.push([pathname, file]));

        for (const [pathname, file] of files) {
          if (/^([^/]*\/)?project\.json$/.test(pathname)) {
            const porjectStr = await file.async('string');
            sb3File['project.json'] = JSON.parse(
              porjectStr.replace(/(\\+)(b|u0008)/g, (match, backslash, code) => {
                // If the number is odd, there is an actual backspace.
                if (backslash.length % 2) {
                  // The match contains an actual backspace, instead of backslashes followed by b.
                  // Remove backspace and keep backslashes that are not part of
                  // the control character representation.
                  return match.replace('\\' + code, '');
                }
                // They are just backslashes followed by b or u0008. (e.g. "\\b")
                // Don't replace in this case. (LLK/scratch-parser#56)
                return match;
              }),
            );
          } else if (!file.dir) {
            const md5ext = pathname.replace(/^([^/]*\/)*/, '');
            sb3File[md5ext] = file;
          }
        }
      } catch (err) {
        reject(err);
        return;
      }
      resolve(sb3File);
    });
  });

const convertImage = (file) =>
  new Promise(async (resolve) => {
    const type = mime.getType(file.name);
    const base64 = await file.async('base64');
    const image = new Image();
    image.src = `data:${type};base64,${base64}`;
    image.addEventListener('load', () => {
      const imageWidth = Math.round(image.width * IMAGE_SCALE);
      const imageHeight = Math.round(image.height * IMAGE_SCALE);

      let width = Math.min(VIEW_WIDTH, imageWidth);
      let height = Math.min(VIEW_HEIGHT, imageHeight);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      const sx = Math.round((imageWidth - width) / 2);
      const sy = Math.round((imageHeight - height) / 2);
      ctx.drawImage(image, -sx, -sy, imageWidth, imageHeight);

      const type = 'image/png';
      const dataUrl = canvas.toDataURL(type);
      let data = dataUrl.slice(IMAGE_DATA_OFFSET);
      if (dataUrl === EMPTY_IMAGE) {
        data =
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';
        width = 1;
        height = 1;
      }
      resolve({ width, height, sx, sy, data, type });
    });
  });

export default async function (file) {
  const sb3File = await sb3Parse(file);
  const projectJson = sb3File['project.json'];

  const nameParts = file.name.split('.');
  nameParts.pop();
  const name = nameParts.join('.');

  const editor = {
    extensions: [],
    package: 'arcade',
  };

  const assetList = [];
  const fileList = [];
  let selectedFileId;

  projectJson.targets.sort((a, b) => a.layerOrder - b.layerOrder);
  for (const target of projectJson.targets) {
    const file = {
      id: target.isStage ? 'stage' : uid(),
      name: target.name,
      assets: [],
      frame: target.currentCostume,
      type: 'text/x-python',
      x: target.x || 0,
      y: target.y || 0,
    };

    // deserialize blocks
    const xmls = [];
    const blocks = deserializeBlocks(target.blocks);
    for (const blockId in blocks) {
      const block = target.blocks[blockId];
      if (!block.parent) {
        xmls.push(blockToXML(blockId, target.blocks, editor));
      }
    }

    // deserialize variables
    // TODO

    // convert image
    for (const costume of target.costumes) {
      file.assets.push(costume.assetId);
      const assetFile = sb3File[costume.md5ext];
      const { sx, sy, ...asset } = await convertImage(assetFile);
      asset.id = costume.assetId;
      asset.name = costume.name;
      asset.centerX = Math.round(costume.rotationCenterX * IMAGE_SCALE - sx);
      asset.centerY = Math.round(costume.rotationCenterY * IMAGE_SCALE - sy);
      assetList.push(asset);
    }

    // convert sound
    // TODO

    if (!target.isStage) {
      if (!selectedFileId) {
        selectedFileId = file.id;
      }
      file.x = file.x * IMAGE_SCALE;
      file.y = file.y * IMAGE_SCALE;
      file.size = target.size;
      file.direction = target.direction;
      file.rotationStyle = RotationStyle[target.rotationStyle];
      file.hidden = !target.visible;
      file.zIndex = target.layerOrder - 1;
    }

    file.xml = `<xml xmlns="http://www.w3.org/1999/xhtml">${xmls.join('')}</xml>`;

    fileList.push(file);
  }

  editor.extensions = Array.from(new Set(editor.extensions));

  return {
    name,
    assetList,
    fileList,
    selectedFileId,
    editor,
  };
}
