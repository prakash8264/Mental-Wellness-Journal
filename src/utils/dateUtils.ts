export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateFull(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTimeString(dateStr: string): string {
  const today = getTodayDateString();
  if (dateStr === today) return 'Today';
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (dateStr === yesterdayStr) return 'Yesterday';

  return formatDateShort(dateStr);
}

export function calculateStreak(loggedDates: string[]): number {
  if (!loggedDates || loggedDates.length === 0) return 0;
  
  const sortedDates = Array.from(new Set(loggedDates)).sort().reverse();
  const todayStr = getTodayDateString();
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if active today or yesterday
  const hasToday = sortedDates.includes(todayStr);
  const hasYesterday = sortedDates.includes(yesterdayStr);

  if (!hasToday && !hasYesterday) return 0;

  let streak = 0;
  let checkDate = new Date(hasToday ? todayStr : yesterdayStr);

  while (true) {
    const year = checkDate.getFullYear();
    const month = String(checkDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkDate.getDate()).padStart(2, '0');
    const dateFormatted = `${year}-${month}-${day}`;

    if (sortedDates.includes(dateFormatted)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getPastNDaysDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}
