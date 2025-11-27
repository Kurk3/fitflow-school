import { X } from 'lucide-react'
import exercisesData from '../../data/exercises.json'

function MuscleInfoPopup({ muscleName, onClose }) {
  if (!muscleName) return null

  // Získaj cviky pre daný sval
  const exercises = exercisesData[muscleName] || []

  // Difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-gray-100 text-gray-700'
      case 'intermediate':
        return 'bg-gray-200 text-gray-800'
      case 'advanced':
        return 'bg-gray-300 text-gray-900'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Equipment icons/labels
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Popup panel */}
      <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-elevated z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{muscleName}</h2>
              <p className="text-gray-600 text-sm">
                {exercises.length} {exercises.length === 1 ? 'cvik' : 'cvikov'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              aria-label="Zavrieť"
            >
              <X size={24} />
            </button>
          </div>
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
                  className="bg-white rounded-xl p-5 shadow-soft hover:shadow-elevated transition-all border border-gray-300"
                >
                  {/* Exercise name */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {exercise.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">
                    {exercise.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {/* Difficulty badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        exercise.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(exercise.difficulty)}
                    </span>

                    {/* Equipment badge */}
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {getEquipmentLabel(exercise.equipment)}
                    </span>
                  </div>

                  {/* Add to workout button */}
                  <button className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-soft">
                    Pridať do workoutu
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Tip:</strong> Klikni na iný sval pre viac cvikov
          </p>
        </div>
      </div>
    </>
  )
}

export default MuscleInfoPopup
