import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getStreakState, STREAK_MILESTONES, StreakState } from '../utils/streak';

function flameColor(current: number): string {
  if (current >= 30) return '#FEF3C7'; // blazing (bright against gradient)
  if (current >= 7) return '#FFEDD5'; // warm
  if (current >= 1) return '#FFFFFF'; // spark
  return 'rgba(255,255,255,0.5)'; // unlit
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
    <View
      className="mx-4 mb-4 rounded-2xl overflow-hidden bg-surface"
      style={{
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 5,
      }}
    >
      <LinearGradient
        colors={['#F59E0B', '#EA580C', '#B91C1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <Ionicons name="flame" size={22} color={flameColor(streak.current)} />
            </View>
            <View>
              <Text className="text-white text-[13px] font-semibold opacity-90">
                Learning streak
              </Text>
              <Text className="font-black text-white text-2xl">
                {streak.current} {streak.current === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white text-[11px] opacity-80">Best</Text>
            <Text className="text-white text-base font-bold">{streak.longest}</Text>
          </View>
        </View>

        {streak.nextMilestone && (
          <View className="mt-4">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-white text-[11px] opacity-80">
                {streak.daysToNextMilestone} day{streak.daysToNextMilestone === 1 ? '' : 's'} to next
                badge
              </Text>
              <Text className="text-white text-[11px] opacity-80">{streak.nextMilestone}-day badge</Text>
            </View>
            <View
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              <View
                className="h-2 rounded-full bg-white"
                style={{ width: `${progressPct}%` }}
              />
            </View>
          </View>
        )}
      </LinearGradient>

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
