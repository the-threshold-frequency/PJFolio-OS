// components/DockIcon.tsx
'use client';
import { Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DockIcon({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 left-6 bg-white/10 border border-white/20 p-3 rounded-lg backdrop-blur-md shadow-lg z-[100]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Monitor className="text-white w-6 h-6" />
    </motion.button>
  );
}
