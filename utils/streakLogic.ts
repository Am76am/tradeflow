
import { format, isSameDay } from 'date-fns';

export const calculateStreaks = (sessions: { date: string }[]) => {
  if (sessions.length === 0) return { currentStreak: 0, bestStreak: 0, activeDays: [] };

  // Fix: Use new Date() instead of parseISO as it might not be exported from all date-fns versions
  const uniqueDays = Array.from(new Set(sessions.map(s => format(new Date(s.date), 'yyyy-MM-dd'))))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const activeDays = uniqueDays;
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Calculate Best Streak
  const sortedAsc = [...uniqueDays].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  for (let i = 0; i < sortedAsc.length; i++) {
    if (i > 0) {
      const prev = new Date(sortedAsc[i - 1]);
      const curr = new Date(sortedAsc[i]);
      // Fix: Use millisecond calculation for consistent day difference
      const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }

  // Calculate Current Streak
  const today = new Date();
  // Fix: Use native Date to get yesterday instead of subDays
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Fix: Use new Date() instead of parseISO
  let checkDate = uniqueDays[0] ? new Date(uniqueDays[0]) : null;

  if (checkDate && (isSameDay(checkDate, today) || isSameDay(checkDate, yesterday))) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      // Fix: Use new Date() instead of parseISO
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  return { currentStreak, bestStreak, activeDays };
};
