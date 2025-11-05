import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import HumanBody from './HumanBody'
import MuscleInfoPopup from '../UI/MuscleInfoPopup'

function Scene() {
  const [selectedMuscle, setSelectedMuscle] = useState(null)

  const handleMuscleClick = (muscleName) => {
    setSelectedMuscle(muscleName)
  }

  const handleClosePopup = () => {
    setSelectedMuscle(null)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-100 to-white relative">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 50 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        {/* 3D Model */}
        <HumanBody onMuscleClick={handleMuscleClick} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-10">
        <h1 className="text-2xl font-bold text-gray-800">FitFlow</h1>
        <p className="text-sm text-gray-600">Klikni na sval pre cviky</p>
      </div>

      {/* Muscle Info Popup */}
      {selectedMuscle && (
        <MuscleInfoPopup
          muscleName={selectedMuscle}
          onClose={handleClosePopup}
        />
      )}
    </div>
  )
}

export default Scene
