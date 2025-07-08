// music-context.tsx
'use client';

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { playlist } from "./MusicData";

const MusicPlayerContext = createContext<any>(null);

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    const onEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrackIndex, isPlaying]);

  const value = {
    audioRef,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    setIsPlaying,
    setCurrentTrackIndex,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    playlist,
    isLooping,
    setIsLooping,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop={isLooping}
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current?.currentTime || 0)
        }
        preload="auto"
      />
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => useContext(MusicPlayerContext);
