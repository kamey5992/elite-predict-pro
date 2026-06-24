import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/theme';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizes = {
    sm: { container: 32, fontSize: 12, iconSize: 14 },
    md: { container: 44, fontSize: 14, iconSize: 18 },
    lg: { container: 60, fontSize: 18, iconSize: 24 },
  };
  const s = sizes[size];

  const isHot = streak >= 7;
  const colors = isHot ? (['#F59E0B', '#EF4444'] as const) : GRADIENTS.primary;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.badge, { width: s.container, height: s.container, borderRadius: s.container / 2 }]}
    >
      <Text style={{ fontSize: s.iconSize }}>{isHot ? '🔥' : '⚡'}</Text>
      <Text style={[styles.count, { fontSize: s.fontSize }]}>{streak}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  count: {
    color: '#fff',
    fontWeight: '800',
    lineHeight: 16,
  },
});
