import { useEffect, useState } from 'preact/hooks';
import { useLocale } from '@blockcode/core';
import { Library } from '@blockcode/ui';
import allSounds from './sounds.yaml';
import soundTags from './sound-tags';

import soundIcon from './icon-sound.svg';

const audioPlayer = new Audio();

export default function SoundsLibrary({ onSelect, onClose }) {
  const [data, setData] = useState([]);
  const { getText } = useLocale();

  const setSelectHandler = (sound) => () => {
    audioPlayer.pause();
    onSelect(sound);
    onClose();
  };

  let timer;
  const setMouseEnterHandler = (soundId) => () => {
    timer = setTimeout(() => {
      audioPlayer.pause();
      audioPlayer.src = `./assets/${soundId}.wav`;
      audioPlayer.play();
    }, 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    audioPlayer.pause();
  };

  useEffect(() => {
    setData(
      allSounds.map((sound) => ({
        name: sound.name,
        author: sound.author,
        copyright: sound.copyright,
        tags: sound.tags,
        image: soundIcon,
        onSelect: setSelectHandler(sound),
        onMouseEnter: setMouseEnterHandler(sound.id),
        onMouseLeave: handleMouseLeave,
      })),
    );
  });

  return (
    <Library
      filterable
      tags={soundTags}
      items={data}
      filterPlaceholder={getText('gui.library.search', 'Search')}
      title={getText('arcade.libraries.sound', 'Choose a Sound')}
      emptyText={getText('arcade.libraries.empty', 'No more!')}
      onClose={onClose}
    />
  );
}

SoundsLibrary.surprise = () => allSounds[Math.floor(Math.random() * allSounds.length)];
