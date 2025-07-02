export function generateMain(name, stage, sprites) {
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
          [...sprites] // toSorted有兼容性问题，顾采用老办法
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(({ id }) => `import ${id.includes('sprite') ? id : `sprite${id}`}`),
          'def start():\n  scratch_start(stage)',
        )
        .join('\n'),
    },
  );
}
