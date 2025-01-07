export function generateMain(stage, sprites) {
  return [].concat(
    stage,
    sprites.map((sprite) => ({
      ...sprite,
      id: sprite.id.includes('sprite') ? sprite.id : `sprite${sprite.id}`,
    })),
    {
      id: 'main',
      type: 'text/x-python',
      content: []
        .concat(
          'from scratch import *',
          `from _stage_ import stage`,
          sprites
            .toSorted((a, b) => a.zIndex - b.zIndex)
            .map(({ id }) => `import ${id.includes('sprite') ? id : `sprite${id}`}`),
          'def start():\n  scratch_start(stage)',
        )
        .join('\n'),
    },
  );
}
