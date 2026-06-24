import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
}

const XP_PER_LEVEL = 500;

function computeRank(level: number): string {
  if (level >= 20) return 'Légende';
  if (level >= 15) return 'Expert';
  if (level >= 10) return 'Avancé';
  if (level >= 5)  return 'Intermédiaire';
  if (level >= 2)  return 'Apprenti';
  return 'Débutant';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },

  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      set({ profile: data as UserProfile, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (!error && data) {
      set({ profile: data as UserProfile });
    } else if (error) {
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ session: data.session, user: data.user });
      await get().fetchProfile();
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (data.session) {
        set({ session: data.session, user: data.user });
        await get().fetchProfile();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'growup://auth/callback' },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  addXP: async (amount) => {
    const { profile } = get();
    if (!profile) return;

    const newXP = profile.xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    const newRank = computeRank(newLevel);

    await get().updateProfile({ xp: newXP, level: newLevel, rank: newRank as any });
  },
}));
