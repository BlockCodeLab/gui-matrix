import { Text, Library } from '@blockcode/core';
import { getAssetUrl } from '../../lib/get-asset-url';
import spriteTags from '../../lib/libraries/sprite-tags';
import sprites from '../../lib/libraries/sprites.yaml';

// 动图计时器
let timer;

// 鼠标进入时，如果角色存在多个造型则动图轮播
const mouseEnterHandler = (sprite) => (e) => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  const len = sprite.costumes.length;
  if (len > 1) {
    let i = 0;
    timer = setInterval(() => {
      e.target.src = getAssetUrl(sprite, sprite.costumes[++i % len]);
    }, 300);
  }
};

// 鼠标离开时，停止轮播，显示第一张图
const mouseLeaveHandler = (sprite) => (e) => {
  clearInterval(timer);
  timer = null;
  e.target.src = getAssetUrl(sprite, sprite.costumes[0]);
};

const getSpritesItmes = (onSelect, onClose) => {
  return sprites.map((sprite) => ({
    name: sprite.name,
    copyright: sprite.copyright,
    tags: sprite.tags,
    image: getAssetUrl(sprite, sprite.costumes[0]),
    onMouseEnter: mouseEnterHandler(sprite),
    onMouseLeave: mouseLeaveHandler(sprite),
    onSelect() {
      clearInterval(timer);
      onSelect(sprite);
      onClose();
      timer = null;
    },
  }));
};

export function SpritesLibrary({ onSelect, onClose }) {
  return (
    <Library
      filterable
      tags={spriteTags}
      items={getSpritesItmes(onSelect, onClose)}
      filterPlaceholder={
        <Text
          id="gui.library.search"
          defaultMessage="Search"
        />
      }
      title={
        <Text
          id="arcade2.libraries.sprite"
          defaultMessage="Choose a Sprite"
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

SpritesLibrary.surprise = () => sprites[Math.floor(Math.random() * sprites.length)];
