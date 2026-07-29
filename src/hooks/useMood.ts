import { useJournalContext } from '@/context/JournalContext';

export function useMood() {
  const { moodLogs, todayMood, logMood, getMoodByDate } = useJournalContext();
  return { moodLogs, todayMood, logMood, getMoodByDate };
}
