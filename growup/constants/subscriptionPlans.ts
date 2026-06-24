import { SubscriptionTier, BillingPeriod } from '@/types';

export interface Plan {
  tier: SubscriptionTier;
  name: string;
  emoji: string;
  color: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  stripe_price_monthly: string;
  stripe_price_yearly: string;
  features: string[];
  not_included: string[];
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    tier: 'free',
    name: 'Gratuit',
    emoji: '🌱',
    color: '#6B7280',
    price_monthly_cents: 0,
    price_yearly_cents: 0,
    stripe_price_monthly: '',
    stripe_price_yearly: '',
    features: [
      'Niveau 1, Jour 1 uniquement',
      'Profil de base',
      '1 défi quotidien',
    ],
    not_included: [
      'Tous les niveaux',
      'Suivi des mesures',
      'Photos de progrès',
      'Succès & badges',
    ],
  },
  {
    tier: 'pro',
    name: 'GrowUp Pro',
    emoji: '⚡',
    color: '#7C3AED',
    price_monthly_cents: 499,
    price_yearly_cents: 2999,
    stripe_price_monthly: process.env.EXPO_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? '',
    stripe_price_yearly: process.env.EXPO_PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? '',
    features: [
      'Tous les niveaux des 2 modes',
      'Suivi des mesures & historique',
      'Tous les défis quotidiens',
      'Succès & badges',
      "Jusqu'à 10 photos de progrès",
    ],
    not_included: [
      'Photos illimitées',
      'Percentile mondial',
    ],
  },
  {
    tier: 'elite',
    name: 'GrowUp Elite',
    emoji: '👑',
    color: '#F59E0B',
    price_monthly_cents: 899,
    price_yearly_cents: 4999,
    stripe_price_monthly: process.env.EXPO_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY ?? '',
    stripe_price_yearly: process.env.EXPO_PUBLIC_STRIPE_PRICE_ELITE_YEARLY ?? '',
    badge: 'POPULAIRE',
    features: [
      'Tout ce qui est dans Pro',
      'Photos de progrès illimitées',
      'Percentile mondial de taille',
      'Analyses IA personnalisées',
      'Support prioritaire',
    ],
    not_included: [],
  },
];

export function getPlanByTier(tier: SubscriptionTier): Plan {
  return PLANS.find((p) => p.tier === tier) ?? PLANS[0];
}

export function formatPrice(cents: number, period: BillingPeriod): string {
  if (cents === 0) return 'Gratuit';
  const euros = (cents / 100).toFixed(2).replace('.', ',');
  return period === 'monthly' ? `${euros}€/mois` : `${euros}€/an`;
}

export function monthlyEquiv(yearlyCents: number): string {
  return ((yearlyCents / 100) / 12).toFixed(2).replace('.', ',') + '€/mois';
}
