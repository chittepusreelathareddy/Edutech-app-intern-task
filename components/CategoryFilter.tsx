import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

interface Props {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              className={`mr-2.5 px-4 py-2 rounded-full border transition-all ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
