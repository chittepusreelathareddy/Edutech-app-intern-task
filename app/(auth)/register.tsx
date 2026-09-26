import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Colors } from '../../constants/colors';
import { registerUser, loginUser } from '../../utils/api';
import { useAuth } from '../../store/authStore';

const schema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

const FIELD_META = {
  username: { label: 'Username', placeholder: 'johndoe', icon: 'person-outline' as const },
  email: { label: 'Email', placeholder: 'you@example.com', icon: 'mail-outline' as const },
  password: { label: 'Password', placeholder: '••••••••', icon: 'lock-closed-outline' as const, secure: true },
  confirm: {
    label: 'Confirm Password',
    placeholder: '••••••••',
    icon: 'lock-closed-outline' as const,
    secure: true,
  },
};

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      await registerUser({ username: data.username, email: data.email, password: data.password });
      setApiSuccess('Account created! Signing you in...');

      try {
        const res = (await loginUser({ email: data.email, password: data.password })) as {
          data: { accessToken: string; user: object; refreshToken: string };
        };
        await login(
          res.data.accessToken,
          res.data.user as Parameters<typeof login>[1],
          res.data.refreshToken as Parameters<typeof login>[2]
        );
      } catch {
        // Fallback to manual login screen if auto login fails
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setApiError(msg);
      if (Platform.OS !== 'web') {
        Alert.alert('Registration Error', msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <View className="flex-1 bg-slate-950">
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center pt-16 pb-8 px-6">
            <View className="w-16 h-16 rounded-2xl bg-indigo-600/90 border border-indigo-400/30 items-center justify-center mb-4 shadow-xl">
              <Ionicons name="rocket" size={28} color="#FFF" />
            </View>
            <Text className="font-black text-[26px] text-white mb-1.5">Create Account</Text>
            <Text className="font-medium text-[15px] text-slate-300">
              Start your learning journey
            </Text>
          </View>

          <View className="bg-background rounded-t-[32px] px-6 pt-8 pb-8 shadow-2xl">
            {apiError && (
              <View className="bg-red-50 border border-error/40 p-3.5 rounded-2xl mb-4 flex-row items-center gap-2">
                <Ionicons name="alert-circle" size={18} color={Colors.error} />
                <Text className="text-error text-[13px] font-semibold flex-1">{apiError}</Text>
              </View>
            )}

            {apiSuccess && (
              <View className="bg-green-50 border border-success/40 p-3.5 rounded-2xl mb-4 flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text className="text-success text-[13px] font-semibold flex-1">{apiSuccess}</Text>
              </View>
            )}

            <View className="gap-1">
              {(Object.keys(FIELD_META) as Array<keyof typeof FIELD_META>).map((name) => {
                const meta = FIELD_META[name];
                return (
                  <View key={name}>
                    <Text className="font-semibold text-[13px] text-foreground mt-2.5 mb-1">
                      {meta.label}
                    </Text>
                    <Controller
                      control={control}
                      name={name}
                      render={({ field: { onChange, value } }) => (
                        <View
                          className={`flex-row items-center bg-surface rounded-2xl px-4 border ${
                            errors[name] ? 'border-error' : 'border-border'
                          }`}
                        >
                          <Ionicons name={meta.icon} size={18} color={Colors.textLight} />
                          <TextInput
                            className="flex-1 font-sans px-3 py-3.5 text-[15px] text-foreground"
                            value={value ?? ''}
                            onChangeText={(text) => {
                              if (apiError) setApiError(null);
                              onChange(text);
                            }}
                            placeholder={meta.placeholder}
                            placeholderTextColor={Colors.textLight}
                            keyboardType={name === 'email' ? 'email-address' : 'default'}
                            autoCapitalize="none"
                            secureTextEntry={'secure' in meta && meta.secure}
                          />
                        </View>
                      )}
                    />
                    {errors[name] && (
                      <Text className="text-xs text-error mt-0.5 ml-1">{errors[name]?.message}</Text>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                className={`bg-primary rounded-2xl py-4 items-center mt-6 shadow-md active:opacity-90 ${
                  isSubmitting ? 'opacity-60' : ''
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Text className="font-heading text-white text-[15px]">
                  {isSubmitting ? 'Creating account…' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text className="text-muted text-sm">Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary text-sm font-bold">Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
