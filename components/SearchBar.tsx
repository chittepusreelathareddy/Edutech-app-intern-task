import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View
      className="flex-row items-center bg-surface rounded-2xl px-4 py-3 mx-4 mb-3.5 border border-border gap-2.5"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <Ionicons name="search-outline" size={19} color={Colors.textSecondary} />
      <TextInput
        className="flex-1 font-sans text-[15px] text-foreground"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search courses...'}
        placeholderTextColor={Colors.textLight}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color={Colors.textLight}
          onPress={() => onChangeText('')}
          suppressHighlighting
        />
      )}
    </View>
  );
}
