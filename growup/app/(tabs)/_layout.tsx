import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

function TabBarIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconActive]}>
      <Ionicons
        name={name}
        size={focused ? 24 : 22}
        color={focused ? COLORS.primaryLight : COLORS.textDim}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { session } = useAuthStore();
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primaryLight,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: styles.label,
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.tabBg} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="program"
        options={{
          title: 'Programme',
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'barbell' : 'barbell-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progrès',
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'trending-up' : 'trending-up-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Défis',
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'person' : 'person-outline'} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  tabBg: {
    flex: 1,
    backgroundColor: COLORS.surface + 'EE',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconActive: {
    backgroundColor: COLORS.primary + '25',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
