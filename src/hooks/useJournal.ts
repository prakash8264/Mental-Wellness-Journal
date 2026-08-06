import { useJournalContext } from '@/context/JournalContext';

export function useJournal() {
  const { entries, saveEntry, deleteEntry, getEntryById, getEntryByDate, settings, updateSettings } = useJournalContext();
  return { entries, saveEntry, deleteEntry, getEntryById, getEntryByDate, settings, updateSettings };
}
