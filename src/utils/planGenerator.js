import exercises from '../data/exercises.json'

// Muscle group definitions for different splits
const MUSCLE_GROUPS = {
  push: ['Hrudník (Pectorals)', 'Ramená (Shoulders)', 'Triceps'],
  pull: ['Chrbát (Back)', 'Biceps', 'Predlaktie (Forearms)'],
  legs: ['Stehná (Quadriceps)', 'Zadné stehenné svaly (Hamstrings)', 'Lýtka (Calves)', 'Zadok (Glutes)'],
  upper: ['Hrudník (Pectorals)', 'Chrbát (Back)', 'Ramená (Shoulders)', 'Biceps', 'Triceps'],
  lower: ['Stehná (Quadriceps)', 'Zadné stehenné svaly (Hamstrings)', 'Lýtka (Calves)', 'Zadok (Glutes)'],
  core: ['Brucho (Abs)', 'Spodná časť chrbta (Lower Back)'],
  fullBody: ['Hrudník (Pectorals)', 'Chrbát (Back)', 'Ramená (Shoulders)', 'Stehná (Quadriceps)', 'Biceps', 'Triceps', 'Brucho (Abs)']
}

// Split configurations based on frequency
const SPLIT_CONFIGS = {
  '2-3': {
    name: 'Full Body',
    days: [
      { name: 'Full Body A', muscles: MUSCLE_GROUPS.fullBody },
      { name: 'Full Body B', muscles: MUSCLE_GROUPS.fullBody },
      { name: 'Full Body C', muscles: MUSCLE_GROUPS.fullBody }
    ],
    rotation: ['Tréning', 'Voľno', 'Tréning', 'Voľno', 'Tréning', 'Voľno', 'Voľno']
  },
  '4-5': {
    name: 'Upper/Lower',
    days: [
      { name: 'Upper Body', muscles: MUSCLE_GROUPS.upper },
      { name: 'Lower Body', muscles: MUSCLE_GROUPS.lower },
      { name: 'Upper Body', muscles: MUSCLE_GROUPS.upper },
      { name: 'Lower Body', muscles: MUSCLE_GROUPS.lower },
      { name: 'Full Body', muscles: MUSCLE_GROUPS.fullBody }
    ],
    rotation: ['Upper', 'Lower', 'Voľno', 'Upper', 'Lower', 'Voľno', 'Voľno']
  },
  '6-7': {
    name: 'Push/Pull/Legs',
    days: [
      { name: 'Push', muscles: MUSCLE_GROUPS.push },
      { name: 'Pull', muscles: MUSCLE_GROUPS.pull },
      { name: 'Legs', muscles: MUSCLE_GROUPS.legs },
      { name: 'Push', muscles: MUSCLE_GROUPS.push },
      { name: 'Pull', muscles: MUSCLE_GROUPS.pull },
      { name: 'Legs', muscles: MUSCLE_GROUPS.legs }
    ],
    rotation: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Voľno']
  }
}

// Get exercises for a muscle group filtered by mode and difficulty
function getExercisesForMuscle(muscle, mode, difficulty) {
  const muscleExercises = exercises[muscle] || []

  // Filter by mode
  let filtered = muscleExercises.filter(ex => ex.modes && ex.modes.includes(mode))

  // If no exercises for this mode, return empty
  if (filtered.length === 0) return []

  // Filter/sort by difficulty
  const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
  const userLevel = difficultyOrder[difficulty] || 2

  // Prioritize exercises at or below user's level
  filtered = filtered.sort((a, b) => {
    const aDiff = difficultyOrder[a.difficulty] || 2
    const bDiff = difficultyOrder[b.difficulty] || 2

    // Prefer exercises at user's level
    const aDistance = Math.abs(aDiff - userLevel)
    const bDistance = Math.abs(bDiff - userLevel)

    return aDistance - bDistance
  })

  return filtered
}

// Calculate sets and reps based on goal
function getSetsReps(goal, experience) {
  const configs = {
    'lose-weight': { sets: 3, reps: '12-15', rest: '45-60s' },
    'build-muscle': { sets: 4, reps: '8-12', rest: '60-90s' },
    'get-fit': { sets: 3, reps: '10-15', rest: '45-60s' },
    'stay-healthy': { sets: 3, reps: '10-12', rest: '60s' },
    'strength': { sets: 5, reps: '3-6', rest: '2-3min' }
  }

  const config = configs[goal] || configs['build-muscle']

  // Adjust for beginners
  if (experience === 'beginner') {
    config.sets = Math.max(2, config.sets - 1)
  }

  return config
}

// Generate workout for a single day
function generateDayWorkout(dayConfig, mode, difficulty, goal) {
  const { sets, reps, rest } = getSetsReps(goal, difficulty)
  const dayExercises = []

  // Get exercises per muscle (limit to keep workouts reasonable)
  const exercisesPerMuscle = mode === 'pilates' ? 2 : 2

  for (const muscle of dayConfig.muscles) {
    const muscleExercises = getExercisesForMuscle(muscle, mode, difficulty)

    // Take top exercises for this muscle
    const selected = muscleExercises.slice(0, exercisesPerMuscle)

    for (const ex of selected) {
      dayExercises.push({
        name: ex.name,
        muscle: muscle,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        sets,
        reps,
        rest,
        tips: ex.tips || []
      })
    }
  }

  return {
    name: dayConfig.name,
    exercises: dayExercises
  }
}

// Main function to generate a training plan
export function generatePlan(profile, goals) {
  const { trainingStyle, workoutFrequency, experienceLevel, primaryGoal } = goals

  // Get split configuration
  const splitConfig = SPLIT_CONFIGS[workoutFrequency] || SPLIT_CONFIGS['4-5']

  // Generate schedule
  const schedule = splitConfig.days.map(dayConfig =>
    generateDayWorkout(dayConfig, trainingStyle, experienceLevel, primaryGoal)
  )

  // Calculate stats
  const totalExercises = schedule.reduce((sum, day) => sum + day.exercises.length, 0)
  const totalSets = schedule.reduce((sum, day) =>
    sum + day.exercises.reduce((s, ex) => s + ex.sets, 0), 0
  )
  const estimatedDuration = Math.round(totalSets * 2.5) // ~2.5 min per set

  // Get unique muscles
  const muscles = [...new Set(schedule.flatMap(day =>
    day.exercises.map(ex => ex.muscle)
  ))]

  return {
    name: `${splitConfig.name} - ${getStyleName(trainingStyle)}`,
    style: trainingStyle,
    styleName: getStyleName(trainingStyle),
    frequency: workoutFrequency,
    frequencyName: getFrequencyName(workoutFrequency),
    splitType: splitConfig.name,
    schedule,
    weeklyRotation: splitConfig.rotation,
    stats: {
      totalExercises,
      totalSets,
      estimatedDuration,
      muscles,
      daysPerWeek: splitConfig.days.length
    },
    createdAt: new Date().toISOString()
  }
}

// Helper functions for display names
function getStyleName(style) {
  const names = {
    bodybuilding: 'Bodybuilding',
    calisthenics: 'Calisthenics',
    pilates: 'Pilates'
  }
  return names[style] || style
}

function getFrequencyName(freq) {
  const names = {
    '2-3': '2-3x týždenne',
    '4-5': '4-5x týždenne',
    '6-7': '6-7x týždenne'
  }
  return names[freq] || freq
}

// Export functions for plan management
export function savePlan(plan) {
  localStorage.setItem('generatedPlan', JSON.stringify(plan))
}

export function loadPlan() {
  const saved = localStorage.getItem('generatedPlan')
  return saved ? JSON.parse(saved) : null
}

export function exportPlanToJSON(plan) {
  const dataStr = JSON.stringify(plan, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportPlanToCSV(plan) {
  const headers = ['Deň', 'Cvik', 'Sval', 'Série', 'Opakovania', 'Vybavenie']
  const rows = [headers.join(',')]

  plan.schedule.forEach(day => {
    day.exercises.forEach(ex => {
      rows.push([
        day.name,
        ex.name,
        ex.muscle,
        ex.sets,
        ex.reps,
        ex.equipment
      ].join(','))
    })
  })

  const csvContent = rows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportPlanToText(plan) {
  let text = `${plan.name}\n`
  text += `${'='.repeat(plan.name.length)}\n\n`
  text += `Štýl: ${plan.styleName}\n`
  text += `Frekvencia: ${plan.frequencyName}\n`
  text += `Split: ${plan.splitType}\n\n`

  plan.schedule.forEach(day => {
    text += `--- ${day.name} ---\n`
    day.exercises.forEach((ex, i) => {
      text += `${i + 1}. ${ex.name} - ${ex.sets}x${ex.reps}\n`
      text += `   Sval: ${ex.muscle}\n`
      text += `   Vybavenie: ${ex.equipment}\n`
    })
    text += '\n'
  })

  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
