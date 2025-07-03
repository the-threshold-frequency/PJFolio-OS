'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BootScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10) + 5;
        return next >= 100 ? 100 : next;
      });

      setBootLines((prev) => {
        const newLine = `[ OK ] ${randomLinuxMessage()}`;
        return [...prev.slice(-4), newLine]; // keep last 5 lines
      });
    }, 300);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setShow(false); // trigger exit animation
      setTimeout(() => onFinish(), 800); // delay to allow animation
    }, 3800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black text-green-400 font-mono px-4 sm:px-6 py-10 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* CRT Overlay */}
          <div className="absolute inset-0 pointer-events-none z-[2] bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[length:100%_3px] opacity-[0.15] mix-blend-screen" />

          {/* "BOOTING..." Text */}
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-6 tracking-widest text-center text-lg sm:text-xl md:text-2xl relative z-[3]"
          >
            <div className="inline-block relative left-[0.9ch]">BOOTING...</div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full max-w-sm sm:max-w-md h-2 bg-green-900/30 rounded overflow-hidden mb-6 z-[3]">
            <motion.div
              className="h-full bg-green-400"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>

          {/* Boot Lines with fade on top lines */}
          <div className="w-full max-w-sm sm:max-w-md text-xs sm:text-sm text-left opacity-80 h-[6.5rem] flex flex-col justify-end space-y-1 overflow-hidden z-[3]">
            {bootLines.map((line, index) => {
              const fadeClass =
                bootLines.length === 5
                  ? index === 0
                    ? 'opacity-20'
                    : index === 1
                    ? 'opacity-50'
                    : 'opacity-100'
                  : 'opacity-100';

              return (
                <div
                  key={index}
                  className={`${fadeClass} transition-opacity duration-700 ease-out`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function randomLinuxMessage() {
  const pool = [
    'Mounting virtual filesystem...',
    'Initializing kernel modules...',
    'Starting system logger...',
    'Activating network interfaces...',
    'Checking disk quotas...',
    'Starting hostname service...',
    'Loading device drivers...',
    'Starting display manager...',
    'Establishing secure boot sequence...',
    'Decrypting environment variables...',
    'Detecting hardware...',
    'Compiling shaders...',
    'Syncing core clocks...',
    'Bootloader handshake complete...',
    'Verifying BIOS handoff...',
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}
