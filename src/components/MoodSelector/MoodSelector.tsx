import React from 'react';
import { motion } from 'framer-motion';
import { MoodType } from '@/types';
import { MOOD_LIST } from '@/constants/moods';

interface MoodSelectorProps {
  selectedMood?: MoodType;
  onSelectMood: (mood: MoodType) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  size = 'md',
  showLabels = false, // Text removed per user request
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const emojiSizes = {
    sm: 'text-2xl w-10 h-10',
    md: 'text-3xl w-12 h-12',
    lg: 'text-4xl w-14 h-14',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3.5 w-full"
    >
      {MOOD_LIST.map((moodOption) => {
        const isSelected = selectedMood === moodOption.id;

        return (
          <button
            key={moodOption.id}
            onClick={() => onSelectMood(moodOption.id)}
            type="button"
            aria-label={`Select mood: ${moodOption.label}`}
            title={moodOption.label}
            className={`relative flex items-center justify-center p-3 rounded-2xl transition-all duration-150 cursor-pointer border-3 border-[var(--border)] select-none aspect-square w-full ${
              isSelected
                ? 'bg-[var(--primary)] text-[var(--text)] shadow-[4px_4px_0px_0px_var(--border)] -translate-y-1 font-black'
                : 'bg-[var(--bg-card)] text-[var(--text)] shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)]'
            }`}
          >
            <span className={`flex items-center justify-center transition-transform ${emojiSizes[size]}`}>
              {moodOption.emoji}
            </span>

            {showLabels && (
              <span
                className={`mt-1.5 text-xs font-bold tracking-tight ${
                  isSelected ? 'text-[var(--text)] font-black' : 'text-[var(--text-muted)]'
                }`}
              >
                {moodOption.label}
              </span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
};
