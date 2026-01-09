import { createContext, useContext, useState, useEffect } from 'react'

const WorkoutContext = createContext()


export const WorkoutProvider = ({ children }) => {
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [workoutName, setWorkoutName] = useState('Môj Tréning')
  const [streak, setStreak] = useState(1)
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null)
  const [savedWorkouts, setSavedWorkouts] = useState([])
  const [trainingPlan, setTrainingPlan] = useState(null)

  // Načítaj z localStorage pri inicializácii
  useEffect(() => {
    const saved = localStorage.getItem('fitflow_workout')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setWorkoutExercises(parsed.exercises || [])
        setWorkoutName(parsed.name || 'Môj Tréning')
      } catch (e) {
        console.error('Chyba pri načítaní tréningu:', e)
      }
    }
    const streakData = localStorage.getItem('fitflow_streak')
    if (streakData) {
      try {
        const parsed = JSON.parse(streakData)
        setStreak(parsed.streak || 1)
        setLastWorkoutDate(parsed.lastWorkoutDate || null)
      } catch (e) {
        console.error('Chyba pri načítaní streaku:', e)
      }
    }
    const savedWorkoutsData = localStorage.getItem('fitflow_saved_workouts')
    if (savedWorkoutsData) {
      try {
        const parsed = JSON.parse(savedWorkoutsData)
        setSavedWorkouts(parsed || [])
      } catch (e) {
        console.error('Chyba pri načítaní uložených tréningov:', e)
      }
    }
    const planData = localStorage.getItem('fitflow_plan')
    if (planData) {
      try {
        const parsed = JSON.parse(planData)
        setTrainingPlan(parsed)
      } catch (e) {
        console.error('Chyba pri načítaní tréningového plánu:', e)
      }
    }
  }, [])

  // Ulož do localStorage vždy keď sa zmenia cviky
  useEffect(() => {
    const trimmedName = (workoutName || '').trim()
    const isEmptyWorkout = workoutExercises.length === 0 && (trimmedName === '' || trimmedName === 'Môj Tréning')
    if (isEmptyWorkout) {
      localStorage.removeItem('fitflow_workout')
      return
    }
    localStorage.setItem('fitflow_workout', JSON.stringify({
      exercises: workoutExercises,
      name: workoutName,
      createdAt: new Date().toISOString()
    }))
  }, [workoutExercises, workoutName])

  // Ulož streak do localStorage
  useEffect(() => {
    localStorage.setItem('fitflow_streak', JSON.stringify({
      streak,
      lastWorkoutDate
    }))
  }, [streak, lastWorkoutDate])

  const addExercise = (exercise, mode) => {
    const id = Date.now() + Math.random()
    const newExercise = {
      id,
      ...exercise,
      mode,
      sets: 3,
      reps: 10,
      weight: 0,
      unit: 'kg'
    }
    setWorkoutExercises([...workoutExercises, newExercise])
    return id
  }

  const removeExercise = (id) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== id))
  }

  const updateExercise = (id, updates) => {
    setWorkoutExercises(workoutExercises.map(ex => 
      ex.id === id ? { ...ex, ...updates } : ex
    ))
  }

  const clearWorkout = () => {
    setWorkoutExercises([])
    setWorkoutName('Môj Tréning')
    localStorage.removeItem('fitflow_workout')
  }


  // Helper: update streak on workout completion
  // Accepts optional date string (YYYY-MM-DD) for testing
  const updateStreak = (customDate) => {
    const today = customDate || new Date().toISOString().slice(0, 10)
    let newStreak = streak;
    let newLastWorkoutDate = lastWorkoutDate;
    if (!lastWorkoutDate) {
      newStreak = 1;
      newLastWorkoutDate = today;
      setStreak(newStreak);
      setLastWorkoutDate(newLastWorkoutDate);
    } else if (lastWorkoutDate === today) {
      newStreak = streak;
      newLastWorkoutDate = today;
      setStreak(newStreak);
      setLastWorkoutDate(newLastWorkoutDate);
    } else {
      // Calculate yesterday based on customDate if provided
      let baseDate = customDate ? new Date(customDate) : new Date();
      const yesterday = new Date(baseDate.getTime() - 86400000).toISOString().slice(0, 10)
      if (lastWorkoutDate === yesterday) {
        newStreak = streak + 1;
        newLastWorkoutDate = today;
        setStreak(newStreak);
        setLastWorkoutDate(newLastWorkoutDate);
      } else {
        newStreak = 1;
        newLastWorkoutDate = today;
        setStreak(newStreak);
        setLastWorkoutDate(newLastWorkoutDate);
      }
    }
    localStorage.setItem('fitflow_streak', JSON.stringify({
      streak: newStreak,
      lastWorkoutDate: newLastWorkoutDate
    }));
  }



  const saveWorkout = () => {
    if (workoutExercises.length === 0) return

    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      exercises: workoutExercises,
      savedAt: new Date().toISOString()
    }

    const updatedSaved = [...savedWorkouts, newWorkout]
    setSavedWorkouts(updatedSaved)
    localStorage.setItem('fitflow_saved_workouts', JSON.stringify(updatedSaved))
    updateStreak()

    // Vyčisti aktuálny tréning pre nový
    setWorkoutExercises([])
    setWorkoutName('Môj Tréning')
    localStorage.removeItem('fitflow_workout')

    return newWorkout.id
  }

  const loadWorkout = (workout) => {
    setWorkoutExercises(workout.exercises || [])
    setWorkoutName(workout.name || 'Môj Tréning')
  }

  const deleteWorkout = (id) => {
    const updatedSaved = savedWorkouts.filter(w => w.id !== id)
    setSavedWorkouts(updatedSaved)
    localStorage.setItem('fitflow_saved_workouts', JSON.stringify(updatedSaved))
  }

  const updateSavedWorkout = (id) => {
    const updatedSaved = savedWorkouts.map(w =>
      w.id === id
        ? { ...w, name: workoutName, exercises: workoutExercises, savedAt: new Date().toISOString() }
        : w
    )
    setSavedWorkouts(updatedSaved)
    localStorage.setItem('fitflow_saved_workouts', JSON.stringify(updatedSaved))
  }

  const exportToJSON = () => {
    const data = {
      name: workoutName,
      exercises: workoutExercises,
      exportedAt: new Date().toISOString()
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workoutName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    updateStreak()
  }

  const exportToCSV = () => {
    let csv = 'Cvičenie,Sval,Mód,Úroveň,Sady,Opakovania,Váha,Jednotka,Vybavenie\n'

    workoutExercises.forEach(ex => {
      csv += `"${ex.name}","${ex.muscleName}","${ex.mode}","${ex.difficulty}",${ex.sets},${ex.reps},"${ex.weight} ${ex.unit}","${ex.equipment}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workoutName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    updateStreak()
  }

  // Export to ICS calendar format
  const exportToICS = (scheduledDate = new Date(), duration = 60) => {
    if (workoutExercises.length === 0) return

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const startDate = new Date(scheduledDate)
    const endDate = new Date(startDate.getTime() + duration * 60000)

    const exerciseList = workoutExercises
      .map((ex, i) => `${i + 1}. ${ex.name} - ${ex.sets}x${ex.reps}${ex.weight > 0 ? ` (${ex.weight}${ex.unit})` : ''}`)
      .join('\\n')

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FitFlow//Workout//SK
BEGIN:VEVENT
UID:${Date.now()}@fitflow
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${workoutName}
DESCRIPTION:${exerciseList}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workoutName.replace(/\s+/g, '_')}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export to plain text for sharing
  const exportToText = () => {
    if (workoutExercises.length === 0) return ''

    let text = `🏋️ ${workoutName}\n`
    text += `📅 ${new Date().toLocaleDateString('sk')}\n\n`

    workoutExercises.forEach((ex, i) => {
      text += `${i + 1}. ${ex.name}\n`
      text += `   ${ex.sets} sérií × ${ex.reps} opakovaní`
      if (ex.weight > 0) text += ` @ ${ex.weight}${ex.unit}`
      text += '\n'
    })

    text += `\n📊 Celkom ${workoutExercises.length} cvikov`
    text += `\n\nVytvorené v FitFlow 💪`

    return text
  }

  // Export formatted for Notion (markdown that pastes beautifully)
  const exportForNotion = async () => {
    if (workoutExercises.length === 0) return false

    const stats = getWorkoutStats()
    const date = new Date().toLocaleDateString('sk', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    let md = `# ${workoutName}\n\n`
    md += `> 📅 ${date}\n\n`
    md += `---\n\n`
    md += `## Cviky\n\n`

    workoutExercises.forEach((ex, i) => {
      md += `- [ ] **${ex.name}**\n`
      md += `    - ${ex.sets} sérií × ${ex.reps} opakovaní`
      if (ex.weight > 0) md += ` @ ${ex.weight}${ex.unit}`
      md += `\n`
      if (ex.muscleName) md += `    - Sval: ${ex.muscleName}\n`
      if (ex.equipment && ex.equipment !== 'none') md += `    - Vybavenie: ${ex.equipment}\n`
      md += `\n`
    })

    md += `---\n\n`
    md += `## Štatistiky\n\n`
    md += `| Metrika | Hodnota |\n`
    md += `|---------|--------|\n`
    md += `| Cvikov | ${stats.totalExercises} |\n`
    md += `| Sérií | ${stats.totalSets} |\n`
    md += `| Opakovaní | ${stats.totalReps} |\n`
    if (stats.totalVolume > 0) {
      md += `| Celkový objem | ${stats.totalVolume.toLocaleString('sk')} kg |\n`
    }
    md += `| Odh. trvanie | ~${stats.estimatedDuration} min |\n`
    md += `\n`
    md += `---\n\n`
    md += `*Vytvorené v [FitFlow](https://fitflow.app)*\n`

    try {
      await navigator.clipboard.writeText(md)
      return true
    } catch (e) {
      console.error('Chyba pri kopírovaní:', e)
      return false
    }
  }

  // Export to Notion (copies to clipboard for pasting into Notion)
  const exportToNotion = async () => {
    if (workoutExercises.length === 0) {
      return { success: false, error: 'Žiadne cviky na export' }
    }

    const stats = getWorkoutStats()

    // Build markdown for Notion
    let md = `# ${workoutName}\n\n`
    md += `📅 ${new Date().toLocaleDateString('sk', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`
    md += `---\n\n`
    md += `## Cviky\n\n`

    workoutExercises.forEach(ex => {
      md += `- [ ] **${ex.name}** — ${ex.sets}×${ex.reps}${ex.weight > 0 ? ` @ ${ex.weight}${ex.unit}` : ''}\n`
    })

    md += `\n---\n\n`
    md += `## Štatistiky\n\n`
    md += `- Cvikov: ${stats.totalExercises}\n`
    md += `- Sérií: ${stats.totalSets}\n`
    md += `- Odhadované trvanie: ~${stats.estimatedDuration} min\n`

    try {
      await navigator.clipboard.writeText(md)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Share workout (uses Web Share API if available)
  const shareWorkout = async () => {
    const text = exportToText()

    if (navigator.share) {
      try {
        await navigator.share({
          title: workoutName,
          text: text
        })
        return true
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('Chyba pri zdieľaní:', e)
        }
        return false
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (e) {
        console.error('Chyba pri kopírovaní:', e)
        return false
      }
    }
  }

  // Get workout statistics
  const getWorkoutStats = () => {
    const totalExercises = workoutExercises.length
    const totalSets = workoutExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
    const totalReps = workoutExercises.reduce((sum, ex) => sum + ((ex.sets || 0) * (ex.reps || 0)), 0)
    const totalVolume = workoutExercises.reduce((sum, ex) => {
      const volume = (ex.sets || 0) * (ex.reps || 0) * (ex.weight || 0)
      return sum + volume
    }, 0)

    const muscleGroups = [...new Set(workoutExercises.map(ex => ex.muscleName).filter(Boolean))]
    const modes = [...new Set(workoutExercises.map(ex => ex.mode).filter(Boolean))]

    const estimatedDuration = totalSets * 2.5 // ~2.5 min per set including rest

    return {
      totalExercises,
      totalSets,
      totalReps,
      totalVolume,
      muscleGroups,
      modes,
      estimatedDuration: Math.round(estimatedDuration)
    }
  }

  // Generate calendar data from saved workouts
  // Returns object with dates as keys and workout counts as values
  const getWorkoutCalendarData = () => {
    const calendarData = {}

    savedWorkouts.forEach(workout => {
      const dateString = new Date(workout.savedAt).toISOString().split('T')[0]
      calendarData[dateString] = (calendarData[dateString] || 0) + 1
    })

    return calendarData
  }

  // Training Plan Management
  const createPlan = (config) => {
    const plan = {
      ...config,
      createdAt: new Date().toISOString(),
      startDate: new Date().toISOString().split('T')[0]
    }
    setTrainingPlan(plan)
    localStorage.setItem('fitflow_plan', JSON.stringify(plan))
    return plan
  }

  const updatePlan = (updates) => {
    const updatedPlan = { ...trainingPlan, ...updates }
    setTrainingPlan(updatedPlan)
    localStorage.setItem('fitflow_plan', JSON.stringify(updatedPlan))
    return updatedPlan
  }

  const deletePlan = () => {
    setTrainingPlan(null)
    localStorage.removeItem('fitflow_plan')
  }

  // Get today's scheduled workout from the plan
  const getTodayWorkout = () => {
    if (!trainingPlan || !trainingPlan.schedule) return null
    const dayOfWeek = new Date().getDay() // 0=Ne, 1=Po, 2=Ut...
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Konvertuj na 0=Po, 6=Ne
    return trainingPlan.schedule[dayIndex] || null
  }

  // Get workout details by ID from savedWorkouts
  const getWorkoutById = (workoutId) => {
    if (!workoutId) return null
    return savedWorkouts.find(w => w.id === workoutId) || null
  }

  return (
    <WorkoutContext.Provider value={{
      workoutExercises,
      workoutName,
      setWorkoutName,
      addExercise,
      removeExercise,
      updateExercise,
      clearWorkout,
      saveWorkout,
      loadWorkout,
      deleteWorkout,
      updateSavedWorkout,
      savedWorkouts,
      exportToJSON,
      exportToCSV,
      exportToICS,
      exportToText,
      exportForNotion,
      exportToNotion,
      shareWorkout,
      getWorkoutStats,
      getWorkoutCalendarData,
      streak,
      setStreak,
      lastWorkoutDate,
      setLastWorkoutDate,
      updateStreak,
      trainingPlan,
      createPlan,
      updatePlan,
      deletePlan,
      getTodayWorkout,
      getWorkoutById
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export const useWorkout = () => {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkout must be used within WorkoutProvider')
  }
  return context
}
