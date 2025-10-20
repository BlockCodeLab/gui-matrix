import { Text, Library } from '@blockcode/core';
import { getAssetUrl } from '../../lib/get-asset-url';
import costumeTags from '../../lib/libraries/sprite-tags';
import costumes from '../../lib/libraries/costumes.yaml';

const getCostumesItmes = (onSelect, onClose) => {
  return costumes.map((costume) => ({
    name: costume.name,
    copyright: costume.copyright,
    tags: costume.tags,
    image: getAssetUrl(costume),
    onSelect() {
      onSelect(costume);
      onClose();
    },
  }));
};

export function CostumesLibrary({ onSelect, onClose }) {
  const costumeItems = getCostumesItmes(onSelect, onClose);

  return (
    <Library
      filterable
      tags={costumeTags}
      items={costumeItems}
      filterPlaceholder={
        <Text
          id="gui.library.search"
          defaultMessage="Search"
        />
      }
      title={
        <Text
          id="arcade2.libraries.costume"
          defaultMessage="Choose a Costume"
        />
      }
      emptyMessage={
        <Text
          id="arcade2.libraries.empty"
          defaultMessage="No more!"
        />
      }
      onClose={onClose}
    />
  );
}

CostumesLibrary.surprise = () => costumes[Math.floor(Math.random() * costumes.length)];
