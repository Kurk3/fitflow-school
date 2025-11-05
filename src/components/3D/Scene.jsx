import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import HumanBody from './HumanBody'

function Scene() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-100 to-white">
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
        <HumanBody />

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
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800">FitFlow</h1>
        <p className="text-sm text-gray-600">Klikni na sval pre info</p>
      </div>
    </div>
  )
}

export default Scene
