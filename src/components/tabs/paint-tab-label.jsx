import { useProjectContext, Text } from '@blockcode/core';

export function PaintTabLabel() {
  const { fileIndex } = useProjectContext();
  return fileIndex.value === 0 ? (
    <Text
      id="matrix.paintEditor.backdrops"
      defaultMessage="Backdrops"
    />
  ) : (
    <Text
      id="matrix.paintEditor.costumes"
      defaultMessage="Costumes"
    />
  );
}
