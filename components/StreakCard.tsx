import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getStreakState, STREAK_MILESTONES, StreakState } from '../utils/streak';

function flameColor(current: number): string {
  if (current >= 30) return '#EF4444'; // blazing
  if (current >= 7) return '#F59E0B'; // warm
  if (current >= 1) return '#FB923C'; // spark
  return Colors.textLight; // unlit
}

export default function StreakCard() {
  const [streak, setStreak] = useState<StreakState | null>(null);

  useEffect(() => {
    getStreakState().then(setStreak);
  }, []);

  if (!streak) return null;

  const earnedMilestones = STREAK_MILESTONES.filter((m) => streak.longest >= m);
  const progressPct = streak.nextMilestone
    ? Math.min(100, Math.round((streak.current / streak.nextMilestone) * 100))
    : 100;

  return (
    <View className="mx-4 mb-4 rounded-2xl border border-border overflow-hidden bg-surface">
      <View className="p-4" style={{ backgroundColor: '#1E1B4B' }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <Ionicons name="flame" size={22} color={flameColor(streak.current)} />
            </View>
            <View>
              <Text className="text-white text-[13px] font-semibold opacity-80">
                Learning streak
              </Text>
              <Text className="text-white text-2xl font-extrabold">
                {streak.current} {streak.current === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white text-[11px] opacity-70">Best</Text>
            <Text className="text-white text-base font-bold">{streak.longest}</Text>
          </View>
        </View>

        {streak.nextMilestone && (
          <View className="mt-4">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-white text-[11px] opacity-70">
                {streak.daysToNextMilestone} day{streak.daysToNextMilestone === 1 ? '' : 's'} to next
                badge
              </Text>
              <Text className="text-white text-[11px] opacity-70">{streak.nextMilestone}-day badge</Text>
            </View>
            <View
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <View
                className="h-2 rounded-full"
                style={{ width: `${progressPct}%`, backgroundColor: Colors.warning }}
              />
            </View>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2 p-3.5">
        {STREAK_MILESTONES.map((m) => {
          const earned = earnedMilestones.includes(m);
          return (
            <View
              key={m}
              className={`flex-row items-center gap-1 rounded-full px-2.5 py-1.5 border ${
                earned ? 'bg-primary-light border-primary' : 'bg-background border-border'
              }`}
            >
              <Ionicons
                name={earned ? 'trophy' : 'trophy-outline'}
                size={13}
                color={earned ? Colors.primary : Colors.textLight}
              />
              <Text
                className={`text-[11px] font-bold ${earned ? 'text-primary' : 'text-muted'}`}
              >
                {m}d
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
