import exercisesData from '../../data/exercises.json'

function ExercisePanel({ muscleName, onClose }) {
  // Získaj cviky pre daný sval
  const exercises = muscleName ? exercisesData[muscleName] || [] : []

  // Difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Equipment labels
  const getEquipmentLabel = (equipment) => {
    const labels = {
      bodyweight: 'Vlastná váha',
      barbell: 'Činka',
      dumbbells: 'Jednoručky',
      dumbbell: 'Jednoručka',
      cable: 'Kladka',
      machine: 'Stroj',
      'pullup bar': 'Hrazda',
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

  // Placeholder keď nič nie je vybrané
  if (!muscleName) {
    return null
  }

  return (
    <div className="h-full bg-white shadow-2xl overflow-y-auto">
      {/* Header with close button */}
      <div className="sticky top-0 bg-gradient-to-r from-gray-700 to-gray-600 text-white p-6 shadow-lg z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{muscleName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Zavrieť"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-100 text-sm">
          {exercises.length} {exercises.length === 1 ? 'cvik' : 'cvikov'}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {exercises.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Žiadne cviky nenájdené</p>
            <p className="text-sm mt-2">Pre tento sval ešte nemáme cviky v databáze.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-400"
              >
                {/* Exercise name */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {exercise.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {exercise.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Difficulty badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>

                  {/* Equipment badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                    {getEquipmentLabel(exercise.equipment)}
                  </span>
                </div>

                {/* Add to workout button */}
                <button className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  Pridať do workoutu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer tip */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <strong>Tip:</strong> Klikni na iný sval pre viac cvikov
        </p>
      </div>
    </div>
  )
}

export default ExercisePanel
