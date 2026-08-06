import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineBookOpen, 
  HiOutlineSparkles, 
  HiFire, 
  HiOutlineHeart, 
  HiOutlinePencilAlt,
  HiOutlineArrowRight,
  HiOutlineAcademicCap
} from 'react-icons/hi';
import { useJournal } from '@/hooks/useJournal';
import { useMood } from '@/hooks/useMood';
import { MoodCard } from '@/components/MoodCard/MoodCard';
import { QuoteCard } from '@/components/QuoteCard/QuoteCard';
import { JournalCard } from '@/components/JournalCard/JournalCard';
import { CalendarWidget } from '@/components/CalendarWidget/CalendarWidget';
import { WeeklyMoodChart } from '@/components/Charts/WeeklyMoodChart';
import { MoodLogModal } from '@/components/MoodLogger/MoodLogModal';
import { Button } from '@/components/Buttons/Button';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { calculateAverageMood } from '@/utils/moodUtils';
import { MoodType } from '@/types';
import { ROUTES } from '@/constants/routes';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { entries, streakDays, deleteEntry } = useJournal();
  const { moodLogs, todayMood, logMood } = useMood();
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: '🌅' };
    if (hour < 17) return { text: 'Good afternoon', icon: '☀️' };
    return { text: 'Good evening', icon: '🌙' };
  };

  const greeting = getGreeting();
  const avgMood = calculateAverageMood(moodLogs);
  const totalWords = entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
  const recentEntries = entries.slice(0, 3);

  const handleSelectMood = (mood: MoodType) => {
    logMood(mood);
    setIsMoodModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="pt-6 pb-12 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-mint)] border-3 border-[var(--border)] text-sm font-bold shadow-[2px_2px_0px_0px_var(--border)] mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--cta)]" />
                <span>{greeting.icon} {greeting.text}: Mindful Reflection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text)] mb-6 leading-tight font-heading">
                Reflect Deeply,<br />
                <span className="text-[var(--cta)]">Nurture Serenity</span>,<br />
                Every Day!
              </h1>

              <p className="text-lg font-medium text-[var(--text-muted)] mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Join thousands cultivating peace. Track daily moods, express thoughts without judgment, and view emotional trends.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button
                  onClick={() => navigate(ROUTES.JOURNAL)}
                  className="btn-primary text-base py-3.5 px-6"
                >
                  <span>Write Reflection Free</span>
                  <HiOutlineArrowRight className="text-lg" />
                </button>
                <button
                  onClick={() => navigate(ROUTES.ANALYTICS)}
                  className="btn-secondary text-base py-3.5 px-6"
                >
                  Explore Mood Analytics
                </button>
              </div>

              <div className="flex gap-6 sm:gap-10 justify-center lg:justify-start pt-2 border-t-3 border-[var(--border)]">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-black text-[var(--text)] font-heading">{streakDays}d</div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Streak</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-black text-[var(--text)] font-heading">{entries.length}</div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Reflections</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-black text-[var(--text)] font-heading">100%</div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Private & Offline</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="clay-card p-6 bg-[var(--bg-card)] border-3 border-[var(--border)] relative z-10 shadow-[6px_6px_0px_0px_var(--border)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] border-3 border-[var(--border)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--border)]">
                    <HiOutlineSparkles className="w-6 h-6 text-[var(--text)]" />
                  </div>
                  <div>
                    <div className="font-black text-lg text-[var(--text)] font-heading">Daily Check-in Progress</div>
                    <div className="text-xs font-bold text-[var(--text-muted)]">3 reflections logged this week</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-[var(--text-muted)]">Mindful Balance</span>
                    <span className="font-black text-[var(--cta)]">75%</span>
                  </div>
                  <div className="h-4 bg-[var(--bg-cream)] rounded-full border-3 border-[var(--border)] overflow-hidden">
                    <div className="h-full w-[75%] bg-[var(--cta)] rounded-full border-r-2 border-[var(--border)]"></div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsMoodModalOpen(true)}
                  className="w-full btn-primary text-sm py-3"
                >
                  Check In Today's Mood
                </button>
              </div>

              <div className="absolute -top-5 -right-5 z-20 w-16 h-16 rounded-2xl bg-[var(--accent-pink)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-3xl">
                🎯
              </div>
              <div className="absolute -bottom-5 -left-5 z-20 w-16 h-16 rounded-2xl bg-[var(--accent-purple)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-3xl">
                📚
              </div>
              <div className="absolute top-1/2 -right-6 z-20 w-14 h-14 rounded-full bg-[var(--accent-yellow)] border-3 border-[var(--border)] shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-2xl">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodCard moodLog={todayMood} onOpenSelector={() => setIsMoodModalOpen(true)} />
        <QuoteCard />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="clay-card p-5 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-yellow)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiFire className="text-[var(--cta)]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Mindful Streak</p>
            <p className="text-2xl font-black text-[var(--text)] font-heading mt-0.5">{streakDays} Days</p>
          </div>
        </div>

        <div className="clay-card p-5 rounded-3xl border-3 border-[var(--border)] bg-[var(--secondary)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiOutlineBookOpen />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Total Entries</p>
            <p className="text-2xl font-black text-[var(--text)] font-heading mt-0.5">{entries.length}</p>
          </div>
        </div>

        <div className="clay-card p-5 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-mint)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiOutlineHeart />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Avg Mood</p>
            <p className="text-2xl font-black text-[var(--text)] font-heading mt-0.5 flex items-center gap-1.5">
              <span>{avgMood.emoji}</span>
              <span className="text-base font-black">{avgMood.label}</span>
            </p>
          </div>
        </div>

        <div className="clay-card p-5 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-purple)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_var(--border)]">
            <HiOutlineAcademicCap />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Words Written</p>
            <p className="text-2xl font-black text-[var(--text)] font-heading mt-0.5">{totalWords}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--text)] font-heading flex items-center gap-2">
                <HiOutlineSparkles className="text-[var(--cta)]" />
                <span>Weekly Mood Rhythm</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-bold">
                7-day emotional flow visualization
              </p>
            </div>
            <button
              onClick={() => navigate(ROUTES.ANALYTICS)}
              className="text-xs font-black text-[var(--cta)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Analytics <HiOutlineArrowRight />
            </button>
          </div>
          <WeeklyMoodChart moodLogs={moodLogs} />
        </div>

        <div>
          <CalendarWidget compact readOnly />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--text)] font-heading">
              Recent Reflections
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              Your latest journal entries and thoughts
            </p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={() => navigate(ROUTES.JOURNAL)}
              className="text-xs font-black text-[var(--cta)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all ({entries.length}) <HiOutlineArrowRight />
            </button>
          )}
        </div>

        {recentEntries.length === 0 ? (
          <EmptyState
            icon="📖"
            title="Your journal is empty"
            description="Start by writing down your first thought or reflection today. It only takes a minute!"
            actionLabel="Write First Entry"
            onAction={() => navigate(ROUTES.JOURNAL)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEntries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))}
          </div>
        )}
      </div>

      <MoodLogModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
      />
    </div>
  );
};
