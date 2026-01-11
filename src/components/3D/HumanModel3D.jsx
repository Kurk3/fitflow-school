import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Model({ onMuscleClick, selectedMuscle }) {
  const { scene, nodes } = useGLTF('/models/naselectovany_model_menej_plosok.glb')
  const [hoveredMesh, setHoveredMesh] = useState(null)
  const modelRef = useRef()

  // Mapovanie z mesh názvov na slovenské názvy svalov
  const getMuscleNameFromMesh = (meshName) => {
    const name = meshName.toLowerCase()

    // Hrudník
    if (name.includes('chest') || name.includes('pectoral') || name.includes('pec')) {
      return 'Hrudník (Pectorals)'
    }
    // Biceps
    if (name.includes('bicep')) {
      return 'Biceps'
    }
    // Triceps
    if (name.includes('tricep')) {
      return 'Triceps'
    }
    // Ramená
    if (name.includes('deltoid') || name.includes('shoulder')) {
      return 'Ramená (Shoulders)'
    }
    // Brucho
    if (name.includes('abs') || name.includes('abdominal')) {
      return 'Brucho (Abs)'
    }
    // Chrbát
    if (name.includes('back') || name.includes('trapezius') || name.includes('trap') || name.includes('lat')) {
      return 'Chrbát (Back)'
    }
    // Stehná
    if (name.includes('quad') || name.includes('thigh')) {
      return 'Stehná (Quads)'
    }
    // Zadné stehenné
    if (name.includes('hamstring')) {
      return 'Zadné stehenné svaly (Hamstrings)'
    }
    // Lýtka
    if (name.includes('calf') || name.includes('calves')) {
      return 'Lýtka (Calves)'
    }
    // Zadok
    if (name.includes('glute') || name.includes('gluteal')) {
      return 'Zadok (Glutes)'
    }
    // Predlaktia
    if (name.includes('forearm')) {
      return 'Predlaktia'
    }

    return null // Ignoruj ostatné meshe (oči, koža, atď)
  }

  // Klonuj materiály pre každý mesh aby sa dali zvýrazňovať nezávisle
  useEffect(() => {
    if (scene) {
      console.log('=== MODEL DEBUG ===')

      // Vypočítaj bounding box celého modelu
      const box = new THREE.Box3().setFromObject(scene)
      const size = new THREE.Vector3()
      box.getSize(size)
      const center = new THREE.Vector3()
      box.getCenter(center)

      console.log('Model veľkosť (size):', size)
      console.log('Model stred (center):', center)
      console.log('Model min:', box.min)
      console.log('Model max:', box.max)

      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          console.log('Mesh:', child.name)

          // Klonuj materiál
          child.material = child.material.clone()
          child.material.transparent = true
          child.material.opacity = 1

          // Nastav základnú farbu
          const muscleName = getMuscleNameFromMesh(child.name)
          if (muscleName) {
            child.userData.muscleName = muscleName
            child.material.emissive = new THREE.Color(0x000000)
            child.material.emissiveIntensity = 0
          }
        }
      })
    }
  }, [scene])

  // Zvýraznenie vybraného/hovernutého svalu
  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (child.isMesh && child.material && child.userData.muscleName) {
        const isSelected = child.userData.muscleName === selectedMuscle
        const isHovered = child.name === hoveredMesh

        if (isSelected || isHovered) {
          child.material.emissive = new THREE.Color(0xff0000) // červená
          child.material.emissiveIntensity = 0.7
        } else {
          child.material.emissive = new THREE.Color(0x000000)
          child.material.emissiveIntensity = 0
        }
      }
    })
  }, [scene, selectedMuscle, hoveredMesh])

  const handleClick = (event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.userData.muscleName) {
      console.log('Clicked mesh:', mesh.name, '-> Muscle:', mesh.userData.muscleName)
      onMuscleClick(mesh.userData.muscleName)
    }
  }

  const handlePointerOver = (event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.userData.muscleName) {
      document.body.style.cursor = 'pointer'
      setHoveredMesh(mesh.name)
    }
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'default'
    setHoveredMesh(null)
  }

  return (
    <primitive
      ref={modelRef}
      object={scene}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={0.01}
      position={[0, -0.2, 0]}
    />
  )
}

function HumanModel3D({ onMuscleClick, selectedMuscle }) {
  return (
    <div className="w-4/5 h-4/5 relative mx-auto">
      <Canvas
        camera={{ position: [10, 10, 5], fov: 40 }}
        shadows
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <pointLight position={[0, 2, 0]} intensity={0.3} />

        {/* 3D Model */}
        <Model onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          target={[0, 1, 0]}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}

// Preload model
useGLTF.preload('/models/naselectovany_model_menej_plosok.glb')

export default HumanModel3D
