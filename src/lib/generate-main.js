import { ColorUtils } from '@blockcode/utils';
import { Runtime } from '@blockcode/blocks';

export function generateMain(name, stage, sprites, monitors = []) {
  return [].concat(
    stage,
    sprites.map((sprite) => ({
      ...sprite,
      id: sprite.id.includes('sprite') ? sprite.id : `sprite${sprite.id}`,
    })),
    {
      id: 'cover',
      type: 'text/x-python',
      content: []
        .concat(
          `import image${stage.assets[0]} as image`,
          `name = "${name}"`,
          `def render(display):`,
          `  display.blit(image.BITMAP, (display.width - image.WIDTH) // 2, (display.height - image.HEIGHT) // 2, image.WIDTH, image.HEIGHT)`,
        )
        .join('\n'),
    },
    {
      id: 'main',
      type: 'text/x-python',
      content: []
        .concat(
          'from scratch import *',
          `from _stage_ import stage`,
          sprites // toSorted有兼容性问题，顾采用老办法
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(({ id }) => `import ${id.includes('sprite') ? id : `sprite${id}`}`),
          `monitors = [${monitors
            .filter((m) => !m.deleting)
            .map(
              (m) =>
                `[${[
                  JSON.stringify(m.groupId),
                  JSON.stringify(m.id),
                  `0x${ColorUtils.rgbToRgb565(ColorUtils.hexToRgb(m.color)).toString(16).toUpperCase()}`,
                  m.mode === Runtime.MonitorMode.Label
                    ? JSON.stringify(`${m.name ? `${m.name}-${m.label}` : m.label}:`)
                    : 'False',
                  m.visible ? 'True' : 'False',
                  m.x ?? 'False',
                  m.y ?? 'False',
                ]}]`,
            )}]`,
          'def start():',
          '  scratch_start(stage, monitors)',
        )
        .join('\n'),
    },
  );
}
