import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_STREAK_KEY = 'streak_current';
const LONGEST_STREAK_KEY = 'streak_longest';
const LAST_ACTIVE_DATE_KEY = 'streak_last_active_date';

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const;

export interface StreakState {
  current: number;
  longest: number;
  /** Days until the next milestone; null once past the highest one. */
  daysToNextMilestone: number | null;
  nextMilestone: number | null;
}

function toDateKey(date: Date): string {
  // Local calendar day, not UTC — so "today" matches the user's clock.
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function daysBetween(aKey: string, bKey: string): number {
  const [ay, am, ad] = aKey.split('-').map(Number);
  const [by, bm, bd] = bKey.split('-').map(Number);
  const a = new Date(ay, am - 1, ad);
  const b = new Date(by, bm - 1, bd);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function withNextMilestone(current: number, longest: number): StreakState {
  const next = STREAK_MILESTONES.find((m) => m > current) ?? null;
  return {
    current,
    longest,
    nextMilestone: next,
    daysToNextMilestone: next ? next - current : null,
  };
}

/**
 * Call once per app foreground/open. Returns the updated streak plus
 * whether this call just crossed a new milestone (for a celebratory
 * notification), so the caller doesn't need its own date math.
 */
export async function recordDailyActivity(): Promise<{
  state: StreakState;
  crossedMilestone: number | null;
}> {
  const todayKey = toDateKey(new Date());
  const [lastActiveKey, currentStr, longestStr] = await Promise.all([
    AsyncStorage.getItem(LAST_ACTIVE_DATE_KEY),
    AsyncStorage.getItem(CURRENT_STREAK_KEY),
    AsyncStorage.getItem(LONGEST_STREAK_KEY),
  ]);

  let current = currentStr ? parseInt(currentStr, 10) : 0;
  let longest = longestStr ? parseInt(longestStr, 10) : 0;
  let crossedMilestone: number | null = null;

  if (lastActiveKey === todayKey) {
    // Already recorded today — just return current state, no double count.
    return { state: withNextMilestone(current, longest), crossedMilestone: null };
  }

  const gap = lastActiveKey ? daysBetween(lastActiveKey, todayKey) : null;
  const previous = current;

  if (gap === 1) {
    current = current + 1;
  } else {
    // First ever open, or a missed day — streak restarts at 1.
    current = 1;
  }

  if (current > longest) longest = current;

  if (STREAK_MILESTONES.includes(current as (typeof STREAK_MILESTONES)[number]) && current !== previous) {
    crossedMilestone = current;
  }

  await Promise.all([
    AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, todayKey),
    AsyncStorage.setItem(CURRENT_STREAK_KEY, String(current)),
    AsyncStorage.setItem(LONGEST_STREAK_KEY, String(longest)),
  ]);

  return { state: withNextMilestone(current, longest), crossedMilestone };
}

export async function getStreakState(): Promise<StreakState> {
  const [currentStr, longestStr] = await Promise.all([
    AsyncStorage.getItem(CURRENT_STREAK_KEY),
    AsyncStorage.getItem(LONGEST_STREAK_KEY),
  ]);
  return withNextMilestone(
    currentStr ? parseInt(currentStr, 10) : 0,
    longestStr ? parseInt(longestStr, 10) : 0
  );
}
