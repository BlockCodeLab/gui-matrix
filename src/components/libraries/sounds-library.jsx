import { Text, Library } from '@blockcode/core';
import { getAssetUrl } from '../../lib/get-asset-url';
import soundTags from '../../lib/libraries/sound-tags';
import sounds from '../../lib/libraries/sounds.yaml';
import soundIcon from './icon-sound.svg';

// 声音播放器
const audioPlayer = new Audio();

// 声音延迟播放计时器
let timer;

// 鼠标进入时，延迟播放声音
const mouseEnterHandler = (sound) => () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    audioPlayer.pause();
    audioPlayer.src = getAssetUrl(sound, 'wav');
    audioPlayer.play();
  }, 200);
};

const handleMouseLeave = () => {
  clearTimeout(timer);
  timer = null;
  audioPlayer.pause();
};

const getSoundsItmes = (onSelect, onClose) => {
  return sounds.map((sound) => ({
    name: sound.name,
    copyright: sound.copyright,
    tags: sound.tags,
    image: soundIcon,
    onMouseEnter: mouseEnterHandler(sound),
    onMouseLeave: handleMouseLeave,
    onSelect() {
      audioPlayer.pause();
      onSelect(sound);
      onClose();
    },
  }));
};

export function SoundsLibrary({ onSelect, onClose }) {
  return (
    <Library
      filterable
      tags={soundTags}
      items={getSoundsItmes(onSelect, onClose)}
      filterPlaceholder={
        <Text
          id="gui.library.search"
          defaultMessage="Search"
        />
      }
      title={
        <Text
          id="matrix.libraries.sound"
          defaultMessage="Choose a Sound"
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

SoundsLibrary.surprise = () => sounds[Math.floor(Math.random() * sounds.length)];
