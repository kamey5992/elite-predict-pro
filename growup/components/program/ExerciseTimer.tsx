import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Exercise } from '@/types';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { GrowButton } from '@/components/ui/GrowButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.55;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ExerciseTimerProps {
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  onNext: () => void;
  onComplete: () => void;
  mode: 'grandir' | 'glowup';
}

export function ExerciseTimer({
  exercise,
  exerciseIndex,
  totalExercises,
  onNext,
  onComplete,
  mode,
}: ExerciseTimerProps) {
  const isLastExercise = exerciseIndex === totalExercises - 1;
  const hasDuration = exercise.duration_seconds > 0;

  const [secondsLeft, setSecondsLeft] = useState(
    hasDuration ? exercise.duration_seconds : 0
  );
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'exercise' | 'rest'>('exercise');
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = exercise.sets ?? 1;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const accentColors = mode === 'grandir' ? GRADIENTS.grandir : GRADIENTS.glowup;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  useEffect(() => {
    if (!hasDuration) return;
    const total = phase === 'exercise' ? exercise.duration_seconds : exercise.rest_seconds;
    const progress = 1 - secondsLeft / total;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [secondsLeft, phase]);

  useEffect(() => {
    if (!isRunning || !hasDuration) return;
    if (secondsLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (phase === 'exercise') {
        if (exercise.rest_seconds > 0 && currentSet < totalSets) {
          setPhase('rest');
          setSecondsLeft(exercise.rest_seconds);
        } else if (currentSet < totalSets) {
          setCurrentSet((s) => s + 1);
          setPhase('exercise');
          setSecondsLeft(exercise.duration_seconds);
        } else {
          setIsRunning(false);
        }
      } else {
        setPhase('exercise');
        setCurrentSet((s) => s + 1);
        setSecondsLeft(exercise.duration_seconds);
      }
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, secondsLeft, phase, currentSet]);

  useEffect(() => {
    isRunning ? startPulse() : stopPulse();
  }, [isRunning]);

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning((r) => !r);
  };

  const dashOffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
    extrapolate: 'clamp',
  });

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const difficultyColor = {
    easy: COLORS.success,
    medium: COLORS.warning,
    hard: COLORS.error,
  }[exercise.difficulty];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressChips}>
          {Array.from({ length: totalExercises }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.chip,
                i < exerciseIndex && styles.chipDone,
                i === exerciseIndex && styles.chipActive,
              ]}
            />
          ))}
        </View>
        <View style={[styles.diffTag, { backgroundColor: difficultyColor + '20' }]}>
          <Text style={[styles.diffText, { color: difficultyColor }]}>
            {exercise.difficulty === 'easy' ? 'Facile' : exercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
          </Text>
        </View>
      </View>

      {/* Exercise name */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseDesc}>{exercise.description}</Text>

      {/* Sets info */}
      {totalSets > 1 && (
        <Text style={styles.setsInfo}>Série {currentSet} / {totalSets}</Text>
      )}

      {hasDuration ? (
        <>
          {/* Circular timer */}
          <View style={styles.timerWrapper}>
            <Animated.View style={[styles.circleContainer, { transform: [{ scale: pulseAnim }] }]}>
              <LinearGradient
                colors={phase === 'rest' ? (['#1E1E40', '#2A2A5A'] as const) : accentColors}
                style={styles.circleBackground}
              >
                <Text style={styles.phaseLabel}>
                  {phase === 'rest' ? '⏸ Repos' : '💪 Effort'}
                </Text>
                <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                <Text style={styles.timerUnit}>secondes</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          <TouchableOpacity onPress={toggleTimer} style={styles.playButton}>
            <LinearGradient colors={accentColors} style={styles.playGradient}>
              <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        /* Reps mode */
        <View style={styles.repsContainer}>
          <LinearGradient colors={accentColors} style={styles.repsBadge}>
            <Text style={styles.repsNumber}>{exercise.reps}</Text>
            <Text style={styles.repsLabel}>répétitions</Text>
          </LinearGradient>
          {exercise.sets && exercise.sets > 1 && (
            <Text style={styles.restHint}>
              Repos {exercise.rest_seconds}s entre chaque série
            </Text>
          )}
        </View>
      )}

      {/* XP reward */}
      <View style={styles.xpContainer}>
        <LinearGradient colors={GRADIENTS.gold} style={styles.xpBadge}>
          <Text style={styles.xpText}>+{exercise.xp_reward} XP</Text>
        </LinearGradient>
      </View>

      {/* Next button */}
      <GrowButton
        title={isLastExercise ? '🏆 Terminer la séance' : 'Exercice suivant →'}
        onPress={isLastExercise ? onComplete : onNext}
        variant={isLastExercise ? 'success' : 'primary'}
        style={styles.nextButton}
      />

      {/* Muscle groups */}
      <View style={styles.muscles}>
        {exercise.muscle_groups.map((g) => (
          <View key={g} style={styles.muscleChip}>
            <Text style={styles.muscleText}>{g}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  progressChips: { flexDirection: 'row', gap: 4 },
  chip: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  chipDone: { backgroundColor: COLORS.success },
  chipActive: { backgroundColor: COLORS.primary, width: 20 },
  diffTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  diffText: { fontSize: 12, fontWeight: '700' },
  exerciseName: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  exerciseDesc: { color: COLORS.textMuted, fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 12 },
  setsInfo: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  timerWrapper: { alignItems: 'center', marginVertical: 24 },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  circleBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  phaseLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  timerText: { color: '#fff', fontSize: 52, fontWeight: '900', letterSpacing: -2 },
  timerUnit: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  playButton: { alignSelf: 'center', marginBottom: 20, borderRadius: 35, overflow: 'hidden', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  playGradient: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
  repsContainer: { alignItems: 'center', paddingVertical: 24 },
  repsBadge: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  repsNumber: { color: '#fff', fontSize: 56, fontWeight: '900' },
  repsLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  restHint: { color: COLORS.textMuted, fontSize: 13 },
  xpContainer: { alignItems: 'center', marginBottom: 20 },
  xpBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  xpText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  nextButton: { marginBottom: 16 },
  muscles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  muscleChip: { backgroundColor: COLORS.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  muscleText: { color: COLORS.textMuted, fontSize: 12 },
});
