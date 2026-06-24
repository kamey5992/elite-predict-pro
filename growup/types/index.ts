export type ProgramMode = 'grandir' | 'glowup';

export type UserRank =
  | 'Débutant'
  | 'Apprenti'
  | 'Intermédiaire'
  | 'Avancé'
  | 'Expert'
  | 'Légende';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  height_cm: number;
  weight_kg: number;
  target_height_cm: number;
  date_of_birth: string | null;
  xp: number;
  level: number;
  rank: UserRank;
  streak_days: number;
  last_activity_date: string | null;
  program_mode: ProgramMode;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration_seconds: number;
  reps: number | null;
  sets: number | null;
  rest_seconds: number;
  muscle_groups: string[];
  video_url: string | null;
  thumbnail_url: string | null;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WorkoutDay {
  id: string;
  day_number: number;
  title: string;
  description: string;
  level_number: number;
  program_mode: ProgramMode;
  exercises: Exercise[];
  total_xp: number;
  duration_minutes: number;
  is_rest_day: boolean;
}

export interface ProgramLevel {
  id: string;
  level_number: number;
  title: string;
  description: string;
  program_mode: ProgramMode;
  days: WorkoutDay[];
  unlock_xp: number;
  badge_icon: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  day_id: string;
  completed_at: string;
  xp_earned: number;
  duration_seconds: number;
  exercises_completed: number;
}

export interface HeightMeasurement {
  id: string;
  user_id: string;
  height_cm: number;
  measured_at: string;
  note: string | null;
}

export interface WeightMeasurement {
  id: string;
  user_id: string;
  weight_kg: number;
  measured_at: string;
  note: string | null;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  taken_at: string;
  category: 'front' | 'side' | 'back';
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition_type: 'streak' | 'workouts' | 'level' | 'height_gain' | 'weight_goal';
  condition_value: number;
  unlocked_at?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  icon: string;
  challenge_type: 'workout' | 'hydration' | 'sleep' | 'stretch' | 'nutrition';
  completed: boolean;
}

export interface WorldPercentile {
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  percentile: number;
}

export type Gender = 'male' | 'female' | 'other';
