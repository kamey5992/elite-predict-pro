import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setSession, fetchProfile, isInitialized } = useAuthStore();
  const { fetchSubscription, reset: resetSubscription } = useSubscriptionStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) { fetchProfile(); fetchSubscription(session.user.id); }
      else useAuthStore.setState({ isInitialized: true });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) { fetchProfile(); fetchSubscription(session.user.id); }
      else { useAuthStore.setState({ isInitialized: true, profile: null }); resetSubscription(); }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isInitialized) SplashScreen.hideAsync();
  }, [isInitialized]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor="#0A0A1A" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A1A' } }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workout/[dayId]" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="achievements" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
