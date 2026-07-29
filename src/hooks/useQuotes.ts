import { useState, useEffect, useCallback } from 'react';
import { Quote } from '@/types';
import { quoteService } from '@/services/quoteService';
import { useJournalContext } from '@/context/JournalContext';

export function useQuotes() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { favouriteQuotes, toggleFavouriteQuote, isQuoteFavourite } = useJournalContext();

  const fetchNewQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quoteService.getRandomQuote();
      setQuote(data);
    } catch {
      setError('Unable to load quote from server. Enjoying curated offline wisdom.');
      setQuote(quoteService.getRandomFallbackQuote());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewQuote();
  }, [fetchNewQuote]);

  return {
    quote,
    loading,
    error,
    refreshQuote: fetchNewQuote,
    favouriteQuotes,
    toggleFavouriteQuote,
    isFavourite: quote ? isQuoteFavourite(quote.quote) : false,
  };
}
