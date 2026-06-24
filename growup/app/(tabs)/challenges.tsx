import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { GradientCard } from '@/components/ui/GradientCard';
import { Achievement } from '@/types';

const DAILY_CHALLENGES = [
  { id: 'dc1', title: '💧 Hydratation', description: 'Boire 2,5 L d\'eau aujourd\'hui', xp_reward: 25, icon: '💧', challenge_type: 'hydration', completed: false },
  { id: 'dc2', title: '😴 Sommeil réparateur', description: 'Dormir 8 heures cette nuit', xp_reward: 30, icon: '😴', challenge_type: 'sleep', completed: false },
  { id: 'dc3', title: '🧘 Étirement du matin', description: '10 minutes de stretching au réveil', xp_reward: 20, icon: '🧘', challenge_type: 'stretch', completed: false },
  { id: 'dc4', title: '🥗 Repas équilibré', description: 'Manger 5 fruits et légumes aujourd\'hui', xp_reward: 25, icon: '🥗', challenge_type: 'nutrition', completed: false },
  { id: 'dc5', title: '🚶 10 000 pas', description: 'Atteindre 10 000 pas aujourd\'hui', xp_reward: 35, icon: '🚶', challenge_type: 'workout', completed: false },
];

export default function ChallengesScreen() {
  const { profile, addXP } = useAuthStore();
  const { achievements, loadAchievements } = useProgressStore();
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [activeAchievementTab, setActiveAchievementTab] = useState<'locked' | 'unlocked'>('unlocked');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (profile) loadAchievements(profile.id);
  }, [profile?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (profile) await loadAchievements(profile.id);
    setRefreshing(false);
  };

  const completeChallenge = async (challengeId: string, xp: number) => {
    if (completedChallenges.has(challengeId)) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompletedChallenges((prev) => new Set([...prev, challengeId]));
    await addXP(xp);
  };

  const totalXPAvailable = challenges.reduce((s, c) => s + c.xp_reward, 0);
  const earnedXP = challenges.filter((c) => completedChallenges.has(c.id)).reduce((s, c) => s + c.xp_reward, 0);

  const unlockedAchievements = achievements.filter((a) => a.unlocked_at);
  const lockedAchievements = achievements.filter((a) => !a.unlocked_at);

  const conditionLabel = (type: string, value: number) => {
    switch (type) {
      case 'workouts': return `${value} séances`;
      case 'streak': return `Streak ${value} jours`;
      case 'level': return `Niveau ${value}`;
      case 'height_gain': return `+${value} cm`;
      default: return `${value}`;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
      >
        <Text style={styles.pageTitle}>Défis & Succès 🏆</Text>

        {/* Daily challenges */}
        <GradientCard style={styles.dailyHeader}>
          <View style={styles.dailyTopRow}>
            <View>
              <Text style={styles.dailyTitle}>Défis du jour</Text>
              <Text style={styles.dailyDate}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <View style={styles.dailyXPBadge}>
              <Text style={styles.dailyXPText}>{earnedXP} / {totalXPAvailable} XP</Text>
            </View>
          </View>
          <View style={styles.dailyTrack}>
            <LinearGradient
              colors={GRADIENTS.gold}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.dailyFill, { width: `${totalXPAvailable > 0 ? (earnedXP / totalXPAvailable) * 100 : 0}%` }]}
            />
          </View>
        </GradientCard>

        <View style={styles.challengesList}>
          {challenges.map((c) => {
            const done = completedChallenges.has(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => completeChallenge(c.id, c.xp_reward)}
                activeOpacity={done ? 1 : 0.8}
                style={[styles.challengeCard, done && styles.challengeCardDone]}
              >
                <Text style={styles.challengeIcon}>{c.icon}</Text>
                <View style={styles.challengeContent}>
                  <Text style={styles.challengeTitle}>{c.title}</Text>
                  <Text style={styles.challengeDesc}>{c.description}</Text>
                </View>
                <View style={styles.challengeRight}>
                  <LinearGradient colors={done ? GRADIENTS.success : GRADIENTS.gold} style={styles.challengeXP}>
                    <Text style={styles.challengeXPText}>+{c.xp_reward}</Text>
                  </LinearGradient>
                  {done && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} style={{ marginTop: 4 }} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Succès 🏅</Text>
        <View style={styles.achTabs}>
          <TouchableOpacity style={[styles.achTab, activeAchievementTab === 'unlocked' && styles.achTabActive]} onPress={() => setActiveAchievementTab('unlocked')}>
            <Text style={[styles.achTabText, activeAchievementTab === 'unlocked' && styles.achTabTextActive]}>
              Obtenus ({unlockedAchievements.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.achTab, activeAchievementTab === 'locked' && styles.achTabActive]} onPress={() => setActiveAchievementTab('locked')}>
            <Text style={[styles.achTabText, activeAchievementTab === 'locked' && styles.achTabTextActive]}>
              À débloquer ({lockedAchievements.length})
            </Text>
          </TouchableOpacity>
        </View>

        {achievements.length === 0 ? (
          <View style={styles.emptyAch}>
            <Text style={styles.emptyEmoji}>🏅</Text>
            <Text style={styles.emptyText}>Les succès se chargent...</Text>
          </View>
        ) : (
          <View style={styles.achGrid}>
            {(activeAchievementTab === 'unlocked' ? unlockedAchievements : lockedAchievements).map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} conditionLabel={conditionLabel} />
            ))}
            {activeAchievementTab === 'unlocked' && unlockedAchievements.length === 0 && (
              <View style={styles.emptyAch}>
                <Text style={styles.emptyEmoji}>🎯</Text>
                <Text style={styles.emptyText}>Complète des défis pour débloquer des succès</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function AchievementCard({ achievement, conditionLabel }: { achievement: Achievement; conditionLabel: (t: string, v: number) => string }) {
  const isUnlocked = !!achievement.unlocked_at;
  return (
    <View style={[styles.achCard, !isUnlocked && styles.achCardLocked]}>
      <LinearGradient
        colors={isUnlocked ? GRADIENTS.gold : (['#1E1E40', '#12122A'] as const)}
        style={styles.achIconCircle}
      >
        <Text style={styles.achIcon}>{isUnlocked ? achievement.icon : '🔒'}</Text>
      </LinearGradient>
      <Text style={[styles.achTitle, !isUnlocked && styles.achTitleLocked]}>{achievement.title}</Text>
      <Text style={styles.achDesc}>{achievement.description}</Text>
      <View style={styles.achCondition}>
        <Text style={styles.achConditionText}>{conditionLabel(achievement.condition_type, achievement.condition_value)}</Text>
      </View>
      {isUnlocked && (
        <View style={styles.achXPBadge}>
          <Text style={styles.achXPText}>+{achievement.xp_reward} XP</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 60 },
  pageTitle: { color: COLORS.text, fontSize: 28, fontWeight: '900', marginBottom: 20 },
  dailyHeader: { marginBottom: 14 },
  dailyTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dailyTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  dailyDate: { color: COLORS.textMuted, fontSize: 12, textTransform: 'capitalize' },
  dailyXPBadge: { backgroundColor: COLORS.primary + '30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dailyXPText: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '700' },
  dailyTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  dailyFill: { height: '100%', borderRadius: 3, minWidth: 4 },
  challengesList: { gap: 10, marginBottom: 28 },
  challengeCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  challengeCardDone: { borderColor: COLORS.success + '50', backgroundColor: COLORS.success + '10' },
  challengeIcon: { fontSize: 32 },
  challengeContent: { flex: 1 },
  challengeTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  challengeDesc: { color: COLORS.textMuted, fontSize: 12 },
  challengeRight: { alignItems: 'center', gap: 4 },
  challengeXP: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  challengeXPText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sectionTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: 14 },
  achTabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  achTab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  achTabActive: { backgroundColor: COLORS.surfaceLight },
  achTabText: { color: COLORS.textDim, fontSize: 13, fontWeight: '600' },
  achTabTextActive: { color: COLORS.primaryLight, fontWeight: '700' },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achCard: { width: (Dimensions.get('window').width - 52) / 2, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.border },
  achCardLocked: { opacity: 0.6 },
  achIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  achIcon: { fontSize: 28 },
  achTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  achTitleLocked: { color: COLORS.textDim },
  achDesc: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 16 },
  achCondition: { backgroundColor: COLORS.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  achConditionText: { color: COLORS.textDim, fontSize: 11, fontWeight: '600' },
  achXPBadge: { backgroundColor: COLORS.gold + '25', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  achXPText: { color: COLORS.gold, fontSize: 12, fontWeight: '700' },
  emptyAch: { width: '100%', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
});
