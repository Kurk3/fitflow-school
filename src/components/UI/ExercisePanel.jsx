import { useState } from 'react'
import exercisesData from '../../data/exercises.json'
import { useWorkout } from '../../context/WorkoutContext'

// Prijímame prop 'mode' a 'onExerciseClick'
function ExercisePanel({ muscleName, mode, onClose, onExerciseClick }) {
  const { addExercise } = useWorkout()
  const [addedExerciseId, setAddedExerciseId] = useState(null)
  // 1. Získame všetky cviky pre sval
  const allExercises = muscleName ? exercisesData[muscleName] || [] : []

  // 2. FILTROVANIE: Vyberieme len tie, ktoré majú v poli 'modes' náš aktuálny mód
  // Poznámka: Ak v JSON ešte nemáš pole 'modes', tento filter by vrátil prázdne pole. 
  // Pre spätnú kompatibilitu pridáme "|| !exercise.modes" aby to ukazovalo všetko, ak dáta chýbajú.
  const exercises = allExercises.filter(exercise => {
    if (!exercise.modes) return true; // Ak dáta nemajú definované módy, zobraz všetko (fallback)
    return exercise.modes.includes(mode);
  });

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
      mat: 'Podložka', // Pre Pilates
      ball: 'Fitlopta' // Pre Pilates
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

  // UI Helper pre názov módu
  const getModeTitle = () => {
    switch(mode) {
        case 'bodybuilding': return 'Bodybuilding';
        case 'calisthenics': return 'Kalistenika';
        case 'pilates': return 'Pilates';
        default: return mode;
    }
  }

  if (!muscleName) return null

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 pt-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-1 block">
              {getModeTitle()}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{muscleName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Zavrieť"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium">
            {exercises.length}
          </span>
          <span>dostupných cvikov</span>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        {exercises.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Žiadne cviky nenájdené</p>
              <p className="text-sm mt-1 text-gray-500 max-w-[250px]">
                Pre sval "{muscleName}" v móde "{getModeTitle()}" zatiaľ nemáme dáta.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-5 shadow-soft hover:shadow-elevated transition-all duration-200 border border-gray-300 cursor-pointer"
                onClick={() => onExerciseClick && onExerciseClick(exercise)}
              >
                <div className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 pr-8">
                      {exercise.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {exercise.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                      {getDifficultyLabel(exercise.difficulty)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {getEquipmentLabel(exercise.equipment)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addExercise(exercise, mode)
                      setAddedExerciseId(exercise.name)
                      setTimeout(() => setAddedExerciseId(null), 2000)
                    }}
                    className={`w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-soft hover:shadow-elevated ${
                      addedExerciseId === exercise.name
                        ? 'bg-gray-900'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        addedExerciseId === exercise.name
                          ? "M5 13l4 4L19 7"
                          : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                      } />
                    </svg>
                    {addedExerciseId === exercise.name ? 'Pridané!' : 'Pridať do tréningu'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExercisePanel