import { useProjectContext, Text } from '@blockcode/core';

export function PaintTabLabel() {
  const { fileIndex } = useProjectContext();
  return fileIndex.value === 0 ? (
    <Text
      id="arcade.paintEditor.backdrops"
      defaultMessage="Backdrops"
    />
  ) : (
    <Text
      id="arcade.paintEditor.costumes"
      defaultMessage="Costumes"
    />
  );
}
