import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useProjectContext } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { loadImageFromAsset } from '@blockcode/paint';
import { ArcadeEmulatorGenerator, ArcadePythonGenerator, buildBlocks } from '../../blocks/blocks';

import { BlocksEditor } from '@blockcode/blocks';
import styles from './blocks-editor.module.css';

// 扩展过滤
const handleExtensionsFilter = () => ['arcade', ['runtime', '!multipin'], ['device', '!multipin']];

// 动态更新XY坐标积木
const XYBlocks = ['glide', 'move', 'set'];

const updateToolboxBlockValue = (workspace, id, value) => {
  const block = workspace.getBlockById(id);
  if (block) {
    block.inputList[0].fieldRow[0].setValue(value);
  }
};

// 代码转换
const emulator = new ArcadeEmulatorGenerator();
const generator = new ArcadePythonGenerator();

// 变量监视偏移
const monitorOffset = { top: 'calc(1.25rem + 48px + var(--space))' };

// 过滤字符
const escape = (name) => name.replaceAll(/[^a-z0-9]/gi, '_');

export function ArcadeBlocksEditor() {
  const { files, fileId, file, assets, modified } = useProjectContext();

  const stage = files.value[0];
  const target = file.value; // 统一舞台或角色
  const isStage = stage && fileId.value === stage.id;

  // 右上角缩略图
  const thumbUrl = useMemo(() => {
    const image = assets.value.find((asset) => asset.id === file.value.assets[target.frame]);
    if (image) {
      return `data:${image.type};base64,${image.data}`;
    }
    return null;
  }, [fileId.value, target.frame, modified.value]);

  // 动态更新XY坐标积木
  useEffect(() => {
    if (files.value[0]?.id === fileId.value) return;

    const workspace = ScratchBlocks.getMainWorkspace();
    if (workspace) {
      XYBlocks.forEach((prefix) => {
        updateToolboxBlockValue(workspace, `${prefix}x`, Math.round(target.x).toString());
        updateToolboxBlockValue(workspace, `${prefix}y`, Math.round(target.y).toString());
      });
    }
  }, [modified.value]);

  // 编译动态积木
  const handleBuildinExtensions = useCallback(() => {
    return buildBlocks(assets.value, files.value, file.value);
  }, []);

  // 根据选中的舞台或角色过滤积木
  const handleExtensionBlockFilter = useCallback((block) => {
    if (files.value[0]?.id === fileId.value) {
      return block.forStage !== false;
    }
    return block.forSprite !== false;
  }, []);

  // 首次加载所有资源
  const handleLoading = useCallback(async () => {
    for (const asset of assets.value) {
      if (asset.type.startsWith('image/')) {
        await loadImageFromAsset(asset);
      }
    }
  }, []);

  // 为舞台和角色分别预处理编译程序
  const handleDefinitions = useCallback((name, define, resources, index) => {
    const res = files.value?.[index];
    if (!res) return;

    // 模拟器代码
    if (name === emulator.name_) {
      define('target_utils', 'const targetUtils = runtime.targetUtils;');
      define('define_stage', `const stage = runtime.querySelector('#_stage_');`);
      define('defing_target', `const target = ${index === 0 ? 'stage;' : `runtime.querySelector('#${res.id}');`}`);
      return;
    }

    // 设备代码
    if (name === generator.name_) {
      define('import_blocks', 'from scratch import *');

      // 根据编辑目标的资源表收集资源导入文件
      const imageModules = [];

      let imageName;
      for (const id of res.assets) {
        imageName = `image${id}`;
        imageModules.push(imageName);
      }

      // 舞台
      if (index === 0) {
        define(
          'define_stage',
          `target = stage = Stage(runtime, (${imageModules.join(',')},), ${res.frame}, ` +
            `fencing_mode=${res.fencing !== false ? 'True' : 'False'})`,
        );
      } else {
        // 角色
        const spriteProps = [
          `(${imageModules.join(',')},)`,
          res.frame,
          Math.round(res.x),
          Math.round(res.y),
          Math.round(res.size),
          Math.round(res.direction),
          res.rotationStyle,
          res.hidden ? 'True' : 'False',
        ];
        define('import_stage', 'from _stage_ import stage');
        define(
          'define_sprite',
          `target = Sprite(runtime, stage, "${res.id}", "${res.name}", ${spriteProps.join(',')})`,
        );
      }

      // 导入资源
      define(`import_images`, imageModules.map((imageName) => `import ${imageName}`).join('\n'));

      // 导入使用的扩展
      for (const id in resources) {
        for (const extModule of resources[id]) {
          define(`import_${id}_${extModule.name}`, `from ext.${escape(id)} import ${extModule.name}`);
        }
      }
    }
  }, []);

  return (
    <>
      <BlocksEditor
        enableMonitor
        enableMyBlockWarp
        enableMultiTargets
        enableStringBlocks
        emulator={emulator}
        generator={generator}
        enableCloneBlocks={!isStage}
        enableLocalVariable={!isStage}
        monitorOffset={monitorOffset}
        onDefinitions={handleDefinitions}
        onBuildinExtensions={handleBuildinExtensions}
        onExtensionBlockFilter={handleExtensionBlockFilter}
        onExtensionsFilter={handleExtensionsFilter}
        onLoading={handleLoading}
      />

      {thumbUrl && (
        <div className={styles.targetThumb}>
          <img
            className={styles.thumbImage}
            src={thumbUrl}
          />
        </div>
      )}
    </>
  );
}
