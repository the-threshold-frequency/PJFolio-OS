'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

const CustomCursor = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const ringScale = useMotionValue(1);

  const ringOpacity = useTransform(ringScale, (s) => (s > 1 ? 1 : 0));

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    let isClicking = false;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const deltaTime = now - lastTime || 1;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / deltaTime;

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      animate(ringX, e.clientX, { duration: 0.2 });
      animate(ringY, e.clientY, { duration: 0.2 });

      if (!isClicking) {
        const targetScale = Math.min(1 + speed * 0.5, 2.5);
        animate(ringScale, targetScale, { duration: 0.2 });
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    const handleMouseStop = () => {
      if (!isClicking) {
        animate(ringScale, 1, { duration: 0.3 });
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      animate(ringScale, 0.2, { duration: 0.2 });
    };

    const handleMouseUp = () => {
      isClicking = false;
      animate(ringScale, 1, { duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseStop);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseStop);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY, ringX, ringY, ringScale]);

  const ringSize = 30;
  const dotSize = 6;

  return (
    <>
      {/* White Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] bg-white rounded-full"
        style={{
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          translateX: -dotSize / 2,
          translateY: -dotSize / 2,
          width: dotSize,
          height: dotSize,
        }}
      />

      {/* Outline Ring */}
      <motion.div
        className="pointer-events-none fixed z-[9998]"
        style={{
          left: 0,
          top: 0,
          x: ringX,
          y: ringY,
          translateX: -ringSize / 2,
          translateY: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: '1px solid white',
          scale: ringScale,
          opacity: ringOpacity,
        }}
      />
    </>
  );
};

export default CustomCursor;
