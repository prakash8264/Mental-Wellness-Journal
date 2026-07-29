import { useJournalContext } from '@/context/JournalContext';

export function useJournal() {
  const { entries, saveEntry, deleteEntry, getEntryById, getEntryByDate, streakDays } = useJournalContext();
  return { entries, saveEntry, deleteEntry, getEntryById, getEntryByDate, streakDays };
}
