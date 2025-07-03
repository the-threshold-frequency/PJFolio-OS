'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import { Home, User, Folder, Mail } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import BootScreen from './components/BootScreen';
import WidgetPanel from './components/WidgetPanel';
import { isTouchDevice } from './utils/isTouchDevice';


const sections = [
  { id: 'home', title: 'Hi, Preetraj Here', icon: Home, color: '#0f0f0f' },
  { id: 'about', title: 'About Me', icon: User, color: '#1e1e2f' },
  { id: 'projects', title: 'Projects', icon: Folder, color: '#2f1e2e' },
  { id: 'contact', title: 'Contact', icon: Mail, color: '#1e2f2e' },
];


export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgColor, setBgColor] = useState(sections[0].color);
  const [booted, setBooted] = useState(false);

  const [showCursor, setShowCursor] = useState(false);

useEffect(() => {
  if (!isTouchDevice()) {
    setShowCursor(true);
  }
}, []);

  useEffect(() => {
    if (!booted) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    };

    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
      const newColor = sections[index]?.color;
      if (newColor && newColor !== bgColor) setBgColor(newColor);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [bgColor, booted]);

  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    container.scrollTo({ left: index * width, behavior: 'smooth' });
  };

  return (
    <>
      {!booted && <BootScreen onFinish={() => setBooted(true)} />}
      {booted && (
      <div
        className="h-[100dvh] w-screen relative transition-colors duration-700 ease-in-out"
          style={{ backgroundColor: bgColor }}
        >
          {showCursor && <CustomCursor />}


          <main
            ref={containerRef}
            className="flex overflow-x-scroll snap-x snap-mandatory no-scrollbar h-full w-full"
          >
            {sections.map((section, index) => (
              <Section key={section.id} title={section.title} delay={index * 0.2} />
            ))}
          </main>

          {/* Frosted Glass Wipe-In Navigation with Refined Animation */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.7 }}
            className="origin-center absolute bottom-[5%] left-1/2 -translate-x-1/2 px-6 py-3 rounded-full z-50 backdrop-blur-md bg-white/10 border border-white/20 shadow-xl"
            >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.3 },
                },
              }}
              className="flex gap-6"
            >
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeIndex === index;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollTo(index)}
                    className={clsx(
                      'group relative flex flex-col items-center transition-transform duration-300',
                      isActive ? 'scale-125 text-white' : 'text-gray-400 hover:text-white'
                    )}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.9 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 180,
                          damping: 16,
                        },
                      },
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
          <WidgetPanel />

        </div>
      )}
    </>
  );
}

function Section({ title, delay }: { title: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      className="snap-start min-w-full h-[100dvh] flex items-center justify-center text-white text-6xl font-bold px-6"
      initial={{ opacity: 0, x: 200 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {title}
    </motion.section>
  );
}
