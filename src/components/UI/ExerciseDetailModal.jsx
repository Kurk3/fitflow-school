import { X, Lightbulb } from 'lucide-react'

function ExerciseDetailModal({ exercise, onClose, onAddToWorkout }) {
  if (!exercise) return null

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'intermediate': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'advanced': return 'bg-gray-200 text-gray-900 border-gray-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEquipmentLabel = (equipment) => {
    const labels = {
      bodyweight: 'Vlastná váha',
      barbell: 'Činka',
      dumbbells: 'Jednoručky',
      dumbbell: 'Jednoručka',
      cable: 'Kladka',
      machine: 'Stroj',
      'pullup bar': 'Hrazda',
      mat: 'Podložka',
      ball: 'Fitlopta',
      'resistance band': 'Expandér',
      rope: 'Lano',
      'gymnastics rings': 'Kruhy'
    }
    return labels[equipment] || equipment
  }

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      beginner: 'Začiatočník',
      intermediate: 'Mierne pokročilý',
      advanced: 'Pokročilý',
    }
    return labels[difficulty] || difficulty
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-elevated border border-gray-300 w-full max-w-lg max-h-[90vh] flex flex-col pointer-events-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 pr-8">
              {exercise.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 -mt-1 -mr-1"
              aria-label="Zavrieť"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* Content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="p-6 pb-0">
                {/* Description */}
                <p className="text-gray-700 text-base leading-relaxed mb-5">
                {exercise.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-2 rounded-lg text-base font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                    {getDifficultyLabel(exercise.difficulty)}
                </span>
                <span className="px-3 py-2 rounded-lg text-base font-medium bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-2">
                    {exercise.equipment === 'barbell' || exercise.equipment === 'dumbbells' || exercise.equipment === 'dumbbell' ? (
                      <img src="/icons/barbel.png" alt="Činka" className="w-5 h-5" title="Činka" />
                    ) : exercise.equipment === 'pullup bar' || exercise.equipment === 'bodyweight' ? (
                      <img src="/icons/bodyweight.png" alt="Vlastná váha" className="w-5 h-5" title="Vlastná váha" />
                    ) : exercise.equipment === 'machine' ? (
                      <img src="/icons/gym.png" alt="Stroj" className="w-5 h-5" title="Stroj" />
                    ) : exercise.equipment === 'cable' ? (
                      <img src="/icons/pulley.png" alt="Kladka" className="w-5 h-5" title="Kladka" />
                    ) : exercise.equipment === 'mat' ? (
                      <img src="/icons/mat.png" alt="Podložka" className="w-5 h-5" title="Podložka" />
                    ) : exercise.equipment === 'gymnastics rings' ? (
                      <img src="/icons/rings.png" alt="Kruhy" className="w-5 h-5" title="Kruhy" />
                    ) : (
                      getEquipmentLabel(exercise.equipment)
                    )}
                </span>
                </div>

                {/* Tips Section */}
                {exercise.tips && exercise.tips.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Tipy na správnu formu</h3>
                    </div>
                    <ul className="space-y-3">
                    {exercise.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium flex items-center justify-center mt-0.5">
                            {index + 1}
                        </span>
                        <span>{tip}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>

            {/* Animation GIF - Redesigned Section */}
            {exercise.animation && (
                <div className="w-full bg-gray-50 border-t border-gray-100 mt-2 py-6 flex flex-col items-center">
                    {/* Badge */}
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-600 border border-gray-200 shadow-sm uppercase tracking-wide">
                            Ukážka cviku
                        </span>
                    </div>

                    {/* Image - Bigger & Blended */}
                    <div className="w-full flex justify-center px-4">
                        <img
                            src={exercise.animation}
                            alt={`${exercise.name} animácia`}
                            className="h-64 sm:h-72 w-auto object-contain mix-blend-multiply opacity-95"
                            style={{ filter: 'contrast(1.05)' }}
                        />
                    </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              onClick={() => {
                onAddToWorkout(exercise)
                onClose()
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-soft flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Pridať do tréningu
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExerciseDetailModal