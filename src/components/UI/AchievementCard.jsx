import { Lock } from 'lucide-react'

function AchievementCard({ achievement }) {
  const { title, description, icon, unlocked, progress, target, rarity } = achievement

  // Rarity colors
  const rarityColors = {
    common: {
      border: 'border-gray-600',
      bg: 'from-gray-800 to-gray-700',
      glow: 'shadow-gray-900',
      text: 'text-gray-300',
    },
    uncommon: {
      border: 'border-green-600',
      bg: 'from-green-900 to-emerald-800',
      glow: 'shadow-green-900',
      text: 'text-green-300',
    },
    rare: {
      border: 'border-blue-600',
      bg: 'from-blue-900 to-blue-800',
      glow: 'shadow-blue-900',
      text: 'text-blue-300',
    },
    epic: {
      border: 'border-purple-600',
      bg: 'from-purple-900 to-purple-800',
      glow: 'shadow-purple-900',
      text: 'text-purple-300',
    },
    legendary: {
      border: 'border-amber-500',
      bg: 'from-amber-900 via-yellow-900 to-amber-800',
      glow: 'shadow-amber-900',
      text: 'text-amber-300',
    },
  }

  const colors = rarityColors[rarity] || rarityColors.common
  const progressPercentage = Math.round((progress / target) * 100)

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
        unlocked
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} ${colors.glow} shadow-lg`
          : 'bg-gray-800 border-gray-600 opacity-60 grayscale'
      }`}
    >
      {/* Lock overlay for locked achievements */}
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {/* Glow effect for unlocked achievements */}
      {unlocked && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.bg} opacity-20 blur-xl -z-10`} />
      )}

      {/* Icon */}
      <div className="flex items-center justify-center mb-3">
        <div
          className={`text-5xl transform transition-transform ${
            unlocked ? 'scale-100 animate-bounce-slow' : 'scale-90'
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-bold text-center mb-1 ${
          unlocked ? colors.text : 'text-gray-400'
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-400 text-center mb-3 min-h-[2.5rem]">
        {description}
      </p>

      {/* Progress bar (if not fully unlocked) */}
      {!unlocked && progress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Pokrok</span>
            <span className="font-mono">
              {progress}/{target}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                progressPercentage >= 90
                  ? 'from-green-400 to-green-600'
                  : 'from-blue-400 to-blue-600'
              } transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlocked badge */}
      {unlocked && (
        <div className="flex items-center justify-center mt-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.text} bg-black/40`}>
            ✓ Odomknuté
          </div>
        </div>
      )}

      {/* Rarity indicator */}
      <div className="absolute top-2 left-2">
        <div
          className={`w-2 h-2 rounded-full ${
            unlocked ? colors.border.replace('border-', 'bg-') : 'bg-gray-600'
          }`}
        />
      </div>
    </div>
  )
}

export default AchievementCard
