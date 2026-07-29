import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import { ROUTES } from '@/constants/routes';

export const FloatingButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(ROUTES.JOURNAL)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Create new journal entry"
      title="Quick Journal Entry"
      className="fixed bottom-20 lg:bottom-8 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[var(--cta)] text-white font-heading font-black text-sm border-3 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[6px_6px_0px_0px_var(--border)] cursor-pointer select-none group"
    >
      <span className="w-7 h-7 rounded-xl bg-white/20 border-2 border-white flex items-center justify-center text-lg group-hover:rotate-90 transition-transform duration-300">
        <HiPlus />
      </span>
      <span className="hidden sm:inline">New Entry</span>
    </motion.button>
  );
};
