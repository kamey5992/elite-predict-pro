import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, XP_PER_LEVEL } from '@/constants/theme';

interface XPBarProps {
  xp: number;
  level: number;
  showLabel?: boolean;
}

export function XPBar({ xp, level, showLabel = true }: XPBarProps) {
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const progress = xpInCurrentLevel / XP_PER_LEVEL;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animWidth, {
      toValue: progress,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [progress]);

  const widthInterp = animWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labels}>
          <Text style={styles.label}>Niveau {level}</Text>
          <Text style={styles.xpText}>{xpInCurrentLevel} / {XP_PER_LEVEL} XP</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterp }]}>
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  xpText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '700' },
  track: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    minWidth: 4,
  },
});
