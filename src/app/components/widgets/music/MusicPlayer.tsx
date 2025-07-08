'use client';

import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Volume2,
} from 'lucide-react';
import { useMusicPlayer } from './music-context';
import { useState, useEffect } from 'react';


export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    playlist,
    audioRef,
  } = useMusicPlayer();

  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => {
      if (isShuffle) {
        let next;
        do {
          next = Math.floor(Math.random() * playlist.length);
        } while (next === prev);
        return next;
      }
      return (prev + 1) % playlist.length;
    });
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(
      (prev) => (prev - 1 + playlist.length) % playlist.length
    );
    setCurrentTime(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.loop = isLoop;
  }
}, [isLoop]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm font-medium">
        <div>
          {currentTrack.title} —{' '}
          <span className="opacity-70">{currentTrack.artist}</span>
        </div>
        <div className="text-xs opacity-50">
          {formatTime(currentTime)} / {formatTime(currentTrack.duration)}
        </div>
      </div>

      {/* Music Progress Bar */}
      <div className="relative w-full h-1 rounded bg-white/20">
        <div
          className="absolute top-0 left-0 h-1 bg-white rounded"
          style={{
            width: `${(currentTime / currentTrack.duration) * 100}%`,
          }}
        />
        <input
          type="range"
          min="0"
          max={currentTrack.duration}
          value={currentTime}
          step="0.1"
          onChange={handleSeek}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <button onClick={() => setIsShuffle((s) => !s)}>
          <Shuffle
            size={16}
            className={`${
              isShuffle ? 'opacity-100 brightness-150' : 'opacity-50'
            }`}
          />
        </button>
        <button onClick={handlePrev}>
          <SkipBack size={16} className="opacity-50" />
        </button>
        <button
          className="bg-white/10 border border-white/10 rounded-full p-2"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={handleNext}>
          <SkipForward size={16} className="opacity-50" />
        </button>
<button onClick={() => setIsLoop((prev) => !prev)}>
  <Repeat size={16} className={isLoop ? "text-white" : "opacity-50"} />
</button>
      </div>

      {/* Volume Bar */}
      <div className="flex items-center gap-2 mt-2">
        <Volume2 size={14} className="opacity-50" />
        <div className="relative w-full h-1 rounded bg-white/20">
          <div
            className="absolute top-0 left-0 h-1 bg-white rounded"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute w-full h-1 opacity-0 cursor-pointer"
          />
        </div>
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
