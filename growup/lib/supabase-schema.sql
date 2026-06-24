-- =============================================
--  GrowUp — Supabase PostgreSQL Schema
-- =============================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES
-- =============================================
create table public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  email         text unique not null,
  full_name     text not null default '',
  avatar_url    text,
  height_cm     numeric(5,1) not null default 170,
  weight_kg     numeric(5,1) not null default 70,
  target_height_cm numeric(5,1) not null default 175,
  date_of_birth date,
  gender        text check (gender in ('male','female','other')) default 'male',
  xp            integer not null default 0,
  level         integer not null default 1,
  rank          text not null default 'Débutant',
  streak_days   integer not null default 0,
  last_activity_date date,
  program_mode  text not null default 'grandir' check (program_mode in ('grandir','glowup')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- PROGRAM LEVELS
-- =============================================
create table public.program_levels (
  id            uuid primary key default uuid_generate_v4(),
  level_number  integer not null,
  title         text not null,
  description   text not null default '',
  program_mode  text not null check (program_mode in ('grandir','glowup')),
  unlock_xp     integer not null default 0,
  badge_icon    text not null default '🏆',
  created_at    timestamptz not null default now(),
  unique(level_number, program_mode)
);

alter table public.program_levels enable row level security;
create policy "Public levels read" on public.program_levels for select using (true);

-- =============================================
-- WORKOUT DAYS
-- =============================================
create table public.workout_days (
  id               uuid primary key default uuid_generate_v4(),
  level_id         uuid references public.program_levels on delete cascade,
  day_number       integer not null,
  title            text not null,
  description      text not null default '',
  program_mode     text not null check (program_mode in ('grandir','glowup')),
  total_xp         integer not null default 50,
  duration_minutes integer not null default 20,
  is_rest_day      boolean not null default false,
  created_at       timestamptz not null default now()
);

alter table public.workout_days enable row level security;
create policy "Public days read" on public.workout_days for select using (true);

-- =============================================
-- EXERCISES
-- =============================================
create table public.exercises (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  description      text not null default '',
  duration_seconds integer not null default 30,
  reps             integer,
  sets             integer,
  rest_seconds     integer not null default 30,
  muscle_groups    text[] not null default '{}',
  video_url        text,
  thumbnail_url    text,
  xp_reward        integer not null default 10,
  difficulty       text not null default 'easy' check (difficulty in ('easy','medium','hard')),
  program_mode     text not null check (program_mode in ('grandir','glowup')),
  created_at       timestamptz not null default now()
);

alter table public.exercises enable row level security;
create policy "Public exercises read" on public.exercises for select using (true);

-- =============================================
-- WORKOUT DAY EXERCISES (join table)
-- =============================================
create table public.workout_day_exercises (
  id          uuid primary key default uuid_generate_v4(),
  day_id      uuid references public.workout_days on delete cascade,
  exercise_id uuid references public.exercises on delete cascade,
  order_index integer not null default 0
);

alter table public.workout_day_exercises enable row level security;
create policy "Public day exercises read" on public.workout_day_exercises for select using (true);

-- =============================================
-- USER PROGRESS (completed days)
-- =============================================
create table public.user_progress (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users on delete cascade,
  day_id              uuid references public.workout_days on delete cascade,
  completed_at        timestamptz not null default now(),
  xp_earned           integer not null default 0,
  duration_seconds    integer not null default 0,
  exercises_completed integer not null default 0,
  unique(user_id, day_id)
);

alter table public.user_progress enable row level security;
create policy "Users manage own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- =============================================
-- HEIGHT MEASUREMENTS
-- =============================================
create table public.height_measurements (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users on delete cascade,
  height_cm   numeric(5,1) not null,
  measured_at timestamptz not null default now(),
  note        text
);

alter table public.height_measurements enable row level security;
create policy "Users manage own heights"
  on public.height_measurements for all
  using (auth.uid() = user_id);

-- =============================================
-- WEIGHT MEASUREMENTS
-- =============================================
create table public.weight_measurements (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users on delete cascade,
  weight_kg   numeric(5,1) not null,
  measured_at timestamptz not null default now(),
  note        text
);

alter table public.weight_measurements enable row level security;
create policy "Users manage own weights"
  on public.weight_measurements for all
  using (auth.uid() = user_id);

-- =============================================
-- PROGRESS PHOTOS
-- =============================================
create table public.progress_photos (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users on delete cascade,
  photo_url  text not null,
  taken_at   timestamptz not null default now(),
  category   text not null check (category in ('front','side','back'))
);

alter table public.progress_photos enable row level security;
create policy "Users manage own photos"
  on public.progress_photos for all
  using (auth.uid() = user_id);

-- =============================================
-- ACHIEVEMENTS
-- =============================================
create table public.achievements (
  id               uuid primary key default uuid_generate_v4(),
  key              text unique not null,
  title            text not null,
  description      text not null,
  icon             text not null default '🏅',
  xp_reward        integer not null default 100,
  condition_type   text not null,
  condition_value  integer not null,
  created_at       timestamptz not null default now()
);

alter table public.achievements enable row level security;
create policy "Public achievements read" on public.achievements for select using (true);

-- =============================================
-- USER ACHIEVEMENTS
-- =============================================
create table public.user_achievements (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references auth.users on delete cascade,
  achievement_id uuid references public.achievements on delete cascade,
  unlocked_at    timestamptz not null default now(),
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;
create policy "Users manage own achievements"
  on public.user_achievements for all
  using (auth.uid() = user_id);

-- =============================================
-- DAILY CHALLENGES
-- =============================================
create table public.daily_challenges (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text not null,
  xp_reward       integer not null default 25,
  icon            text not null default '⚡',
  challenge_type  text not null,
  active_date     date not null default current_date,
  created_at      timestamptz not null default now()
);

alter table public.daily_challenges enable row level security;
create policy "Public challenges read" on public.daily_challenges for select using (true);

-- =============================================
-- USER DAILY CHALLENGE COMPLETIONS
-- =============================================
create table public.user_daily_challenges (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users on delete cascade,
  challenge_id uuid references public.daily_challenges on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, challenge_id)
);

alter table public.user_daily_challenges enable row level security;
create policy "Users manage own challenges"
  on public.user_daily_challenges for all
  using (auth.uid() = user_id);

-- =============================================
-- SUBSCRIPTIONS
-- =============================================
create table public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references auth.users on delete cascade unique,
  tier                    text not null default 'free' check (tier in ('free','pro','elite')),
  billing_period          text check (billing_period in ('monthly','yearly')),
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  status                  text not null default 'active' check (status in ('active','canceled','past_due','trialing')),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Service role (Netlify webhook) bypasses RLS to upsert subscriptions.

-- =============================================
-- SEED: PROGRAM LEVELS
-- =============================================
insert into public.program_levels (level_number, title, description, program_mode, unlock_xp, badge_icon) values
  (1, 'Fondations', 'Commence ton voyage de croissance avec les bases essentielles.', 'grandir', 0, '🌱'),
  (2, 'Élan', 'Intensifie tes séances et construis ta régularité.', 'grandir', 500, '⚡'),
  (3, 'Ascension', 'Dépasse tes limites avec des entraînements avancés.', 'grandir', 1500, '🚀'),
  (4, 'Maîtrise', 'Atteins le sommet de ta croissance physique.', 'grandir', 3500, '👑'),
  (1, 'Éveil', 'Prends soin de toi avec des routines douces et efficaces.', 'glowup', 0, '✨'),
  (2, 'Rayonnement', 'Développe ta confiance et ton bien-être intérieur.', 'glowup', 500, '🌟'),
  (3, 'Transformation', 'Transcende ton potentiel pour rayonner pleinement.', 'glowup', 1500, '💎'),
  (4, 'Épanouissement', 'Incarne la version la plus accomplie de toi-même.', 'glowup', 3500, '🦋');

-- =============================================
-- SEED: ACHIEVEMENTS
-- =============================================
insert into public.achievements (key, title, description, icon, xp_reward, condition_type, condition_value) values
  ('first_workout',   'Premier pas',           'Complète ton premier entraînement.', '👟', 50,  'workouts', 1),
  ('week_streak',     'Semaine parfaite',       'Maintiens un streak de 7 jours.',    '🔥', 200, 'streak',   7),
  ('month_streak',    'Guerrier du mois',       'Maintiens un streak de 30 jours.',   '💪', 500, 'streak',   30),
  ('level_5',         'Montée en puissance',    'Atteins le niveau 5.',               '⚡', 150, 'level',    5),
  ('level_10',        'Vétéran',                'Atteins le niveau 10.',              '🏆', 300, 'level',    10),
  ('workouts_10',     'Assidu',                 'Complète 10 entraînements.',         '✅', 100, 'workouts', 10),
  ('workouts_50',     'Infatigable',            'Complète 50 entraînements.',         '💎', 400, 'workouts', 50),
  ('height_1cm',      'Premier centimètre',     'Grandis de 1 cm.',                   '📏', 300, 'height_gain', 1),
  ('height_5cm',      'Transformation',         'Grandis de 5 cm.',                   '🚀', 1000,'height_gain', 5);
