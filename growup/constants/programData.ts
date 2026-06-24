import { ProgramLevel, ProgramMode } from '@/types';

const GRANDIR_LEVELS: ProgramLevel[] = [
  {
    id: 'g-l1',
    level_number: 1,
    title: 'Fondations',
    description: 'Commence ton voyage de croissance avec les bases essentielles.',
    program_mode: 'grandir',
    unlock_xp: 0,
    badge_icon: '🌱',
    days: [
      {
        id: 'g-l1-d1', day_number: 1, title: 'Activation corporelle',
        description: 'Réveille chaque muscle et prépare ton corps à la croissance.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 60, duration_minutes: 25, is_rest_day: false,
        exercises: [
          { id: 'e1', name: 'Étirements de la colonne', description: 'Allonge-toi sur le dos, ramène les genoux sur la poitrine et bascule doucement de gauche à droite.', duration_seconds: 60, reps: null, sets: 3, rest_seconds: 30, muscle_groups: ['Dos', 'Colonne vertébrale'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
          { id: 'e2', name: 'Suspension à la barre', description: 'Suspends-toi à une barre, bras tendus, pendant le temps indiqué.', duration_seconds: 30, reps: null, sets: 4, rest_seconds: 60, muscle_groups: ['Épaules', 'Dos', 'Colonne'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e3', name: 'Cobra Yoga', description: 'Allongé sur le ventre, pousse sur tes bras pour lever le buste en arquant le dos.', duration_seconds: 45, reps: null, sets: 3, rest_seconds: 30, muscle_groups: ['Colonne', 'Abdos', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
          { id: 'e4', name: 'Sauts en étoile', description: 'Saute en écartant les bras et jambes simultanément.', duration_seconds: 30, reps: null, sets: 3, rest_seconds: 30, muscle_groups: ['Corps entier', 'Cardio'], video_url: null, thumbnail_url: null, xp_reward: 12, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l1-d2', day_number: 2, title: 'Colonne vertébrale forte',
        description: 'Des exercices ciblés pour décompresser et renforcer ta colonne.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 65, duration_minutes: 30, is_rest_day: false,
        exercises: [
          { id: 'e5', name: 'Étirement du chat-vache', description: 'À quatre pattes, alterne le dos en arche et en creux en synchronisant avec ta respiration.', duration_seconds: 60, reps: null, sets: 4, rest_seconds: 20, muscle_groups: ['Colonne', 'Dos'], video_url: null, thumbnail_url: null, xp_reward: 12, difficulty: 'easy' },
          { id: 'e6', name: 'Planche', description: 'Maintiens la position planche en gardant le corps droit.', duration_seconds: 30, reps: null, sets: 4, rest_seconds: 45, muscle_groups: ['Abdos', 'Dos', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e7', name: 'Superman', description: 'Allongé ventre au sol, lève simultanément les bras et les jambes.', duration_seconds: 45, reps: null, sets: 3, rest_seconds: 30, muscle_groups: ['Bas du dos', 'Fessiers', 'Ischio'], video_url: null, thumbnail_url: null, xp_reward: 12, difficulty: 'easy' },
          { id: 'e8', name: 'Rotation du bassin', description: 'Debout, fais des cercles avec tes hanches dans les deux sens.', duration_seconds: 45, reps: null, sets: 2, rest_seconds: 20, muscle_groups: ['Hanches', 'Lombaires'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l1-d3', day_number: 3, title: 'Repos actif',
        description: 'Récupère avec de douces mobilisations articulaires.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 30, duration_minutes: 15, is_rest_day: true,
        exercises: [
          { id: 'e9', name: 'Marche consciente', description: '15 minutes de marche douce en te concentrant sur ta posture.', duration_seconds: 900, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Corps entier'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
          { id: 'e10', name: 'Étirements du matin', description: 'Étire doucement chaque articulation au lever.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Corps entier'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l1-d4', day_number: 4, title: 'Force & Longueur',
        description: 'Combine force musculaire et étirements profonds.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 70, duration_minutes: 35, is_rest_day: false,
        exercises: [
          { id: 'e11', name: 'Fente avant', description: 'Avance une jambe en pliant les deux genoux à 90°. Alterne les côtés.', duration_seconds: 0, reps: 12, sets: 3, rest_seconds: 45, muscle_groups: ['Quadriceps', 'Fessiers', 'Hanches'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e12', name: 'Squats profonds', description: 'Descends le plus bas possible en gardant le dos droit.', duration_seconds: 0, reps: 15, sets: 3, rest_seconds: 45, muscle_groups: ['Quadriceps', 'Fessiers', 'Dos'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e13', name: 'Ponte', description: 'Allongé sur le dos, lève les hanches en contractant les fessiers.', duration_seconds: 0, reps: 15, sets: 3, rest_seconds: 30, muscle_groups: ['Fessiers', 'Ischio', 'Bas du dos'], video_url: null, thumbnail_url: null, xp_reward: 12, difficulty: 'easy' },
          { id: 'e14', name: 'Étirement du psoas', description: 'En fente basse, pousse les hanches vers l'avant pour étirer le psoas.', duration_seconds: 45, reps: null, sets: 3, rest_seconds: 20, muscle_groups: ['Psoas', 'Hanches'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l1-d5', day_number: 5, title: 'Mobilité des épaules',
        description: 'Ouvre ta cage thoracique et libère tes épaules.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 60, duration_minutes: 25, is_rest_day: false,
        exercises: [
          { id: 'e15', name: 'Rotation des bras', description: 'Fais de grands cercles avec les bras tendus, vers l'avant puis vers l'arrière.', duration_seconds: 30, reps: null, sets: 3, rest_seconds: 20, muscle_groups: ['Épaules', 'Dos'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
          { id: 'e16', name: 'Ouverture thoracique', description: 'Assis ou debout, joins les mains derrière le dos et pousse la poitrine vers l'avant.', duration_seconds: 45, reps: null, sets: 4, rest_seconds: 30, muscle_groups: ['Poitrine', 'Épaules', 'Dos'], video_url: null, thumbnail_url: null, xp_reward: 12, difficulty: 'easy' },
          { id: 'e17', name: 'Traction australienne', description: 'Pendu à une barre basse, corps incliné, tire ta poitrine vers la barre.', duration_seconds: 0, reps: 10, sets: 3, rest_seconds: 60, muscle_groups: ['Dos', 'Biceps', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e18', name: 'Chien tête en bas', description: 'Pose mains et pieds au sol, hanches levées pour former un V inversé.', duration_seconds: 60, reps: null, sets: 3, rest_seconds: 30, muscle_groups: ['Dos', 'Ischio', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 12, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l1-d6', day_number: 6, title: 'Sprint & Sauts',
        description: 'Stimule tes hormones de croissance avec du cardio intense.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 75, duration_minutes: 30, is_rest_day: false,
        exercises: [
          { id: 'e19', name: 'Sprint 20 m', description: 'Sprinte à pleine vitesse sur 20 mètres. Récupère 60s entre chaque sprint.', duration_seconds: 0, reps: 8, sets: 1, rest_seconds: 60, muscle_groups: ['Jambes', 'Cardio'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'hard' },
          { id: 'e20', name: 'Sauts verticaux', description: 'Saute le plus haut possible en levant les bras.', duration_seconds: 0, reps: 10, sets: 4, rest_seconds: 60, muscle_groups: ['Jambes', 'Cardio'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e21', name: 'Corde à sauter', description: 'Saute à la corde à rythme modéré.', duration_seconds: 120, reps: null, sets: 3, rest_seconds: 60, muscle_groups: ['Cardio', 'Mollets'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e22', name: 'Récupération active', description: 'Marche lentement et respire profondément.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Cardio'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l1-d7', day_number: 7, title: 'Repos complet',
        description: 'La croissance se fait pendant le repos. Dors bien, mange bien.',
        level_number: 1, program_mode: 'grandir',
        total_xp: 20, duration_minutes: 5, is_rest_day: true,
        exercises: [
          { id: 'e23', name: 'Méditation du soir', description: '5 minutes de respiration profonde avant de dormir.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Mental'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
        ],
      },
    ],
  },
  {
    id: 'g-l2',
    level_number: 2,
    title: 'Élan',
    description: 'Intensifie tes séances et construis ta régularité.',
    program_mode: 'grandir',
    unlock_xp: 500,
    badge_icon: '⚡',
    days: [
      {
        id: 'g-l2-d1', day_number: 1, title: 'Force explosive',
        description: 'Développe une puissance musculaire maximale.',
        level_number: 2, program_mode: 'grandir',
        total_xp: 90, duration_minutes: 40, is_rest_day: false,
        exercises: [
          { id: 'e24', name: 'Burpees', description: 'Position debout → sol → pompe → saut. Enchaine sans pause.', duration_seconds: 0, reps: 10, sets: 4, rest_seconds: 60, muscle_groups: ['Corps entier', 'Cardio'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'hard' },
          { id: 'e25', name: 'Pompes diamant', description: 'Pompes avec les mains formant un diamant sous la poitrine.', duration_seconds: 0, reps: 12, sets: 4, rest_seconds: 45, muscle_groups: ['Triceps', 'Poitrine', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 18, difficulty: 'hard' },
          { id: 'e26', name: 'Suspension longue', description: 'Suspends-toi à la barre le plus longtemps possible.', duration_seconds: 60, reps: null, sets: 4, rest_seconds: 90, muscle_groups: ['Colonne', 'Dos', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'hard' },
          { id: 'e27', name: 'Fentes sautées', description: 'Effectue des fentes en alternant les jambes avec un saut entre chaque.', duration_seconds: 0, reps: 12, sets: 3, rest_seconds: 60, muscle_groups: ['Jambes', 'Cardio'], video_url: null, thumbnail_url: null, xp_reward: 18, difficulty: 'hard' },
        ],
      },
      {
        id: 'g-l2-d2', day_number: 2, title: 'Yoga de croissance',
        description: 'Séquence yoga avancée pour décompresser la colonne vertébrale.',
        level_number: 2, program_mode: 'grandir',
        total_xp: 80, duration_minutes: 35, is_rest_day: false,
        exercises: [
          { id: 'e28', name: 'Salutation au soleil', description: 'Enchaînement de 12 postures en flux continu.', duration_seconds: 300, reps: null, sets: 3, rest_seconds: 60, muscle_groups: ['Corps entier', 'Flexibilité'], video_url: null, thumbnail_url: null, xp_reward: 25, difficulty: 'medium' },
          { id: 'e29', name: 'Guerrier I', description: 'En fente avant, bras levés vers le ciel, maintenez 45 secondes de chaque côté.', duration_seconds: 45, reps: null, sets: 3, rest_seconds: 30, muscle_groups: ['Jambes', 'Dos', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'medium' },
          { id: 'e30', name: 'Posture de la roue', description: 'Allongé, pousse sur tes mains et pieds pour former un arc.', duration_seconds: 30, reps: null, sets: 4, rest_seconds: 45, muscle_groups: ['Colonne', 'Épaules', 'Abdos'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'hard' },
        ],
      },
      {
        id: 'g-l2-d3', day_number: 3, title: 'Récupération guidée',
        description: 'Foam rolling et automassage pour une récupération optimale.',
        level_number: 2, program_mode: 'grandir',
        total_xp: 40, duration_minutes: 20, is_rest_day: true,
        exercises: [
          { id: 'e31', name: 'Foam rolling dos', description: 'Roule lentement sur le foam roller sur toute la longueur du dos.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Dos'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
          { id: 'e32', name: 'Méditation body scan', description: 'Prends conscience de chaque partie de ton corps de bas en haut.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Mental'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l2-d4', day_number: 4, title: 'HIIT Croissance',
        description: 'Intervalles haute intensité pour stimuler la GH (hormone de croissance).',
        level_number: 2, program_mode: 'grandir',
        total_xp: 100, duration_minutes: 35, is_rest_day: false,
        exercises: [
          { id: 'e33', name: 'Tabata sprints', description: '20s sprint max / 10s repos × 8 séries.', duration_seconds: 240, reps: null, sets: 1, rest_seconds: 120, muscle_groups: ['Cardio', 'Jambes'], video_url: null, thumbnail_url: null, xp_reward: 30, difficulty: 'hard' },
          { id: 'e34', name: 'Mountain climbers', description: 'En position planche, ramène alternativement les genoux vers la poitrine rapidement.', duration_seconds: 45, reps: null, sets: 4, rest_seconds: 30, muscle_groups: ['Abdos', 'Cardio', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'hard' },
          { id: 'e35', name: 'Box jumps', description: 'Saute sur une boîte ou un banc, puis descends doucement.', duration_seconds: 0, reps: 10, sets: 4, rest_seconds: 60, muscle_groups: ['Jambes', 'Explosivité'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'hard' },
          { id: 'e36', name: 'Refroidissement', description: 'Marche lente et respiration récupérative.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Cardio'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l2-d5', day_number: 5, title: 'Traction & Étirements',
        description: 'Travail avancé de décompression articulaire.',
        level_number: 2, program_mode: 'grandir',
        total_xp: 85, duration_minutes: 40, is_rest_day: false,
        exercises: [
          { id: 'e37', name: 'Tractions pronation', description: 'Barre au-dessus de toi, tire ton corps vers le haut.', duration_seconds: 0, reps: 6, sets: 5, rest_seconds: 90, muscle_groups: ['Dos', 'Biceps', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 25, difficulty: 'hard' },
          { id: 'e38', name: 'Étirement de la taille', description: 'Bras levé d'un côté, penche-toi de l'autre côté lentement.', duration_seconds: 45, reps: null, sets: 3, rest_seconds: 20, muscle_groups: ['Lombaires', 'Obliques'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
          { id: 'e39', name: 'Inversion à la barre', description: 'Suspendu à la barre, laisse la gravité étirer ta colonne.', duration_seconds: 60, reps: null, sets: 5, rest_seconds: 60, muscle_groups: ['Colonne', 'Épaules'], video_url: null, thumbnail_url: null, xp_reward: 25, difficulty: 'medium' },
        ],
      },
      {
        id: 'g-l2-d6', day_number: 6, title: 'Circuit complet',
        description: 'Un circuit qui sollicite tout le corps de haut en bas.',
        level_number: 2, program_mode: 'grandir',
        total_xp: 95, duration_minutes: 45, is_rest_day: false,
        exercises: [
          { id: 'e40', name: 'Circuit A — Haut du corps', description: 'Pompes × 15, Tractions × 6, Développé militaire × 12. 3 tours.', duration_seconds: 600, reps: null, sets: 3, rest_seconds: 90, muscle_groups: ['Haut du corps'], video_url: null, thumbnail_url: null, xp_reward: 30, difficulty: 'hard' },
          { id: 'e41', name: 'Circuit B — Bas du corps', description: 'Squats × 20, Fentes × 12/côté, Sauts × 10. 3 tours.', duration_seconds: 600, reps: null, sets: 3, rest_seconds: 90, muscle_groups: ['Bas du corps'], video_url: null, thumbnail_url: null, xp_reward: 30, difficulty: 'hard' },
          { id: 'e42', name: 'Étirements finaux', description: 'Stretching complet pendant 10 minutes.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Corps entier'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'g-l2-d7', day_number: 7, title: 'Repos & Bilan',
        description: 'Repose-toi et mesure tes progrès de la semaine.',
        level_number: 2, program_mode: 'grandir',
        total_xp: 30, duration_minutes: 10, is_rest_day: true,
        exercises: [
          { id: 'e43', name: 'Mesure de taille', description: 'Mesure ta taille le matin, avant de manger, pieds nus.', duration_seconds: 120, reps: null, sets: 1, rest_seconds: 0, muscle_groups: [], video_url: null, thumbnail_url: null, xp_reward: 30, difficulty: 'easy' },
        ],
      },
    ],
  },
];

const GLOWUP_LEVELS: ProgramLevel[] = [
  {
    id: 'gu-l1',
    level_number: 1,
    title: 'Éveil',
    description: 'Prends soin de toi avec des routines douces et efficaces.',
    program_mode: 'glowup',
    unlock_xp: 0,
    badge_icon: '✨',
    days: [
      {
        id: 'gu-l1-d1', day_number: 1, title: 'Routine du matin',
        description: 'Démarre chaque journée avec énergie et intention.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 55, duration_minutes: 20, is_rest_day: false,
        exercises: [
          { id: 'gu-e1', name: 'Hydratation consciente', description: 'Bois 2 grands verres d'eau dès le réveil. Observe les sensations dans ton corps.', duration_seconds: 120, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Bien-être'], video_url: null, thumbnail_url: null, xp_reward: 10, difficulty: 'easy' },
          { id: 'gu-e2', name: 'Stretching matinal', description: 'Étire doucement chaque partie du corps pendant 10 minutes.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Corps entier', 'Flexibilité'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
          { id: 'gu-e3', name: 'Journaling', description: 'Écris 3 choses pour lesquelles tu es reconnaissant(e) aujourd'hui.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Mental'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
          { id: 'gu-e4', name: 'Skin care matinal', description: 'Nettoyant → sérum vitamine C → crème hydratante → SPF 50+.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Peau'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'gu-l1-d2', day_number: 2, title: 'Corps & Posture',
        description: 'Travaille ta posture pour un port naturellement élégant.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 60, duration_minutes: 25, is_rest_day: false,
        exercises: [
          { id: 'gu-e5', name: 'Correction posturale', description: 'Adosses-toi à un mur, talons, fessiers, dos et nuque en contact. Maintiens 2 minutes.', duration_seconds: 120, reps: null, sets: 5, rest_seconds: 30, muscle_groups: ['Dos', 'Posture'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
          { id: 'gu-e6', name: 'Pilates débutant', description: 'Enchainement de 20 minutes de Pilates pour gainage et souplesse.', duration_seconds: 1200, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Abdos', 'Dos', 'Fessiers'], video_url: null, thumbnail_url: null, xp_reward: 25, difficulty: 'medium' },
          { id: 'gu-e7', name: 'Massage facial', description: 'Massage Gua Sha ou rouleaux de jade pour drainer et tonifier le visage.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Visage'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'gu-l1-d3', day_number: 3, title: 'Détox & Nutrition',
        description: 'Nourris ton corps de l'intérieur pour briller à l'extérieur.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 50, duration_minutes: 15, is_rest_day: false,
        exercises: [
          { id: 'gu-e8', name: 'Jus vert du matin', description: 'Prépare un jus de céleri, concombre, citron et gingembre.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Nutrition'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
          { id: 'gu-e9', name: 'Repas anti-inflammatoire', description: 'Prépare un repas à base de saumon, légumes colorés et graines de chia.', duration_seconds: 1800, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Nutrition'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
          { id: 'gu-e10', name: 'Objectif hydratation', description: 'Assure-toi de boire 2,5L d'eau aujourd'hui. Ajoute du citron ou des herbes.', duration_seconds: 60, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Hydratation'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'gu-l1-d4', day_number: 4, title: 'Confiance & Mindset',
        description: 'Développe une confiance inébranlable en toi.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 55, duration_minutes: 20, is_rest_day: false,
        exercises: [
          { id: 'gu-e11', name: 'Affirmations positives', description: 'Répète 10 affirmations devant le miroir avec conviction.', duration_seconds: 300, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Mental', 'Confiance'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
          { id: 'gu-e12', name: 'Méditation visualisation', description: 'Ferme les yeux et visualise ta version idéale avec tous tes sens.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Mental'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
          { id: 'gu-e13', name: 'Pose de puissance', description: 'Adopte 3 postures de pouvoir (Wonder Woman, etc.) pendant 2 minutes chacune.', duration_seconds: 360, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Confiance', 'Posture'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'gu-l1-d5', day_number: 5, title: 'Cheveux & Corps',
        description: 'Chouchoute tes cheveux et ta peau pour un éclat maximal.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 50, duration_minutes: 30, is_rest_day: false,
        exercises: [
          { id: 'gu-e14', name: 'Masque capillaire', description: 'Applique un masque nourrissant (huile de coco + argan). Laisse poser 30min.', duration_seconds: 1800, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Cheveux'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
          { id: 'gu-e15', name: 'Masque visage', description: 'Masque à l'argile ou au miel selon ton type de peau. Laisse 15 minutes.', duration_seconds: 900, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Peau'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
          { id: 'gu-e16', name: 'Gommage corps', description: 'Gommage maison sucre + huile d'olive sur tout le corps sous la douche.', duration_seconds: 600, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Peau'], video_url: null, thumbnail_url: null, xp_reward: 15, difficulty: 'easy' },
        ],
      },
      {
        id: 'gu-l1-d6', day_number: 6, title: 'Activité physique & Fun',
        description: 'Bouge avec joie pour libérer les endorphines.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 65, duration_minutes: 40, is_rest_day: false,
        exercises: [
          { id: 'gu-e17', name: 'Danse cardio', description: 'Danse librement pendant 20 minutes sur ta playlist préférée.', duration_seconds: 1200, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Cardio', 'Corps entier', 'Joie'], video_url: null, thumbnail_url: null, xp_reward: 30, difficulty: 'easy' },
          { id: 'gu-e18', name: 'Yoga doux', description: '20 minutes de yoga flow léger pour terminer en beauté.', duration_seconds: 1200, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Flexibilité', 'Mental'], video_url: null, thumbnail_url: null, xp_reward: 25, difficulty: 'easy' },
        ],
      },
      {
        id: 'gu-l1-d7', day_number: 7, title: 'Luxe & Récupération',
        description: 'Traite-toi comme la royauté que tu es.',
        level_number: 1, program_mode: 'glowup',
        total_xp: 45, duration_minutes: 60, is_rest_day: true,
        exercises: [
          { id: 'gu-e19', name: 'Bain spa maison', description: 'Bain chaud avec sels d'Epsom, huiles essentielles et pétales de rose.', duration_seconds: 1800, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Récupération', 'Bien-être'], video_url: null, thumbnail_url: null, xp_reward: 25, difficulty: 'easy' },
          { id: 'gu-e20', name: 'Lecture inspirante', description: 'Lis 30 minutes d'un livre sur le développement personnel.', duration_seconds: 1800, reps: null, sets: 1, rest_seconds: 0, muscle_groups: ['Mental'], video_url: null, thumbnail_url: null, xp_reward: 20, difficulty: 'easy' },
        ],
      },
    ],
  },
];

export const PROGRAM_DATA: Record<ProgramMode, ProgramLevel[]> = {
  grandir: GRANDIR_LEVELS,
  glowup: GLOWUP_LEVELS,
};
