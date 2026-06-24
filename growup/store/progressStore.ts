import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { HeightMeasurement, WeightMeasurement, ProgressPhoto, Achievement } from '@/types';

interface ProgressState {
  heightHistory: HeightMeasurement[];
  weightHistory: WeightMeasurement[];
  photos: ProgressPhoto[];
  achievements: Achievement[];
  unlockedAchievementKeys: Set<string>;
  totalWorkouts: number;
  isLoading: boolean;

  loadProgress: (userId: string) => Promise<void>;
  addHeightMeasurement: (userId: string, heightCm: number, note?: string) => Promise<void>;
  addWeightMeasurement: (userId: string, weightKg: number, note?: string) => Promise<void>;
  addPhoto: (userId: string, photoUrl: string, category: 'front' | 'side' | 'back') => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  loadAchievements: (userId: string) => Promise<Achievement[]>;
  checkAndUnlockAchievements: (userId: string, stats: AchievementStats) => Promise<Achievement[]>;
  getWorldPercentile: (heightCm: number, age: number, gender: string) => number;
}

interface AchievementStats {
  totalWorkouts: number;
  streakDays: number;
  level: number;
  initialHeight: number;
  currentHeight: number;
}

// Approximate height percentile calculation (WHO data-based)
function computeWorldPercentile(heightCm: number, gender: string): number {
  const maleMean = 171;
  const femaleMean = 158;
  const sd = 7;
  const mean = gender === 'female' ? femaleMean : maleMean;
  const z = (heightCm - mean) / sd;
  // Phi approximation
  const p = 1 / (1 + Math.exp(-1.7 * z));
  return Math.round(p * 100);
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  heightHistory: [],
  weightHistory: [],
  photos: [],
  achievements: [],
  unlockedAchievementKeys: new Set(),
  totalWorkouts: 0,
  isLoading: false,

  loadProgress: async (userId) => {
    set({ isLoading: true });
    try {
      const [heights, weights, photos, workouts] = await Promise.all([
        supabase
          .from('height_measurements')
          .select('*')
          .eq('user_id', userId)
          .order('measured_at', { ascending: true }),
        supabase
          .from('weight_measurements')
          .select('*')
          .eq('user_id', userId)
          .order('measured_at', { ascending: true }),
        supabase
          .from('progress_photos')
          .select('*')
          .eq('user_id', userId)
          .order('taken_at', { ascending: false }),
        supabase
          .from('user_progress')
          .select('id')
          .eq('user_id', userId),
      ]);

      set({
        heightHistory: (heights.data ?? []) as HeightMeasurement[],
        weightHistory: (weights.data ?? []) as WeightMeasurement[],
        photos: (photos.data ?? []) as ProgressPhoto[],
        totalWorkouts: workouts.data?.length ?? 0,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addHeightMeasurement: async (userId, heightCm, note) => {
    const { data, error } = await supabase
      .from('height_measurements')
      .insert({ user_id: userId, height_cm: heightCm, note: note ?? null })
      .select()
      .single();
    if (!error && data) {
      const { heightHistory } = get();
      set({ heightHistory: [...heightHistory, data as HeightMeasurement] });
    }
  },

  addWeightMeasurement: async (userId, weightKg, note) => {
    const { data, error } = await supabase
      .from('weight_measurements')
      .insert({ user_id: userId, weight_kg: weightKg, note: note ?? null })
      .select()
      .single();
    if (!error && data) {
      const { weightHistory } = get();
      set({ weightHistory: [...weightHistory, data as WeightMeasurement] });
    }
  },

  addPhoto: async (userId, photoUrl, category) => {
    const { data, error } = await supabase
      .from('progress_photos')
      .insert({ user_id: userId, photo_url: photoUrl, category })
      .select()
      .single();
    if (!error && data) {
      const { photos } = get();
      set({ photos: [data as ProgressPhoto, ...photos] });
    }
  },

  deletePhoto: async (photoId) => {
    const { error } = await supabase
      .from('progress_photos')
      .delete()
      .eq('id', photoId);
    if (!error) {
      const { photos } = get();
      set({ photos: photos.filter((p) => p.id !== photoId) });
    }
  },

  loadAchievements: async (userId) => {
    const { data: all } = await supabase.from('achievements').select('*');
    const { data: userAch } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId);

    const unlockedMap = new Map(
      (userAch ?? []).map((a: any) => [a.achievement_id, a.unlocked_at])
    );

    const achievements: Achievement[] = (all ?? []).map((a: any) => ({
      ...a,
      unlocked_at: unlockedMap.get(a.id),
    }));

    const unlockedKeys = new Set(
      achievements.filter((a) => a.unlocked_at).map((a) => a.key)
    );

    set({ achievements, unlockedAchievementKeys: unlockedKeys });
    return achievements;
  },

  checkAndUnlockAchievements: async (userId, stats) => {
    const { achievements, unlockedAchievementKeys } = get();
    const newlyUnlocked: Achievement[] = [];

    for (const ach of achievements) {
      if (unlockedAchievementKeys.has(ach.key)) continue;

      let shouldUnlock = false;
      const heightGain = stats.currentHeight - stats.initialHeight;

      switch (ach.condition_type) {
        case 'workouts':
          shouldUnlock = stats.totalWorkouts >= ach.condition_value;
          break;
        case 'streak':
          shouldUnlock = stats.streakDays >= ach.condition_value;
          break;
        case 'level':
          shouldUnlock = stats.level >= ach.condition_value;
          break;
        case 'height_gain':
          shouldUnlock = heightGain >= ach.condition_value;
          break;
      }

      if (shouldUnlock) {
        const { error } = await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: ach.id,
        });
        if (!error) {
          newlyUnlocked.push({ ...ach, unlocked_at: new Date().toISOString() });
          unlockedAchievementKeys.add(ach.key);
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      set({ unlockedAchievementKeys: new Set(unlockedAchievementKeys) });
    }

    return newlyUnlocked;
  },

  getWorldPercentile: (heightCm, age, gender) => {
    return computeWorldPercentile(heightCm, gender);
  },
}));
