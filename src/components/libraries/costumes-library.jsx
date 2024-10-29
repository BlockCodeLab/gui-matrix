import { useEffect, useState } from 'preact/hooks';
import { useLocale } from '@blockcode/core';
import { Library } from '@blockcode/ui';
import allCostumes from './costumes.yaml';
import costumeTags from './sprite-tags';

export default function CostumesLibrary({ onSelect, onClose }) {
  const [data, setData] = useState([]);
  const { getText } = useLocale();

  const setSelectHandler = (costume) => () => {
    onSelect(costume);
    onClose();
  };

  useEffect(() => {
    setData(
      allCostumes.map((costume) => ({
        name: costume.name,
        author: costume.author,
        copyright: costume.copyright,
        tags: costume.tags,
        image: `./assets/${costume.id}.png`,
        onSelect: setSelectHandler(costume),
      })),
    );
  });

  return (
    <Library
      filterable
      tags={costumeTags}
      items={data}
      filterPlaceholder={getText('gui.library.search', 'Search')}
      title={getText('arcade.libraries.costume', 'Choose a Costume')}
      emptyText={getText('arcade.libraries.empty', 'No more!')}
      onClose={onClose}
    />
  );
}

CostumesLibrary.surprise = () => allCostumes[Math.floor(Math.random() * allCostumes.length)];
