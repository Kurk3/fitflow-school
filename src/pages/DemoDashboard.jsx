import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HumanModel3D from '../components/3D/HumanModel3D'
import ExercisePanel from '../components/UI/ExercisePanel'
import WorkoutPanel from '../components/UI/WorkoutPanel'
import ExerciseDetailModal from '../components/UI/ExerciseDetailModal'
import { useWorkout } from '../context/WorkoutContext'
import { useToast } from '../context/ToastContext'
import { ClipboardList, X, Trash2 } from 'lucide-react'

function DemoDashboard() {
  const navigate = useNavigate()
  const [selectedMuscle, setSelectedMuscle] = useState(null)
  const [activeMode, setActiveMode] = useState('bodybuilding')
  const [showWorkout, setShowWorkout] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [showQuickWorkout, setShowQuickWorkout] = useState(false)
  const quickWorkoutRef = useRef(null)
  const { workoutExercises, addExercise, removeExercise, saveWorkout, workoutName, setWorkoutName } = useWorkout()
  const { showToast } = useToast()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickWorkoutRef.current && !quickWorkoutRef.current.contains(event.target)) {
        setShowQuickWorkout(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMuscleClick = (muscleName) => {
    setSelectedMuscle(muscleName)
  }

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'bodybuilding': return 'Bodybuilding'
      case 'calisthenics': return 'Calisthenics'
      case 'pilates': return 'Pilates'
      default: return mode
    }
  }

  return (
    <div className="w-full h-screen bg-neutral-50 relative overflow-hidden">
      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6">
        <div className="flex items-start justify-between">
          {/* Logo + Quick Workout Button */}
          <div className="flex flex-col gap-2">
            {/* Logo */}
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-soft border border-neutral-200 hover:bg-white transition-all duration-200"
            >
              <div className="p-1.5 bg-neutral-900 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-neutral-900">FitFlow</h1>
              </div>
            </button>

            {/* Quick Workout Button with Dropdown */}
            <div className="relative" ref={quickWorkoutRef}>
              <button
                onClick={() => setShowQuickWorkout(!showQuickWorkout)}
                className="relative p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft border border-neutral-200 hover:bg-white transition-all duration-200"
                aria-label="Aktuálny tréning"
              >
                <ClipboardList className="w-5 h-5 text-neutral-700" />
                {workoutExercises.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {workoutExercises.length}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showQuickWorkout && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-elevated border border-neutral-200 overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                    <input
                      type="text"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      className="font-bold text-lg text-neutral-900 bg-transparent border-none outline-none focus:bg-neutral-50 focus:px-2 focus:py-1 focus:-mx-2 focus:-my-1 rounded-lg transition-all w-full mr-2"
                      placeholder="Názov tréningu"
                    />
                    <button
                      onClick={() => setShowQuickWorkout(false)}
                      className="p-1 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>

                  {/* Exercise List */}
                  <div className="max-h-80 overflow-y-auto">
                    {workoutExercises.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-neutral-400">Žiadne cviky</p>
                        <p className="text-xs text-neutral-300 mt-1">Klikni na sval a pridaj cviky</p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-2">
                        {workoutExercises.map((exercise, index) => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="w-8 h-8 bg-neutral-200 rounded-full text-sm font-semibold flex items-center justify-center text-neutral-600">
                                {index + 1}
                              </span>
                              <div>
                                <p className="text-base font-medium text-neutral-900">{exercise.name}</p>
                                <p className="text-sm text-neutral-400">{exercise.sets}×{exercise.reps}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                              removeExercise(exercise.id)
                              showToast('Cvik odstránený', 'info')
                            }}
                              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-neutral-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {workoutExercises.length > 0 && (
                    <div className="px-4 py-4 border-t border-neutral-100">
                      <button
                        onClick={() => {
                          saveWorkout()
                          showToast('Tréning uložený', 'success')
                          setShowQuickWorkout(false)
                        }}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                      >
                        Uložiť tréning
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher - Center */}
          <div className="flex gap-1 bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-soft border border-neutral-200">
            {['bodybuilding', 'calisthenics', 'pilates'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                  activeMode === mode
                    ? 'bg-neutral-900 text-white shadow-soft'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span className="hidden sm:inline">{getModeLabel(mode)}</span>
                <span className="sm:hidden">{mode.slice(0, 4).toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Right Actions - Only Workout */}
          <div className="flex items-center gap-2">
            {/* Workout Button with Badge */}
            <button
              onClick={() => setShowWorkout(true)}
              className="relative p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft border border-neutral-200 hover:bg-white transition-all duration-200"
              aria-label="Workout"
            >
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {workoutExercises.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {workoutExercises.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3D Model - Full Screen */}
      <div className="w-full h-full">
        <HumanModel3D
          onMuscleClick={handleMuscleClick}
          selectedMuscle={selectedMuscle}
        />
      </div>

      {/* Bottom Instructions - Center */}
      {!selectedMuscle && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-soft border border-neutral-200">
            <p className="text-sm font-medium text-neutral-600">
              Klikni na sval <span className="mx-1">•</span>
              Rotuj ťahaním <span className="mx-1">•</span>
              Zoom kolieskom
            </p>
          </div>
        </div>
      )}

      {/* Exercise Panel - Slide from Right */}
      {selectedMuscle && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSelectedMuscle(null)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-elevated z-50 animate-slide-in-right">
            <ExercisePanel
              muscleName={selectedMuscle}
              mode={activeMode}
              onClose={() => setSelectedMuscle(null)}
              onExerciseClick={(exercise) => setSelectedExercise(exercise)}
            />
          </div>
        </>
      )}

      {/* Workout Panel - Modal */}
      {showWorkout && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowWorkout(false)}
          />

          {/* Modal */}
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:h-[80vh] bg-white rounded-2xl shadow-elevated z-50 overflow-hidden">
            <WorkoutPanel onClose={() => setShowWorkout(false)} />
          </div>
        </>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToWorkout={(exercise) => {
            addExercise(exercise, activeMode)
            showToast('Cvik pridaný do tréningu', 'success')
          }}
        />
      )}
    </div>
  )
}

export default DemoDashboard
