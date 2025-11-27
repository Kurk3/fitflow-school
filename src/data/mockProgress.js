// Mock data for gamification UI prototype
// This is hardcoded data to demonstrate the UI/UX design

export const mockUserProgress = {
  level: 23,
  currentXP: 4500,
  xpToNextLevel: 5000,
  totalWorkouts: 87,
  currentStreak: 15,
  longestStreak: 28,
  totalAchievements: 45,
  unlockedAchievements: 12,
  totalVolume: 145250, // kg
  memberSince: '2024-09-15',
}

export const mockAchievements = [
  // Workout Milestones
  {
    id: 'first_step',
    title: 'Prvý Krok',
    description: 'Dokončiť prvý workout',
    icon: 'Dumbbell',
    unlocked: true,
    progress: 100,
    target: 1,
    category: 'workouts',
    rarity: 'common',
  },
  {
    id: 'getting_started',
    title: 'Začíname',
    description: 'Dokončiť 5 workoutov',
    icon: 'Biceps',
    unlocked: true,
    progress: 100,
    target: 5,
    category: 'workouts',
    rarity: 'common',
  },
  {
    id: 'enthusiast',
    title: 'Nadšenec',
    description: 'Dokončiť 10 workoutov',
    icon: 'Flame',
    unlocked: true,
    progress: 100,
    target: 10,
    category: 'workouts',
    rarity: 'common',
  },
  {
    id: 'dedicated',
    title: 'Dedicovaný',
    description: 'Dokončiť 25 workoutov',
    icon: 'Zap',
    unlocked: true,
    progress: 100,
    target: 25,
    category: 'workouts',
    rarity: 'uncommon',
  },
  {
    id: 'beast_mode',
    title: 'Beast Mode',
    description: 'Dokončiť 50 workoutov',
    icon: 'Crown',
    unlocked: false,
    progress: 87,
    target: 50,
    category: 'workouts',
    rarity: 'rare',
  },
  {
    id: 'iron_man',
    title: 'Železný Muž',
    description: 'Dokončiť 100 workoutov',
    icon: 'Trophy',
    unlocked: false,
    progress: 87,
    target: 100,
    category: 'workouts',
    rarity: 'epic',
  },
  {
    id: 'legend',
    title: 'Legenda',
    description: 'Dokončiť 250 workoutov',
    icon: 'Crown',
    unlocked: false,
    progress: 87,
    target: 250,
    category: 'workouts',
    rarity: 'legendary',
  },

  // Streak Achievements
  {
    id: 'on_fire',
    title: 'Na Vlne',
    description: '7-dňový streak',
    icon: 'Flame',
    unlocked: true,
    progress: 100,
    target: 7,
    category: 'streaks',
    rarity: 'uncommon',
  },
  {
    id: 'two_weeks',
    title: 'Dva Týždne',
    description: '14-dňový streak',
    icon: 'Zap',
    unlocked: true,
    progress: 100,
    target: 14,
    category: 'streaks',
    rarity: 'rare',
  },
  {
    id: 'monthly_warrior',
    title: 'Mesačný Bojovník',
    description: '30-dňový streak',
    icon: 'Star',
    unlocked: false,
    progress: 15,
    target: 30,
    category: 'streaks',
    rarity: 'epic',
  },
  {
    id: 'unstoppable',
    title: 'Neporaziteľný',
    description: '100-dňový streak',
    icon: 'Gem',
    unlocked: false,
    progress: 15,
    target: 100,
    category: 'streaks',
    rarity: 'legendary',
  },

  // Variety & Exploration
  {
    id: 'multi_talent',
    title: 'Multi-Talent',
    description: 'Vyskúšaj všetky 3 tréningové módy',
    icon: 'Target',
    unlocked: true,
    progress: 100,
    target: 3,
    category: 'variety',
    rarity: 'uncommon',
  },
  {
    id: 'balanced',
    title: 'Vyvážený',
    description: 'Natrénovať všetky svalové skupiny za týždeň',
    icon: 'Scale',
    unlocked: true,
    progress: 100,
    target: 10,
    category: 'variety',
    rarity: 'rare',
  },
  {
    id: 'explorer',
    title: 'Prieskumník',
    description: 'Vyskúšať 25 rôznych cvikov',
    icon: 'Compass',
    unlocked: true,
    progress: 100,
    target: 25,
    category: 'variety',
    rarity: 'uncommon',
  },
  {
    id: 'encyclopedia',
    title: 'Encyklopedista',
    description: 'Vyskúšať 50 rôznych cvikov',
    icon: 'BookOpen',
    unlocked: false,
    progress: 38,
    target: 50,
    category: 'variety',
    rarity: 'epic',
  },
  {
    id: 'full_body_master',
    title: 'Full Body Master',
    description: 'Všetky hlavné svaly za 1 workout',
    icon: 'User',
    unlocked: true,
    progress: 100,
    target: 1,
    category: 'variety',
    rarity: 'rare',
  },

  // Volume & Strength
  {
    id: 'volume_king',
    title: 'Volume King',
    description: 'Zdvihnúť 5000kg za workout',
    icon: 'Swords',
    unlocked: false,
    progress: 65,
    target: 5000,
    category: 'strength',
    rarity: 'rare',
  },
  {
    id: 'heavyweight',
    title: 'Ťažká Váha',
    description: 'Celkový objem 50,000kg',
    icon: 'Dumbbell',
    unlocked: false,
    progress: 145250,
    target: 50000,
    category: 'strength',
    rarity: 'common',
  },
  {
    id: 'titan',
    title: 'Titán',
    description: 'Celkový objem 100,000kg',
    icon: 'Biceps',
    unlocked: false,
    progress: 145250,
    target: 100000,
    category: 'strength',
    rarity: 'epic',
  },

  // Time-based
  {
    id: 'early_bird',
    title: 'Ranné Vtáča',
    description: 'Workout pred 9:00 ráno',
    icon: 'Sunrise',
    unlocked: true,
    progress: 100,
    target: 1,
    category: 'special',
    rarity: 'uncommon',
  },
  {
    id: 'night_owl',
    title: 'Nočný Owl',
    description: 'Workout po 21:00',
    icon: 'Moon',
    unlocked: false,
    progress: 0,
    target: 1,
    category: 'special',
    rarity: 'uncommon',
  },
  {
    id: 'weekend_warrior',
    title: 'Víkendový Warrior',
    description: '10 víkendových workoutov',
    icon: 'PartyPopper',
    unlocked: false,
    progress: 6,
    target: 10,
    category: 'special',
    rarity: 'rare',
  },

  // Difficulty progression
  {
    id: 'beginner_graduate',
    title: 'Beginner Graduate',
    description: '25 beginner cvikov dokončených',
    icon: 'GraduationCap',
    unlocked: true,
    progress: 100,
    target: 25,
    category: 'progression',
    rarity: 'common',
  },
  {
    id: 'intermediate_explorer',
    title: 'Intermediate Explorer',
    description: '25 intermediate cvikov dokončených',
    icon: 'TrendingUp',
    unlocked: false,
    progress: 18,
    target: 25,
    category: 'progression',
    rarity: 'uncommon',
  },
  {
    id: 'advanced_legend',
    title: 'Advanced Legend',
    description: '25 advanced cvikov dokončených',
    icon: 'Award',
    unlocked: false,
    progress: 5,
    target: 25,
    category: 'progression',
    rarity: 'epic',
  },
]

// Generate mock workout calendar data (last 84 days / ~12 weeks)
const generateCalendarData = () => {
  const data = {}
  const today = new Date()

  for (let i = 83; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]

    // Random workout intensity (0-4 workouts per day)
    // Higher probability of workouts on weekdays
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    let workouts = 0
    const random = Math.random()

    if (i < 15) {
      // Last 15 days - current streak period (more consistent)
      if (!isWeekend) {
        workouts = random > 0.2 ? 1 : 0
      } else {
        workouts = random > 0.5 ? 1 : 0
      }
    } else if (i < 45) {
      // Previous month - good consistency
      if (!isWeekend) {
        workouts = random > 0.3 ? (random > 0.8 ? 2 : 1) : 0
      } else {
        workouts = random > 0.6 ? 1 : 0
      }
    } else {
      // Older data - less consistent
      workouts = random > 0.5 ? (random > 0.85 ? 2 : 1) : 0
    }

    if (workouts > 0) {
      data[dateString] = workouts
    }
  }

  return data
}

export const mockWorkoutCalendar = generateCalendarData()

// Mock stats
export const mockStats = {
  totalVolume: 145250,
  mostTrainedMuscle: { name: 'Hrudník', count: 23 },
  favoriteExercise: { name: 'Bench Press', count: 18 },
  averageDuration: 45, // minutes
  bestDayOfWeek: { day: 'Pondelok', count: 25 },
  mostProductiveHour: '18:00',
  modeDistribution: {
    bodybuilding: 65,
    calisthenics: 15,
    pilates: 7,
  },
  muscleDistribution: {
    'Hrudník': 23,
    'Chrbát': 20,
    'Ramená': 18,
    'Biceps': 16,
    'Triceps': 15,
    'Stehná': 12,
    'Zadok': 10,
    'Brucho': 19,
    'Zadné stehenné svaly': 8,
    'Lýtka': 6,
  },
}
