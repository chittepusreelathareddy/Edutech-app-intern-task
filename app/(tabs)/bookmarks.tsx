import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '../../store/courseStore';
import CourseCard from '../../components/CourseCard';
import OfflineBanner from '../../components/OfflineBanner';
import { PREMIUM_COURSES } from '../../utils/coursesData';

export default function BookmarksScreen() {
  const router = useRouter();
  const { courses, bookmarks } = useCourses();

  const allAvailableCourses = courses.length > 0 ? courses : (PREMIUM_COURSES as any);
  const bookmarkedCourses = allAvailableCourses.filter((c: any) =>
    bookmarks.includes(String(c.id))
  );

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <OfflineBanner />
      <FlatList
        data={bookmarkedCourses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CourseCard course={item} />}
        ListHeaderComponent={
          <View className="px-4 pt-3 pb-2">
            <Text className="font-black text-[22px] text-foreground dark:text-white">
              Saved Courses
            </Text>
            {bookmarkedCourses.length > 0 && (
              <Text className="text-xs font-semibold text-muted dark:text-slate-400 mt-1">
                {bookmarkedCourses.length} {bookmarkedCourses.length === 1 ? 'course' : 'courses'} saved
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center p-10 bg-surface dark:bg-slate-900 rounded-3xl mx-4 my-6 border border-dashed border-slate-300 dark:border-slate-800">
            <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-4">
              <Ionicons name="bookmark-outline" size={36} color="#4F46E5" />
            </View>
            <Text className="font-heading text-lg text-foreground dark:text-white mb-2 text-center">
              No bookmarked courses
            </Text>
            <Text className="text-[13px] text-muted dark:text-slate-400 text-center leading-relaxed mb-5">
              Tap the bookmark icon on any course card to save it to your personal learning
              collection.
            </Text>
            <TouchableOpacity
              className="bg-primary rounded-2xl px-6 py-3 flex-row items-center gap-1.5 shadow-md"
              onPress={() => router.push('/(tabs)')}
            >
              <Ionicons name="compass-outline" size={17} color="#fff" />
              <Text className="text-white font-bold text-sm">Browse Courses</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerClassName="pt-2 pb-8"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
