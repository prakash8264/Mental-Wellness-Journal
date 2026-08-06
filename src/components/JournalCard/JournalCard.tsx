import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '@/types';
import { getMoodOption } from '@/utils/moodUtils';
import { formatDateShort, getRelativeTimeString } from '@/utils/dateUtils';
import { HiOutlineDocumentText, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

interface JournalCardProps {
  entry: JournalEntry;
  onDelete?: (id: string) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ entry, onDelete }) => {
  const navigate = useNavigate();
  const moodOption = getMoodOption(entry.mood);

  return (
    <div
      onClick={() => navigate(`/journal/${entry.id}?mode=view`)}
      className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between bg-[var(--bg-card)] border-3 border-[var(--border)] group relative"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[var(--text)]">
              {getRelativeTimeString(entry.date)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">•</span>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              {formatDateShort(entry.date)}
            </span>
          </div>

          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]"
            style={{ backgroundColor: moodOption.color, color: '#1E293B' }}
          >
            <span>{moodOption.emoji}</span>
            <span>{moodOption.label}</span>
          </div>
        </div>

        <h3 className="text-lg font-black text-[var(--text)] font-heading line-clamp-1 group-hover:text-[var(--cta)] transition-colors">
          {entry.title || 'Untitled Reflection'}
        </h3>

        <p className="text-sm text-[var(--text-muted)] font-medium mt-2 line-clamp-2 leading-relaxed">
          {entry.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()}
        </p>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-cream)] text-[var(--text)] text-[11px] font-extrabold border-2 border-[var(--border)] shadow-[1px_1px_0px_0px_var(--border)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-[var(--border)] text-xs text-[var(--text-muted)] font-bold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <HiOutlineDocumentText className="text-[var(--text)]" />
            {entry.wordCount} words
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/journal/${entry.id}?mode=edit`)}
            className="p-1.5 rounded-lg bg-[var(--secondary)] border-2 border-[var(--border)] text-[var(--text)] font-bold transition-transform hover:scale-110 cursor-pointer"
            title="Edit Entry"
          >
            <HiOutlinePencil className="text-sm" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1.5 rounded-lg bg-[var(--cta)] border-2 border-[var(--border)] text-white font-bold transition-transform hover:scale-110 cursor-pointer"
              title="Delete Entry"
            >
              <HiOutlineTrash className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
