import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOnline ? 0 : 1, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [isOnline, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: (1 - progress.value) * -24,
      },
    ],
  }));

  if (isOnline) return null;

  return (
    <Animated.View style={animatedStyle}>
      <View className="bg-error py-2.5 items-center flex-row justify-center gap-1.5 px-4">
        <Ionicons name="cloud-offline-outline" size={15} color="#FFFFFF" />
        <Text className="text-white text-[13px] font-semibold">No internet connection</Text>
      </View>
    </Animated.View>
  );
}
