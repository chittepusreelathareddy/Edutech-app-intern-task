import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CourseProgressEntry,
  CourseProgressMap,
  ProgressContext,
  loadProgress,
  saveProgress,
} from '../store/progressStore';

const EMPTY_ENTRY: CourseProgressEntry = { percent: 0, note: '', updatedAt: '' };

export default function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<CourseProgressMap>({});

  useEffect(() => {
    loadProgress().then(setProgressState);
  }, []);

  const setProgress = useCallback(async (courseId: string, percent: number) => {
    setProgressState((prev) => {
      const existing = prev[courseId] ?? EMPTY_ENTRY;
      const next: CourseProgressMap = {
        ...prev,
        [courseId]: { ...existing, percent, updatedAt: new Date().toISOString() },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setNote = useCallback(async (courseId: string, note: string) => {
    setProgressState((prev) => {
      const existing = prev[courseId] ?? EMPTY_ENTRY;
      const next: CourseProgressMap = {
        ...prev,
        [courseId]: { ...existing, note, updatedAt: new Date().toISOString() },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getProgress = useCallback(
    (courseId: string) => progress[courseId] ?? EMPTY_ENTRY,
    [progress]
  );

  const value = useMemo(
    () => ({ progress, setProgress, setNote, getProgress }),
    [progress, setProgress, setNote, getProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
