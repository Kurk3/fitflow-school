import { useState, useRef } from 'react'
import { useWorkout } from '../../context/WorkoutContext'
import ExerciseForm from './ExerciseForm'
import ExportDropdown from './ExportDropdown'
import { exportToICalendar, exportToCSV as exportCalendarToCSV, exportToPNG, exportToPDF } from '../../utils/exportCalendar'

function WorkoutPanel() {
  const {
    workoutExercises,
    workoutName,
    setWorkoutName,
    removeExercise,
    updateExercise,
    clearWorkout,
    saveWorkout,
    exportToJSON,
    exportToCSV,
    savedWorkouts,
    loadWorkout,
    deleteWorkout,
    updateSavedWorkout,
    getWorkoutCalendarData
  } = useWorkout()
  const [editingId, setEditingId] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [tab, setTab] = useState('current')
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null)
  const calendarRef = useRef(null)

  const handleSaveExercise = (id, formData) => {
    updateExercise(id, formData)
    setEditingId(null)
  }

  const handleLoadWorkout = (workout) => {
    loadWorkout(workout)
    setCurrentWorkoutId(workout.id)
    setTab('current')
  }

  const handleSaveWorkout = () => {
    if (currentWorkoutId) {
      updateSavedWorkout(currentWorkoutId)
      setCurrentWorkoutId(null)
    } else {
      const newId = saveWorkout()
      if (newId) {
        setCurrentWorkoutId(newId)
      }
    }
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleDeleteWorkout = (id) => {
    deleteWorkout(id)
    if (currentWorkoutId === id) {
      setCurrentWorkoutId(null)
    }
  }

  const handleClearWorkout = () => {
    clearWorkout()
    setCurrentWorkoutId(null)
  }

  const handleCalendarExport = async (format) => {
    const workoutData = getWorkoutCalendarData()

    switch (format) {
      case 'icalendar':
        exportToICalendar(workoutData)
        break
      case 'csv':
        exportCalendarToCSV(workoutData)
        break
      case 'png':
        await exportToPNG(calendarRef)
        break
      case 'pdf':
        exportToPDF(workoutData)
        break
      default:
        console.error('Unknown export format:', format)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800'
      case 'intermediate': return 'bg-amber-100 text-amber-800'
      case 'advanced': return 'bg-rose-100 text-rose-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getModeEmoji = (mode) => {
    switch (mode) {
      case 'bodybuilding': return '💪'
      case 'calisthenics': return '🏃'
      case 'pilates': return '🧘'
      default: return '🏋️'
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col text-white">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 py-2 font-semibold ${tab === 'current' ? 'bg-gray-900 text-blue-400' : 'bg-gray-800 text-gray-400'}`}
          onClick={() => setTab('current')}
        >
          Aktuálny tréning
        </button>
        <button
          className={`flex-1 py-2 font-semibold ${tab === 'saved' ? 'bg-gray-900 text-blue-400' : 'bg-gray-800 text-gray-400'}`}
          onClick={() => setTab('saved')}
        >
          Uložené tréningy
        </button>
      </div>

      {/* Current Workout */}
      {tab === 'current' && (
        <>
          {/* Header */}
          <div className="border-b border-white/10 p-4">
            <div className="mb-4">
              <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 block">Názov tréningu</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-xs font-bold">
                {workoutExercises.length}
              </span>
              <span>cvikov v tréningu</span>
              {currentWorkoutId ? (
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-blue-400">📝 Upravuješ uložený</span>
                  <button
                    onClick={() => {
                      setCurrentWorkoutId(null)
                      setWorkoutName('')
                      clearWorkout()
                    }}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                    title="Začať nový tréning"
                  >
                    ➕ Nový
                  </button>
                </div>
              ) : (
                <span className="ml-auto text-xs text-green-400">✨ Nový tréning</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {workoutExercises.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <div className="text-4xl">📋</div>
                <p className="text-sm font-medium">Žiadne cviky v tréningu</p>
                <p className="text-xs text-gray-500 text-center">Klikni na "Pridať do tréningu" v paneli cvikov</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workoutExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    {editingId === exercise.id ? (
                      <ExerciseForm
                        exercise={exercise}
                        onSave={(data) => handleSaveExercise(exercise.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{getModeEmoji(exercise.mode)}</span>
                              <h4 className="font-semibold text-sm text-white">{exercise.name}</h4>
                            </div>
                            <p className="text-xs text-gray-400">{exercise.muscleName}</p>
                          </div>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-gray-400">Sety × Opakovania</p>
                            <p className="text-sm font-semibold text-white">{exercise.sets} × {exercise.reps}</p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-gray-400">Váha</p>
                            <p className="text-sm font-semibold text-white">{exercise.weight} {exercise.unit}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                            {exercise.equipment}
                          </span>
                        </div>

                        <button
                          onClick={() => setEditingId(exercise.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded transition-colors"
                        >
                          Upraviť
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Actions */}
          {workoutExercises.length > 0 && (
            <div className="border-t border-white/10 p-4 space-y-2">
              {/* Save Button */}
              <button
                onClick={handleSaveWorkout}
                className={`w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={saveSuccess ? "M5 13l4 4L19 7" : "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"} />
                </svg>
                {saveSuccess ? 'Uložené!' : (currentWorkoutId ? 'Aktualizovať' : 'Uložiť')}
              </button>

              {/* Export Section */}
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Exportovať</div>

                {/* Current Workout Export */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Aktuálny tréning</div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportToJSON}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                    >
                      JSON
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                    >
                      CSV
                    </button>
                  </div>
                </div>

                {/* Calendar Export */}
                {savedWorkouts.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Kalendár & História</div>
                    <ExportDropdown onExport={handleCalendarExport} />
                  </div>
                )}
              </div>

              {/* Clear Button */}
              <button
                onClick={handleClearWorkout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Vymazať tréning
              </button>
            </div>
          )}
        </>
      )}

      {/* Saved Workouts */}
      {tab === 'saved' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!savedWorkouts || savedWorkouts.length === 0) ? (
            <div className="text-gray-400 text-center mt-8">
              <div className="text-4xl mb-2">💾</div>
              <div>Žiadne uložené tréningy</div>
            </div>
          ) : (
            savedWorkouts.map((w, idx) => (
              <div key={w.id || idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-white">{w.name || 'Bez názvu'}</div>
                    <div className="text-xs text-gray-400">{new Date(w.savedAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mb-3">
                  {w.exercises.length} cvikov
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadWorkout(w)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
                  >
                    Načítať
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(w.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
                  >
                    Vymazať
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default WorkoutPanel