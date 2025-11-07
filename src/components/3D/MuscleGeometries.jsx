import * as THREE from 'three'

// Helper funkcia pre vytvorenie biceps/triceps pomocou LatheGeometry
export function createArmMuscle() {
  // Profil svalu - zakrivený tvar bicepsu
  const points = []
  const segments = 16

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = t * Math.PI

    // Vytvor vybočený tvar - najširší v strede
    const radius = 0.5 + Math.sin(angle) * 0.3
    const y = t * 1.0 - 0.5

    points.push(new THREE.Vector2(radius, y))
  }

  return new THREE.LatheGeometry(points, 16)
}

// Helper pre lýtka s vybočením
export function createCalfMuscle() {
  const points = []
  const segments = 12

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = t * Math.PI

    // Lýtko je najširšie v hornej tretine
    const radius = 0.5 + Math.sin(angle * 1.3) * 0.25
    const y = t * 1.0 - 0.5

    points.push(new THREE.Vector2(radius, y))
  }

  return new THREE.LatheGeometry(points, 12)
}

// Helper pre stehno
export function createThighMuscle() {
  const points = []
  const segments = 14

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = t * Math.PI

    // Stehno je širšie hore
    const radius = 0.6 - t * 0.15 + Math.sin(angle) * 0.2
    const y = t * 1.0 - 0.5

    points.push(new THREE.Vector2(radius, y))
  }

  return new THREE.LatheGeometry(points, 16)
}

// Helper pre torzo s V-tvarom
export function createTorsoShape() {
  const shape = new THREE.Shape()

  // Vytvor obrys torza - široké hore, úzke dole (V-shape)
  shape.moveTo(-0.45, 0.5)  // Ľavé rameno
  shape.lineTo(-0.38, 0.3)  // Armpit
  shape.quadraticCurveTo(-0.35, 0, -0.28, -0.3) // Oblique
  shape.lineTo(-0.22, -0.5) // Ľavý pás

  shape.lineTo(0.22, -0.5)  // Pravý pás
  shape.quadraticCurveTo(0.28, -0.3, 0.35, 0) // Pravá oblique
  shape.lineTo(0.38, 0.3)   // Pravá armpit
  shape.lineTo(0.45, 0.5)   // Pravé rameno

  shape.quadraticCurveTo(0, 0.55, -0.45, 0.5) // Horná krivka

  const extrudeSettings = {
    depth: 0.25,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 8
  }

  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

// Pectorals s krivkou
export function createPectoralMuscle() {
  const shape = new THREE.Shape()

  // Tvar prsného svalu
  shape.moveTo(0, 0.3)
  shape.quadraticCurveTo(0.3, 0.2, 0.35, 0)
  shape.quadraticCurveTo(0.3, -0.15, 0.15, -0.2)
  shape.lineTo(0, -0.15)
  shape.quadraticCurveTo(0.05, 0, 0, 0.3)

  const extrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5
  }

  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

// Ab muscle (jedna kocka)
export function createAbMuscle() {
  const shape = new THREE.Shape()

  // Zaoblený obdĺžnik
  const width = 0.12
  const height = 0.10
  const radius = 0.02

  shape.moveTo(-width/2 + radius, -height/2)
  shape.lineTo(width/2 - radius, -height/2)
  shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
  shape.lineTo(width/2, height/2 - radius)
  shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
  shape.lineTo(-width/2 + radius, height/2)
  shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
  shape.lineTo(-width/2, -height/2 + radius)
  shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)

  const extrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelSegments: 3
  }

  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}
