// widgets/music/useMusicPlayer.ts
'use client';

import { useEffect, useRef, useState } from 'react';

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = new Audio('/music/sample.mp3');
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  return { isPlaying, togglePlay };
}
