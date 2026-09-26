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
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  const [showPassword, setShowPassword] = useState(false);

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
          <View className="items-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 rounded-2xl bg-indigo-600/90 border border-indigo-400/30 items-center justify-center mb-4 shadow-xl">
              <Ionicons name="school" size={30} color="#FFF" />
            </View>
            <Text className="font-black text-[28px] text-white mb-1.5">EduTech LMS</Text>
            <Text className="font-medium text-[15px] text-slate-300">
              Sign in to continue learning
            </Text>
          </View>

          <View className="bg-background rounded-t-[32px] px-6 pt-8 pb-8 shadow-2xl">
            {apiError && (
              <View className="bg-red-50 border border-error/40 p-3.5 rounded-2xl mb-4 flex-row items-center gap-2">
                <Ionicons name="alert-circle" size={18} color={Colors.error} />
                <Text className="text-error text-[13px] font-semibold flex-1">{apiError}</Text>
              </View>
            )}

            <View className="gap-1.5">
              <Text className="font-semibold text-[13px] text-foreground mt-1 mb-1">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`flex-row items-center bg-surface rounded-2xl px-4 border ${
                      errors.email ? 'border-error' : 'border-border'
                    }`}
                  >
                    <Ionicons name="mail-outline" size={18} color={Colors.textLight} />
                    <TextInput
                      className="flex-1 font-sans px-3 py-3.5 text-[15px] text-foreground"
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
                  </View>
                )}
              />
              {errors.email && (
                <Text className="text-xs text-error mt-0.5 ml-1">{errors.email.message}</Text>
              )}

              <Text className="font-semibold text-[13px] text-foreground mt-3 mb-1">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`flex-row items-center bg-surface rounded-2xl px-4 border ${
                      errors.password ? 'border-error' : 'border-border'
                    }`}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} />
                    <TextInput
                      className="flex-1 font-sans px-3 py-3.5 text-[15px] text-foreground"
                      value={value ?? ''}
                      onChangeText={(text) => {
                        if (apiError) setApiError(null);
                        onChange(text);
                      }}
                      placeholder="••••••••"
                      placeholderTextColor={Colors.textLight}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={Colors.textLight}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text className="text-xs text-error mt-0.5 ml-1">{errors.password.message}</Text>
              )}

              <TouchableOpacity
                className={`bg-primary rounded-2xl py-4 items-center mt-6 shadow-md active:opacity-90 ${
                  isSubmitting ? 'opacity-60' : ''
                }`}
                onPress={handleSubmit(handleSignIn)}
                disabled={isSubmitting}
              >
                <Text className="font-heading text-white text-[15px]">
                  {isSubmitting ? 'Signing in…' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border border-primary/30 rounded-2xl py-3.5 items-center mt-3 bg-primary-light flex-row justify-center gap-1.5"
                onPress={handleDemoSignIn}
                disabled={isSubmitting}
              >
                <Ionicons name="flash" size={16} color={Colors.primary} />
                <Text className="text-primary text-[13px] font-semibold">Quick Demo Sign In</Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text className="text-muted text-sm">Don&apos;t have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary text-sm font-bold">Register</Text>
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
