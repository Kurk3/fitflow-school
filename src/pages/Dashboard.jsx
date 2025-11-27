import { useState } from 'react'
import HumanModel3D from '../components/3D/HumanModel3D'
import ExercisePanel from '../components/UI/ExercisePanel'
import WorkoutPanel from '../components/UI/WorkoutPanel'
import ProfilePanel from '../components/UI/ProfilePanel'
import ExerciseDetailModal from '../components/UI/ExerciseDetailModal'
import { useWorkout } from '../context/WorkoutContext'

function Dashboard() {
  const [selectedMuscle, setSelectedMuscle] = useState(null)
  const [activeMode, setActiveMode] = useState('bodybuilding')
  const [showProfile, setShowProfile] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const { streak, addExercise } = useWorkout()

  const handleMuscleClick = (muscleName) => {
    setSelectedMuscle(muscleName)
  }

  // Funkcia na štýlovanie tlačidiel
  const getTabStyle = (mode) => {
    const isActive = activeMode === mode
    const baseStyle = "relative px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 "
    const activeStyle = "bg-white text-gray-900 shadow-soft border-2 border-gray-900"
    const inactiveStyle = "text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
    return baseStyle + (isActive ? activeStyle : inactiveStyle)
  }

  return (
    <div className="w-full h-screen flex bg-gray-50">
      {/* Profile Modal Popup */}
      {showProfile && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setShowProfile(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl h-[90vh] bg-white rounded-elegant shadow-elevated overflow-hidden transform transition-all duration-300 scale-100">
              <ProfilePanel onClose={() => setShowProfile(false)} />
            </div>
          </div>
        </>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-[600px] bg-white flex flex-col p-0 md:p-12 gap-12 border-r border-gray-200 z-20">
        {/* Logo + Streak Row */}
        <div className="flex items-center justify-between gap-3 px-6 py-6 md:px-0 md:py-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900 rounded-lg shadow-subtle">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">FitFlow</h1>
              <p className="text-gray-500 text-xs tracking-widest">TRAINING GUIDE</p>
            </div>
          </div>
          {/* Achievements Button */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer shadow-subtle"
            aria-label="Otvoriť achievementy a štatistiky"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">Achievements</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-row gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 mx-6 md:mx-0 w-full justify-center">
          {['bodybuilding', 'calisthenics', 'pilates'].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={getTabStyle(mode) + ' flex-1 py-3 px-4 flex justify-center items-center'}
              style={{ minWidth: 0 }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Workout Panel */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <WorkoutPanel />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex overflow-hidden relative">
          {/* 3D Model */}
          <div className={`h-full bg-white flex items-center justify-center transition-all duration-300 ease-in-out ${
            selectedMuscle ? 'w-full md:w-3/5' : 'w-full'
          }`}>
            <HumanModel3D
              onMuscleClick={handleMuscleClick}
              selectedMuscle={selectedMuscle}
            />
            {!selectedMuscle && (
              <div className="absolute bottom-10 text-center pointer-events-none opacity-50">
                <p className="text-lg font-medium text-gray-600">Aktívny režim: <span className="capitalize text-primary-900 font-semibold">{activeMode}</span></p>
                <p className="text-sm text-gray-500">Klikni na sval pre zobrazenie cvikov</p>
              </div>
            )}
          </div>

          {/* Exercise Panel */}
          <div className={`absolute md:relative right-0 h-full w-full md:w-2/5 transform transition-transform duration-300 ease-in-out shadow-2xl z-10 ${
            selectedMuscle ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:hidden'
          }`}>
            {selectedMuscle && (
              <ExercisePanel
                muscleName={selectedMuscle}
                mode={activeMode}
                onClose={() => setSelectedMuscle(null)}
                onExerciseClick={(exercise) => setSelectedExercise(exercise)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Exercise Detail Modal - Full Screen */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToWorkout={(exercise) => {
            addExercise(exercise, activeMode)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard