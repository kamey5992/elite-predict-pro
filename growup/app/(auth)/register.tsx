import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { GrowButton } from '@/components/ui/GrowButton';

type Step = 'identity' | 'measurements' | 'mode';

export default function RegisterScreen() {
  const { signUp, updateProfile, isLoading } = useAuthStore();
  const [step, setStep] = useState<Step>('identity');

  // Step 1 — identity
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 — measurements
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [targetHeightCm, setTargetHeightCm] = useState('175');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');

  // Step 3 — mode
  const [programMode, setProgramMode] = useState<'grandir' | 'glowup'>('grandir');

  const goNext = () => {
    if (step === 'identity') {
      if (!fullName.trim() || !email.trim() || !password) {
        return Alert.alert('Champs requis', 'Remplis tous les champs.');
      }
      if (password !== confirmPassword) {
        return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      }
      if (password.length < 6) {
        return Alert.alert('Mot de passe', 'Au moins 6 caractères requis.');
      }
      setStep('measurements');
    } else if (step === 'measurements') {
      setStep('mode');
    }
  };

  const handleRegister = async () => {
    try {
      await signUp(email.trim().toLowerCase(), password, fullName.trim());
      await updateProfile({
        height_cm: parseFloat(heightCm) || 170,
        weight_kg: parseFloat(weightKg) || 70,
        target_height_cm: parseFloat(targetHeightCm) || 175,
        date_of_birth: dob || null,
        program_mode: programMode,
      } as any);
      router.replace('/(tabs)/program');
    } catch (error: any) {
      Alert.alert('Erreur', error.message ?? 'Impossible de créer le compte.');
    }
  };

  const GENDERS: { value: 'male' | 'female' | 'other'; label: string; emoji: string }[] = [
    { value: 'male', label: 'Homme', emoji: '♂️' },
    { value: 'female', label: 'Femme', emoji: '♀️' },
    { value: 'other', label: 'Autre', emoji: '⚧️' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={GRADIENTS.dark} style={StyleSheet.absoluteFillObject} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.back} onPress={() => step === 'identity' ? router.back() : setStep(step === 'mode' ? 'measurements' : 'identity')}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.steps}>
          {(['identity', 'measurements', 'mode'] as Step[]).map((s, i) => (
            <View key={s} style={[styles.stepDot, step === s && styles.stepDotActive,
              (['identity', 'measurements', 'mode'] as Step[]).indexOf(step) > i && styles.stepDotDone]} />
          ))}
        </View>

        {step === 'identity' && (
          <View style={styles.form}>
            <Text style={styles.title}>Crée ton compte 🌱</Text>
            <Text style={styles.subtitle}>Commence ton voyage GrowUp</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Prénom & Nom" placeholderTextColor={COLORS.textDim} value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor={COLORS.textDim} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Mot de passe" placeholderTextColor={COLORS.textDim} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Confirmer le mot de passe" placeholderTextColor={COLORS.textDim} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
            </View>
            <GrowButton title="Continuer →" onPress={goNext} variant="primary" style={{ marginTop: 8 }} />
          </View>
        )}

        {step === 'measurements' && (
          <View style={styles.form}>
            <Text style={styles.title}>Tes mensurations 📏</Text>
            <Text style={styles.subtitle}>Pour personnaliser ton programme</Text>

            <Text style={styles.label}>Genre</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.genderBtn, gender === g.value && styles.genderBtnActive]}
                  onPress={() => setGender(g.value)}
                >
                  <Text style={styles.genderEmoji}>{g.emoji}</Text>
                  <Text style={[styles.genderLabel, gender === g.value && styles.genderLabelActive]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Taille actuelle (cm)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="resize-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="170" placeholderTextColor={COLORS.textDim} value={heightCm} onChangeText={setHeightCm} keyboardType="decimal-pad" />
            </View>

            <Text style={styles.label}>Poids (kg)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="barbell-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="70" placeholderTextColor={COLORS.textDim} value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" />
            </View>

            <Text style={styles.label}>Objectif de taille (cm)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="trending-up-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="175" placeholderTextColor={COLORS.textDim} value={targetHeightCm} onChangeText={setTargetHeightCm} keyboardType="decimal-pad" />
            </View>

            <GrowButton title="Continuer →" onPress={goNext} variant="primary" style={{ marginTop: 8 }} />
          </View>
        )}

        {step === 'mode' && (
          <View style={styles.form}>
            <Text style={styles.title}>Ton programme 🎯</Text>
            <Text style={styles.subtitle}>Choisis ta voie de transformation</Text>

            <TouchableOpacity
              style={[styles.modeCard, programMode === 'grandir' && styles.modeCardActive]}
              onPress={() => setProgramMode('grandir')}
            >
              <LinearGradient
                colors={programMode === 'grandir' ? GRADIENTS.grandir : (['#12122A', '#1E1E40'] as const)}
                style={styles.modeGradient}
              >
                <Text style={styles.modeEmoji}>💪</Text>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>Grandir</Text>
                  <Text style={styles.modeDesc}>Programme physique intensif pour maximiser ta taille et ta stature.</Text>
                  <View style={styles.modeTags}>
                    {['Étirements', 'Suspension', 'HIIT', 'Yoga'].map((t) => (
                      <View key={t} style={styles.modeTag}><Text style={styles.modeTagText}>{t}</Text></View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, programMode === 'glowup' && styles.modeCardActiveAccent]}
              onPress={() => setProgramMode('glowup')}
            >
              <LinearGradient
                colors={programMode === 'glowup' ? GRADIENTS.glowup : (['#12122A', '#1E1E40'] as const)}
                style={styles.modeGradient}
              >
                <Text style={styles.modeEmoji}>✨</Text>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>Glow Up</Text>
                  <Text style={styles.modeDesc}>Bien-être holistique — peau, corps, mental, nutrition et confiance.</Text>
                  <View style={styles.modeTags}>
                    {['Skin care', 'Nutrition', 'Mindset', 'Yoga'].map((t) => (
                      <View key={t} style={styles.modeTag}><Text style={styles.modeTagText}>{t}</Text></View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <GrowButton title="Lancer mon aventure 🚀" onPress={handleRegister} isLoading={isLoading} variant="primary" style={{ marginTop: 16 }} />
          </View>
        )}

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: 16 },
  steps: { flexDirection: 'row', gap: 8, marginBottom: 32, justifyContent: 'center' },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  stepDotActive: { backgroundColor: COLORS.primary, width: 24 },
  stepDotDone: { backgroundColor: COLORS.success },
  form: { gap: 14 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 14, marginBottom: 8 },
  label: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600', marginBottom: -6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, fontSize: 15, paddingVertical: 14 },
  eyeBtn: { padding: 4 },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', paddingVertical: 14, gap: 4 },
  genderBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  genderEmoji: { fontSize: 24 },
  genderLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  genderLabelActive: { color: COLORS.primaryLight },
  modeCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.border },
  modeCardActive: { borderColor: COLORS.primary },
  modeCardActiveAccent: { borderColor: COLORS.accent },
  modeGradient: { padding: 20, flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  modeEmoji: { fontSize: 40, marginTop: 4 },
  modeInfo: { flex: 1, gap: 6 },
  modeTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800' },
  modeDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 18 },
  modeTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  modeTag: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modeTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  loginText: { color: COLORS.textMuted, fontSize: 14 },
  loginLink: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700' },
});
