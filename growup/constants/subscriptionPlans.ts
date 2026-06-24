import { SubscriptionTier, BillingPeriod } from '@/types';

export interface Plan {
  tier: SubscriptionTier;
  name: string;
  emoji: string;
  color: string;
  price_fcfa_monthly: number;
  price_fcfa_yearly: number;
  price_key_monthly: string;
  price_key_yearly: string;
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
    price_fcfa_monthly: 0,
    price_fcfa_yearly: 0,
    price_key_monthly: '',
    price_key_yearly: '',
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
    price_fcfa_monthly: 3000,
    price_fcfa_yearly: 18000,
    price_key_monthly: 'pro_monthly',
    price_key_yearly: 'pro_yearly',
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
    price_fcfa_monthly: 5000,
    price_fcfa_yearly: 30000,
    price_key_monthly: 'elite_monthly',
    price_key_yearly: 'elite_yearly',
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

export function formatPrice(fcfa: number, period: BillingPeriod): string {
  if (fcfa === 0) return 'Gratuit';
  const formatted = fcfa.toLocaleString('fr-CI');
  return period === 'monthly' ? `${formatted} FCFA/mois` : `${formatted} FCFA/an`;
}

export function monthlyEquiv(yearlyFcfa: number): string {
  return Math.round(yearlyFcfa / 12).toLocaleString('fr-CI') + ' FCFA/mois';
}
