import React from 'react';
import { MoodLog } from '@/types';
import { getMoodOption } from '@/utils/moodUtils';
import { getRelativeTimeString } from '@/utils/dateUtils';
import { HiOutlineSparkles } from 'react-icons/hi';

interface MoodCardProps {
  moodLog?: MoodLog;
  onOpenSelector?: () => void;
}

export const MoodCard: React.FC<MoodCardProps> = ({ moodLog, onOpenSelector }) => {
  if (!moodLog) {
    return (
      <div
        onClick={onOpenSelector}
        className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer bg-[var(--bg-card)] border-3 border-dashed border-[var(--border)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] border-3 border-[var(--border)] flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_var(--border)]">
              ✨
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text)] font-heading">
                How are you feeling today?
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                Tap to check in with your mind & body
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="btn-primary text-xs py-2 px-4"
          >
            Log Mood
          </button>
        </div>
      </div>
    );
  }

  const moodOption = getMoodOption(moodLog.mood);

  return (
    <div className="clay-card p-6 rounded-3xl relative overflow-hidden bg-[var(--bg-card)] border-3 border-[var(--border)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl border-3 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-center text-4xl"
            style={{ backgroundColor: moodOption.color }}
          >
            {moodOption.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                {getRelativeTimeString(moodLog.date)}'s Mood {moodLog.time ? `(${moodLog.time})` : ''}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
              <span className="text-xs font-bold text-[var(--text-muted)]">
                Score: {moodOption.score}/10
              </span>
            </div>
            <h3 className="text-xl font-black text-[var(--text)] font-heading mt-0.5 flex items-center gap-2">
              <span>{moodOption.label}</span>
              <HiOutlineSparkles className="text-base text-[var(--cta)]" />
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-1 max-w-sm">
              {moodOption.description}
            </p>
          </div>
        </div>

        {onOpenSelector && (
          <button
            onClick={onOpenSelector}
            className="text-xs font-extrabold text-[var(--cta)] hover:underline underline-offset-4 cursor-pointer"
          >
            + Log Mood
          </button>
        )}
      </div>
    </div>
  );
};
