import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, GRADIENTS } from '@/constants/theme';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'success' | 'danger';

interface GrowButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const GRADIENT_MAP: Record<string, readonly [string, string]> = {
  primary: GRADIENTS.primary,
  accent:  GRADIENTS.glowup,
  success: GRADIENTS.success,
};

export function GrowButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: GrowButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isGradient = ['primary', 'accent', 'success'].includes(variant);
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  if (isGradient) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
        style={[styles.base, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={GRADIENT_MAP[variant] ?? GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {icon}
              <Text style={[styles.textGradient, textStyle]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const flatBg = isDanger
    ? COLORS.error
    : isOutline
    ? 'transparent'
    : 'transparent';

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles.flat,
        { backgroundColor: flatBg },
        isOutline && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isDanger ? '#fff' : COLORS.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.textFlat,
              isDanger && { color: '#fff' },
              isOutline && { color: COLORS.primary },
              isGhost && { color: COLORS.textMuted },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  flat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  textGradient: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  textFlat: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
