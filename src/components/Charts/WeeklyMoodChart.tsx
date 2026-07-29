import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { MoodLog } from '@/types';
import { getPastNDaysDates, formatDateShort } from '@/utils/dateUtils';
import { MOOD_OPTIONS } from '@/constants/moods';

interface WeeklyMoodChartProps {
  moodLogs: MoodLog[];
}

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({ moodLogs }) => {
  const dates = getPastNDaysDates(7);

  const data = dates.map((dateStr) => {
    const log = moodLogs.find((m) => m.date === dateStr);
    const score = log ? MOOD_OPTIONS[log.mood]?.score || 5 : 5;
    const label = log ? MOOD_OPTIONS[log.mood]?.label || 'Unlogged' : 'Unlogged';
    const emoji = log ? MOOD_OPTIONS[log.mood]?.emoji || '😶' : '😶';

    return {
      date: formatDateShort(dateStr),
      score,
      label,
      emoji,
    };
  });

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9381FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#9381FF" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 11, fill: '#94A3B8' }} 
          />
          <YAxis 
            domain={[1, 10]} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 11, fill: '#94A3B8' }} 
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="glass-card px-3 py-2 rounded-xl text-xs shadow-lg border border-purple-200 dark:border-purple-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Score: {item.score}/10</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#9381FF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#moodGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
