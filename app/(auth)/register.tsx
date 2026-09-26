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
import { Link, useRouter } from 'expo-router';
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Text className="text-[52px] mb-2">📚</Text>
          <Text className="text-[26px] font-extrabold text-foreground mb-1">Create Account</Text>
          <Text className="text-[15px] text-muted">Start your learning journey</Text>
        </View>

        {apiError && (
          <View className="bg-red-100 dark:bg-red-950/40 border border-error p-3.5 rounded-[10px] mb-4">
            <Text className="text-error text-sm font-semibold text-center">{apiError}</Text>
          </View>
        )}

        {apiSuccess && (
          <View className="bg-green-100 dark:bg-green-950/40 border border-green-500 p-3.5 rounded-[10px] mb-4">
            <Text className="text-green-700 dark:text-green-300 text-sm font-semibold text-center">{apiSuccess}</Text>
          </View>
        )}

        <View className="gap-1">
          {(
            [
              { name: 'username' as const, label: 'Username', placeholder: 'johndoe', keyboardType: 'default' as const },
              { name: 'email' as const, label: 'Email', placeholder: 'you@example.com', keyboardType: 'email-address' as const },
              { name: 'password' as const, label: 'Password', placeholder: '••••••••', keyboardType: 'default' as const, secure: true },
              { name: 'confirm' as const, label: 'Confirm Password', placeholder: '••••••••', keyboardType: 'default' as const, secure: true },
            ] as const
          ).map((field) => (
            <View key={field.name}>
              <Text className="text-sm font-semibold text-foreground mt-2.5">{field.label}</Text>
              <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`bg-surface rounded-[10px] px-3.5 py-3 text-[15px] text-foreground border mt-1 ${
                      errors[field.name] ? 'border-error' : 'border-border'
                    }`}
                    value={value ?? ''}
                    onChangeText={(text) => {
                      if (apiError) setApiError(null);
                      onChange(text);
                    }}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textLight}
                    keyboardType={field.keyboardType}
                    autoCapitalize="none"
                    secureTextEntry={'secure' in field && field.secure}
                  />
                )}
              />
              {errors[field.name] && (
                <Text className="text-xs text-error mt-0.5">{errors[field.name]?.message}</Text>
              )}
            </View>
          ))}

          <TouchableOpacity
            className={`bg-primary rounded-[10px] py-3.5 items-center mt-5 ${isSubmitting ? 'opacity-60' : ''}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-base font-bold">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-5">
            <Text className="text-muted text-sm">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary text-sm font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
