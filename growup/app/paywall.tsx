import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { PLANS, monthlyEquiv } from '@/constants/subscriptionPlans';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { GrowButton } from '@/components/ui/GrowButton';
import { BillingPeriod } from '@/types';

const PAYMENT_METHODS = [
  { id: 'wave',   label: 'Wave',         emoji: '🌊', color: '#00A3E0', bg: 'rgba(0,163,224,.15)' },
  { id: 'orange', label: 'Orange Money', emoji: '🟠', color: '#FF6600', bg: 'rgba(255,102,0,.15)' },
  { id: 'moov',   label: 'Moov Money',   emoji: '🔵', color: '#0064C8', bg: 'rgba(0,100,200,.15)' },
  { id: 'card',   label: 'Carte',        emoji: '💳', color: COLORS.primary, bg: COLORS.primary + '20' },
];

export default function PaywallScreen() {
  const { user, profile } = useAuthStore();
  const { startCheckout, tier: currentTier } = useSubscriptionStore();
  const [billing, setBilling] = useState<BillingPeriod>('yearly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('wave');

  const paidPlans = PLANS.filter((p) => p.tier !== 'free');

  const handleUpgrade = async (planTier: string, priceId: string) => {
    if (!user) return;
    if (!priceId) {
      Alert.alert('Bientôt disponible', 'Le paiement en ligne sera disponible très prochainement !');
      return;
    }
    setLoadingPlan(planTier);
    try {
      const method = selectedPayment === 'card' ? 'stripe' : 'paydunya';
      await startCheckout(priceId, user.id, profile?.email ?? user.email ?? '', method);
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Impossible de démarrer le paiement.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Header */}
        <LinearGradient colors={[COLORS.primary + '30', 'transparent']} style={styles.heroGrad}>
          <Text style={styles.heroEmoji}>🚀</Text>
          <Text style={styles.title}>Débloque tout GrowUp</Text>
          <Text style={styles.subtitle}>
            7 jours d'essai gratuit · Annulation à tout moment
          </Text>
        </LinearGradient>

        {/* Social proof */}
        <View style={styles.socialProof}>
          <Text style={styles.socialEmoji}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.socialText}>+2 000 utilisateurs ont transformé leur corps</Text>
        </View>

        {/* Billing toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingBtn, billing === 'monthly' && styles.billingBtnActive]}
            onPress={() => setBilling('monthly')}
          >
            <Text style={[styles.billingLabel, billing === 'monthly' && styles.billingLabelActive]}>Mensuel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingBtn, billing === 'yearly' && styles.billingBtnActive]}
            onPress={() => setBilling('yearly')}
          >
            <Text style={[styles.billingLabel, billing === 'yearly' && styles.billingLabelActive]}>Annuel</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>-50%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plan cards */}
        {paidPlans.map((plan) => {
          const priceId = billing === 'monthly' ? plan.stripe_price_monthly : plan.stripe_price_yearly;
          const priceCents = billing === 'monthly' ? plan.price_monthly_cents : plan.price_yearly_cents;
          const isCurrentPlan = currentTier === plan.tier;
          const isElite = plan.tier === 'elite';

          return (
            <View key={plan.tier} style={[styles.planCard, isElite && styles.planCardElite]}>
              {isElite && (
                <LinearGradient
                  colors={[plan.color + '15', 'transparent']}
                  style={StyleSheet.absoluteFillObject}
                />
              )}

              {plan.badge && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
                  <Text style={styles.planEmoji}>{plan.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                  {billing === 'yearly' && priceCents > 0 && (
                    <Text style={styles.monthlyEquiv}>soit {monthlyEquiv(priceCents)}</Text>
                  )}
                </View>
                <View style={styles.priceBlock}>
                  <Text style={[styles.priceAmount, { color: plan.color }]}>
                    {(priceCents / 100).toFixed(2).replace('.', ',')}€
                  </Text>
                  <Text style={styles.pricePer}>/{billing === 'monthly' ? 'mois' : 'an'}</Text>
                </View>
              </View>

              <View style={styles.featureList}>
                {plan.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {isCurrentPlan ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>✓ Ton abonnement actuel</Text>
                </View>
              ) : (
                <GrowButton
                  title={loadingPlan === plan.tier ? 'Chargement...' : `Commencer l'essai gratuit`}
                  onPress={() => handleUpgrade(plan.tier, priceId)}
                  isLoading={loadingPlan === plan.tier}
                  variant={isElite ? 'accent' : 'primary'}
                  style={{ marginTop: 16 }}
                />
              )}
            </View>
          );
        })}

        {/* Payment methods */}
        <View style={styles.paySection}>
          <Text style={styles.paySectionTitle}>Mode de paiement</Text>
          <View style={styles.payGrid}>
            {PAYMENT_METHODS.map((pm) => (
              <TouchableOpacity
                key={pm.id}
                style={[styles.payBtn, { backgroundColor: pm.bg, borderColor: selectedPayment === pm.id ? pm.color : COLORS.border }]}
                onPress={() => setSelectedPayment(pm.id)}
              >
                <Text style={styles.payEmoji}>{pm.emoji}</Text>
                <Text style={[styles.payLabel, selectedPayment === pm.id && { color: pm.color }]}>{pm.label}</Text>
                {selectedPayment === pm.id && (
                  <View style={[styles.payCheck, { backgroundColor: pm.color }]}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comparison table */}
        <View style={styles.compTable}>
          <Text style={styles.compTitle}>Comparaison des plans</Text>
          {[
            { label: 'Niveau 1, Jour 1', free: true, pro: true, elite: true },
            { label: 'Tous les niveaux', free: false, pro: true, elite: true },
            { label: 'Suivi des mesures', free: false, pro: true, elite: true },
            { label: 'Succès & défis', free: false, pro: true, elite: true },
            { label: "Photos (jusqu'à 10)", free: false, pro: true, elite: true },
            { label: 'Photos illimitées', free: false, pro: false, elite: true },
            { label: 'Percentile mondial', free: false, pro: false, elite: true },
          ].map((row) => (
            <View key={row.label} style={styles.compRow}>
              <Text style={styles.compLabel}>{row.label}</Text>
              {(['free', 'pro', 'elite'] as const).map((t) => (
                <View key={t} style={styles.compCell}>
                  <Ionicons
                    name={row[t] ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={row[t] ? COLORS.success : COLORS.border}
                  />
                </View>
              ))}
            </View>
          ))}
          <View style={styles.compHeaderRow}>
            <View style={{ flex: 1 }} />
            {['Gratuit', 'Pro', 'Elite'].map((h) => (
              <Text key={h} style={styles.compHeader}>{h}</Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={() => router.back()}>
          <Text style={styles.skipText}>Rester sur le plan gratuit</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          Paiement 100% sécurisé via Stripe. Renouvellement automatique.{'\n'}
          Annulable à tout moment depuis ton profil.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 48 },
  closeBtn: { position: 'absolute', top: 54, right: 20, zIndex: 10, padding: 8, backgroundColor: COLORS.surface, borderRadius: 20 },
  heroGrad: { paddingTop: 80, paddingBottom: 24, alignItems: 'center', gap: 8, paddingHorizontal: 24 },
  heroEmoji: { fontSize: 52 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
  socialProof: { alignItems: 'center', marginBottom: 20 },
  socialEmoji: { fontSize: 16, marginBottom: 4 },
  socialText: { color: COLORS.textDim, fontSize: 13 },
  billingToggle: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 14, padding: 4, marginHorizontal: 20, marginBottom: 20, gap: 4 },
  billingBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  billingBtnActive: { backgroundColor: COLORS.primary },
  billingLabel: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
  billingLabelActive: { color: '#fff' },
  saveBadge: { backgroundColor: '#10B981', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  saveBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  planCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, marginHorizontal: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  planCardElite: { borderColor: '#F59E0B50' },
  popularBadge: { position: 'absolute', top: 12, right: 12, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  popularBadgeText: { color: '#000', fontSize: 10, fontWeight: '900' },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  planIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  planEmoji: { fontSize: 24 },
  planName: { fontSize: 18, fontWeight: '800' },
  monthlyEquiv: { color: COLORS.textDim, fontSize: 11, marginTop: 2 },
  priceBlock: { alignItems: 'flex-end' },
  priceAmount: { fontSize: 22, fontWeight: '900' },
  pricePer: { color: COLORS.textDim, fontSize: 12 },
  featureList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { color: COLORS.text, fontSize: 14, flex: 1 },
  currentBadge: { backgroundColor: COLORS.success + '20', borderRadius: 10, padding: 12, marginTop: 16, alignItems: 'center' },
  currentBadgeText: { color: COLORS.success, fontSize: 14, fontWeight: '700' },
  compTable: { marginHorizontal: 20, marginVertical: 8, backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  compTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', padding: 16, paddingBottom: 8 },
  compHeaderRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8 },
  compHeader: { width: 52, textAlign: 'center', color: COLORS.textDim, fontSize: 11, fontWeight: '700' },
  compRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  compLabel: { flex: 1, color: COLORS.textMuted, fontSize: 13 },
  compCell: { width: 52, alignItems: 'center' },
  paySection: { marginHorizontal: 20, marginBottom: 16 },
  paySectionTitle: { color: COLORS.textMuted, fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  payGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  payBtn: { width: '48%', borderRadius: 12, borderWidth: 2, padding: 12, alignItems: 'center', gap: 4, position: 'relative' },
  payEmoji: { fontSize: 22 },
  payLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  payCheck: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  skipBtn: { alignItems: 'center', paddingVertical: 20 },
  skipText: { color: COLORS.textDim, fontSize: 14, textDecorationLine: 'underline' },
  legal: { color: COLORS.textDim, fontSize: 11, textAlign: 'center', lineHeight: 16, paddingHorizontal: 24 },
});
