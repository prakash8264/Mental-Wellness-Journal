import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineCalendar, 
  HiOutlineBookOpen, 
  HiOutlinePencil, 
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineTrash
} from 'react-icons/hi';
import { CalendarWidget } from '@/components/CalendarWidget/CalendarWidget';
import { JournalCard } from '@/components/JournalCard/JournalCard';
import { MoodCard } from '@/components/MoodCard/MoodCard';
import { MoodLogModal } from '@/components/MoodLogger/MoodLogModal';
import { Button } from '@/components/Buttons/Button';
import { useJournal } from '@/hooks/useJournal';
import { useMood } from '@/hooks/useMood';
import { getMoodOption } from '@/utils/moodUtils';
import { formatDateFull, getTodayDateString } from '@/utils/dateUtils';
import { ROUTES } from '@/constants/routes';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { entries, getEntryByDate } = useJournal();
  const { getMoodsByDate, deleteMoodLog } = useMood();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  const selectedEntry = getEntryByDate(selectedDate);
  const selectedDateMoods = getMoodsByDate(selectedDate);

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

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" icon={<HiOutlinePlus />} onClick={() => setIsMoodModalOpen(true)}>
            Log Mood
          </Button>
          <Button variant="primary" size="md" icon={<HiOutlinePlus />} onClick={handleCreateForDate}>
            Write Reflection
          </Button>
        </div>
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

            {/* Logged Moods Section for Selected Date */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                  Mood Logs ({selectedDateMoods.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsMoodModalOpen(true)}
                  className="text-xs font-extrabold text-[var(--cta)] hover:underline cursor-pointer"
                >
                  + Add Mood
                </button>
              </div>

              {selectedDateMoods.length === 0 ? (
                <div className="clay-card p-4 rounded-2xl text-center space-y-1 bg-[var(--bg-cream)] border-2 border-dashed border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] font-bold">No mood entries for this date.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateMoods.map((log) => {
                    const moodOpt = getMoodOption(log.mood);
                    return (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-8 h-8 rounded-xl border-2 border-[var(--border)] flex items-center justify-center text-base shadow-[1px_1px_0px_0px_var(--border)]"
                            style={{ backgroundColor: moodOpt.color }}
                          >
                            {moodOpt.emoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[var(--text)]">{moodOpt.label}</span>
                              {log.time && (
                                <span className="text-[10px] font-extrabold text-[var(--text-muted)]">
                                  {log.time}
                                </span>
                              )}
                            </div>
                            {log.note && (
                              <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{log.note}</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteMoodLog(log.id)}
                          className="text-slate-400 hover:text-[var(--cta)] p-1 transition-colors cursor-pointer"
                          title="Delete mood log"
                        >
                          <HiOutlineTrash className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

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

      <MoodLogModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        initialDate={selectedDate}
      />
    </div>
  );
};
