import { Lock } from 'lucide-react'

function AchievementCard({ achievement }) {
  const { title, description, icon, unlocked, progress, target, rarity } = achievement

  const progressPercentage = Math.round((progress / target) * 100)

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
          className={`text-5xl transform transition-transform ${
            unlocked ? 'scale-100' : 'scale-90 grayscale'
          }`}
        >
          {icon}
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
