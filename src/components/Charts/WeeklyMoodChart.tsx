import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { MoodLog } from '@/types';
import { getPastNDaysDates, formatDateShort } from '@/utils/dateUtils';
import { MOOD_OPTIONS } from '@/constants/moods';

import { useTheme } from '@/hooks/useTheme';

interface WeeklyMoodChartProps {
  moodLogs: MoodLog[];
}

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({ moodLogs }) => {
  const { isDark } = useTheme();
  const axisTickColor = isDark ? '#F8FAFC' : '#64748B';
  const chartStrokeColor = isDark ? '#10B981' : '#1E293B';
  const dates = getPastNDaysDates(7);

  const data = dates.map((dateStr) => {
    const dayLogs = moodLogs.filter((m) => m.date === dateStr);
    
    if (dayLogs.length === 0) {
      return {
        date: formatDateShort(dateStr),
        score: 5,
        label: 'Unlogged',
        emoji: '😶',
      };
    }

    const totalScore = dayLogs.reduce((acc, l) => acc + (MOOD_OPTIONS[l.mood]?.score || 5), 0);
    const avgScore = Math.round((totalScore / dayLogs.length) * 10) / 10;
    const latestLog = dayLogs[0];
    const option = MOOD_OPTIONS[latestLog.mood] || MOOD_OPTIONS.calm;

    return {
      date: formatDateShort(dateStr),
      score: avgScore,
      label: `${option.label} (${dayLogs.length} log${dayLogs.length > 1 ? 's' : ''})`,
      emoji: option.emoji,
    };
  });

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="weeklyMoodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A7F3D0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#A7F3D0" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
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
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Date: {item.date} | Score: {item.score}/10</p>
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
            fill="url(#weeklyMoodGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
