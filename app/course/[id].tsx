import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useCourses } from '../../store/courseStore';
import { generateCourseInsights } from '@/utils/ai';
import { getStableThumbnail } from '../../utils/thumbnail';

export default function CourseDetailScreen() {
  const { id, thumbnail } = useLocalSearchParams<{ id: string; thumbnail: string }>();
  const router = useRouter();
  const { courses, bookmarks, enrolled, toggleBookmark, toggleEnroll } = useCourses();

  const course = courses.find((c) => String(c.id) === id);
  if (!course) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-muted text-base">Course not found</Text>
      </View>
    );
  }

  const isBookmarked = bookmarks.includes(String(course.id));
  const isEnrolled = enrolled.includes(String(course.id));

  const [aiInsights, setAiInsights] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleEnroll = async () => {
    await toggleEnroll(String(course.id));
    if (!isEnrolled) {
      Alert.alert('Enrolled! 🎉', `You are now enrolled in "${course.title}"`);
    }
  };

  const loadAIInsights = async () => {
    setAiLoading(true);
    const result = await generateCourseInsights(course);
    setAiInsights(result);
    setAiLoading(false);
  };

  useEffect(() => {
    if (course) {
      loadAIInsights();
    }
  }, [course?.id]);

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View className="relative h-64 w-full bg-slate-900">
        <Image
          source={{ uri: thumbnail || getStableThumbnail(course) }}
          className="w-full h-full"
          contentFit="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <View className="absolute inset-0 p-4 justify-end">
          <View className="self-start bg-indigo-600/90 rounded-full px-3 py-1 mb-2.5 border border-indigo-400/30">
            <Text className="text-white text-xs font-bold capitalize">{course.category}</Text>
          </View>
          <Text className="font-black text-white text-xl leading-tight" numberOfLines={3}>
            {course.title}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-center gap-2.5 mb-4 mt-1">
          <Image
            source={{ uri: course.instructorAvatar }}
            className="w-11 h-11 rounded-full bg-border"
            contentFit="cover"
          />
          <View className="flex-1">
            <Text className="text-[11px] text-muted">Instructor</Text>
            <Text className="text-sm font-bold text-foreground">{course.instructorName}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={15} color={Colors.warning} />
              <Text className="text-sm text-muted font-semibold">
                {course.rating?.toFixed(1)}
              </Text>
            </View>
            <Text className="text-slate-300">•</Text>
            <View className="bg-primary-light rounded-full px-2.5 py-1">
              <Text className="text-[13px] font-heading text-primary">
                ${course.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Text className="font-heading text-base text-foreground mb-2">Description</Text>
        <Text className="text-sm text-muted leading-[22px] mb-5">{course.description}</Text>

        <View className="bg-primary-light rounded-2xl p-4 mb-4 border border-primary/10">
          <View className="flex-row items-center gap-1.5 mb-2.5">
            <Ionicons name="sparkles-outline" size={18} color={Colors.primary} />
            <Text className="font-heading text-base text-primary">AI Course Insights</Text>
          </View>

          {aiLoading ? (
            <Text className="text-[13px] text-muted leading-5">Generating AI summary...</Text>
          ) : aiInsights ? (
            <>
              <Text className="text-sm font-bold text-foreground mt-2 mb-1">
                What you will learn
              </Text>
              {aiInsights.whatYouWillLearn?.map((item: string, index: number) => (
                <Text key={index} className="text-[13px] text-muted leading-5">
                  • {item}
                </Text>
              ))}

              <Text className="text-sm font-bold text-foreground mt-2 mb-1">
                Best suited for
              </Text>
              <Text className="text-[13px] text-muted leading-5">{aiInsights.bestFor}</Text>

              <Text className="text-sm font-bold text-foreground mt-2 mb-1">Summary</Text>
              <Text className="text-[13px] text-muted leading-5">{aiInsights.aiSummary}</Text>
            </>
          ) : (
            <TouchableOpacity
              className="bg-primary rounded-xl py-2.5 items-center"
              onPress={loadAIInsights}
            >
              <Text className="text-white text-sm font-bold">Generate AI Summary</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row gap-3 mb-3">
          <TouchableOpacity
            className={`flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2 shadow-md ${
              isEnrolled ? 'bg-success' : 'bg-primary'
            }`}
            onPress={handleEnroll}
          >
            <Ionicons
              name={isEnrolled ? 'checkmark-circle' : 'add-circle-outline'}
              size={18}
              color="#fff"
            />
            <Text className="text-white text-base font-bold">
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[52px] bg-primary-light rounded-2xl justify-center items-center border border-primary/10"
            onPress={() => toggleBookmark(String(course.id))}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? Colors.bookmark : Colors.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-secondary rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md"
          onPress={() =>
            router.push({
              pathname: '/webview',
              params: {
                title: course.title,
                instructor: course.instructorName,
                price: String(course.price),
                description: course.description,
                thumbnail: course.thumbnail,
              },
            })
          }
        >
          <Ionicons name="play-circle-outline" size={20} color="#fff" />
          <Text className="text-white text-[15px] font-bold">Start Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
