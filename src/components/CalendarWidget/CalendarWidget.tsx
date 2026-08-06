import React from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '@/hooks/useJournal';
import { useMood } from '@/hooks/useMood';
import { getMoodOption } from '@/utils/moodUtils';
import { ROUTES } from '@/constants/routes';

interface CalendarWidgetProps {
  onSelectDate?: (dateStr: string) => void;
  compact?: boolean;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ onSelectDate, compact = false }) => {
  const navigate = useNavigate();
  const { entries } = useJournal();
  const { moodLogs } = useMood();

  const handleDateClick = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (onSelectDate) {
      onSelectDate(dateStr);
    } else {
      const entry = entries.find((e) => e.date === dateStr);
      if (entry) {
        navigate(`/journal/${entry.id}`);
      } else {
        navigate(`${ROUTES.JOURNAL}?date=${dateStr}`);
      }
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const hasMoods = moodLogs.some((m) => m.date === dateStr);
    const hasJournal = entries.some((e) => e.date === dateStr);

    if (!hasMoods && !hasJournal) return null;

    return (
      <div className="flex items-center justify-center gap-1 mt-1">
        {hasMoods && (
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] border border-[var(--border)]" title="Mood logged" />
        )}
        {hasJournal && (
          <span className="w-2 h-2 rounded-full bg-[var(--cta)] border border-[var(--border)]" title="Journal entry logged" />
        )}
      </div>
    );
  };

  return (
    <div className={`clay-card rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] ${compact ? 'p-4' : 'p-6 sm:p-8'}`}>
      <Calendar
        onClickDay={handleDateClick}
        tileContent={tileContent}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
};
