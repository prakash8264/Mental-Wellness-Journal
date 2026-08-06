import { useJournalContext } from '@/context/JournalContext';

export function useMood() {
  const { moodLogs, todayMood, logMood, deleteMoodLog, getMoodByDate, getMoodsByDate } = useJournalContext();
  return { moodLogs, todayMood, logMood, deleteMoodLog, getMoodByDate, getMoodsByDate };
}
