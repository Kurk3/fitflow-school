import { useEffect, useState } from 'react'

function XPBar({ currentXP, maxXP, level, showLabel = true }) {
  const [animatedWidth, setAnimatedWidth] = useState(0)
  const percentage = Math.min((currentXP / maxXP) * 100, 100)

  useEffect(() => {
    // Animate the bar fill on mount
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-gray-200">Level {level}</span>
          <span className="text-gray-300 font-mono">
            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
        {/* Animated progress bar */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
          style={{ width: `${animatedWidth}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Glow effect on the edge */}
        <div
          className="absolute top-0 left-0 h-full w-2 bg-white/50 blur-sm transition-all duration-1000 ease-out"
          style={{ left: `${Math.max(animatedWidth - 1, 0)}%` }}
        />
      </div>

      {showLabel && (
        <div className="text-xs text-center text-gray-400">
          {maxXP - currentXP > 0 ? (
            <span>{(maxXP - currentXP).toLocaleString()} XP do ďalšieho levelu</span>
          ) : (
            <span className="text-green-400 font-semibold">Pripravený na level up! 🎉</span>
          )}
        </div>
      )}
    </div>
  )
}

export default XPBar
