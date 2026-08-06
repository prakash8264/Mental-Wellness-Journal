import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { MoodSelector } from '@/components/MoodSelector/MoodSelector';
import { useMood } from '@/hooks/useMood';
import { MoodType } from '@/types';
import { getMoodOption } from '@/utils/moodUtils';
import { getTodayDateString, getCurrentTimeString, formatDateFull } from '@/utils/dateUtils';
import { HiOutlineTrash, HiOutlineClock, HiOutlineCalendar, HiOutlinePlus } from 'react-icons/hi';

interface MoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const MoodLogModal: React.FC<MoodLogModalProps> = ({
  isOpen,
  onClose,
  initialDate,
}) => {
  const { logMood, deleteMoodLog, getMoodsByDate } = useMood();
  
  const [selectedDate, setSelectedDate] = useState(initialDate || getTodayDateString());
  const [selectedTime, setSelectedTime] = useState(getCurrentTimeString());
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate || getTodayDateString());
      setSelectedTime(getCurrentTimeString());
    }
  }, [isOpen, initialDate]);

  const dateMoods = getMoodsByDate(selectedDate);

  const handleLogMood = () => {
    const today = getTodayDateString();
    const nowTime = getCurrentTimeString();

    if (selectedDate > today) {
      alert('Cannot log mood for a future date.');
      return;
    }
    if (selectedDate === today && selectedTime > nowTime) {
      alert(`Cannot log mood for a future time. Current time is ${nowTime}.`);
      return;
    }

    logMood(selectedMood, note.trim() || undefined, selectedDate, selectedTime);
    setNote('');
    // Refresh current time for next log
    setSelectedTime(getCurrentTimeString());
  };

  const todayStr = getTodayDateString();
  const maxTime = selectedDate === todayStr ? getCurrentTimeString() : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mood Tracker & Check-in"
      subtitle="Log your moods throughout the day or check in past feelings"
      maxWidth="3xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left Column: Logging Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 bg-[var(--bg-cream)] p-5 rounded-2xl border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]">
          <div>
            <h3 className="text-sm font-black text-[var(--text)] font-heading mb-3 flex items-center gap-1.5">
              <span>Select Your Mood</span>
            </h3>
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
              size="sm"
              showLabels={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  max={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[var(--bg-card)] text-[var(--text)] px-3 py-2 rounded-xl text-xs font-bold border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Time Entry (24h)
              </label>
              <div className="relative">
                <input
                  type="time"
                  max={maxTime}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[var(--bg-card)] text-[var(--text)] px-3 py-2 rounded-xl text-xs font-bold border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Optional Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What triggered this feeling? (optional)..."
              className="w-full bg-[var(--bg-card)] text-[var(--text)] px-3 py-2 rounded-xl text-xs font-bold border-2 border-[var(--border)] placeholder-slate-400 focus:outline-none shadow-[2px_2px_0px_0px_var(--border)]"
            />
          </div>

          <button
            type="button"
            onClick={handleLogMood}
            className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            <HiOutlinePlus className="text-base" />
            <span>Log Mood for {selectedDate} at {selectedTime}</span>
          </button>
        </div>

        {/* Right Column: Entries for Selected Date (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-2 mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text)] font-heading flex items-center gap-1.5">
                <HiOutlineCalendar className="text-base text-[var(--cta)]" />
                <span>Entries ({dateMoods.length})</span>
              </h3>
              <span className="text-[11px] font-extrabold text-[var(--text-muted)]">
                {selectedDate}
              </span>
            </div>

            {dateMoods.length === 0 ? (
              <div className="bg-[var(--bg-card)] p-6 rounded-2xl border-2 border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)] font-bold space-y-1">
                <p>No mood logs recorded for this date yet.</p>
                <p className="text-[11px] text-slate-400 font-normal">Select a mood above and tap "Log Mood".</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {dateMoods.map((log) => {
                  const moodOpt = getMoodOption(log.mood);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-9 rounded-xl border-2 border-[var(--border)] flex items-center justify-center text-lg shadow-[1px_1px_0px_0px_var(--border)]"
                          style={{ backgroundColor: moodOpt.color }}
                        >
                          {moodOpt.emoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[var(--text)]">
                              {moodOpt.label}
                            </span>
                            {log.time && (
                              <span className="text-[10px] font-extrabold text-[var(--text-muted)] flex items-center gap-0.5">
                                <HiOutlineClock className="text-slate-400" />
                                {log.time}
                              </span>
                            )}
                          </div>
                          {log.note && (
                            <p className="text-[11px] text-[var(--text-muted)] font-medium line-clamp-1">
                              {log.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteMoodLog(log.id)}
                        className="p-1.5 rounded-lg bg-[var(--bg-cream)] text-slate-400 hover:text-[var(--cta)] hover:bg-rose-50 border border-transparent hover:border-[var(--border)] transition-all cursor-pointer"
                        title="Delete log"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t-2 border-[var(--border)] text-[11px] text-[var(--text-muted)] font-bold text-center">
            {formatDateFull(selectedDate)}
          </div>
        </div>
      </div>
    </Modal>
  );
};
