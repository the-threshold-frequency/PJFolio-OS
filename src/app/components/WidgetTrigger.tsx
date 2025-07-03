// WidgetTrigger.tsx
'use client';

import { useState } from 'react';
import { Sliders, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WidgetPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Trigger Button */}
      <div
        onClick={toggleWidget}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-white/10 backdrop-blur-md text-white text-sm rounded-l-xl shadow-lg hover:bg-white/20 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-white group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">System</span>
        </div>
      </div>

      {/* Sliding Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-[280px] sm:w-[320px] h-full bg-black/60 backdrop-blur-lg border-l border-white/10 z-40 p-4 flex flex-col gap-4 text-white"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold tracking-wide">Widgets</h2>
              <X onClick={toggleWidget} className="h-5 w-5 cursor-pointer text-white hover:text-red-400" />
            </div>
            <div className="text-sm opacity-70">(Widgets go here...)</div>
            {/* Add your widgets below this line */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
