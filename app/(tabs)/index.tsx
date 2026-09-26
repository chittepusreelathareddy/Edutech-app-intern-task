import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '../../store/courseStore';
import { useAuth } from '../../store/authStore';
import { fetchCourses, fetchInstructors } from '../../utils/api';
import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import SortFilterBar, { PriceBucket, SortOption } from '../../components/SortFilterBar';
import FeaturedBanner from '../../components/FeaturedBanner';
import OfflineBanner from '../../components/OfflineBanner';
import { Colors } from '../../constants/colors';
import { Course } from '../../store/courseStore';
import { PREMIUM_COURSES } from '../../utils/coursesData';

interface ApiProduct {
  id: number | string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating?: number | { rate?: number };
}

interface ApiUser {
  name?: { first?: string; last?: string } | string;
  picture?: { thumbnail?: string; medium?: string };
}

interface ProductsResponse {
  data: { data: ApiProduct[] };
}

interface UsersResponse {
  data: { data: ApiUser[] };
}

function buildCourses(products: ApiProduct[], users: ApiUser[]): Course[] {
  return products.map((p, i) => {
    const user = users[i % users.length];
    const name = user?.name;
    const instructorName =
      typeof name === 'string'
        ? name
        : name
        ? `${name.first ?? ''} ${name.last ?? ''}`.trim()
        : 'Unknown';
    const instructorAvatar =
      user?.picture?.thumbnail ?? user?.picture?.medium ?? '';
    const rating =
      typeof p.rating === 'number'
        ? p.rating
        : typeof p.rating === 'object' && p.rating?.rate !== undefined
        ? p.rating.rate
        : 0;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      thumbnail: p.thumbnail,
      rating,
      instructorName,
      instructorAvatar,
    };
  });
}

const ALL_CATEGORY = 'All';

export default function CoursesScreen() {
  const { courses, setCourses } = useCourses();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [priceBucket, setPriceBucket] = useState<PriceBucket>('all');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [products, users] = await Promise.all([
        fetchCourses() as Promise<ProductsResponse>,
        fetchInstructors() as Promise<UsersResponse>,
      ]);
      const built = buildCourses(products.data.data, users.data.data);
      setCourses(built.length > 0 ? built : (PREMIUM_COURSES as unknown as Course[]));
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load courses');
      setCourses(PREMIUM_COURSES as unknown as Course[]);
    } finally {
      setLoading(false);
    }
  }, [setCourses]);

  useEffect(() => {
    if (courses.length === 0) loadData();
  }, [courses.length, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(courses.map((c) => c.category).filter((c): c is string => !!c))
    );
    return [ALL_CATEGORY, ...unique];
  }, [courses]);

  const filtered = useMemo(() => {
    let list = courses;
    if (selectedCategory !== ALL_CATEGORY) {
      list = list.filter((c) => c.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.instructorName ?? '').toLowerCase().includes(q)
      );
    }
    if (priceBucket !== 'all') {
      list = list.filter((c) => {
        if (priceBucket === 'under-50') return c.price < 50;
        if (priceBucket === '50-200') return c.price >= 50 && c.price <= 200;
        return c.price > 200;
      });
    }
    if (sortOption !== 'featured') {
      list = [...list].sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
    }
    return list;
  }, [courses, search, selectedCategory, priceBucket, sortOption]);

  const firstCourse = courses[0] as unknown as Record<string, unknown> | undefined;
  const isPremiumCourse = !!firstCourse && 'duration' in firstCourse && 'level' in firstCourse;
  const featured =
    search.trim() === '' &&
    selectedCategory === ALL_CATEGORY &&
    sortOption === 'featured' &&
    priceBucket === 'all' &&
    isPremiumCourse
      ? courses[0]
      : null;
  const greetingName = user?.username ? user.username.split(/[\s_]/)[0] : 'there';

  return (
    <View className="flex-1 bg-background">
      <OfflineBanner />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CourseCard course={item} />}
        ListHeaderComponent={
          <View>
            <View className="px-4 pt-3 pb-4">
              <Text className="text-[13px] font-semibold text-muted">Welcome back,</Text>
              <Text className="font-black text-[22px] text-foreground" numberOfLines={1}>
                {greetingName} 👋
              </Text>
            </View>
            <SearchBar value={search} onChangeText={setSearch} />
            {categories.length > 1 && (
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            )}
            <SortFilterBar
              sortOption={sortOption}
              onSelectSort={setSortOption}
              priceBucket={priceBucket}
              onSelectPriceBucket={setPriceBucket}
            />
            {featured && (
              <>
                <Text className="font-heading text-[15px] text-foreground px-4 mb-2.5">
                  Featured for you
                </Text>
                <FeaturedBanner course={featured as unknown as Parameters<typeof FeaturedBanner>[0]['course']} />
                <Text className="font-heading text-[15px] text-foreground px-4 mb-1 mt-1">
                  All courses
                </Text>
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="items-center p-14">
              <View className="w-16 h-16 rounded-full bg-primary-light items-center justify-center mb-4">
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
              <Text className="text-muted text-sm font-semibold">Loading courses…</Text>
            </View>
          ) : loadError ? (
            <View className="items-center p-14">
              <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={28} color={Colors.error} />
              </View>
              <Text className="text-foreground text-[15px] font-bold text-center mb-1">
                Couldn&apos;t load courses
              </Text>
              <Text className="text-error text-[13px] text-center mb-4">{loadError}</Text>
              <TouchableOpacity
                className="bg-primary rounded-2xl px-6 py-3 flex-row items-center gap-1.5"
                onPress={loadData}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text className="text-white font-bold text-sm">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center p-14">
              <View className="w-16 h-16 rounded-full bg-primary-light items-center justify-center mb-4">
                <Ionicons name="search-outline" size={26} color={Colors.primary} />
              </View>
              <Text className="text-foreground text-[15px] font-bold mb-1">No courses found</Text>
              <Text className="text-muted text-[13px] text-center">
                Try a different search term or category
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        contentContainerClassName="pt-1 pb-6"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
