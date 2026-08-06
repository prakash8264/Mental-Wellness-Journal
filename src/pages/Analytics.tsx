import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlinePlus
} from 'react-icons/hi';
import { useMood } from '@/hooks/useMood';
import { CalendarWidget } from '@/components/CalendarWidget/CalendarWidget';
import { MoodSelector } from '@/components/MoodSelector/MoodSelector';
import { calculateAverageMood, getMoodOption } from '@/utils/moodUtils';
import { getPastNDaysDates, formatDateShort, formatDateFull, getTodayDateString, getCurrentTimeString } from '@/utils/dateUtils';
import { MOOD_OPTIONS } from '@/constants/moods';
import { MoodType } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export const Analytics: React.FC = () => {
  const { moodLogs, logMood, deleteMoodLog, getMoodsByDate } = useMood();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>(getCurrentTimeString());
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [note, setNote] = useState('');

  // 1. Calculate Averages
  const weeklyDates = getPastNDaysDates(7);
  const monthlyDates = getPastNDaysDates(30);

  const weeklyLogs = moodLogs.filter((m) => weeklyDates.includes(m.date));
  const monthlyLogs = moodLogs.filter((m) => monthlyDates.includes(m.date));

  const weeklyAvg = calculateAverageMood(weeklyLogs);
  const monthlyAvg = calculateAverageMood(monthlyLogs);

  // 2. Filter logs for selected date
  const selectedDateLogs = getMoodsByDate(selectedDate);

  // 3. Build Trend Chart Data for Selected Date (by time) or fall back to 7-day trend
  let chartData: { time: string; score: number; label: string; emoji: string }[] = [];
  let isDailyTrend = false;

  if (selectedDateLogs.length > 0) {
    isDailyTrend = true;
    // Sort selected date logs chronologically
    const sorted = [...selectedDateLogs].sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });

    chartData = sorted.map((log) => {
      const opt = getMoodOption(log.mood);
      return {
        time: log.time || '12:00',
        score: opt.score,
        label: opt.label,
        emoji: opt.emoji,
      };
    });
  } else {
    // Fallback: 7-day trend leading up to or around selected date
    chartData = weeklyDates.map((dateStr) => {
      const dayLogs = moodLogs.filter((m) => m.date === dateStr);
      if (dayLogs.length === 0) {
        return {
          time: formatDateShort(dateStr),
          score: 5,
          label: 'Unlogged',
          emoji: '😶',
        };
      }
      const totalScore = dayLogs.reduce((acc, l) => acc + (getMoodOption(l.mood).score || 5), 0);
      const avgScore = Math.round((totalScore / dayLogs.length) * 10) / 10;
      const latestLog = dayLogs[0];
      const opt = getMoodOption(latestLog.mood);
      return {
        time: formatDateShort(dateStr),
        score: avgScore,
        label: opt.label,
        emoji: opt.emoji,
      };
    });
  }


  const { isDark } = useTheme();
  const axisTickColor = isDark ? '#94A3B8' : '#1E293B';
  const chartStrokeColor = isDark ? '#10B981' : '#1E293B';

  const handleLogMoodFromAnalytics = () => {
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
    setSelectedTime(getCurrentTimeString());
  };

  const todayStr = getTodayDateString();
  const maxTime = selectedDate === todayStr ? getCurrentTimeString() : undefined;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-[var(--border)] pb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text)] font-heading flex items-center gap-2">
            <HiOutlineChartBar className="text-[var(--cta)]" />
            <span>Mood Insights & Analytics</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-bold">
            Tap any date on the calendar to view its mood intensity trend & daily logs
          </p>
        </div>
      </div>

      {/* Main Grid: Left Calendar & Quick Logger (5 Cols) / Right Insights & Trend Graph (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN (5 Cols): Calendar + Quick Mood Logger */}
        <div className="lg:col-span-5 space-y-6">

          {/* Calendar Widget (No Emojis, Clean Dot Indicators) */}
          <div className="clay-card p-4 sm:p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text)] font-heading flex items-center gap-1.5">
                <HiOutlineCalendar className="text-base text-[var(--cta)]" />
                <span>Select Date</span>
              </span>
              <span className="text-xs font-black text-[var(--cta)]">{selectedDate}</span>
            </div>

            <CalendarWidget onSelectDate={(d) => setSelectedDate(d)} compact />
          </div>

          {/* Quick Mood Log Panel for Selected Date */}
          <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-2">
              <h3 className="text-sm font-black text-[var(--text)] font-heading">
                Log Mood for {selectedDate}
              </h3>
            </div>

            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
              size="sm"
              showLabels={false}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  max={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[var(--bg-cream)] text-[var(--text)] px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--border)] focus:outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  Time (24h)
                </label>
                <input
                  type="time"
                  max={maxTime}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[var(--bg-cream)] text-[var(--text)] px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--border)] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Brief note (optional)..."
                className="w-full bg-[var(--bg-cream)] text-[var(--text)] px-3 py-2 rounded-xl text-xs font-bold border-2 border-[var(--border)] placeholder-slate-400 focus:outline-none shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
            </div>

            <button
              type="button"
              onClick={handleLogMoodFromAnalytics}
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <HiOutlinePlus className="text-base" />
              <span>Log Mood Entry</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols): Mood Insights & Selected Date Graph */}
        <div className="lg:col-span-7 space-y-6">

          {/* Top Row: Weekly Average & Monthly Average Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="clay-card p-5 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-mint)] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center text-3xl shadow-[2px_2px_0px_0px_var(--border)]">
                {weeklyAvg.emoji}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  Weekly Average (Last 7 Days)
                </p>
                <p className="text-xl font-black text-[var(--text)] font-heading mt-0.5">
                  {weeklyAvg.label}
                </p>
                <p className="text-xs font-bold text-[var(--text-muted)]">Score: {weeklyAvg.score}/10</p>
              </div>
            </div>

            <div className="clay-card p-5 rounded-3xl border-3 border-[var(--border)] bg-[var(--secondary)] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center text-3xl shadow-[2px_2px_0px_0px_var(--border)]">
                {monthlyAvg.emoji}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  Monthly Average (Last 30 Days)
                </p>
                <p className="text-xl font-black text-[var(--text)] font-heading mt-0.5">
                  {monthlyAvg.label}
                </p>
                <p className="text-xs font-bold text-[var(--text-muted)]">Score: {monthlyAvg.score}/10</p>
              </div>
            </div>
          </div>

          {/* Mood Trend Graph Card (Graphs Selected Date Time-Series) */}
          <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-black text-[var(--text)] font-heading flex items-center gap-2">
                  <HiOutlineSparkles className="text-[var(--cta)]" />
                  <span>Mood Trend — {formatDateFull(selectedDate)}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-bold">
                  {isDailyTrend
                    ? `Showing emotional curve across ${selectedDateLogs.length} time entry(ies)`
                    : `No logs on ${selectedDate}. Showing overall 7-day trend.`}
                </p>
              </div>
              <span className="text-xs font-black text-[var(--cta)] bg-[var(--bg-cream)] px-3 py-1 rounded-xl border-2 border-[var(--border)] w-fit">
                {selectedDate}
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="selectedDateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A7F3D0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#A7F3D0" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: axisTickColor, fontWeight: 'bold' }}
                  />
                  <YAxis
                    domain={[1, 10]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: axisTickColor, fontWeight: 'bold' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="clay-card px-3 py-2 rounded-xl text-xs bg-[var(--bg-card)] text-[var(--text)] border-2 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)] font-black">
                            <p className="flex items-center gap-1.5">
                              <span className="text-base">{item.emoji}</span>
                              <span>{item.label}</span>
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Time: {item.time} | Score: {item.score}/10</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={chartStrokeColor}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#selectedDateGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Logged Entries for Selected Date */}
          <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-3">
              <h3 className="text-sm font-black text-[var(--text)] font-heading uppercase tracking-wider flex items-center gap-2">
                <HiOutlineCalendar className="text-base text-[var(--cta)]" />
                <span>Entries for {selectedDate} ({selectedDateLogs.length})</span>
              </h3>
            </div>

            {selectedDateLogs.length === 0 ? (
              <div className="bg-[var(--bg-cream)] p-6 rounded-2xl border-2 border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)] font-bold">
                No mood logs for {selectedDate}. Use the panel on the left to add a mood entry for this date!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDateLogs.map((log) => {
                  const moodOpt = getMoodOption(log.mood);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center text-xl shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                          style={{ backgroundColor: moodOpt.color }}
                        >
                          {moodOpt.emoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[var(--text)]">{moodOpt.label}</span>
                            {log.time && (
                              <span className="text-[10px] font-extrabold text-[var(--text-muted)] flex items-center gap-0.5">
                                <HiOutlineClock className="text-slate-400" />
                                {log.time}
                              </span>
                            )}
                          </div>
                          {log.note && (
                            <p className="text-[11px] text-[var(--text-muted)] font-medium line-clamp-1 mt-0.5">
                              {log.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteMoodLog(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--cta)] hover:bg-rose-50 border border-transparent hover:border-[var(--border)] transition-all cursor-pointer"
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

        </div>
      </div>
    </div>
  );
};
