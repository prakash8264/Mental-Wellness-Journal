import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  HiOutlineChartBar, 
  HiFire, 
  HiOutlineBookOpen, 
  HiOutlineHeart, 
  HiOutlineSparkles 
} from 'react-icons/hi';
import { useJournal } from '@/hooks/useJournal';
import { useMood } from '@/hooks/useMood';
import { calculateAverageMood, getMostCommonMood } from '@/utils/moodUtils';
import { getPastNDaysDates, formatDateShort } from '@/utils/dateUtils';
import { MOOD_OPTIONS } from '@/constants/moods';

export const Analytics: React.FC = () => {
  const { entries, streakDays } = useJournal();
  const { moodLogs } = useMood();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const daysCount = timeframe === 'weekly' ? 7 : 30;
  const dates = getPastNDaysDates(daysCount);

  const trendData = dates.map((dateStr) => {
    const log = moodLogs.find((m) => m.date === dateStr);
    const score = log ? MOOD_OPTIONS[log.mood]?.score || 5 : 5;
    const label = log ? MOOD_OPTIONS[log.mood]?.label || 'Neutral' : 'Unlogged';
    const emoji = log ? MOOD_OPTIONS[log.mood]?.emoji || '😐' : '😶';

    return {
      date: formatDateShort(dateStr),
      score,
      label,
      emoji,
    };
  });

  const moodCounts: Record<string, number> = {};
  moodLogs.forEach((l) => {
    moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
  });

  const pieColors: Record<string, string> = {
    happy: '#FEF08A',
    excited: '#F59E0B',
    calm: '#A7F3D0',
    neutral: '#94A3B8',
    sad: '#A5F3FC',
    depressed: '#818CF8',
    angry: '#FFB7B2',
    anxious: '#E9D5FF',
    stressed: '#FB923C',
  };

  const distributionData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: MOOD_OPTIONS[mood as keyof typeof MOOD_OPTIONS]?.label || mood,
    value: count,
    emoji: MOOD_OPTIONS[mood as keyof typeof MOOD_OPTIONS]?.emoji || '😐',
    color: pieColors[mood] || '#FEF08A',
  }));

  const avgMood = calculateAverageMood(moodLogs);
  const topMood = getMostCommonMood(moodLogs);

  const thisMonthStr = new Date().toISOString().substring(0, 7);
  const entriesThisMonth = entries.filter((e) => e.date.startsWith(thisMonthStr)).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-[var(--border)] pb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text)] font-heading flex items-center gap-2">
            <HiOutlineChartBar className="text-[var(--cta)]" />
            <span>Emotional Analytics & Insights</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-bold">
            Deep insights into your mindfulness journey and patterns
          </p>
        </div>

        <div className="clay-card p-1 rounded-2xl flex items-center gap-1 bg-[var(--bg-card)] border-2 border-[var(--border)] w-fit">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border-2 transition-all ${
              timeframe === 'weekly'
                ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Weekly (7 Days)
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border-2 transition-all ${
              timeframe === 'monthly'
                ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Monthly (30 Days)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="clay-card p-6 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-yellow)] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiFire className="text-[var(--cta)]" />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Current Streak</p>
          <p className="text-2xl font-black text-[var(--text)] font-heading">{streakDays} Days</p>
          <p className="text-[11px] font-bold text-[var(--text)]">Keep momentum going!</p>
        </div>

        <div className="clay-card p-6 rounded-3xl border-3 border-[var(--border)] bg-[var(--secondary)] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiOutlineBookOpen />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Entries This Month</p>
          <p className="text-2xl font-black text-[var(--text)] font-heading">{entriesThisMonth} Entries</p>
          <p className="text-[11px] font-bold text-[var(--text)]">Consistent reflections</p>
        </div>

        <div className="clay-card p-6 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-mint)] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiOutlineHeart />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Average Mood</p>
          <p className="text-2xl font-black text-[var(--text)] font-heading flex items-center gap-1.5">
            <span>{avgMood.emoji}</span>
            <span>{avgMood.label}</span>
          </p>
          <p className="text-[11px] font-bold text-[var(--text)]">Score: {avgMood.score}/10</p>
        </div>

        <div className="clay-card p-6 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-purple)] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiOutlineSparkles />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Most Common</p>
          <p className="text-2xl font-black text-[var(--text)] font-heading flex items-center gap-1.5">
            <span>{topMood.emoji}</span>
            <span>{topMood.label}</span>
          </p>
          <p className="text-[11px] font-bold text-[var(--text)]">Dominant state</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
          <div>
            <h3 className="text-xl font-black text-[var(--text)] font-heading">
              Mood Progression Trend
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              Score trajectory over the past {daysCount} days
            </p>
          </div>

          <div className="w-full h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FEF08A" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FEF08A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 'bold' }} />
                <YAxis domain={[1, 10]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 'bold' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="clay-card px-3 py-2 rounded-xl text-xs bg-white border-2 border-[var(--border)]">
                          <p className="font-black text-[var(--text)] flex items-center gap-1.5">
                            <span>{item.emoji}</span>
                            <span>{item.label}</span>
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5">Score: {item.score}/10</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#1E293B" strokeWidth={3} fillOpacity={1} fill="url(#analyticsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
          <div>
            <h3 className="text-xl font-black text-[var(--text)] font-heading">
              Mood Breakdown
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              Distribution of logged emotional states
            </p>
          </div>

          {distributionData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center text-[var(--text-muted)] text-xs font-bold">
              No mood data recorded yet.
            </div>
          ) : (
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#1E293B"
                    strokeWidth={2}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="clay-card px-3 py-1.5 rounded-xl text-xs bg-white border-2 border-[var(--border)] font-black">
                            <span>
                              {item.emoji} {item.name}: {item.value} log(s)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 justify-center">
            {distributionData.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-cream)] text-xs font-black text-[var(--text)] border-2 border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              >
                <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)]" style={{ backgroundColor: item.color }} />
                <span>{item.emoji} {item.name} ({item.value})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
