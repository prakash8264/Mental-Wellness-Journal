import React, { useState } from 'react';
import { HiX, HiPlus } from 'react-icons/hi';

interface TagInputProps {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
}

const SUGGESTED_TAGS = ['Mindfulness', 'Gratitude', 'Self-Care', 'Reflection', 'Work', 'Growth', 'Peace'];

export const TagInput: React.FC<TagInputProps> = ({ tags, onChangeTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      onChangeTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChangeTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--primary)] text-[var(--text)] text-xs font-black border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]"
          >
            #{tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-[var(--cta)] transition-colors"
            >
              <HiX className="text-sm" />
            </button>
          </span>
        ))}

        <div className="relative inline-flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag..."
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-cream)] text-[var(--text)] border-2 border-[var(--border)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-32 shadow-[2px_2px_0px_0px_var(--border)]"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => handleAddTag(inputValue)}
              className="absolute right-1.5 p-1 rounded-lg bg-[var(--cta)] text-white text-xs font-bold border border-[var(--border)]"
            >
              <HiPlus />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-[var(--text-muted)] font-bold">Suggestions:</span>
        {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((suggested) => (
          <button
            key={suggested}
            type="button"
            onClick={() => handleAddTag(suggested)}
            className="px-2.5 py-1 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--secondary)] text-[var(--text)] text-[10px] font-bold transition-all border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
          >
            + {suggested}
          </button>
        ))}
      </div>
    </div>
  );
};
