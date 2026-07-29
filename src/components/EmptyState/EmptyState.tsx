import React from 'react';
import { Button } from '@/components/Buttons/Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🌱',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="clay-card p-10 sm:p-14 rounded-3xl text-center flex flex-col items-center justify-center max-w-lg mx-auto bg-[var(--bg-card)] border-3 border-[var(--border)] my-8">
      <div className="w-20 h-20 rounded-2xl bg-[var(--primary)] border-3 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--border)] flex items-center justify-center text-4xl mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-black text-[var(--text)] font-heading mb-2">
        {title}
      </h3>

      <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
