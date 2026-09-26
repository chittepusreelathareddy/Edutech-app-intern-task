import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
export type PriceBucket = 'all' | 'under-50' | '50-200' | '200-plus';

const SORT_OPTIONS: { key: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'featured', label: 'Featured', icon: 'sparkles-outline' },
  { key: 'price-asc', label: 'Price: Low to High', icon: 'arrow-up-outline' },
  { key: 'price-desc', label: 'Price: High to Low', icon: 'arrow-down-outline' },
  { key: 'rating-desc', label: 'Top Rated', icon: 'star-outline' },
];

const PRICE_BUCKETS: { key: PriceBucket; label: string }[] = [
  { key: 'all', label: 'Any price' },
  { key: 'under-50', label: 'Under $50' },
  { key: '50-200', label: '$50 - $200' },
  { key: '200-plus', label: '$200+' },
];

interface Props {
  sortOption: SortOption;
  onSelectSort: (sort: SortOption) => void;
  priceBucket: PriceBucket;
  onSelectPriceBucket: (bucket: PriceBucket) => void;
}

export default function SortFilterBar({
  sortOption,
  onSelectSort,
  priceBucket,
  onSelectPriceBucket,
}: Props) {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {SORT_OPTIONS.map((opt) => {
          const isSelected = sortOption === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onSelectSort(opt.key)}
              activeOpacity={0.85}
              className={`mr-2.5 px-3.5 py-2 rounded-full border flex-row items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary border-primary shadow-sm'
                  : 'bg-surface border-border'
              }`}
            >
              <Ionicons
                name={opt.icon}
                size={13}
                color={isSelected ? '#FFFFFF' : '#64748B'}
              />
              <Text
                className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-muted'}`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
      >
        {PRICE_BUCKETS.map((bucket) => {
          const isSelected = priceBucket === bucket.key;
          return (
            <TouchableOpacity
              key={bucket.key}
              onPress={() => onSelectPriceBucket(bucket.key)}
              activeOpacity={0.85}
              className={`mr-2.5 px-3.5 py-1.5 rounded-full border ${
                isSelected
                  ? 'bg-primary-light border-primary'
                  : 'bg-surface border-border'
              }`}
            >
              <Text
                className={`text-[11px] font-bold ${
                  isSelected ? 'text-primary' : 'text-muted'
                }`}
              >
                {bucket.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
