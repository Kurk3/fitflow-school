import { useState } from 'react'
import HumanModel3D from '../components/3D/HumanModel3D'
import ExercisePanel from '../components/UI/ExercisePanel'

function Dashboard() {
  const [selectedMuscle, setSelectedMuscle] = useState(null)

  const handleMuscleClick = (muscleName) => {
    setSelectedMuscle(muscleName)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg">
        <div className="px-4 py-3 flex items-center gap-2">
          {/* Logo */}
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          <div>
            <h1 className="text-2xl font-bold">FitFlow</h1>
            <p className="text-gray-100 text-xs">Tvoj osobný tréningový sprievodca</p>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Model - Animates width and position */}
        <div className={`h-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
          selectedMuscle ? 'w-3/5' : 'w-full'
        }`}>
          <HumanModel3D onMuscleClick={handleMuscleClick} selectedMuscle={selectedMuscle} />
        </div>

        {/* Slide-over Exercise Panel */}
        <div className={`h-full w-2/5 transform transition-transform duration-300 ease-in-out ${
          selectedMuscle ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <ExercisePanel muscleName={selectedMuscle} onClose={() => setSelectedMuscle(null)} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
