import { useState } from 'react'
import exercisesData from '../../data/exercises.json'
import musclesData from '../../data/muscles.json'
import { useWorkout } from '../../context/WorkoutContext'

// Prijímame prop 'mode' a 'onExerciseClick'
function ExercisePanel({ muscleName, mode, onClose, onExerciseClick }) {
  const { addExercise } = useWorkout()
  const [addedExerciseId, setAddedExerciseId] = useState(null)
  const [activeTab, setActiveTab] = useState('exercises')

  // Získaj informácie o svale
  const muscleInfo = muscleName ? musclesData[muscleName] : null

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

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'exercises', label: `Cviky (${exercises.length})` },
  ]

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1 block">
              {getModeTitle()}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{muscleName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Zavrieť"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="p-5 space-y-6">
            {muscleInfo ? (
              <>
                {/* Description */}
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {muscleInfo.description}
                  </p>
                </div>

                {/* Anatomy */}
                {muscleInfo.anatomy && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Anatómia</h3>
                    <div className="space-y-3">
                      {muscleInfo.anatomy.parts.map((part, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="font-medium text-gray-900 text-sm">{part.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-xs text-gray-400 mb-1">Začiatok</p>
                          <p className="text-xs text-gray-700">{muscleInfo.anatomy.origin}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-xs text-gray-400 mb-1">Úpon</p>
                          <p className="text-xs text-gray-700">{muscleInfo.anatomy.insertion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Functions */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Funkcie svalu</h3>
                  <div className="space-y-2">
                    {muscleInfo.functions.map((func, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{func}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Exercises */}
                {muscleInfo.bestExercises && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Najlepšie cviky</h3>
                    <div className="flex flex-wrap gap-2">
                      {muscleInfo.bestExercises.map((exercise, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg font-medium"
                        >
                          {exercise}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tipy pre tréning</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-2">
                      {muscleInfo.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Training Frequency */}
                {muscleInfo.trainingFrequency && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Frekvencia tréningu</h3>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-blue-700">{muscleInfo.trainingFrequency}</p>
                    </div>
                  </div>
                )}

                {/* Common Injuries */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Časté zranenia</h3>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-red-700">{muscleInfo.commonInjuries}</p>
                  </div>
                </div>

                {/* Prevention */}
                {muscleInfo.prevention && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Prevencia zranení</h3>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-sm text-green-700">{muscleInfo.prevention}</p>
                    </div>
                  </div>
                )}

                {/* Related Muscles */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Súvisiace svaly</h3>
                  <div className="flex flex-wrap gap-2">
                    {muscleInfo.relatedMuscles.map((muscle, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Informácie nedostupné</p>
                <p className="text-gray-400 text-sm">Pre tento sval zatiaľ nemáme detaily</p>
              </div>
            )}
          </div>
        )}

        {/* EXERCISES TAB */}
        {activeTab === 'exercises' && (
          <div className="p-5">
            {exercises.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Žiadne cviky</p>
                <p className="text-gray-400 text-sm max-w-[250px] mx-auto">
                  Pre "{muscleName}" v móde "{getModeTitle()}" zatiaľ nemáme cviky
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                    onClick={() => onExerciseClick && onExerciseClick(exercise)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {exercise.name}
                      </h3>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {exercise.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                          {getDifficultyLabel(exercise.difficulty)}
                        </span>
                        <span className="px-2 py-1 rounded text-sm font-medium bg-white text-gray-500 border border-gray-200 flex items-center gap-1">
                          {exercise.equipment === 'barbell' || exercise.equipment === 'dumbbells' || exercise.equipment === 'dumbbell' ? (
                            <img src="/icons/barbel.png" alt="Činka" className="w-4 h-4" title="Činka" />
                          ) : exercise.equipment === 'pullup bar' || exercise.equipment === 'bodyweight' ? (
                            <img src="/icons/bodyweight.png" alt="Vlastná váha" className="w-4 h-4" title="Vlastná váha" />
                          ) : exercise.equipment === 'machine' ? (
                            <img src="/icons/gym.png" alt="Stroj" className="w-4 h-4" title="Stroj" />
                          ) : exercise.equipment === 'cable' ? (
                            <img src="/icons/pulley.png" alt="Kladka" className="w-4 h-4" title="Kladka" />
                          ) : exercise.equipment === 'mat' ? (
                            <img src="/icons/mat.png" alt="Podložka" className="w-4 h-4" title="Podložka" />
                          ) : exercise.equipment === 'gymnastics rings' ? (
                            <img src="/icons/rings.png" alt="Kruhy" className="w-4 h-4" title="Kruhy" />
                          ) : (
                            getEquipmentLabel(exercise.equipment)
                          )}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addExercise(exercise, mode)
                          setAddedExerciseId(exercise.name)
                          setTimeout(() => setAddedExerciseId(null), 2000)
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          addedExerciseId === exercise.name
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            addedExerciseId === exercise.name
                              ? "M5 13l4 4L19 7"
                              : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                          } />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExercisePanel