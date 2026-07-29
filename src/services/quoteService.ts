import { Quote } from '@/types';
import { FALLBACK_QUOTES } from '@/constants/quotes';

export const quoteService = {
  async getRandomQuote(): Promise<Quote> {
    try {
      // Fetch via raw CORS proxy or fallback if network unavailable
      const response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random', {
        cache: 'no-cache',
      });
      
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
      // Graceful fallback to offline curated quotes
      return this.getRandomFallbackQuote();
    }
  },

  getRandomFallbackQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  },
};
