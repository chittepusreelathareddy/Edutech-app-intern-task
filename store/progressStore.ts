import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext } from 'react';

export interface CourseProgressEntry {
  percent: number;
  note: string;
  updatedAt: string;
}

export type CourseProgressMap = Record<string, CourseProgressEntry>;

const PROGRESS_KEY = 'course_progress';

export async function loadProgress(): Promise<CourseProgressMap> {
  const data = await AsyncStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
}

export async function saveProgress(progress: CourseProgressMap): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export interface ProgressContextType {
  progress: CourseProgressMap;
  setProgress: (courseId: string, percent: number) => Promise<void>;
  setNote: (courseId: string, note: string) => Promise<void>;
  getProgress: (courseId: string) => CourseProgressEntry;
}

export const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
