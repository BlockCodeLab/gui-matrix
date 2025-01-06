import { Text, Library } from '@blockcode/core';
import { getAssetUrl } from '../../lib/get-asset-url';
import backdropTags from '../../lib/libraries/backdrop-tags';
import backdrops from '../../lib/libraries/backdrops.yaml';

const getBackdropItmes = (onSelect, onClose) => {
  return backdrops.map((backdrop) => ({
    name: backdrop.name,
    copyright: backdrop.copyright,
    tags: backdrop.tags,
    image: getAssetUrl(backdrop, 'png'),
    onSelect() {
      onSelect(backdrop);
      onClose();
    },
  }));
};

export function BackdropsLibrary({ onSelect, onClose }) {
  const backdropItems = getBackdropItmes(onSelect, onClose);

  return (
    <Library
      filterable
      tags={backdropTags}
      items={backdropItems}
      filterPlaceholder={
        <Text
          id="gui.library.search"
          defaultMessage="Search"
        />
      }
      title={
        <Text
          id="matrix.libraries.backdrop"
          defaultMessage="Choose a Backdrop"
        />
      }
      emptyMessage={
        <Text
          id="matrix.libraries.empty"
          defaultMessage="No more!"
        />
      }
      onClose={onClose}
    />
  );
}

BackdropsLibrary.surprise = () => backdrops[Math.floor(Math.random() * backdrops.length)];
