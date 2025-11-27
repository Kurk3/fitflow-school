import { useState } from 'react'
import { useWorkout } from '../../context/WorkoutContext'

function WorkoutPanel({ onClose }) {
  const {
    workoutExercises,
    workoutName,
    setWorkoutName,
    removeExercise,
    clearWorkout,
    saveWorkout,
    savedWorkouts,
    loadWorkout,
    deleteWorkout,
    exportToJSON,
    exportToCSV,
    exportToICS,
    shareWorkout,
    getWorkoutStats,
  } = useWorkout()

  const [tab, setTab] = useState('build')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    if (workoutExercises.length === 0) return
    saveWorkout()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const tabs = [
    { id: 'build', label: 'Zostaviť' },
    { id: 'saved', label: 'Uložené' },
    { id: 'export', label: 'Export' },
  ]

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Tréning</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-5 border-b border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* BUILD TAB */}
        {tab === 'build' && (
          <div className="p-5 h-full flex flex-col">
            {/* Workout Name */}
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Názov tréningu..."
              className="w-full text-base font-medium text-gray-900 placeholder-gray-300 bg-gray-50 border-0 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-gray-200"
            />

            {/* Exercise List */}
            {workoutExercises.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Zatiaľ prázdny</p>
                <p className="text-gray-400 text-sm">Vyber sval na modeli a pridaj cviky</p>
              </div>
            ) : (
              <div className="space-y-1.5 flex-1">
                {workoutExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {exercise.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {exercise.sets}×{exercise.reps}
                        {exercise.weight > 0 && ` · ${exercise.weight}${exercise.unit}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {workoutExercises.length > 0 && (
              <div className="pt-4 mt-auto space-y-2">
                <button
                  onClick={handleSave}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    saveSuccess
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {saveSuccess ? 'Uložené!' : 'Uložiť'}
                </button>
                <button
                  onClick={clearWorkout}
                  className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Vyčistiť
                </button>
              </div>
            )}
          </div>
        )}

        {/* SAVED TAB */}
        {tab === 'saved' && (
          <div className="p-5">
            {(!savedWorkouts || savedWorkouts.length === 0) ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Žiadne uložené</p>
                <p className="text-gray-400 text-sm">Ulož svoj prvý tréning</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {workout.name || 'Bez názvu'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {workout.exercises.length} cvikov · {new Date(workout.savedAt).toLocaleDateString('sk')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          loadWorkout(workout)
                          setTab('build')
                        }}
                        className="flex-1 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        Načítať
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="px-3 py-2 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXPORT TAB */}
        {tab === 'export' && (
          <div className="p-5 space-y-6">
            {/* Stats Section */}
            {workoutExercises.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Štatistiky tréningu</h3>
                {(() => {
                  const stats = getWorkoutStats()
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalExercises}</p>
                        <p className="text-xs text-gray-500">Cvikov</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalSets}</p>
                        <p className="text-xs text-gray-500">Sérií</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalReps}</p>
                        <p className="text-xs text-gray-500">Opakovaní</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">~{stats.estimatedDuration}<span className="text-sm font-normal">min</span></p>
                        <p className="text-xs text-gray-500">Odh. trvanie</p>
                      </div>
                      {stats.totalVolume > 0 && (
                        <div className="col-span-2 bg-white rounded-lg p-3 border border-gray-100">
                          <p className="text-2xl font-bold text-gray-900">{stats.totalVolume.toLocaleString('sk')}<span className="text-sm font-normal ml-1">kg</span></p>
                          <p className="text-xs text-gray-500">Celkový objem</p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Calendar Export */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pridať do kalendára</h3>
              <button
                onClick={() => exportToICS()}
                disabled={workoutExercises.length === 0}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 text-sm">Kalendár (.ics)</p>
                  <p className="text-xs text-gray-400">Google, Apple, Outlook kalendár</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>

            {/* Share */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Zdieľať</h3>
              <button
                onClick={async () => {
                  const success = await shareWorkout()
                  if (success && !navigator.share) {
                    alert('Tréning skopírovaný do schránky!')
                  }
                }}
                disabled={workoutExercises.length === 0}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 text-sm">Zdieľať tréning</p>
                  <p className="text-xs text-gray-400">Pošli kamarátom alebo skopíruj</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* File Export */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Exportovať súbor</h3>
              <div className="space-y-2">
                <button
                  onClick={exportToJSON}
                  disabled={workoutExercises.length === 0}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-xs font-bold text-gray-600">{ }</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 text-sm">JSON</p>
                    <p className="text-xs text-gray-400">Pre zálohu alebo import</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <button
                  onClick={exportToCSV}
                  disabled={workoutExercises.length === 0}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 text-sm">CSV</p>
                    <p className="text-xs text-gray-400">Pre Excel alebo Sheets</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>

            {workoutExercises.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Žiadne cviky</p>
                <p className="text-gray-400 text-sm">Najprv pridaj cviky do tréningu</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutPanel
