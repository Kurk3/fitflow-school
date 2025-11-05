import { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { getMuscleName } from '../../constants/muscleMapping'
import * as THREE from 'three'

function HumanBody({ onMuscleClick }) {
  const groupRef = useRef()
  const [hoveredPart, setHoveredPart] = useState(null)
  const [modelError, setModelError] = useState(false)
  const [originalMaterials, setOriginalMaterials] = useState(new Map())

  // Pokus načítať GLTF model
  let gltf = null
  try {
    gltf = useGLTF('/models/human-body.glb', true)
  } catch (error) {
    console.log('Model nie je dostupný, použijem placeholder')
    if (!modelError) setModelError(true)
  }

  // Clone materiály pre každý mesh aby boli independent
  useEffect(() => {
    if (gltf && gltf.scene) {
      const materials = new Map()
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Uložiť originál
          const originalMaterial = child.material.clone()
          materials.set(child.uuid, originalMaterial)

          // Priradiť nový cloned material každému meshu
          child.material = child.material.clone()
        }
      })
      setOriginalMaterials(materials)
    }
  }, [gltf])

  const handleClick = (event) => {
    event.stopPropagation()
    const partName = event.object.name || 'Unknown'
    const muscleName = getMuscleName(partName)
    console.log('Clicked:', partName, '→', muscleName)

    // Zavolaj callback pre otvorenie popupu
    if (onMuscleClick) {
      onMuscleClick(muscleName)
    }
  }

  const handleHover = (event, isHovering) => {
    event.stopPropagation()
    const mesh = event.object

    if (isHovering) {
      setHoveredPart(mesh.name)
      document.body.style.cursor = 'pointer'

      // Zvýrazni materiál
      if (mesh.material) {
        const material = mesh.material
        if (material.emissive) {
          material.emissive = new THREE.Color(0xff6b35)
          material.emissiveIntensity = 0.5
        }
        material.opacity = 0.9
      }
    } else {
      setHoveredPart(null)
      document.body.style.cursor = 'default'

      // Obnov originálny materiál
      if (mesh.material && originalMaterials.has(mesh.uuid)) {
        const original = originalMaterials.get(mesh.uuid)
        if (mesh.material.emissive) {
          mesh.material.emissive.copy(original.emissive || new THREE.Color(0x000000))
          mesh.material.emissiveIntensity = original.emissiveIntensity || 0
        }
        mesh.material.opacity = original.opacity || 1
      }
    }
  }

  const MuscleGroup = ({ position, scale, color, name, ...props }) => {
    const isHovered = hoveredPart === name

    return (
      <mesh
        position={position}
        scale={scale}
        onClick={() => handleClick(name)}
        onPointerOver={() => setHoveredPart(name)}
        onPointerOut={() => setHoveredPart(null)}
        castShadow
        {...props}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={isHovered ? '#ff6b6b' : color}
          emissive={isHovered ? '#ff3333' : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>
    )
  }

  // Ak existuje GLTF model, použijeme ho
  if (gltf && gltf.scene) {
    return (
      <primitive
        ref={groupRef}
        object={gltf.scene}
        onClick={handleClick}
        onPointerOver={(e) => handleHover(e, true)}
        onPointerOut={(e) => handleHover(e, false)}
        scale={1}
        position={[0, -1, 0]}
      />
    )
  }

  // Placeholder figúrka (ak model nie je dostupný)
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Hlava */}
      <MuscleGroup
        position={[0, 1.5, 0]}
        scale={[0.3, 0.3, 0.3]}
        color="#f4c2a0"
        name="Hlava"
      />

      {/* Trup */}
      <MuscleGroup
        position={[0, 0.5, 0]}
        scale={[0.5, 0.8, 0.3]}
        color="#e8a87c"
        name="Hrudník (Chest)"
      />

      {/* Brucho */}
      <MuscleGroup
        position={[0, -0.3, 0]}
        scale={[0.45, 0.5, 0.28]}
        color="#e09e70"
        name="Brucho (Abs)"
      />

      {/* Ľavé rameno */}
      <MuscleGroup
        position={[-0.5, 0.7, 0]}
        scale={[0.25, 0.25, 0.25]}
        color="#d4896b"
        name="Ľavé rameno (Shoulder)"
      />

      {/* Pravé rameno */}
      <MuscleGroup
        position={[0.5, 0.7, 0]}
        scale={[0.25, 0.25, 0.25]}
        color="#d4896b"
        name="Pravé rameno (Shoulder)"
      />

      {/* Ľavá ruka */}
      <MuscleGroup
        position={[-0.5, 0.1, 0]}
        scale={[0.15, 0.6, 0.15]}
        color="#c97b5f"
        name="Ľavý biceps"
      />

      {/* Pravá ruka */}
      <MuscleGroup
        position={[0.5, 0.1, 0]}
        scale={[0.15, 0.6, 0.15]}
        color="#c97b5f"
        name="Pravý biceps"
      />

      {/* Ľavé stehno */}
      <MuscleGroup
        position={[-0.2, -1.0, 0]}
        scale={[0.2, 0.7, 0.2]}
        color="#b96e52"
        name="Ľavé stehno (Quads)"
      />

      {/* Pravé stehno */}
      <MuscleGroup
        position={[0.2, -1.0, 0]}
        scale={[0.2, 0.7, 0.2]}
        color="#b96e52"
        name="Pravé stehno (Quads)"
      />

      {/* Ľavé lýtko */}
      <MuscleGroup
        position={[-0.2, -1.8, 0]}
        scale={[0.15, 0.5, 0.15]}
        color="#a65f46"
        name="Ľavé lýtko (Calves)"
      />

      {/* Pravé lýtko */}
      <MuscleGroup
        position={[0.2, -1.8, 0]}
        scale={[0.15, 0.5, 0.15]}
        color="#a65f46"
        name="Pravé lýtko (Calves)"
      />
    </group>
  )
}

export default HumanBody
