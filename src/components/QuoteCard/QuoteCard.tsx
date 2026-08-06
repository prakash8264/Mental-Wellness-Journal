import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuotes } from '@/hooks/useQuotes';
import { HiRefresh, HiHeart, HiOutlineHeart, HiOutlineSparkles } from 'react-icons/hi';

export const QuoteCard: React.FC = () => {
  const { quote, loading, refreshQuote, toggleFavouriteQuote, isFavourite } = useQuotes();

  return (
    <div className="clay-card p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-[var(--accent-purple)] text-[var(--text)] border-3 border-[var(--border)]">

      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border)] text-xs font-black text-[var(--text)] shadow-[2px_2px_0px_0px_var(--border)]">
          <HiOutlineSparkles className="text-base text-[var(--cta)]" />
          <span>Daily Mindfulness Quote</span>
        </div>

        <div className="flex items-center gap-2">
          {quote && (
            <button
              onClick={() => toggleFavouriteQuote(quote)}
              className="w-9 h-9 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--cta)] shadow-[2px_2px_0px_0px_var(--border)] hover:bg-[var(--bg-cream)] cursor-pointer transition-all"
              title={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
            >
              {isFavourite ? <HiHeart className="text-lg text-[var(--cta)]" /> : <HiOutlineHeart className="text-lg text-[var(--cta)]" />}
            </button>
          )}

          <button
            onClick={refreshQuote}
            disabled={loading}
            className="w-9 h-9 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--text)] shadow-[2px_2px_0px_0px_var(--border)] hover:bg-[var(--bg-cream)] cursor-pointer transition-all"
            title="Fetch new inspirational quote"
          >
            <HiRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="min-h-[90px] flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-3 py-2">
              <div className="h-4 bg-white/60 rounded-full w-5/6 animate-pulse" />
              <div className="h-4 bg-white/40 rounded-full w-2/3 animate-pulse" />
            </div>
          ) : (
            <motion.div
              key={quote?.quote}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base sm:text-lg font-bold text-[var(--text)] leading-relaxed font-heading italic">
                "{quote?.quote}"
              </p>
              <p className="text-xs font-black text-[var(--text)] mt-3 flex items-center gap-1.5">
                <span className="w-5 h-1 bg-[var(--cta)] rounded-full inline-block" />
                <span>{quote?.author || 'Unknown'}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
