import {
  Lock,
  Dumbbell,
  Flame,
  Zap,
  Crown,
  Trophy,
  Star,
  Gem,
  Target,
  Scale,
  Compass,
  BookOpen,
  User,
  Swords,
  Sunrise,
  Moon,
  PartyPopper,
  GraduationCap,
  TrendingUp,
  Award
} from 'lucide-react'

// Mapovanie názvov ikon na komponenty
const iconMap = {
  Dumbbell,
  Biceps: Dumbbell, // Lucide nemá Biceps, použijeme Dumbbell
  Flame,
  Zap,
  Crown,
  Trophy,
  Star,
  Gem,
  Target,
  Scale,
  Compass,
  BookOpen,
  User,
  Swords,
  Sunrise,
  Moon,
  PartyPopper,
  GraduationCap,
  TrendingUp,
  Award,
}

function AchievementCard({ achievement }) {
  const { title, description, icon, unlocked, progress, target, rarity } = achievement

  const progressPercentage = Math.round((progress / target) * 100)

  // Získaj komponent ikony podľa názvu
  const IconComponent = iconMap[icon] || Dumbbell

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
        unlocked
          ? 'bg-white border-gray-300 shadow-soft'
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
    >
      {/* Lock overlay for locked achievements */}
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center mb-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            unlocked
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-300 text-neutral-500'
          }`}
        >
          <IconComponent className="w-7 h-7" />
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-bold text-center mb-1 ${
          unlocked ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-600 text-center mb-3 min-h-[2.5rem]">
        {description}
      </p>

      {/* Progress bar (if not fully unlocked) */}
      {!unlocked && progress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Pokrok</span>
            <span className="font-mono">
              {progress}/{target}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-900 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlocked badge */}
      {unlocked && (
        <div className="flex items-center justify-center mt-2">
          <div className="px-3 py-1 rounded-full text-xs font-semibold text-gray-900 bg-gray-100">
            ✓ Odomknuté
          </div>
        </div>
      )}
    </div>
  )
}

export default AchievementCard
