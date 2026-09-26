import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useCourses } from '../../store/courseStore';
import { useProgress } from '../../store/progressStore';
import { generateCourseInsights, askCourseAssistant, ChatMessage } from '@/utils/ai';
import { getStableThumbnail } from '../../utils/thumbnail';

const PROGRESS_STEPS = [25, 50, 75, 100];

export default function CourseDetailScreen() {
  const { id, thumbnail } = useLocalSearchParams<{ id: string; thumbnail: string }>();
  const router = useRouter();
  const { courses, bookmarks, enrolled, toggleBookmark, toggleEnroll } = useCourses();
  const { getProgress, setProgress, setNote } = useProgress();

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

  const courseProgress = getProgress(String(course.id));
  const [noteDraft, setNoteDraft] = useState(courseProgress.note);
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setNoteDraft(courseProgress.note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleQuickSetProgress = async (percent: number) => {
    await setProgress(String(course.id), percent);
  };

  const handleSaveNote = async () => {
    await setNote(String(course.id), noteDraft);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const handleSendChatMessage = async () => {
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    const nextHistory: ChatMessage[] = [...chatMessages, { role: 'user', text: question }];
    setChatMessages(nextHistory);
    setChatInput('');
    setChatLoading(true);

    const answer = await askCourseAssistant(course, question, chatMessages);
    setChatMessages((prev) => [...prev, { role: 'model', text: answer }]);
    setChatLoading(false);
  };

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
    <>
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

        <View className="bg-surface rounded-2xl p-4 mb-4 border border-border/70">
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="trending-up-outline" size={18} color={Colors.primary} />
              <Text className="font-heading text-base text-foreground">My Progress</Text>
            </View>
            <Text className="text-sm font-bold text-primary">{courseProgress.percent}%</Text>
          </View>

          <View className="h-2.5 rounded-full bg-border overflow-hidden mb-3">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(0, courseProgress.percent))}%` }}
            />
          </View>

          <View className="flex-row gap-2 mb-4">
            {PROGRESS_STEPS.map((step) => (
              <TouchableOpacity
                key={step}
                onPress={() => handleQuickSetProgress(step)}
                className={`flex-1 rounded-xl py-2 items-center border ${
                  courseProgress.percent === step
                    ? 'bg-primary border-primary'
                    : 'bg-primary-light border-primary/10'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    courseProgress.percent === step ? 'text-white' : 'text-primary'
                  }`}
                >
                  {step}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm font-bold text-foreground mb-1.5">My Notes</Text>
          <TextInput
            value={noteDraft}
            onChangeText={setNoteDraft}
            onBlur={handleSaveNote}
            placeholder="Jot down personal notes about this course..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-background rounded-xl border border-border p-3 text-sm text-foreground min-h-[90px]"
          />

          <View className="flex-row items-center justify-between mt-2.5">
            {noteSaved ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text className="text-xs font-semibold text-success">Note saved</Text>
              </View>
            ) : (
              <View />
            )}
            <TouchableOpacity
              className="bg-primary rounded-lg px-3.5 py-2"
              onPress={handleSaveNote}
            >
              <Text className="text-white text-xs font-bold">Save note</Text>
            </TouchableOpacity>
          </View>
        </View>

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

        <TouchableOpacity
          className="bg-surface rounded-2xl p-4 mb-4 border border-border/70 flex-row items-center gap-2.5"
          onPress={() => setChatVisible(true)}
          activeOpacity={0.85}
        >
          <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-heading text-[15px] text-foreground">Ask AI Assistant</Text>
            <Text className="text-xs text-muted">Chat about this course's topics</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

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

    <Modal
      visible={chatVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setChatVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <View className="flex-1 pr-2">
            <Text className="font-heading text-base text-foreground" numberOfLines={1}>
              AI Study Assistant
            </Text>
            <Text className="text-xs text-muted" numberOfLines={1}>
              {course.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setChatVisible(false)}
            hitSlop={8}
            className="w-9 h-9 rounded-full bg-background items-center justify-center"
          >
            <Ionicons name="close" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.length === 0 && (
            <View className="items-center mt-10 px-6">
              <Ionicons name="sparkles-outline" size={28} color={Colors.primary} />
              <Text className="text-sm text-muted text-center mt-2">
                Ask me anything about "{course.title}" — concepts, study tips, or what to
                learn next.
              </Text>
            </View>
          )}

          {chatMessages.map((msg, index) => (
            <View
              key={index}
              className={`mb-3 max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                msg.role === 'user'
                  ? 'self-end bg-primary rounded-br-sm'
                  : 'self-start bg-surface border border-border rounded-bl-sm'
              }`}
            >
              <Text
                className={`text-[13px] leading-5 ${
                  msg.role === 'user' ? 'text-white' : 'text-foreground'
                }`}
              >
                {msg.text}
              </Text>
            </View>
          ))}

          {chatLoading && (
            <View className="self-start bg-surface border border-border rounded-2xl rounded-bl-sm px-3.5 py-3 mb-3 flex-row items-center gap-2">
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text className="text-[13px] text-muted">Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View className="flex-row items-end gap-2 px-4 py-3 border-t border-border bg-surface">
          <TextInput
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Ask about this course..."
            placeholderTextColor={Colors.textLight}
            multiline
            editable={!chatLoading}
            className="flex-1 bg-background rounded-2xl border border-border px-3.5 py-2.5 text-sm text-foreground max-h-24"
          />
          <TouchableOpacity
            onPress={handleSendChatMessage}
            disabled={chatLoading || !chatInput.trim()}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              chatLoading || !chatInput.trim() ? 'bg-primary/40' : 'bg-primary'
            }`}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
    </>
  );
}
