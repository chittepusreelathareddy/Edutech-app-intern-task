import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../store/authStore';
import { useCourses } from '../../store/courseStore';
import { logoutUser } from '../../utils/api';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import StreakCard from '../../components/StreakCard';
import { Colors } from '../../constants/colors';
import { ThemePreference, loadThemePreference, saveThemePreference } from '../../utils/theme';

const THEME_OPTIONS: { key: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

const AVATAR_KEY = 'profile_avatar_uri';
const DEFAULT_AVATAR = 'https://picsum.photos/200/300';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { bookmarks, enrolled } = useCourses();
  const [avatarUrl, setAvatarUrl] = React.useState(DEFAULT_AVATAR);
  const { setColorScheme } = useColorScheme();
  const [themePref, setThemePref] = React.useState<ThemePreference>('system');

  // BUGFIX (documented limitation): picked avatar used to live only in
  // component state, so it silently reset to the default image the next
  // time the app opened. It's now persisted per-user in AsyncStorage.
  React.useEffect(() => {
    AsyncStorage.getItem(AVATAR_KEY).then((saved) => {
      if (saved) setAvatarUrl(saved);
    });
  }, []);

  React.useEffect(() => {
    loadThemePreference().then(setThemePref);
  }, []);

  const handleThemeChange = async (pref: ThemePreference) => {
    setThemePref(pref);
    setColorScheme(pref);
    await saveThemePreference(pref);
  };

  const performLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore API errors during logout
    }
    await logout();
    router.replace('/(auth)/login');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to logout?')) {
        performLogout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]);
    }
  };

  //user avatar image is page not found so added image intensionally


  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Allow gallery access'
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setAvatarUrl(imageUri);
      await AsyncStorage.setItem(AVATAR_KEY, imageUri);
      // Note: still simulated locally (no backend to upload to), but it
      // now survives app restarts instead of silently reverting.
    }
  };

  const stats = [
    { label: 'Enrolled', value: enrolled.length, icon: 'school-outline' as const },
    { label: 'Bookmarked', value: bookmarks.length, icon: 'bookmark-outline' as const },
  ];

  const accountRows = [
    { label: 'Username', value: user?.username, icon: 'person-outline' as const },
    { label: 'Email', value: user?.email, icon: 'mail-outline' as const },
    { label: 'Role', value: user?.role ?? 'Student', icon: 'ribbon-outline' as const },
  ];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-10">
      <View className="bg-slate-950">
        <LinearGradient
          colors={['#312E81', '#1E1B4B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center pt-10 pb-8 px-6"
        >
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.85}>
            <View
              className="p-1 rounded-full mb-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-[88px] h-[88px] rounded-full"
                  contentFit="cover"
                />
              ) : (
                <View className="w-[88px] h-[88px] rounded-full bg-primary justify-center items-center">
                  <Text className="text-white text-4xl font-bold">
                    {(user?.username ?? 'U')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary items-center justify-center border-2 border-slate-950">
                <Ionicons name="camera" size={13} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="font-black text-xl text-white mb-1">
            {user?.username ?? 'User'}
          </Text>
          <Text className="text-[13px] text-slate-300">{user?.email ?? ''}</Text>
        </LinearGradient>
      </View>

      <View className="flex-row mx-4 -mt-6 gap-3">
        {stats.map((s) => (
          <View
            key={s.label}
            className="flex-1 bg-surface rounded-2xl p-4 items-center border border-border"
            style={{
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View className="w-9 h-9 rounded-full bg-primary-light items-center justify-center mb-1.5">
              <Ionicons name={s.icon} size={17} color={Colors.primary} />
            </View>
            <Text className="text-[22px] font-black text-foreground">{s.value}</Text>
            <Text className="text-xs text-muted mt-0.5">{s.label}</Text>
          </View>
        ))}
      </View>

      <View className="mt-4">
        <StreakCard />
      </View>

      <View className="bg-surface mx-4 rounded-2xl p-4 border border-border mb-4">
        <Text className="text-sm font-bold text-muted mb-2 uppercase tracking-wide">
          Account
        </Text>
        {accountRows.map((row, idx) => (
          <View
            key={row.label}
            className={`flex-row items-center justify-between py-3 ${
              idx < accountRows.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <View className="flex-row items-center gap-2.5">
              <Ionicons name={row.icon} size={17} color={Colors.textSecondary} />
              <Text className="text-sm text-muted">{row.label}</Text>
            </View>
            <Text className="text-sm text-foreground font-semibold">{row.value}</Text>
          </View>
        ))}
      </View>

      <View className="bg-surface mx-4 rounded-2xl p-4 border border-border mb-4">
        <Text className="text-sm font-bold text-muted mb-3 uppercase tracking-wide">
          Preferences
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Ionicons name="contrast-outline" size={17} color={Colors.textSecondary} />
            <Text className="text-sm text-muted">Theme</Text>
          </View>
          <View className="flex-row bg-background rounded-full p-1 gap-1 border border-border">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = themePref === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => handleThemeChange(opt.key)}
                  activeOpacity={0.85}
                  className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ${
                    isSelected ? 'bg-primary' : ''
                  }`}
                >
                  <Ionicons
                    name={opt.icon}
                    size={14}
                    color={isSelected ? '#fff' : Colors.textSecondary}
                  />
                  <Text
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-white' : 'text-muted'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="mx-4 bg-surface border border-error/30 rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={18} color={Colors.error} />
        <Text className="text-error text-base font-bold">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
