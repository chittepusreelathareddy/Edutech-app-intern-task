import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { Course, useCourses } from '../store/courseStore';
import { getStableThumbnail } from '../utils/thumbnail';

interface Props {
  course: Course;
}

function CourseCard({ course }: Props) {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useCourses();
  const isBookmarked = bookmarks.includes(String(course.id));
  const thumbnail = useMemo(() => getStableThumbnail(course), [course.id, course.thumbnail]);

  return (
    <TouchableOpacity
      className="bg-surface rounded-2xl mx-4 mb-4 overflow-hidden border border-border/70"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
      onPress={() =>
        router.push({
          pathname: `/course/${course.id}`,
          params: {
            thumbnail,
          },
        })
      }
      activeOpacity={0.9}
    >
      <View className="relative">
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-40 bg-border"
          contentFit="cover"
          transition={200}
        />
        <View className="absolute top-2.5 left-2.5 bg-slate-900/80 rounded-full px-2.5 py-1 flex-row items-center gap-1">
          <Ionicons name="star" size={12} color={Colors.warning} />
          <Text className="text-white text-[11px] font-bold">
            {(course.rating ?? 0).toFixed(1)}
          </Text>
        </View>
        <Pressable
          onPress={() => toggleBookmark(String(course.id))}
          hitSlop={8}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-slate-900/60 items-center justify-center"
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isBookmarked ? Colors.bookmark : '#FFFFFF'}
          />
        </Pressable>
      </View>
      <View className="p-3.5">
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: course.instructorAvatar }}
            className="w-6 h-6 rounded-full mr-1.5 bg-border"
            contentFit="cover"
          />
          <Text className="text-xs text-muted font-semibold flex-1" numberOfLines={1}>
            {course.instructorName ?? 'Unknown'}
          </Text>
        </View>
        <Text className="font-heading text-[15px] text-foreground mb-1 leading-5" numberOfLines={2}>
          {course.title}
        </Text>
        <Text className="text-[13px] text-muted leading-[18px] mb-3" numberOfLines={2}>
          {course.description}
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="bg-primary-light rounded-full px-3 py-1.5">
            <Text className="text-[13px] font-heading text-primary">
              ${course.price.toFixed(2)}
            </Text>
          </View>
          {!!course.category && (
            <View className="bg-background border border-border rounded-full px-2.5 py-1">
              <Text className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                {course.category}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CourseCard);
