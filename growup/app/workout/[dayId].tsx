import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/authStore';
import { useProgramStore } from '@/store/programStore';
import { useProgressStore } from '@/store/progressStore';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { ExerciseTimer } from '@/components/program/ExerciseTimer';
import { GrowButton } from '@/components/ui/GrowButton';

type Phase = 'preview' | 'active' | 'completed';

export default function WorkoutScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const { profile, addXP } = useAuthStore();
  const { currentDay, activeMode, completeDay, nextExercise, activeExerciseIndex, setCurrentDay } = useProgramStore();
  const { checkAndUnlockAchievements, totalWorkouts, heightHistory } = useProgressStore();

  const [phase, setPhase] = useState<Phase>('preview');
  const [startTime] = useState(Date.now());
  const [earnedXP, setEarnedXP] = useState(0);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showAchModal, setShowAchModal] = useState(false);

  const celebrateAnim = useRef(new Animated.Value(0)).current;

  if (!currentDay) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Séance introuvable</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const day = currentDay;
  const mode = activeMode;
  const accentColors = mode === 'grandir' ? GRADIENTS.grandir : GRADIENTS.glowup;

  const handleStartWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPhase('active');
  };

  const handleNextExercise = () => {
    nextExercise();
  };

  const handleCompleteWorkout = async () => {
    if (!profile) return;

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);
    const xp = await completeDay(profile.id, day.id, durationSeconds);
    setEarnedXP(xp);

    await addXP(xp);

    // Check achievements
    const initialH = heightHistory.at(0)?.height_cm ?? profile.height_cm;
    const currentH = heightHistory.at(-1)?.height_cm ?? profile.height_cm;
    const newAch = await checkAndUnlockAchievements(profile.id, {
      totalWorkouts: totalWorkouts + 1,
      streakDays: profile.streak_days,
      level: profile.level,
      initialHeight: initialH,
      currentHeight: currentH,
    });

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;
    const isConsecutive = lastActivity === new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = isConsecutive || !lastActivity ? (profile.streak_days + 1) : 1;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.spring(celebrateAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 30,
      friction: 5,
    }).start();

    setNewAchievements(newAch);
    setPhase('completed');

    if (newAch.length > 0) {
      setTimeout(() => setShowAchModal(true), 1000);
    }
  };

  const handleExit = () => {
    Alert.alert('Quitter la séance ?', 'Ta progression ne sera pas sauvegardée.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Quitter', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  if (phase === 'preview') {
    return (
      <View style={styles.container}>
        <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />

        {/* Header */}
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.dayChip}>
            <Text style={styles.dayChipText}>Jour {day.day_number}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.previewScroll}>
          {/* Title */}
          <LinearGradient colors={accentColors} style={styles.previewTitleBg}>
            <Text style={styles.previewTitle}>{day.title}</Text>
            <Text style={styles.previewDesc}>{day.description}</Text>
          </LinearGradient>

          {/* Stats */}
          <View style={styles.previewStats}>
            {[
              { icon: 'time-outline', label: `${day.duration_minutes} min`, color: COLORS.primary },
              { icon: 'flash-outline', label: `+${day.total_xp} XP`, color: COLORS.gold },
              { icon: 'barbell-outline', label: `${day.exercises.length} exercices`, color: COLORS.accent },
            ].map((s) => (
              <View key={s.label} style={styles.previewStat}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
                <Text style={[styles.previewStatText, { color: s.color }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Exercise list */}
          <Text style={styles.exerciseListTitle}>Programme de la séance</Text>
          {day.exercises.map((ex, i) => (
            <View key={ex.id} style={styles.exercisePreviewItem}>
              <View style={[styles.exercisePreviewNumber, { backgroundColor: accentColors[0] + '30' }]}>
                <Text style={styles.exercisePreviewNumberText}>{i + 1}</Text>
              </View>
              <View style={styles.exercisePreviewContent}>
                <Text style={styles.exercisePreviewName}>{ex.name}</Text>
                <Text style={styles.exercisePreviewMeta}>
                  {ex.duration_seconds > 0 ? `${ex.duration_seconds}s` : `${ex.reps} reps`}
                  {ex.sets && ex.sets > 1 ? ` × ${ex.sets} séries` : ''}
                  {' · '}
                  {ex.difficulty === 'easy' ? '🟢' : ex.difficulty === 'medium' ? '🟡' : '🔴'}
                </Text>
              </View>
              <Text style={styles.exercisePreviewXP}>+{ex.xp_reward} XP</Text>
            </View>
          ))}

          <View style={styles.previewCta}>
            <GrowButton
              title={day.is_rest_day ? '✅ Marquer comme fait' : '🚀 Démarrer la séance'}
              onPress={handleStartWorkout}
              variant="primary"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'active') {
    const currentExercise = day.exercises[activeExerciseIndex];
    if (!currentExercise) {
      handleCompleteWorkout();
      return null;
    }

    return (
      <View style={styles.container}>
        <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />

        {/* Header */}
        <View style={styles.activeHeader}>
          <TouchableOpacity onPress={handleExit} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
          <Text style={styles.activeTitle}>{day.title}</Text>
          <View style={styles.activeXP}>
            <Text style={styles.activeXPText}>+{day.total_xp} XP</Text>
          </View>
        </View>

        <ExerciseTimer
          exercise={currentExercise}
          exerciseIndex={activeExerciseIndex}
          totalExercises={day.exercises.length}
          onNext={handleNextExercise}
          onComplete={handleCompleteWorkout}
          mode={mode}
        />
      </View>
    );
  }

  if (phase === 'completed') {
    const scale = celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
    const opacity = celebrateAnim;

    return (
      <View style={styles.container}>
        <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />

        <Animated.View style={[styles.completedContainer, { transform: [{ scale }], opacity }]}>
          <LinearGradient colors={GRADIENTS.success} style={styles.completedIcon}>
            <Text style={styles.completedEmoji}>🏆</Text>
          </LinearGradient>

          <Text style={styles.completedTitle}>Séance terminée !</Text>
          <Text style={styles.completedSubtitle}>{day.title}</Text>

          <View style={styles.completedStats}>
            <View style={styles.completedStat}>
              <Text style={styles.completedStatValue}>+{earnedXP}</Text>
              <Text style={styles.completedStatLabel}>XP gagnés</Text>
            </View>
            <View style={styles.completedStat}>
              <Text style={styles.completedStatValue}>{day.exercises.length}</Text>
              <Text style={styles.completedStatLabel}>Exercices</Text>
            </View>
            <View style={styles.completedStat}>
              <Text style={styles.completedStatValue}>{Math.round((Date.now() - startTime) / 60000)}</Text>
              <Text style={styles.completedStatLabel}>Minutes</Text>
            </View>
          </View>

          {newAchievements.length > 0 && (
            <View style={styles.achPreview}>
              <Text style={styles.achPreviewTitle}>🏅 Succès débloqués !</Text>
              {newAchievements.map((a) => (
                <Text key={a.id} style={styles.achPreviewItem}>{a.icon} {a.title}</Text>
              ))}
            </View>
          )}

          <GrowButton title="Retour au programme" onPress={() => router.replace('/(tabs)/program')} variant="primary" style={styles.completedBtn} />
          <GrowButton title="Voir mes progrès" onPress={() => router.replace('/(tabs)/progress')} variant="outline" />
        </Animated.View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: COLORS.text, fontSize: 18, marginBottom: 12 },
  backLink: { color: COLORS.primaryLight, fontSize: 16 },
  // Preview
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  dayChip: { backgroundColor: COLORS.primary + '30', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  dayChipText: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700' },
  previewScroll: { padding: 20, paddingTop: 0 },
  previewTitleBg: { borderRadius: 20, padding: 24, marginBottom: 20, alignItems: 'center' },
  previewTitle: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  previewDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  previewStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  previewStat: { alignItems: 'center', gap: 6 },
  previewStatText: { fontSize: 14, fontWeight: '700' },
  exerciseListTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  exercisePreviewItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  exercisePreviewNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  exercisePreviewNumberText: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
  exercisePreviewContent: { flex: 1 },
  exercisePreviewName: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  exercisePreviewMeta: { color: COLORS.textMuted, fontSize: 12 },
  exercisePreviewXP: { color: COLORS.gold, fontSize: 12, fontWeight: '700' },
  previewCta: { marginTop: 24, marginBottom: 20 },
  // Active
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  activeTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  activeXP: { backgroundColor: COLORS.gold + '25', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeXPText: { color: COLORS.gold, fontSize: 12, fontWeight: '800' },
  // Completed
  completedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  completedIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12 },
  completedEmoji: { fontSize: 50 },
  completedTitle: { color: COLORS.text, fontSize: 32, fontWeight: '900', textAlign: 'center' },
  completedSubtitle: { color: COLORS.textMuted, fontSize: 16, textAlign: 'center' },
  completedStats: { flexDirection: 'row', gap: 24, backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  completedStat: { alignItems: 'center', gap: 4 },
  completedStatValue: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  completedStatLabel: { color: COLORS.textMuted, fontSize: 12 },
  achPreview: { backgroundColor: COLORS.gold + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.gold + '40', alignItems: 'center', gap: 8, width: '100%' },
  achPreviewTitle: { color: COLORS.gold, fontSize: 15, fontWeight: '800' },
  achPreviewItem: { color: COLORS.text, fontSize: 14 },
  completedBtn: { width: '100%' },
});
