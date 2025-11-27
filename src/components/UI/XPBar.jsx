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
          <span className="font-semibold text-gray-900">Level {level}</span>
          <span className="text-gray-600 font-mono">
            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Animated progress bar */}
        <div
          className="absolute top-0 left-0 h-full bg-primary-900 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedWidth}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      {showLabel && (
        <div className="text-xs text-center text-gray-600">
          {maxXP - currentXP > 0 ? (
            <span>{(maxXP - currentXP).toLocaleString()} XP do ďalšieho levelu</span>
          ) : (
            <span className="text-gray-900 font-semibold">Pripravený na level up!</span>
          )}
        </div>
      )}
    </div>
  )
}

export default XPBar
