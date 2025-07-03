'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export default function WidgetPanel() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const autoCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const interactionOngoing = useRef(false);

  const scheduleAutoClose = () => {
    if (autoCloseTimeout.current) clearTimeout(autoCloseTimeout.current);
    autoCloseTimeout.current = setTimeout(() => {
      if (!interactionOngoing.current) setOpen(false);
    }, 6000);
  };

  useEffect(() => {
    if (open) scheduleAutoClose();
    return () => {
      if (autoCloseTimeout.current) clearTimeout(autoCloseTimeout.current);
    };
  }, [open]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth - 20) setOpen(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current !== null) {
        const endX = e.changedTouches[0].clientX;
        if (touchStartX.current > window.innerWidth - 30 && endX < window.innerWidth - 100) {
          setOpen(true);
        }
        touchStartX.current = null;
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <AnimatePresence>
      {open && (
<motion.div
  key="widget-panel"
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
  ref={panelRef}
  onMouseEnter={() => (interactionOngoing.current = true)}
  onMouseLeave={() => {
    interactionOngoing.current = false;
    scheduleAutoClose();
  }}
  onTouchStart={() => (interactionOngoing.current = true)}
  className="fixed top-5 z-[90] w-[90vw] sm:w-[340px] max-h-[80vh] flex flex-col gap-4 text-white overflow-visible pointer-events-auto left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 will-change-transform will-change-[backdrop-filter]"
>


          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.2,
                  staggerChildren: 0.15,
                },
              },
            }}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <WidgetCard>
              <div className="text-center text-xl font-semibold tracking-wide">
                {new Date().toLocaleTimeString()}
                <br />
                <span className="text-sm opacity-70">{new Date().toDateString()}</span>
              </div>
            </WidgetCard>

            <WidgetCard>
              <div className="text-sm">
                 <strong>Page Views:</strong> [Coming soon...]
              </div>
            </WidgetCard>

            <WidgetCard>
              <div className="text-sm">
                 <strong>Theme:</strong> [Light / Dark]
              </div>
            </WidgetCard>

            <WidgetCard>
              <div className="text-sm">
                 <strong>Quick Contact</strong>
                <div className="mt-1 text-xs opacity-70 leading-tight">
                  preetrajhaldar2002@gmail.com
                  <br />
                  +91 9674785422
                </div>
              </div>
            </WidgetCard>

            <WidgetCard>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="font-medium text-sm"> Futuristic Beats</div>
                  <div className="text-xs opacity-70">By SynthCore</div>
                </div>
                <button
                  onClick={togglePlay}
                  className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
              <audio
                ref={audioRef}
                src="/music/sample.mp3"
                loop
                preload="auto"
              />
            </WidgetCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WidgetCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      className="rounded-xl p-4 bg-black/30 border border-white/10 backdrop-blur-md shadow-inner"
    >
      {children}
    </motion.div>
  );
}
