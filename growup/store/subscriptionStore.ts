import { create } from 'zustand';
import { Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Subscription, SubscriptionTier } from '@/types';

const NETLIFY_URL = process.env.EXPO_PUBLIC_NETLIFY_URL ?? 'https://elite-predict-pro.netlify.app';

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  tier: SubscriptionTier;
  fetchSubscription: (userId: string) => Promise<void>;
  startCheckout: (priceId: string, userId: string, userEmail: string, paymentMethod?: string) => Promise<void>;
  canAccess: (feature: 'full_program' | 'progress_tracking' | 'photos' | 'unlimited_photos' | 'percentile') => boolean;
  reset: () => void;
}

function isActive(status?: string): boolean {
  return status === 'active' || status === 'trialing';
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  tier: 'free',

  fetchSubscription: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      const activeTier: SubscriptionTier =
        data && isActive(data.status) ? (data.tier as SubscriptionTier) : 'free';

      set({ subscription: data as Subscription | null, tier: activeTier });
    } finally {
      set({ isLoading: false });
    }
  },

  startCheckout: async (priceId: string, userId: string, userEmail: string, paymentMethod = 'stripe') => {
    const res = await fetch(
      `${NETLIFY_URL}/.netlify/functions/growup-stripe-checkout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, userEmail, paymentMethod }),
      }
    );
    if (!res.ok) throw new Error('Impossible de démarrer le paiement.');
    const { url } = await res.json();
    if (url) await Linking.openURL(url);
  },

  canAccess: (feature) => {
    const { tier } = get();
    switch (feature) {
      case 'full_program':       return tier === 'pro' || tier === 'elite';
      case 'progress_tracking':  return tier === 'pro' || tier === 'elite';
      case 'photos':             return tier === 'pro' || tier === 'elite';
      case 'unlimited_photos':   return tier === 'elite';
      case 'percentile':         return tier === 'elite';
      default: return false;
    }
  },

  reset: () => set({ subscription: null, tier: 'free' }),
}));
