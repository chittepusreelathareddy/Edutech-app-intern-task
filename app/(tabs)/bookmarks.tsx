import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { useCourses } from '../../store/courseStore';
import CourseCard from '../../components/CourseCard';
import OfflineBanner from '../../components/OfflineBanner';
import { PREMIUM_COURSES } from '../../utils/coursesData';

export default function BookmarksScreen() {
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
          bookmarkedCourses.length > 0 ? (
            <View className="px-4 pt-3 pb-2 flex-row justify-between items-center">
              <Text className="text-lg font-extrabold text-foreground dark:text-white">
                Saved Courses
              </Text>
              <Text className="text-xs font-semibold text-muted dark:text-slate-400">
                {bookmarkedCourses.length} {bookmarkedCourses.length === 1 ? 'course' : 'courses'}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center p-12 bg-surface dark:bg-slate-900 rounded-2xl mx-4 my-6 border border-dashed border-slate-300 dark:border-slate-800">
            <Text className="text-5xl mb-3">🔖</Text>
            <Text className="text-lg font-extrabold text-foreground dark:text-white mb-2">
              No bookmarked courses
            </Text>
            <Text className="text-xs text-muted dark:text-slate-400 text-center leading-relaxed">
              Tap the bookmark icon on any course card in the catalog to save it to your personal learning collection.
            </Text>
          </View>
        }
        contentContainerClassName="pt-2 pb-8"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
