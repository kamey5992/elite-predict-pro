import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  borderRadius?: number;
}

export function GradientCard({
  children,
  colors = [COLORS.surface, COLORS.surfaceLight],
  style,
  innerStyle,
  borderRadius = 16,
}: GradientCardProps) {
  return (
    <View style={[styles.wrapper, { borderRadius }, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius }, innerStyle]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradient: {
    padding: 16,
  },
});
