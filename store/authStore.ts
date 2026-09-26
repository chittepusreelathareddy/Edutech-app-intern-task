import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext } from 'react';
import { Platform } from 'react-native';

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: { url?: string };
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'auth_user';

export async function setSecureItem(key: string, value: string) {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (err) {
    console.warn(`[Storage] setItem fallback for ${key}:`, err);
    await AsyncStorage.setItem(key, value);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (err) {
    console.warn(`[Storage] getItem fallback for ${key}:`, err);
    return await AsyncStorage.getItem(key);
  }
}

export async function deleteSecureItem(key: string) {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (err) {
    console.warn(`[Storage] deleteItem fallback for ${key}:`, err);
    await AsyncStorage.removeItem(key);
  }
}

export async function saveAuth(token: string, user: User, refreshToken: string) {
  await setSecureItem(TOKEN_KEY, token);
  await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth() {
  await deleteSecureItem(TOKEN_KEY);
  await deleteSecureItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

export async function loadAuth(): Promise<{ token: string | null; user: User | null; refreshToken: string | null }> {
  const token = await getSecureItem(TOKEN_KEY);
  const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);
  const userStr = await AsyncStorage.getItem(USER_KEY);
  const user = userStr ? (JSON.parse(userStr) as User) : null;
  return { token, user, refreshToken };
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (val: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

