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
      case 'beginner': return 'bg-gray-100 text-gray-700'
      case 'intermediate': return 'bg-gray-200 text-gray-800'
      case 'advanced': return 'bg-gray-300 text-gray-900'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 font-semibold text-sm transition-colors ${tab === 'current' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setTab('current')}
        >
          Aktuálny tréning
        </button>
        <button
          className={`flex-1 py-3 font-semibold text-sm transition-colors ${tab === 'saved' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setTab('saved')}
        >
          Uložené tréningy
        </button>
      </div>

      {/* Current Workout */}
      {tab === 'current' && (
        <>
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="mb-4">
              <label className="text-xs font-semibold tracking-wider text-gray-600 uppercase mb-2 block">Názov tréningu</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Názov tréningu..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold">
                {workoutExercises.length}
              </span>
              <span>cvikov v tréningu</span>
              {currentWorkoutId ? (
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-gray-500">Upravuješ uložený</span>
                  <button
                    onClick={() => {
                      setCurrentWorkoutId(null)
                      setWorkoutName('')
                      clearWorkout()
                    }}
                    className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-2 py-1 rounded transition-colors"
                    title="Začať nový tréning"
                  >
                    + Nový
                  </button>
                </div>
              ) : (
                <span className="ml-auto text-xs text-gray-500">Nový tréning</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {workoutExercises.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Žiadne cviky v tréningu</p>
                <p className="text-xs text-gray-500 text-center">Klikni na sval a pridaj cviky</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workoutExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white border border-gray-300 rounded-xl p-4 shadow-soft hover:shadow-elevated transition-shadow">
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
                            <h4 className="font-semibold text-sm text-gray-900">{exercise.name}</h4>
                            <p className="text-xs text-gray-500">{exercise.muscleName}</p>
                          </div>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-500">Sety × Opakovania</p>
                            <p className="text-sm font-semibold text-gray-900">{exercise.sets} × {exercise.reps}</p>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-500">Váha</p>
                            <p className="text-sm font-semibold text-gray-900">{exercise.weight} {exercise.unit}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {exercise.equipment}
                          </span>
                        </div>

                        <button
                          onClick={() => setEditingId(exercise.id)}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-soft"
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
            <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
              {/* Save Button */}
              <button
                onClick={handleSaveWorkout}
                className={`w-full font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-soft ${
                  saveSuccess ? 'bg-gray-800' : 'bg-gray-900 hover:bg-gray-800'
                } text-white`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={saveSuccess ? "M5 13l4 4L19 7" : "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"} />
                </svg>
                {saveSuccess ? 'Uložené!' : (currentWorkoutId ? 'Aktualizovať' : 'Uložiť')}
              </button>

              {/* Export Section */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Exportovať</div>

                {/* Current Workout Export */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Aktuálny tréning</div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportToJSON}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                    >
                      JSON
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
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
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm border-2 border-gray-300 hover:border-gray-400"
              >
                Vymazať tréning
              </button>
            </div>
          )}
        </>
      )}

      {/* Saved Workouts */}
      {tab === 'saved' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {(!savedWorkouts || savedWorkouts.length === 0) ? (
            <div className="text-gray-500 text-center mt-8">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-700">Žiadne uložené tréningy</div>
            </div>
          ) : (
            savedWorkouts.map((w, idx) => (
              <div key={w.id || idx} className="bg-white border border-gray-300 rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{w.name || 'Bez názvu'}</div>
                    <div className="text-xs text-gray-500">{new Date(w.savedAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {w.exercises.length} cvikov
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadWorkout(w)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-3 py-2.5 rounded-lg transition-colors shadow-soft"
                  >
                    Načítať
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(w.id)}
                    className="flex-1 bg-white hover:bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors border border-gray-300"
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