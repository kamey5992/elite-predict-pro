import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { COLORS, GRADIENTS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  const { profile } = useAuthStore();
  const { achievements, loadAchievements } = useProgressStore();

  useEffect(() => {
    if (profile) loadAchievements(profile.id);
  }, [profile?.id]);

  const unlocked = achievements.filter((a) => a.unlocked_at);
  const locked = achievements.filter((a) => !a.unlocked_at);
  const totalXPFromAch = unlocked.reduce((s, a) => s + a.xp_reward, 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Succès</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Summary */}
        <LinearGradient colors={GRADIENTS.gold} style={styles.summary}>
          <Text style={styles.summaryCount}>{unlocked.length} / {achievements.length}</Text>
          <Text style={styles.summaryLabel}>Succès débloqués</Text>
          <Text style={styles.summaryXP}>+{totalXPFromAch} XP gagnés</Text>
        </LinearGradient>

        {unlocked.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🏅 Obtenus</Text>
            <View style={styles.grid}>
              {unlocked.map((ach) => (
                <View key={ach.id} style={styles.achCard}>
                  <LinearGradient colors={GRADIENTS.gold} style={styles.achIcon}>
                    <Text style={{ fontSize: 28 }}>{ach.icon}</Text>
                  </LinearGradient>
                  <Text style={styles.achTitle}>{ach.title}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                  <View style={styles.achXP}>
                    <Text style={styles.achXPText}>+{ach.xp_reward} XP</Text>
                  </View>
                  {ach.unlocked_at && (
                    <Text style={styles.achDate}>
                      {new Date(ach.unlocked_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {locked.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🔒 À débloquer</Text>
            <View style={styles.grid}>
              {locked.map((ach) => (
                <View key={ach.id} style={[styles.achCard, styles.achCardLocked]}>
                  <View style={[styles.achIcon, { backgroundColor: COLORS.surfaceLight }]}>
                    <Text style={{ fontSize: 28, opacity: 0.3 }}>{ach.icon}</Text>
                  </View>
                  <Text style={[styles.achTitle, { color: COLORS.textDim }]}>{ach.title}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                  <View style={[styles.achXP, { backgroundColor: COLORS.border }]}>
                    <Text style={[styles.achXPText, { color: COLORS.textDim }]}>{ach.xp_reward} XP</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  title: { color: COLORS.text, fontSize: 20, fontWeight: '800' },
  scroll: { padding: 20, paddingTop: 8 },
  summary: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  summaryCount: { color: '#fff', fontSize: 40, fontWeight: '900' },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 4 },
  summaryXP: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achCard: { width: CARD_WIDTH, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border },
  achCardLocked: { opacity: 0.55 },
  achIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  achTitle: { color: COLORS.text, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  achDesc: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 15 },
  achXP: { backgroundColor: COLORS.gold + '25', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  achXPText: { color: COLORS.gold, fontSize: 12, fontWeight: '700' },
  achDate: { color: COLORS.textDim, fontSize: 10, marginTop: 2 },
});
