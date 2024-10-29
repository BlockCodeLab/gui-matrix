import { useEffect, useState } from 'preact/hooks';
import { useLocale } from '@blockcode/core';
import { Library } from '@blockcode/ui';
import allSprites from './sprites.yaml';
import spriteTags from './sprite-tags';

export default function SpritesLibrary({ onSelect, onClose }) {
  const [data, setData] = useState([]);
  const { getText } = useLocale();

  const setSelectHandler = (sprite) => () => {
    onSelect(sprite);
    onClose();
  };

  let timer;
  const setMouseEnterHandler = (sprite) => (e) => {
    const len = sprite.costumes.length;
    if (len > 1) {
      let i = 0;
      timer = setInterval(() => (e.target.src = `./assets/${sprite.costumes[++i % len].id}.png`), 333);
    }
  };

  const setMouseLeaveHandler = (sprite) => (e) => {
    clearInterval(timer);
    e.target.src = `./assets/${sprite.costumes[0].id}.png`;
  };

  useEffect(() => {
    setData(
      allSprites.map((sprite) => ({
        name: sprite.name,
        author: sprite.author,
        copyright: sprite.copyright,
        tags: sprite.tags,
        image: `./assets/${sprite.costumes[0].id}.png`,
        onSelect: setSelectHandler(sprite),
        onMouseEnter: setMouseEnterHandler(sprite),
        onMouseLeave: setMouseLeaveHandler(sprite),
      })),
    );
  });

  return (
    <Library
      filterable
      tags={spriteTags}
      items={data}
      filterPlaceholder={getText('gui.library.search', 'Search')}
      title={getText('arcade.libraries.sprite', 'Choose a Sprite')}
      emptyText={getText('arcade.libraries.empty', 'No more!')}
      onClose={onClose}
    />
  );
}

SpritesLibrary.surprise = () => allSprites[Math.floor(Math.random() * allSprites.length)];
