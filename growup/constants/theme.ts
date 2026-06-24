export const COLORS = {
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  accent: '#EC4899',
  accentLight: '#F472B6',
  background: '#0A0A1A',
  surface: '#12122A',
  surfaceLight: '#1E1E40',
  border: '#2A2A5A',
  text: '#F0F0FF',
  textMuted: '#8888B8',
  textDim: '#606098',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  gold: '#F59E0B',
  grandir: '#7C3AED',
  glowup: '#EC4899',
};

export const GRADIENTS = {
  primary: ['#7C3AED', '#EC4899'] as const,
  grandir: ['#5B21B6', '#7C3AED'] as const,
  glowup: ['#BE185D', '#EC4899'] as const,
  dark: ['#0A0A1A', '#12122A'] as const,
  card: ['#1E1E40', '#12122A'] as const,
  gold: ['#F59E0B', '#D97706'] as const,
  success: ['#16A34A', '#22C55E'] as const,
};

export const RANKS = [
  { name: 'Débutant',      minLevel: 1,  color: '#94A3B8', icon: '🌱' },
  { name: 'Apprenti',      minLevel: 2,  color: '#60A5FA', icon: '⚡' },
  { name: 'Intermédiaire', minLevel: 5,  color: '#A78BFA', icon: '🔥' },
  { name: 'Avancé',        minLevel: 10, color: '#F59E0B', icon: '💎' },
  { name: 'Expert',        minLevel: 15, color: '#EC4899', icon: '👑' },
  { name: 'Légende',       minLevel: 20, color: '#7C3AED', icon: '🌟' },
];

export const XP_PER_LEVEL = 500;
