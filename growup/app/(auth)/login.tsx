import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { COLORS, GRADIENTS } from '@/constants/theme';
import { GrowButton } from '@/components/ui/GrowButton';

export default function LoginScreen() {
  const { signIn, signInWithGoogle, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Champs requis', 'Remplis tous les champs.');
      return;
    }
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace('/(tabs)/program');
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message ?? 'Vérifie tes identifiants.');
    }
  };

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
        {/* Logo */}
        <View style={styles.logoSection}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌱</Text>
          </LinearGradient>
          <Text style={styles.appName}>GrowUp</Text>
          <Text style={styles.tagline}>Deviens la meilleure version de toi-même</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Bon retour 👋</Text>
          <Text style={styles.subtitle}>Connecte-toi pour continuer ton parcours</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textDim}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.textDim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textDim}
              />
            </TouchableOpacity>
          </View>

          <GrowButton
            title="Se connecter"
            onPress={handleLogin}
            isLoading={isLoading}
            variant="primary"
            style={styles.loginBtn}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <GrowButton
            title="Continuer avec Google"
            onPress={signInWithGoogle}
            variant="outline"
            icon={<Text style={{ fontSize: 18 }}>🔐</Text>}
          />

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Pas encore de compte ? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Créer un compte</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 60 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
  },
  logoEmoji: { fontSize: 40 },
  appName: { color: COLORS.text, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  tagline: { color: COLORS.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center' },
  form: { gap: 16 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: COLORS.textMuted, fontSize: 14, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, fontSize: 15, paddingVertical: 14 },
  eyeBtn: { padding: 4 },
  loginBtn: { marginTop: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textDim, fontSize: 13 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  signupText: { color: COLORS.textMuted, fontSize: 14 },
  signupLink: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700' },
});
