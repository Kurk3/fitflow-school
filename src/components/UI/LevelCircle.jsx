import { useEffect, useState } from 'react'

function LevelCircle({ level, currentXP, maxXP, size = 'large' }) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const progress = (currentXP / maxXP) * 100

  // Size configurations
  const sizes = {
    small: {
      container: 'w-20 h-20',
      text: 'text-xl',
      label: 'text-[10px]',
      strokeWidth: 4,
      radius: 36,
    },
    medium: {
      container: 'w-28 h-28',
      text: 'text-3xl',
      label: 'text-xs',
      strokeWidth: 5,
      radius: 50,
    },
    large: {
      container: 'w-36 h-36',
      text: 'text-4xl',
      label: 'text-sm',
      strokeWidth: 6,
      radius: 66,
    },
  }

  const config = sizes[size]
  const circumference = 2 * Math.PI * config.radius
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    // Animate the circle fill
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${config.container}`}>
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary-900 transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Level number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold text-primary-900 ${config.text}`}>
            {level}
          </div>
          <div className={`text-gray-500 font-semibold uppercase tracking-wide ${config.label}`}>
            Level
          </div>
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-xs text-gray-600 font-mono">
        {Math.round(progress)}% do Level {level + 1}
      </div>
    </div>
  )
}

export default LevelCircle
