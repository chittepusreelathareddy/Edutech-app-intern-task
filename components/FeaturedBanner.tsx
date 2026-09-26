import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PremiumCourse } from '../utils/coursesData';

interface Props {
  course: PremiumCourse;
}

export default function FeaturedBanner({ course }: Props) {
  const router = useRouter();

  return (
    <View className="mx-4 mb-5 rounded-2xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800">
      {/* Background Image with Gradient Overlay */}
      <View className="relative h-56 w-full">
        <Image
          source={{ uri: course.thumbnail }}
          className="w-full h-full"
          contentFit="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 justify-between">
          {/* Top Badges */}
          <View className="flex-row justify-between items-center">
            <View className="bg-amber-500 rounded-full px-3 py-1 flex-row items-center gap-1 shadow-md">
              <Ionicons name="flame" size={14} color="#FFF" />
              <Text className="text-white text-xs font-black uppercase tracking-wider">
                Trending Course
              </Text>
            </View>
            <View className="bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-400/30">
              <Text className="text-white text-xs font-bold">{course.category}</Text>
            </View>
          </View>

          {/* Bottom Title & CTA */}
          <View>
            <Text className="text-white text-xl font-extrabold leading-tight mb-1" numberOfLines={2}>
              {course.title}
            </Text>
            <Text className="text-slate-300 text-xs mb-3" numberOfLines={2}>
              {course.subtitle || course.description}
            </Text>

            <View className="flex-row justify-between items-center pt-1 border-t border-slate-800/80">
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="text-amber-400 text-xs font-bold">{course.rating}</Text>
                </View>
                <Text className="text-slate-400 text-xs font-medium">• {course.duration}</Text>
                <Text className="text-slate-400 text-xs font-medium">• {course.level}</Text>
              </View>

              <TouchableOpacity
                className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-2 flex-row items-center gap-1.5 shadow-md active:opacity-80"
                onPress={() =>
                  router.push({
                    pathname: `/course/${course.id}`,
                    params: { thumbnail: course.thumbnail },
                  })
                }
              >
                <Text className="text-white text-xs font-bold">Explore</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
