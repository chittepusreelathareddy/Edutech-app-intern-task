import 'react-native-gesture-handler';
import '../global.css';
import { useCallback, useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Image } from 'expo-image';
import { cssInterop, StyleSheet } from 'react-native-css-interop';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import AuthProvider from '../providers/AuthProvider';
import CourseProvider from '../providers/CourseProvider';
import { useAuth } from '../store/authStore';
import {
  requestNotificationPermission,
  scheduleReminderNotification,
  sendStreakMilestoneNotification,
} from '../utils/notifications';
import { recordDailyActivity } from '../utils/streak';
import { Colors } from '../constants/colors';

StyleSheet.setFlag?.('darkMode', 'class');
cssInterop(Image, { className: 'style' });

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { isLoading, token } = useAuth();

  useEffect(() => {
    requestNotificationPermission();
    scheduleReminderNotification();
    recordDailyActivity().then(({ crossedMilestone }) => {
      if (crossedMilestone) sendStreakMilestoneNotification(crossedMilestone);
    });
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" redirect={!!token} />
      <Stack.Screen name="(tabs)" redirect={!token} />
      <Stack.Screen
        name="course/[id]"
        redirect={!token}
        options={{ headerShown: true, title: 'Course Details', headerTintColor: Colors.primary }}
      />
      <Stack.Screen
        name="webview"
        redirect={!token}
        options={{ headerShown: true, title: 'Course Content', headerTintColor: Colors.primary }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CourseProvider>
        <RootNavigator />
      </CourseProvider>
    </AuthProvider>
  );
}
