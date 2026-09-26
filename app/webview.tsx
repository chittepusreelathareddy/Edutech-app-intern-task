import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useAuth } from '../store/authStore';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function CourseWebViewScreen() {
  const { user, token } = useAuth();

  const params = useLocalSearchParams<{
    title: string;
    instructor: string;
    price: string;
    description: string;
  }>();

  const courseUrl = `https://rutikakhedkar.github.io/webview/?course=${encodeURIComponent(
    params.title || ''
  )}&instructor=${encodeURIComponent(
    params.instructor || ''
  )}&price=${encodeURIComponent(
    params.price || ''
  )}&description=${encodeURIComponent(
    params.description || ''
  )}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);

  const mockLessons = [
    { title: '1. Course Orientation & Environment Setup', duration: '12:45', completed: true },
    { title: '2. Core Principles & Architectural Patterns', duration: '24:30', completed: true },
    { title: '3. Building Your First Production Project', duration: '45:10', completed: false },
    { title: '4. Advanced State Management & Optimization', duration: '38:15', completed: false },
    { title: '5. End-to-End Testing & Cloud Deployment', duration: '30:00', completed: false },
  ];

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'START_LEARNING') {
        console.log('User started learning');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Web Platform Custom Interactive Player Component
  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-slate-950 flex-col md:flex-row">
        {/* Video Player Main View */}
        <View className="flex-1 bg-black justify-center items-center p-6 relative min-h-[300px]">
          <View className="w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl justify-center items-center relative">
            {/* Mock Player Screen */}
            <View className="items-center p-6 text-center">
              <View className="w-20 h-20 bg-indigo-600/90 rounded-full justify-center items-center mb-4 shadow-xl border border-indigo-400/40">
                <Ionicons name="play" size={38} color="#FFF" style={{ marginLeft: 4 }} />
              </View>
              <Text className="text-white text-lg font-extrabold mb-1">
                {mockLessons[activeLesson].title}
              </Text>
              <Text className="text-slate-400 text-xs mb-4">
                {params.title || 'Course Content Module'} • Instructor: {params.instructor || 'Lead Educator'}
              </Text>
              <View className="bg-indigo-950/80 px-4 py-1.5 rounded-full border border-indigo-500/30">
                <Text className="text-indigo-300 text-xs font-semibold">HD 1080p • Interactive Session</Text>
              </View>
            </View>

            {/* Video Controls Bar */}
            <View className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-md p-3 flex-row items-center justify-between border-t border-slate-800">
              <TouchableOpacity className="flex-row items-center gap-2">
                <Ionicons name="pause" size={20} color="#FFF" />
                <Text className="text-xs text-white font-bold">{mockLessons[activeLesson].duration}</Text>
              </TouchableOpacity>
              <View className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <View className="w-1/3 h-full bg-indigo-500 rounded-full" />
              </View>
              <Ionicons name="volume-medium" size={20} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Lessons Playlist Sidebar */}
        <View className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-4">
          <Text className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            Course Curriculum
          </Text>
          <Text className="text-sm font-extrabold text-white mb-4" numberOfLines={1}>
            {params.title || 'Interactive Course Modules'}
          </Text>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {mockLessons.map((les, idx) => {
              const isActive = activeLesson === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveLesson(idx)}
                  className={`p-3 rounded-xl mb-2.5 border transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <Ionicons
                      name={les.completed ? 'checkmark-circle' : isActive ? 'play-circle' : 'ellipse-outline'}
                      size={18}
                      color={les.completed ? '#10B981' : isActive ? '#6366F1' : '#64748B'}
                    />
                    <Text className="text-[10px] font-semibold text-slate-400">{les.duration}</Text>
                  </View>
                  <Text
                    className={`text-xs font-bold ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {les.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Native WebView Component
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Text className="text-error text-sm text-center">
          Failed to load course content. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <WebView
        source={{
          uri: courseUrl,
          headers: {
            Authorization: `Bearer ${token}`,
            UserName: user?.username || '',
            UserEmail: user?.email || '',
            Platform: 'Expo-App',
          },
        }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && (
        <View className="absolute inset-0 justify-center items-center bg-background/80">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}
