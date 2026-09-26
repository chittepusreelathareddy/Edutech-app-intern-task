import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme_preference';

export async function loadThemePreference(): Promise<ThemePreference> {
  const data = await AsyncStorage.getItem(THEME_KEY);
  return data === 'light' || data === 'dark' || data === 'system' ? data : 'system';
}

export async function saveThemePreference(value: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, value);
}
