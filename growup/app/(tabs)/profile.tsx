import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Image, Modal, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { COLORS, GRADIENTS, RANKS, XP_PER_LEVEL } from '@/constants/theme';
import { GradientCard } from '@/components/ui/GradientCard';
import { XPBar } from '@/components/ui/XPBar';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { GrowButton } from '@/components/ui/GrowButton';

export default function ProfileScreen() {
  const { profile, signOut, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [heightCm, setHeightCm] = useState(String(profile?.height_cm ?? ''));
  const [weightKg, setWeightKg] = useState(String(profile?.weight_kg ?? ''));
  const [targetHeight, setTargetHeight] = useState(String(profile?.target_height_cm ?? ''));
  const [isSaving, setIsSaving] = useState(false);

  const rank = RANKS.find((r) => r.name === profile?.rank) ?? RANKS[0];
  const nextRank = RANKS[RANKS.findIndex((r) => r.name === profile?.rank) + 1];

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission requise');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      await updateProfile({ avatar_url: uri });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        height_cm: parseFloat(heightCm) || profile?.height_cm,
        weight_kg: parseFloat(weightKg) || profile?.weight_kg,
        target_height_cm: parseFloat(targetHeight) || profile?.target_height_cm,
      } as any);
      setEditing(false);
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Es-tu sûr(e) de vouloir te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: async () => { await signOut(); router.replace('/(auth)/login'); } },
    ]);
  };

  const xpToNextLevel = XP_PER_LEVEL - ((profile?.xp ?? 0) % XP_PER_LEVEL);

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero section */}
        <LinearGradient
          colors={[COLORS.primary + '40', COLORS.background]}
          style={styles.hero}
        >
          <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <LinearGradient colors={GRADIENTS.primary} style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </LinearGradient>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{profile?.full_name ?? 'Utilisateur'}</Text>
          <Text style={styles.profileEmail}>{profile?.email}</Text>

          {/* Rank badge */}
          <LinearGradient
            colors={[rank.color + '30', rank.color + '10'] as any}
            style={styles.rankBadge}
          >
            <Text style={styles.rankIcon}>{rank.icon}</Text>
            <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.name}</Text>
          </LinearGradient>
        </LinearGradient>

        {/* XP & Stats */}
        <GradientCard style={styles.xpCard}>
          <XPBar xp={profile?.xp ?? 0} level={profile?.level ?? 1} />
          <View style={styles.xpDetails}>
            <View style={styles.xpStat}>
              <Text style={styles.xpStatValue}>{profile?.xp ?? 0}</Text>
              <Text style={styles.xpStatLabel}>XP total</Text>
            </View>
            <View style={styles.xpDivider} />
            <View style={styles.xpStat}>
              <Text style={styles.xpStatValue}>Niv. {profile?.level ?? 1}</Text>
              <Text style={styles.xpStatLabel}>Niveau actuel</Text>
            </View>
            <View style={styles.xpDivider} />
            <View style={styles.xpStat}>
              <Text style={styles.xpStatValue}>{xpToNextLevel}</Text>
              <Text style={styles.xpStatLabel}>XP vers Niv. {(profile?.level ?? 1) + 1}</Text>
            </View>
          </View>
          {nextRank && (
            <Text style={styles.nextRankHint}>
              Rang suivant : <Text style={{ color: nextRank.color }}>{nextRank.icon} {nextRank.name}</Text> (Niv. {nextRank.minLevel})
            </Text>
          )}
        </GradientCard>

        {/* Streak */}
        <GradientCard style={styles.streakCard}>
          <View style={styles.streakRow}>
            <View>
              <Text style={styles.streakTitle}>Streak actuel 🔥</Text>
              <Text style={styles.streakValue}>{profile?.streak_days ?? 0} jours consécutifs</Text>
            </View>
            <StreakBadge streak={profile?.streak_days ?? 0} size="lg" />
          </View>
        </GradientCard>

        {/* Info section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes informations</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Text style={styles.editBtn}>{editing ? 'Annuler' : 'Modifier'}</Text>
            </TouchableOpacity>
          </View>

          {editing ? (
            <View style={styles.editForm}>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Nom complet</Text>
                <TextInput style={styles.formInput} value={fullName} onChangeText={setFullName} placeholderTextColor={COLORS.textDim} />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Taille (cm)</Text>
                <TextInput style={styles.formInput} value={heightCm} onChangeText={setHeightCm} keyboardType="decimal-pad" placeholderTextColor={COLORS.textDim} />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Poids (kg)</Text>
                <TextInput style={styles.formInput} value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" placeholderTextColor={COLORS.textDim} />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Objectif de taille (cm)</Text>
                <TextInput style={styles.formInput} value={targetHeight} onChangeText={setTargetHeight} keyboardType="decimal-pad" placeholderTextColor={COLORS.textDim} />
              </View>
              <GrowButton title={isSaving ? 'Sauvegarde...' : 'Enregistrer'} onPress={handleSave} isLoading={isSaving} variant="primary" />
            </View>
          ) : (
            <View style={styles.infoGrid}>
              {[
                { label: 'Taille', value: `${profile?.height_cm ?? '—'} cm`, icon: 'resize-outline' },
                { label: 'Poids', value: `${profile?.weight_kg ?? '—'} kg`, icon: 'barbell-outline' },
                { label: 'Objectif', value: `${profile?.target_height_cm ?? '—'} cm`, icon: 'trending-up-outline' },
                { label: 'Programme', value: profile?.program_mode === 'grandir' ? '💪 Grandir' : '✨ Glow Up', icon: 'star-outline' },
              ].map((item) => (
                <View key={item.label} style={styles.infoCard}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.primaryLight} />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          {[
            { label: 'Mes succès', icon: 'trophy-outline', onPress: () => router.push('/achievements') },
            { label: 'Notifications', icon: 'notifications-outline', onPress: () => {} },
            { label: 'Partager l\'app', icon: 'share-outline', onPress: () => {} },
            { label: 'Confidentialité', icon: 'shield-outline', onPress: () => {} },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.settingsItem} onPress={item.onPress}>
              <View style={styles.settingsIcon}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.primaryLight} />
              </View>
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textDim} />
            </TouchableOpacity>
          ))}
        </View>

        <GrowButton
          title="Se déconnecter"
          onPress={handleSignOut}
          variant="danger"
          style={{ marginBottom: 40 }}
          icon={<Ionicons name="log-out-outline" size={18} color="#fff" />}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 0 },
  hero: { paddingTop: 70, paddingBottom: 28, alignItems: 'center', gap: 8, paddingHorizontal: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 4 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: COLORS.primary },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#fff', fontSize: 40, fontWeight: '900' },
  avatarEditBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.background },
  profileName: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  profileEmail: { color: COLORS.textMuted, fontSize: 14 },
  rankBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  rankIcon: { fontSize: 18 },
  rankLabel: { fontSize: 14, fontWeight: '700' },
  xpCard: { margin: 20, marginTop: 0 },
  xpDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  xpStat: { flex: 1, alignItems: 'center' },
  xpStatValue: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  xpStatLabel: { color: COLORS.textDim, fontSize: 11, marginTop: 2, textAlign: 'center' },
  xpDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  nextRankHint: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginTop: 12 },
  streakCard: { marginHorizontal: 20, marginBottom: 20 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakTitle: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  streakValue: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  editBtn: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, gap: 6, borderWidth: 1, borderColor: COLORS.border },
  infoLabel: { color: COLORS.textMuted, fontSize: 12 },
  infoValue: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  editForm: { gap: 12 },
  formRow: { gap: 4 },
  formLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  formInput: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, color: COLORS.text, fontSize: 15, paddingHorizontal: 16, paddingVertical: 12 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  settingsIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.primary + '20', alignItems: 'center', justifyContent: 'center' },
  settingsLabel: { flex: 1, color: COLORS.text, fontSize: 15, fontWeight: '600' },
});
