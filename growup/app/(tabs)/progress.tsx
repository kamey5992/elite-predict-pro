import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Image, Modal, Dimensions, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { GradientCard } from '@/components/ui/GradientCard';
import { GrowButton } from '@/components/ui/GrowButton';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 56) / 3;

export default function ProgressScreen() {
  const { profile } = useAuthStore();
  const { heightHistory, weightHistory, photos, totalWorkouts, isLoading, loadProgress, addHeightMeasurement, addWeightMeasurement, addPhoto, deletePhoto, getWorldPercentile } = useProgressStore();

  const [activeTab, setActiveTab] = useState<'measurements' | 'photos'>('measurements');
  const [showAddHeight, setShowAddHeight] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newHeight, setNewHeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [heightNote, setHeightNote] = useState('');
  const [weightNote, setWeightNote] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (profile) loadProgress(profile.id);
  }, [profile?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (profile) await loadProgress(profile.id);
    setRefreshing(false);
  };

  const handleAddHeight = async () => {
    const h = parseFloat(newHeight);
    if (!h || h < 50 || h > 300) return Alert.alert('Taille invalide', 'Entre une taille entre 50 et 300 cm.');
    await addHeightMeasurement(profile!.id, h, heightNote || undefined);
    setNewHeight('');
    setHeightNote('');
    setShowAddHeight(false);
  };

  const handleAddWeight = async () => {
    const w = parseFloat(newWeight);
    if (!w || w < 20 || w > 500) return Alert.alert('Poids invalide', 'Entre un poids valide.');
    await addWeightMeasurement(profile!.id, w, weightNote || undefined);
    setNewWeight('');
    setWeightNote('');
    setShowAddWeight(false);
  };

  const handleAddPhoto = async (category: 'front' | 'side' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission requise', 'Autorise l'accès à tes photos.');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      await addPhoto(profile!.id, result.assets[0].uri, category);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert('Supprimer', 'Supprimer cette photo ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deletePhoto(photoId) },
    ]);
  };

  const latestHeight = heightHistory.at(-1);
  const initialHeight = heightHistory.at(0);
  const heightGain = latestHeight && initialHeight ? latestHeight.height_cm - initialHeight.height_cm : 0;
  const latestWeight = weightHistory.at(-1);
  const percentile = profile && latestHeight ? getWorldPercentile(latestHeight.height_cm, 18, 'male') : 0;

  const heightTarget = profile?.target_height_cm ?? 175;
  const heightCurrent = latestHeight?.height_cm ?? profile?.height_cm ?? 170;
  const heightProgressToGoal = Math.min(1, Math.max(0, (heightCurrent - (initialHeight?.height_cm ?? heightCurrent)) / (heightTarget - (initialHeight?.height_cm ?? heightCurrent) + 0.001)));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Mes Progrès 📈</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <GradientCard colors={GRADIENTS.grandir} style={styles.statCard} innerStyle={styles.statInner}>
            <Text style={styles.statValue}>{latestHeight?.height_cm ?? profile?.height_cm ?? '—'}</Text>
            <Text style={styles.statUnit}>cm</Text>
            <Text style={styles.statLabel}>Taille actuelle</Text>
          </GradientCard>
          <GradientCard colors={GRADIENTS.glowup} style={styles.statCard} innerStyle={styles.statInner}>
            <Text style={styles.statValue}>{heightGain > 0 ? `+${heightGain.toFixed(1)}` : '0'}</Text>
            <Text style={styles.statUnit}>cm</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </GradientCard>
          <GradientCard colors={GRADIENTS.gold} style={styles.statCard} innerStyle={styles.statInner}>
            <Text style={styles.statValue}>{percentile}</Text>
            <Text style={styles.statUnit}>%</Text>
            <Text style={styles.statLabel}>Percentile mondial</Text>
          </GradientCard>
        </View>

        {/* Objectif taille */}
        <GradientCard style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalLabel}>Objectif de taille</Text>
              <Text style={styles.goalValue}>{heightTarget} cm</Text>
            </View>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>{totalWorkouts} séances</Text>
            </View>
          </View>
          <View style={styles.goalTrack}>
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.goalFill, { width: `${Math.max(2, heightProgressToGoal * 100)}%` }]}
            />
          </View>
          <View style={styles.goalLabels}>
            <Text style={styles.goalLabelText}>{initialHeight?.height_cm ?? heightCurrent} cm</Text>
            <Text style={styles.goalLabelText}>{heightTarget} cm 🎯</Text>
          </View>
        </GradientCard>

        {/* Tab switcher */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, activeTab === 'measurements' && styles.tabActive]} onPress={() => setActiveTab('measurements')}>
            <Ionicons name="analytics-outline" size={16} color={activeTab === 'measurements' ? COLORS.primaryLight : COLORS.textDim} />
            <Text style={[styles.tabText, activeTab === 'measurements' && styles.tabTextActive]}>Mesures</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'photos' && styles.tabActive]} onPress={() => setActiveTab('photos')}>
            <Ionicons name="images-outline" size={16} color={activeTab === 'photos' ? COLORS.primaryLight : COLORS.textDim} />
            <Text style={[styles.tabText, activeTab === 'photos' && styles.tabTextActive]}>Photos</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'measurements' && (
          <View>
            {/* Height section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📏 Historique de taille</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddHeight(true)}>
                <Ionicons name="add" size={18} color={COLORS.primaryLight} />
              </TouchableOpacity>
            </View>
            {heightHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📏</Text>
                <Text style={styles.emptyText}>Ajoute ta première mesure</Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {[...heightHistory].reverse().slice(0, 8).map((m) => (
                  <View key={m.id} style={styles.historyItem}>
                    <View style={styles.historyDot} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historyValue}>{m.height_cm} cm</Text>
                      {m.note && <Text style={styles.historyNote}>{m.note}</Text>}
                    </View>
                    <Text style={styles.historyDate}>{formatDate(m.measured_at)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Weight section */}
            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <Text style={styles.sectionTitle}>⚖️ Historique de poids</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddWeight(true)}>
                <Ionicons name="add" size={18} color={COLORS.primaryLight} />
              </TouchableOpacity>
            </View>
            {weightHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>⚖️</Text>
                <Text style={styles.emptyText}>Ajoute ta première pesée</Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {[...weightHistory].reverse().slice(0, 8).map((m) => (
                  <View key={m.id} style={styles.historyItem}>
                    <View style={[styles.historyDot, { backgroundColor: COLORS.accent }]} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historyValue}>{m.weight_kg} kg</Text>
                      {m.note && <Text style={styles.historyNote}>{m.note}</Text>}
                    </View>
                    <Text style={styles.historyDate}>{formatDate(m.measured_at)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'photos' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📸 Photos de progression</Text>
            </View>
            <View style={styles.photoCategories}>
              {([['front', 'Face', '👤'], ['side', 'Profil', '🧍'], ['back', 'Dos', '🔙']] as const).map(([cat, label, emoji]) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.photoCategoryBtn}
                  onPress={() => handleAddPhoto(cat)}
                >
                  <LinearGradient colors={GRADIENTS.primary} style={styles.photoCategoryGrad}>
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                    <Text style={styles.photoCategoryLabel}>Ajouter {label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {photos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📸</Text>
                <Text style={styles.emptyText}>Aucune photo pour l'instant</Text>
                <Text style={styles.emptySubtext}>Compare tes progrès visuellement</Text>
              </View>
            ) : (
              <View style={styles.photoGrid}>
                {photos.map((photo) => (
                  <TouchableOpacity
                    key={photo.id}
                    style={styles.photoItem}
                    onLongPress={() => handleDeletePhoto(photo.id)}
                  >
                    <Image source={{ uri: photo.photo_url }} style={styles.photoImage} />
                    <View style={styles.photoLabel}>
                      <Text style={styles.photoLabelText}>
                        {photo.category === 'front' ? 'Face' : photo.category === 'side' ? 'Profil' : 'Dos'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Height Modal */}
      <Modal visible={showAddHeight} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Nouvelle mesure de taille</Text>
            <TextInput style={styles.modalInput} placeholder="Taille en cm (ex: 172.5)" placeholderTextColor={COLORS.textDim} value={newHeight} onChangeText={setNewHeight} keyboardType="decimal-pad" autoFocus />
            <TextInput style={styles.modalInput} placeholder="Note (optionnel)" placeholderTextColor={COLORS.textDim} value={heightNote} onChangeText={setHeightNote} />
            <View style={styles.modalButtons}>
              <GrowButton title="Annuler" onPress={() => setShowAddHeight(false)} variant="ghost" style={{ flex: 1 }} />
              <GrowButton title="Enregistrer" onPress={handleAddHeight} variant="primary" style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Weight Modal */}
      <Modal visible={showAddWeight} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Nouveau poids</Text>
            <TextInput style={styles.modalInput} placeholder="Poids en kg (ex: 68.5)" placeholderTextColor={COLORS.textDim} value={newWeight} onChangeText={setNewWeight} keyboardType="decimal-pad" autoFocus />
            <TextInput style={styles.modalInput} placeholder="Note (optionnel)" placeholderTextColor={COLORS.textDim} value={weightNote} onChangeText={setWeightNote} />
            <View style={styles.modalButtons}>
              <GrowButton title="Annuler" onPress={() => setShowAddWeight(false)} variant="ghost" style={{ flex: 1 }} />
              <GrowButton title="Enregistrer" onPress={handleAddWeight} variant="primary" style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 60 },
  pageTitle: { color: COLORS.text, fontSize: 28, fontWeight: '900', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1 },
  statInner: { alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statUnit: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', marginTop: -2 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4, textAlign: 'center' },
  goalCard: { marginBottom: 20 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  goalLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  goalValue: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  goalBadge: { backgroundColor: COLORS.primary + '30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  goalBadgeText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '700' },
  goalTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  goalFill: { height: '100%', borderRadius: 4, minWidth: 4 },
  goalLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  goalLabelText: { color: COLORS.textDim, fontSize: 12 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 9 },
  tabActive: { backgroundColor: COLORS.surfaceLight },
  tabText: { color: COLORS.textDim, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: COLORS.primaryLight, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '25', alignItems: 'center', justifyContent: 'center' },
  historyList: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border + '60', gap: 12 },
  historyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  historyContent: { flex: 1 },
  historyValue: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  historyNote: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  historyDate: { color: COLORS.textDim, fontSize: 12 },
  emptyState: { alignItems: 'center', padding: 32, backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
  emptySubtext: { color: COLORS.textDim, fontSize: 13, marginTop: 4 },
  photoCategories: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  photoCategoryBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  photoCategoryGrad: { alignItems: 'center', paddingVertical: 14, gap: 4 },
  photoCategoryLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoItem: { width: PHOTO_SIZE, height: PHOTO_SIZE * 1.3, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  photoLabel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 4, alignItems: 'center' },
  photoLabelText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 14, borderTopWidth: 1, borderColor: COLORS.border },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  modalInput: { backgroundColor: COLORS.surfaceLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, color: COLORS.text, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  modalButtons: { flexDirection: 'row', gap: 12 },
});
