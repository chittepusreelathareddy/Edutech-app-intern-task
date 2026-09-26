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
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Colors } from '../../constants/colors';
import { loginUser, registerUser } from '../../utils/api';
import { useAuth } from '../../store/authStore';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      let res: { data: { accessToken: string; user: object; refreshToken: string } };
      try {
        res = (await loginUser(data)) as {
          data: { accessToken: string; user: object; refreshToken: string };
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '';
        // If FreeAPI backend user account does not exist or was cleared, auto-register & login
        if (msg.toLowerCase().includes('user does not exist') || msg.includes('404')) {
          let baseUsername = data.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
          if (baseUsername.length < 3) baseUsername = `user_${baseUsername}`;
          let username = baseUsername;

          try {
            await registerUser({
              username,
              email: data.email,
              password: data.password,
            });
          } catch {
            username = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
            await registerUser({
              username,
              email: data.email,
              password: data.password,
            });
          }

          res = (await loginUser(data)) as {
            data: { accessToken: string; user: object; refreshToken: string };
          };
        } else {
          throw err;
        }
      }

      await login(
        res.data.accessToken,
        res.data.user as Parameters<typeof login>[1],
        res.data.refreshToken as Parameters<typeof login>[2]
      );
    } catch (err: unknown) {
      console.log(err);
      const msg = err instanceof Error ? err.message : 'Login failed';
      setApiError(msg);
      if (Platform.OS !== 'web') {
        Alert.alert('Login Failed', msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    const demoEmail = 'sreelatha_edutech@gmail.com';
    const demoPassword = 'Password123!';
    setValue('email', demoEmail);
    setValue('password', demoPassword);
    await handleSignIn({ email: demoEmail, password: demoPassword });
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
        <View className="items-center mb-10">
          <Text className="text-[52px] mb-2">📚</Text>
          <Text className="text-[28px] font-extrabold text-foreground mb-1">EduTech LMS</Text>
          <Text className="text-[15px] text-muted">Sign in to continue learning</Text>
        </View>

        {apiError && (
          <View className="bg-red-100 dark:bg-red-950/40 border border-error p-3.5 rounded-[10px] mb-4">
            <Text className="text-error text-sm font-semibold text-center">{apiError}</Text>
          </View>
        )}

        <View className="gap-1.5">
          <Text className="text-sm font-semibold text-foreground mt-3">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`bg-surface rounded-[10px] px-3.5 py-3 text-[15px] text-foreground border mt-1 ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                value={value ?? ''}
                onChangeText={(text) => {
                  if (apiError) setApiError(null);
                  onChange(text);
                }}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text className="text-xs text-error mt-0.5">{errors.email.message}</Text>}

          <Text className="text-sm font-semibold text-foreground mt-3">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`bg-surface rounded-[10px] px-3.5 py-3 text-[15px] text-foreground border mt-1 ${
                  errors.password ? 'border-error' : 'border-border'
                }`}
                value={value ?? ''}
                onChangeText={(text) => {
                  if (apiError) setApiError(null);
                  onChange(text);
                }}
                placeholder="••••••••"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
              />
            )}
          />
          {errors.password && <Text className="text-xs text-error mt-0.5">{errors.password.message}</Text>}

          <TouchableOpacity
            className={`bg-primary rounded-[10px] py-3.5 items-center mt-5 ${isSubmitting ? 'opacity-60' : ''}`}
            onPress={handleSubmit(handleSignIn)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-base font-bold">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-primary rounded-[10px] py-3 items-center mt-2 bg-primary/5"
            onPress={handleDemoSignIn}
            disabled={isSubmitting}
          >
            <Text className="text-primary text-sm font-semibold">
              ⚡ Quick Demo Sign In
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-5">
            <Text className="text-muted text-sm">Don&apos;t have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary text-sm font-bold">Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

