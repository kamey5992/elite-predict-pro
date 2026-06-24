import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { WorkoutDay, ProgramMode } from '@/types';
import { COLORS, GRADIENTS } from '@/constants/theme';

interface DayCardProps {
  day: WorkoutDay;
  isCompleted: boolean;
  isLocked: boolean;
  mode: ProgramMode;
  onPress: () => void;
}

export function DayCard({ day, isCompleted, isLocked, mode, onPress }: DayCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isLocked) onPress();
  };

  const accentGradient = mode === 'grandir' ? GRADIENTS.grandir : GRADIENTS.glowup;
  const accentColor = mode === 'grandir' ? COLORS.primary : COLORS.accent;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={isLocked ? 1 : 0.8}
      style={[styles.wrapper, isLocked && styles.locked]}
    >
      <View style={[styles.card, isCompleted && styles.completedCard]}>
        {/* Left accent */}
        <LinearGradient
          colors={isCompleted ? GRADIENTS.success : accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.accent}
        />

        {/* Day number */}
        <View style={[styles.dayBadge, { backgroundColor: isCompleted ? COLORS.success : accentColor }]}>
          <Text style={styles.dayNumber}>{day.day_number}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{day.title}</Text>
            {day.is_rest_day && (
              <View style={styles.restTag}>
                <Text style={styles.restText}>Repos</Text>
              </View>
            )}
          </View>
          <Text style={styles.description} numberOfLines={2}>{day.description}</Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color={COLORS.textDim} />
              <Text style={styles.metaText}>{day.duration_minutes} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flash-outline" size={12} color={COLORS.textDim} />
              <Text style={styles.metaText}>+{day.total_xp} XP</Text>
            </View>
            {!day.is_rest_day && (
              <View style={styles.metaItem}>
                <Ionicons name="barbell-outline" size={12} color={COLORS.textDim} />
                <Text style={styles.metaText}>{day.exercises.length} exos</Text>
              </View>
            )}
          </View>
        </View>

        {/* Status icon */}
        <View style={styles.statusIcon}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={20} color={COLORS.textDim} />
          ) : isCompleted ? (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={accentColor} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  locked: { opacity: 0.5 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  completedCard: {
    borderColor: COLORS.success + '50',
    backgroundColor: COLORS.success + '10',
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  dayNumber: { color: '#fff', fontWeight: '800', fontSize: 14 },
  content: { flex: 1, paddingVertical: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  title: { color: COLORS.text, fontWeight: '700', fontSize: 15, flex: 1 },
  restTag: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  restText: { color: COLORS.warning, fontSize: 11, fontWeight: '600' },
  description: { color: COLORS.textMuted, fontSize: 12, lineHeight: 17, marginBottom: 8 },
  meta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: COLORS.textDim, fontSize: 11 },
  statusIcon: { paddingHorizontal: 14 },
});
