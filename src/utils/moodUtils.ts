import { MoodLog, MoodType, MoodOption } from '@/types';
import { MOOD_OPTIONS, MOOD_LIST } from '@/constants/moods';

export function getMoodOption(mood: MoodType): MoodOption {
  return MOOD_OPTIONS[mood] || MOOD_OPTIONS.calm;
}

export function calculateAverageMood(logs: MoodLog[]): { score: number; label: string; emoji: string } {
  if (!logs || logs.length === 0) {
    return { score: 7, label: 'Calm', emoji: '😌' };
  }

  const totalScore = logs.reduce((acc, log) => {
    const option = MOOD_OPTIONS[log.mood];
    return acc + (option ? option.score : 5);
  }, 0);

  const avgScore = Math.round((totalScore / logs.length) * 10) / 10;

  // Map average score back to closest mood
  let closestMood: MoodOption = MOOD_OPTIONS.calm;
  let minDiff = 100;

  MOOD_LIST.forEach((m) => {
    const diff = Math.abs(m.score - avgScore);
    if (diff < minDiff) {
      minDiff = diff;
      closestMood = m;
    }
  });

  return {
    score: avgScore,
    label: closestMood.label,
    emoji: closestMood.emoji,
  };
}

export function calculateWordAndCharCount(text: string): { words: number; chars: number; readingTime: number } {
  // Strip HTML tags if content comes from rich text editor
  const stripped = text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const trimmed = stripped.trim();
  if (!trimmed) {
    return { words: 0, chars: 0, readingTime: 0 };
  }

  const chars = trimmed.length;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200)); // Average reading speed ~200 wpm

  return { words, chars, readingTime };
}
