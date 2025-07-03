'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Volume2 } from 'lucide-react';
import { playlist } from './MusicData';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrack = playlist[currentTrackIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    const onEnded = () => {
      handleNext();
    };

    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex, isPlaying]);

  return (
    <div className="w-full flex flex-col gap-2">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        preload="auto"
      />

      <div className="flex justify-between items-center text-sm font-medium">
        <div>
          {currentTrack.title} — <span className="opacity-70">{currentTrack.artist}</span>
        </div>
        <div className="text-xs opacity-50">
          {formatTime(currentTime)} / {formatTime(currentTrack.duration)}
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={currentTrack.duration}
        value={currentTime}
        step="0.1"
        onChange={handleSeek}
        className="w-full h-1 rounded bg-white/20 appearance-none cursor-pointer accent-white"
      />

      <div className="flex items-center justify-between mt-2">
        <button><Shuffle size={16} className="opacity-50" /></button>
        <button onClick={handlePrev}><SkipBack size={16} className="opacity-50" /></button>
        <button
          className="bg-white/10 border border-white/10 rounded-full p-2"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={handleNext}><SkipForward size={16} className="opacity-50" /></button>
        <button><Repeat size={16} className="opacity-50" /></button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Volume2 size={14} className="opacity-50" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 rounded bg-white/20 appearance-none cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
