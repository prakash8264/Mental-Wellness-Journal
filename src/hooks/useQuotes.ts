import { useJournalContext } from '@/context/JournalContext';

export function useQuotes() {
  const {
    dailyQuote,
    quoteLoading,
    fetchDailyQuote,
    favouriteQuotes,
    toggleFavouriteQuote,
    isQuoteFavourite,
  } = useJournalContext();

  return {
    quote: dailyQuote,
    loading: quoteLoading,
    error: null,
    refreshQuote: () => fetchDailyQuote(true),
    favouriteQuotes,
    toggleFavouriteQuote,
    isFavourite: dailyQuote ? isQuoteFavourite(dailyQuote.quote) : false,
  };
}
