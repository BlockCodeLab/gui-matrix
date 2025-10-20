import { useProjectContext, Text } from '@blockcode/core';

export function PaintTabLabel() {
  const { fileIndex } = useProjectContext();
  return fileIndex.value === 0 ? (
    <Text
      id="arcade2.paintEditor.backdrops"
      defaultMessage="Backdrops"
    />
  ) : (
    <Text
      id="arcade2.paintEditor.costumes"
      defaultMessage="Costumes"
    />
  );
}
