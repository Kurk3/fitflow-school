import { useState } from 'react'
import HumanModel3D from '../components/3D/HumanModel3D'
import ExercisePanel from '../components/UI/ExercisePanel'
import WorkoutPanel from '../components/UI/WorkoutPanel'
import { useWorkout } from '../context/WorkoutContext'

function Dashboard() {
  const [selectedMuscle, setSelectedMuscle] = useState(null)
  const [activeMode, setActiveMode] = useState('bodybuilding')
  const { streak } = useWorkout()

  const handleMuscleClick = (muscleName) => {
    setSelectedMuscle(muscleName)
  }

  // Funkcia na štýlovanie tlačidiel
  const getTabStyle = (mode) => {
    const isActive = activeMode === mode
    const baseStyle = "relative px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 "
    const activeStyle = "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105"
    const inactiveStyle = "text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20"
    return baseStyle + (isActive ? activeStyle : inactiveStyle)
  }

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Sidebar */}
      {/* ...existing code... */}
      <aside className="w-full md:w-[600px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col p-0 md:p-12 gap-12 border-r border-white/10 z-20">
        {/* Logo + Streak Row */}
        <div className="flex items-center justify-between gap-3 px-6 py-6 md:px-0 md:py-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">FitFlow</h1>
              <p className="text-gray-400 text-xs tracking-widest">TRAINING GUIDE</p>
            </div>
          </div>
          {/* Streak Display moved here */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-semibold text-amber-300">{Number.isFinite(streak) && streak > 0 ? streak : 1} {Number.isFinite(streak) && streak === 1 ? 'Day' : 'Days'} Streak</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-row gap-4 bg-gradient-to-r from-white/5 to-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10 mx-6 md:mx-0 w-full justify-center">
          {['bodybuilding', 'calisthenics', 'pilates'].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={getTabStyle(mode) + ' flex-1 min-h-[64px] px-2 flex justify-center items-center transition-transform text-lg'}
              style={{ minWidth: 0 }}
            >
              <span className="inline-flex flex-row items-center w-full justify-center">
                {mode === 'bodybuilding' && <span>💪</span>}
                {mode === 'calisthenics' && <span>🏃</span>}
                {mode === 'pilates' && <span>🧘</span>}
                <span className="whitespace-nowrap ml-1">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </span>
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
          <div className={`h-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
            selectedMuscle ? 'w-full md:w-3/5' : 'w-full'
          }`}>
            <HumanModel3D 
              onMuscleClick={handleMuscleClick} 
              selectedMuscle={selectedMuscle} 
            />
            {!selectedMuscle && (
              <div className="absolute bottom-10 text-center pointer-events-none opacity-50">
                <p className="text-lg font-medium text-gray-400">Aktívny režim: <span className="capitalize text-blue-600 font-semibold">{activeMode}</span></p>
                <p className="text-sm text-gray-400">Klikni na sval pre zobrazenie cvikov</p>
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
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard