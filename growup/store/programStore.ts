import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { ProgramLevel, WorkoutDay, ProgramMode } from '@/types';
import { PROGRAM_DATA } from '@/constants/programData';

interface ProgramState {
  levels: ProgramLevel[];
  currentLevel: ProgramLevel | null;
  currentDay: WorkoutDay | null;
  activeMode: ProgramMode;
  completedDayIds: Set<string>;
  isLoading: boolean;
  activeExerciseIndex: number;
  isWorkoutActive: boolean;
  workoutTimer: number;
  exerciseTimer: number;

  setActiveMode: (mode: ProgramMode) => void;
  loadProgram: (mode: ProgramMode, userXP: number) => Promise<void>;
  loadCompletedDays: (userId: string) => Promise<void>;
  setCurrentDay: (day: WorkoutDay) => void;
  completeDay: (userId: string, dayId: string, durationSeconds: number) => Promise<number>;
  startWorkout: () => void;
  nextExercise: () => void;
  endWorkout: () => void;
  isDayCompleted: (dayId: string) => boolean;
}

export const useProgramStore = create<ProgramState>((set, get) => ({
  levels: [],
  currentLevel: null,
  currentDay: null,
  activeMode: 'grandir',
  completedDayIds: new Set(),
  isLoading: false,
  activeExerciseIndex: 0,
  isWorkoutActive: false,
  workoutTimer: 0,
  exerciseTimer: 0,

  setActiveMode: (mode) => {
    set({ activeMode: mode });
  },

  loadProgram: async (mode, userXP) => {
    set({ isLoading: true });
    try {
      // Use local data first (offline-first), then sync with Supabase
      const localLevels = PROGRAM_DATA[mode];

      // Mark levels as locked/unlocked based on XP
      const levelsWithLock = localLevels.map((level) => ({
        ...level,
        isLocked: userXP < level.unlock_xp,
      }));

      set({ levels: levelsWithLock, isLoading: false });

      // Try to load from Supabase in background
      const { data: remoteData } = await supabase
        .from('program_levels')
        .select(`
          *,
          workout_days (
            *,
            workout_day_exercises (
              order_index,
              exercises (*)
            )
          )
        `)
        .eq('program_mode', mode)
        .order('level_number', { ascending: true });

      if (remoteData && remoteData.length > 0) {
        // Map remote data to our format
        const remoteLevels = remoteData.map((l: any) => ({
          ...l,
          days: (l.workout_days || [])
            .sort((a: any, b: any) => a.day_number - b.day_number)
            .map((d: any) => ({
              ...d,
              exercises: (d.workout_day_exercises || [])
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((e: any) => e.exercises),
            })),
          isLocked: userXP < l.unlock_xp,
        }));
        set({ levels: remoteLevels });
      }
    } catch {
      // Keep local data on network error
    } finally {
      set({ isLoading: false });
    }
  },

  loadCompletedDays: async (userId) => {
    const { data } = await supabase
      .from('user_progress')
      .select('day_id')
      .eq('user_id', userId);

    if (data) {
      set({ completedDayIds: new Set(data.map((r: any) => r.day_id)) });
    }
  },

  setCurrentDay: (day) => set({ currentDay: day, activeExerciseIndex: 0 }),

  completeDay: async (userId, dayId, durationSeconds) => {
    const { currentDay } = get();
    const xpEarned = currentDay?.total_xp ?? 50;

    await supabase.from('user_progress').upsert({
      user_id: userId,
      day_id: dayId,
      xp_earned: xpEarned,
      duration_seconds: durationSeconds,
      exercises_completed: currentDay?.exercises.length ?? 0,
      completed_at: new Date().toISOString(),
    });

    const { completedDayIds } = get();
    completedDayIds.add(dayId);
    set({ completedDayIds: new Set(completedDayIds) });

    return xpEarned;
  },

  startWorkout: () => set({ isWorkoutActive: true, activeExerciseIndex: 0, workoutTimer: 0 }),

  nextExercise: () => {
    const { activeExerciseIndex, currentDay } = get();
    if (!currentDay) return;
    const total = currentDay.exercises.length;
    if (activeExerciseIndex < total - 1) {
      set({ activeExerciseIndex: activeExerciseIndex + 1, exerciseTimer: 0 });
    }
  },

  endWorkout: () => set({ isWorkoutActive: false, activeExerciseIndex: 0 }),

  isDayCompleted: (dayId) => get().completedDayIds.has(dayId),
}));
