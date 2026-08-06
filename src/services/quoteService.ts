import { Quote } from '@/types';
import { FALLBACK_QUOTES } from '@/constants/quotes';

export const quoteService = {
  async getRandomQuote(): Promise<Quote> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      // Fetch via raw CORS proxy with 2-second timeout signal
      const response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random', {
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].q) {
        return {
          id: `zen-${Date.now()}`,
          quote: data[0].q,
          author: data[0].a || 'Unknown',
          category: 'Mindfulness',
        };
      }
      
      return this.getRandomFallbackQuote();
    } catch {
      clearTimeout(timeoutId);
      // Fallback to curated offline quotes if network errors or times out (>2s)
      return this.getRandomFallbackQuote();
    }
  },

  getRandomFallbackQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  },
};
