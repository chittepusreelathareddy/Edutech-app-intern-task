import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/colors';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(focused: boolean, active: IconName, inactive: IconName) {
  return (
    <Ionicons
      name={focused ? active : inactive}
      size={focused ? 24 : 22}
      color={focused ? Colors.primary : Colors.textLight}
    />
  );
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const surface = isDark ? '#1E293B' : Colors.surface;
  const border = isDark ? '#334155' : Colors.border;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: -2 },
        tabBarStyle: {
          backgroundColor: surface,
          borderTopColor: border,
          borderTopWidth: 1,
          height: 62,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { color: Colors.surface, fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courses',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'book', 'book-outline'),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'bookmark', 'bookmark-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}
