import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineCalendar, 
  HiOutlineBookOpen, 
  HiOutlinePencil, 
  HiOutlinePlus,
  HiOutlineSparkles 
} from 'react-icons/hi';
import { CalendarWidget } from '@/components/CalendarWidget/CalendarWidget';
import { JournalCard } from '@/components/JournalCard/JournalCard';
import { MoodCard } from '@/components/MoodCard/MoodCard';
import { Button } from '@/components/Buttons/Button';
import { useJournal } from '@/hooks/useJournal';
import { useMood } from '@/hooks/useMood';
import { formatDateFull, getTodayDateString } from '@/utils/dateUtils';
import { ROUTES } from '@/constants/routes';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { entries, getEntryByDate } = useJournal();
  const { getMoodByDate } = useMood();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const selectedEntry = getEntryByDate(selectedDate);
  const selectedMoodLog = getMoodByDate(selectedDate);

  const handleCreateForDate = () => {
    navigate(`${ROUTES.JOURNAL}?date=${selectedDate}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-[var(--border)] pb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text)] font-heading flex items-center gap-2">
            <HiOutlineCalendar className="text-[var(--cta)]" />
            <span>Mindfulness Calendar</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-bold">
            Track your emotional history day by day
          </p>
        </div>

        <Button variant="primary" size="md" icon={<HiOutlinePlus />} onClick={handleCreateForDate}>
          Add Entry for {selectedDate}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <CalendarWidget onSelectDate={(d) => setSelectedDate(d)} />
        </div>

        <div className="space-y-6">
          <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)] text-[var(--text)] text-xs font-black border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]">
                <HiOutlineSparkles /> Date Overview
              </span>
              <span className="text-xs font-black text-[var(--text)]">{selectedDate}</span>
            </div>

            <h3 className="text-xl font-black text-[var(--text)] font-heading">
              {formatDateFull(selectedDate)}
            </h3>

            <MoodCard moodLog={selectedMoodLog} />

            {selectedEntry ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-muted)] flex items-center gap-1">
                    <HiOutlineBookOpen /> Reflection Entry
                  </span>
                  <button
                    onClick={() => navigate(`/journal/${selectedEntry.id}`)}
                    className="text-xs font-black text-[var(--cta)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HiOutlinePencil /> Open Editor
                  </button>
                </div>
                <JournalCard entry={selectedEntry} />
              </div>
            ) : (
              <div className="clay-card p-6 rounded-2xl text-center space-y-3 bg-[var(--bg-cream)] border-2 border-dashed border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)] font-bold">
                  No written journal entry for this date yet.
                </p>
                <Button variant="secondary" size="sm" icon={<HiOutlinePlus />} onClick={handleCreateForDate}>
                  Write Reflection
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
