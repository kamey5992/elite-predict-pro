import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useProgramStore } from '@/store/programStore';
import { COLORS, GRADIENTS, RANKS } from '@/constants/theme';
import { GradientCard } from '@/components/ui/GradientCard';
import { XPBar } from '@/components/ui/XPBar';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { DayCard } from '@/components/program/DayCard';
import { ProgramMode } from '@/types';

const { width } = Dimensions.get('window');

export default function ProgramScreen() {
  const { profile } = useAuthStore();
  const { levels, activeMode, isLoading, loadProgram, loadCompletedDays, setCurrentDay, setActiveMode, isDayCompleted } = useProgramStore();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      loadProgram(activeMode, profile.xp);
      loadCompletedDays(profile.id);
    }
  }, [profile?.id, activeMode]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (profile) {
      await Promise.all([loadProgram(activeMode, profile.xp), loadCompletedDays(profile.id)]);
    }
    setRefreshing(false);
  };

  const switchMode = (mode: ProgramMode) => {
    setActiveMode(mode);
    setExpandedLevel(null);
  };

  const handleDayPress = (day: any) => {
    setCurrentDay(day);
    router.push(`/workout/${day.id}`);
  };

  const rank = RANKS.find((r) => r.name === profile?.rank) ?? RANKS[0];

  const totalCompleted = levels.reduce(
    (sum, l) => sum + l.days.filter((d) => isDayCompleted(d.id)).length,
    0
  );
  const totalDays = levels.reduce((sum, l) => sum + l.days.length, 0);
  const overallProgress = totalDays > 0 ? totalCompleted / totalDays : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour {profile?.full_name?.split(' ')[0] ?? ''} 👋</Text>
            <View style={styles.rankRow}>
              <Text style={styles.rankEmoji}>{rank.icon}</Text>
              <Text style={[styles.rankName, { color: rank.color }]}>{rank.name}</Text>
            </View>
          </View>
          <StreakBadge streak={profile?.streak_days ?? 0} size="md" />
        </View>

        {/* XP Bar */}
        <GradientCard style={styles.xpCard}>
          <XPBar xp={profile?.xp ?? 0} level={profile?.level ?? 1} />
        </GradientCard>

        {/* Overall progress */}
        <GradientCard colors={GRADIENTS.card} style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressTitle}>Progression globale</Text>
              <Text style={styles.progressCount}>{totalCompleted} / {totalDays} jours</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPct}>{Math.round(overallProgress * 100)}%</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${overallProgress * 100}%` }]}>
              <LinearGradient colors={GRADIENTS.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
            </View>
          </View>
        </GradientCard>

        {/* Mode switcher */}
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[styles.modeBtn, activeMode === 'grandir' && styles.modeBtnActiveGrandir]}
            onPress={() => switchMode('grandir')}
          >
            {activeMode === 'grandir' ? (
              <LinearGradient colors={GRADIENTS.grandir} style={styles.modeBtnGrad}>
                <Text style={styles.modeEmoji}>💪</Text>
                <Text style={styles.modeBtnTextActive}>Grandir</Text>
              </LinearGradient>
            ) : (
              <View style={styles.modeBtnGrad}>
                <Text style={styles.modeEmoji}>💪</Text>
                <Text style={styles.modeBtnText}>Grandir</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, activeMode === 'glowup' && styles.modeBtnActiveGlowup]}
            onPress={() => switchMode('glowup')}
          >
            {activeMode === 'glowup' ? (
              <LinearGradient colors={GRADIENTS.glowup} style={styles.modeBtnGrad}>
                <Text style={styles.modeEmoji}>✨</Text>
                <Text style={styles.modeBtnTextActive}>Glow Up</Text>
              </LinearGradient>
            ) : (
              <View style={styles.modeBtnGrad}>
                <Text style={styles.modeEmoji}>✨</Text>
                <Text style={styles.modeBtnText}>Glow Up</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Levels */}
        {levels.map((level) => {
          const isExpanded = expandedLevel === level.id;
          const completedInLevel = level.days.filter((d) => isDayCompleted(d.id)).length;
          const levelProgress = completedInLevel / level.days.length;
          const isLocked = (profile?.xp ?? 0) < level.unlock_xp;

          return (
            <View key={level.id} style={styles.levelSection}>
              <TouchableOpacity
                style={[styles.levelHeader, isLocked && styles.levelHeaderLocked]}
                onPress={() => !isLocked && setExpandedLevel(isExpanded ? null : level.id)}
                activeOpacity={isLocked ? 1 : 0.8}
              >
                <LinearGradient
                  colors={isLocked ? (['#1E1E40', '#12122A'] as const) : (activeMode === 'grandir' ? GRADIENTS.grandir : GRADIENTS.glowup)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.levelGradient}
                >
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{isLocked ? '🔒' : level.badge_icon}</Text>
                  </View>
                  <View style={styles.levelContent}>
                    <View style={styles.levelTitleRow}>
                      <Text style={styles.levelNumber}>Niveau {level.level_number}</Text>
                      {isLocked && (
                        <Text style={styles.levelLockHint}>{level.unlock_xp} XP requis</Text>
                      )}
                    </View>
                    <Text style={styles.levelTitle}>{level.title}</Text>
                    {!isLocked && (
                      <View style={styles.levelMeta}>
                        <Text style={styles.levelMetaText}>{completedInLevel}/{level.days.length} jours</Text>
                        <View style={styles.levelMiniBar}>
                          <View style={[styles.levelMiniBarFill, { width: `${levelProgress * 100}%` }]} />
                        </View>
                      </View>
                    )}
                  </View>
                  {!isLocked && (
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="rgba(255,255,255,0.7)"
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {isExpanded && !isLocked && (
                <View style={styles.daysContainer}>
                  {level.days.map((day) => (
                    <DayCard
                      key={day.id}
                      day={day}
                      isCompleted={isDayCompleted(day.id)}
                      isLocked={false}
                      mode={activeMode}
                      onPress={() => handleDayPress(day)}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rankEmoji: { fontSize: 16 },
  rankName: { fontSize: 14, fontWeight: '700' },
  xpCard: { marginBottom: 14 },
  progressCard: { marginBottom: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressTitle: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  progressCount: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  progressCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary + '30', alignItems: 'center', justifyContent: 'center' },
  progressPct: { color: COLORS.primaryLight, fontSize: 16, fontWeight: '800' },
  progressTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden', minWidth: 4 },
  modeSwitch: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  modeBtn: { flex: 1, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  modeBtnActiveGrandir: { borderColor: COLORS.primary },
  modeBtnActiveGlowup: { borderColor: COLORS.accent },
  modeBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, backgroundColor: COLORS.surface },
  modeEmoji: { fontSize: 18 },
  modeBtnText: { color: COLORS.textMuted, fontWeight: '700', fontSize: 14 },
  modeBtnTextActive: { color: '#fff', fontWeight: '800', fontSize: 14 },
  levelSection: { marginBottom: 12 },
  levelHeader: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  levelHeaderLocked: { opacity: 0.65 },
  levelGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  levelBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  levelBadgeText: { fontSize: 22 },
  levelContent: { flex: 1 },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  levelNumber: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  levelLockHint: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  levelTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  levelMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  levelMetaText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  levelMiniBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  levelMiniBarFill: { height: '100%', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2 },
  daysContainer: { marginTop: 8, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: COLORS.primary + '50' },
});
