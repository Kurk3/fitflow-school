import { useState } from 'react'
import { useWorkout } from '../../context/WorkoutContext'

const DAY_NAMES = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa']
const DAY_NAMES_SHORT = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne']

function WorkoutPanel({ onClose }) {
  const {
    savedWorkouts,
    loadWorkout,
    deleteWorkout,
    trainingPlan,
    createPlan,
    deletePlan,
    getTodayWorkout,
    getWorkoutById,
  } = useWorkout()

  const [tab, setTab] = useState('saved')
  const [planSchedule, setPlanSchedule] = useState([
    { dayIndex: 0, workoutId: null },
    { dayIndex: 1, workoutId: null },
    { dayIndex: 2, workoutId: null },
    { dayIndex: 3, workoutId: null },
    { dayIndex: 4, workoutId: null },
    { dayIndex: 5, workoutId: null },
    { dayIndex: 6, workoutId: null },
  ])
  const [isEditingPlan, setIsEditingPlan] = useState(false)
  const [selectedWorkoutForPlan, setSelectedWorkoutForPlan] = useState(null) // null = voľno, workoutId = tréning
  const [activeDayModal, setActiveDayModal] = useState(null) // index dňa pre modal
  const [clipboardModal, setClipboardModal] = useState(false) // clipboard success modal

  // Copy training plan to Notion format with progressive overload tables
  const copyPlanToNotion = async () => {
    if (!trainingPlan) return false

    let md = `# Tréningový plán\n\n`

    // Progressive overload rules - callout format
    md += `> 💡 **Pravidlá Progressive Overload**\n`
    md += `> Splníš reps → +2.5kg | Nesplníš → opakuj | 2x nesplníš → -5kg\n`
    md += `> **Pauzy:** Heavy 3-5min | Sila 2-3min | Hypertrofia 90s | Izolácie 60s\n\n`
    md += `---\n\n`

    // Each training day
    trainingPlan.schedule.forEach((day) => {
      const hasWorkout = day.workoutId !== null
      const workout = hasWorkout ? getWorkoutById(day.workoutId) : null

      if (workout) {
        md += `## ${DAY_NAMES[day.dayIndex]} - ${workout.name}\n\n`

        // Progress table for this workout
        md += `| Cvik | Sety×Reps | Pauza | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 |\n`
        md += `|------|-----------|-------|----|----|----|----|----|----|----|----|`

        workout.exercises.forEach((ex) => {
          // Determine rest period based on reps
          const reps = parseInt(ex.reps) || 10
          let pause = '90s'
          if (reps <= 5) pause = '3-4 min'
          else if (reps <= 8) pause = '2-3 min'
          else if (reps <= 12) pause = '90s'
          else pause = '60s'

          // Starting weight or BW
          const startWeight = ex.weight > 0 ? `${ex.weight}${ex.unit}` : 'BW'

          md += `\n| **${ex.name}** | ${ex.sets}×${ex.reps} | ${pause} | ${startWeight} |  |  |  |  |  |  |  |`
        })
        md += `\n\n`
      }
    })

    // Rest days
    const restDays = trainingPlan.schedule.filter(d => d.workoutId === null)
    if (restDays.length > 0) {
      md += `## Regenerácia\n\n`
      md += `**Voľné dni:** ${restDays.map(d => DAY_NAMES[d.dayIndex]).join(', ')}\n\n`
    }

    md += `---\n\n`

    // Weekly tracking
    md += `## Týždenný Tracking\n\n`
    md += `| Týždeň | Váha (kg) | Pocit (1-10) | Spánok | Poznámky |\n`
    md += `|--------|-----------|--------------|--------|----------|\n`
    for (let i = 1; i <= 8; i++) {
      md += `| ${i} |  |  |  |  |\n`
    }
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

  const tabs = [
    { id: 'saved', label: 'Uložené' },
    { id: 'plan', label: 'Plán' },
    { id: 'export', label: 'Export' },
  ]

  // Plan management functions
  const handleDayClick = (dayIndex) => {
    setPlanSchedule(prev => prev.map(day =>
      day.dayIndex === dayIndex
        ? { ...day, workoutId: selectedWorkoutForPlan }
        : day
    ))
  }

  const handleCreatePlan = () => {
    const schedule = planSchedule.map(day => {
      const workout = day.workoutId ? getWorkoutById(day.workoutId) : null
      return {
        dayIndex: day.dayIndex,
        workoutId: day.workoutId,
        workoutName: workout ? workout.name : 'Voľno'
      }
    })

    createPlan({
      name: 'Môj tréningový plán',
      schedule
    })
  }

  const handleDeletePlan = () => {
    deletePlan()
    setIsEditingPlan(false)
  }

  const handleEditPlan = () => {
    if (trainingPlan) {
      setPlanSchedule(trainingPlan.schedule.map(day => ({
        dayIndex: day.dayIndex,
        workoutId: day.workoutId
      })))
    }
    setIsEditingPlan(true)
  }

  const todayWorkout = getTodayWorkout()
  const todayDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Tréning</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-5 border-b border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* SAVED TAB */}
        {tab === 'saved' && (
          <div className="p-5">
            {(!savedWorkouts || savedWorkouts.length === 0) ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Žiadne uložené</p>
                <p className="text-gray-400 text-sm">Ulož svoj prvý tréning</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {workout.name || 'Bez názvu'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {workout.exercises.length} cvikov · {new Date(workout.savedAt).toLocaleDateString('sk')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          loadWorkout(workout)
                          setTab('build')
                        }}
                        className="flex-1 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        Načítať
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="px-3 py-2 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PLAN TAB */}
        {tab === 'plan' && (
          <div className="relative">
            {/* Keď NIE JE plán alebo editujeme */}
            {(!trainingPlan || isEditingPlan) ? (
              <div className="flex flex-col h-full">
                {/* No saved workouts warning */}
                {(!savedWorkouts || savedWorkouts.length === 0) ? (
                  <div className="text-center py-12 px-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-5 mx-auto">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Vytvor si týždenný plán</h3>
                    <p className="text-gray-500 text-sm mb-6">Najprv ulož niekoľko tréningov,<br/>potom ich rozplánuj na týždeň</p>
                    <button
                      onClick={() => setTab('build')}
                      className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Vytvoriť tréning
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Workout Selector - Pick a workout */}
                    <div className="px-4 pt-4 pb-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {selectedWorkoutForPlan === null ? '1. Vyber tréning' : '2. Klikni na deň'}
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        {/* Rest day chip */}
                        <button
                          onClick={() => setSelectedWorkoutForPlan(null)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            selectedWorkoutForPlan === null
                              ? 'bg-gray-900 text-white shadow-lg ring-2 ring-gray-900 ring-offset-2'
                              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Voľno
                        </button>

                        {/* Workout chips */}
                        {savedWorkouts.map((workout) => (
                          <button
                            key={workout.id}
                            onClick={() => setSelectedWorkoutForPlan(workout.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                              selectedWorkoutForPlan === workout.id
                                ? 'bg-gray-900 text-white shadow-lg ring-2 ring-gray-900 ring-offset-2'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {workout.name || 'Tréning'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Week Grid - Tap to place */}
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-7 gap-1.5">
                        {DAY_NAMES_SHORT.map((day, index) => {
                          const assignedWorkoutId = planSchedule[index]?.workoutId
                          const assignedWorkout = assignedWorkoutId ? getWorkoutById(assignedWorkoutId) : null

                          return (
                            <button
                              key={index}
                              onClick={() => handleDayClick(index)}
                              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                                assignedWorkout
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                              }`}
                            >
                              {/* Day name */}
                              <span className={`text-[9px] font-bold uppercase ${
                                assignedWorkout ? 'text-gray-400' : 'text-gray-400'
                              }`}>
                                {day}
                              </span>

                              {/* Icon or initial */}
                              <div className="my-1">
                                {assignedWorkout ? (
                                  <span className="text-lg font-bold">
                                    {assignedWorkout.name[0]}
                                  </span>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Schedule Summary */}
                      <div className="mt-4 space-y-1.5">
                        {DAY_NAMES.map((_, index) => {
                          const assignedWorkoutId = planSchedule[index]?.workoutId
                          const assignedWorkout = assignedWorkoutId ? getWorkoutById(assignedWorkoutId) : null

                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-2 rounded-xl transition-all ${
                                assignedWorkout
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <button
                                onClick={() => handleDayClick(index)}
                                className="flex-1 flex items-center gap-3 px-3 py-2 text-left"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  assignedWorkout ? 'bg-white/10' : 'bg-gray-200 text-gray-400'
                                }`}>
                                  {DAY_NAMES_SHORT[index]}
                                </div>
                                <span className={`flex-1 text-sm font-medium truncate ${
                                  assignedWorkout ? '' : 'text-gray-400'
                                }`}>
                                  {assignedWorkout ? assignedWorkout.name : 'Voľno'}
                                </span>
                              </button>
                              {/* Delete button */}
                              {assignedWorkout && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setPlanSchedule(prev => prev.map(day =>
                                      day.dayIndex === index ? { ...day, workoutId: null } : day
                                    ))
                                  }}
                                  className="p-2 mr-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Create/Update Button */}
                    <div className="p-4 border-t border-gray-100 bg-white">
                      <button
                        onClick={() => {
                          handleCreatePlan()
                          setIsEditingPlan(false)
                          setSelectedWorkoutForPlan(null)
                        }}
                        className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        {isEditingPlan ? 'Uložiť zmeny' : 'Vytvoriť plán'}
                      </button>
                      {isEditingPlan && (
                        <button
                          onClick={() => {
                            setIsEditingPlan(false)
                            setSelectedWorkoutForPlan(null)
                            if (trainingPlan) {
                              setPlanSchedule(trainingPlan.schedule.map(day => ({
                                dayIndex: day.dayIndex,
                                workoutId: day.workoutId
                              })))
                            }
                          }}
                          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
                        >
                          Zrušiť
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Keď JE plán vytvorený - Show mode */
              <div>
                {/* Today Hero */}
                <div className="px-5 pt-5 pb-4">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {DAY_NAMES[todayDayIndex]}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          todayWorkout?.workoutId
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          {todayWorkout?.workoutId ? 'Tréningový deň' : 'Deň oddychu'}
                        </span>
                      </div>

                      {todayWorkout?.workoutId ? (
                        <>
                          <h2 className="text-2xl font-bold mb-2">{todayWorkout.workoutName}</h2>
                          {(() => {
                            const workout = getWorkoutById(todayWorkout.workoutId)
                            if (workout) {
                              return (
                                <p className="text-gray-400">
                                  {workout.exercises.length} cvikov · ~{Math.round(workout.exercises.length * 4)} min
                                </p>
                              )
                            }
                            return null
                          })()}
                        </>
                      ) : (
                        <>
                          <h2 className="text-2xl font-bold mb-2">Regenerácia</h2>
                          <p className="text-gray-400">Daj si pauzu, tvoje svaly rastú počas oddychu</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Week Overview */}
                <div className="px-5 pb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tento týždeň</h3>
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <div className="grid grid-cols-7 gap-1">
                      {trainingPlan.schedule.map((day, index) => {
                        const isToday = index === todayDayIndex
                        const hasWorkout = day.workoutId !== null
                        const isPast = index < todayDayIndex

                        return (
                          <div
                            key={index}
                            className={`text-center py-2 rounded-xl transition-all ${
                              isToday
                                ? 'bg-gray-900'
                                : ''
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase block mb-1 ${
                              isToday ? 'text-gray-400' : 'text-gray-400'
                            }`}>
                              {DAY_NAMES_SHORT[index]}
                            </span>
                            <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center ${
                              isToday
                                ? hasWorkout ? 'bg-white' : 'bg-gray-700'
                                : isPast
                                  ? hasWorkout ? 'bg-gray-900/20 text-gray-700' : 'bg-gray-200'
                                  : hasWorkout ? 'bg-gray-900 text-white' : 'bg-gray-200'
                            }`}>
                              {hasWorkout ? (
                                <svg className={`w-3.5 h-3.5 ${isToday ? 'text-gray-900' : isPast ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className={`text-[10px] font-medium ${isToday ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Full Schedule */}
                <div className="px-5 pb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Rozpis</h3>
                  <div className="space-y-2">
                    {trainingPlan.schedule.map((day, index) => {
                      const isToday = index === todayDayIndex
                      const hasWorkout = day.workoutId !== null

                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            isToday
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isToday
                              ? hasWorkout ? 'bg-white text-gray-900' : 'bg-gray-700'
                              : hasWorkout ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {DAY_NAMES_SHORT[index]}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${isToday ? 'text-white' : hasWorkout ? 'text-gray-900' : 'text-gray-400'}`}>
                              {day.workoutName || 'Voľno'}
                            </p>
                          </div>
                          {isToday && (
                            <span className="text-[10px] px-2 py-1 bg-white/20 rounded-full font-bold">DNES</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5">
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditPlan}
                      className="flex-1 py-3 text-sm font-semibold text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Upraviť plán
                    </button>
                    <button
                      onClick={handleDeletePlan}
                      className="px-5 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      Zmazať
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Day Selection Bottom Sheet */}
            {activeDayModal !== null && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                  onClick={() => setActiveDayModal(null)}
                />
                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up">
                  {/* Handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="px-5 pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">{DAY_NAMES[activeDayModal]}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Vyber tréning pre tento deň</p>
                  </div>

                  {/* Options */}
                  <div className="p-5 space-y-2 max-h-[50vh] overflow-y-auto">
                    {/* Rest option */}
                    <button
                      onClick={() => {
                        setPlanSchedule(prev => prev.map(day =>
                          day.dayIndex === activeDayModal ? { ...day, workoutId: null } : day
                        ))
                        setActiveDayModal(null)
                      }}
                      className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                        planSchedule[activeDayModal]?.workoutId === null
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        planSchedule[activeDayModal]?.workoutId === null ? 'bg-white/10' : 'bg-gray-200'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base">Voľno</p>
                        <p className={`text-sm ${planSchedule[activeDayModal]?.workoutId === null ? 'text-gray-400' : 'text-gray-500'}`}>
                          Deň regenerácie
                        </p>
                      </div>
                      {planSchedule[activeDayModal]?.workoutId === null && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>

                    {/* Workout options */}
                    {savedWorkouts.map((workout) => {
                      const isSelected = planSchedule[activeDayModal]?.workoutId === workout.id
                      return (
                        <button
                          key={workout.id}
                          onClick={() => {
                            setPlanSchedule(prev => prev.map(day =>
                              day.dayIndex === activeDayModal ? { ...day, workoutId: workout.id } : day
                            ))
                            setActiveDayModal(null)
                          }}
                          className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                            isSelected ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                            isSelected ? 'bg-white/10' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {(workout.name || 'T')[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base truncate">{workout.name || 'Bez názvu'}</p>
                            <p className={`text-sm ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                              {workout.exercises.length} cvikov · ~{Math.round(workout.exercises.length * 4)} min
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Safe area padding */}
                  <div className="h-8" />
                </div>
              </>
            )}
          </div>
        )}

        {/* EXPORT TAB */}
        {tab === 'export' && (
          <div className="p-5">
            {trainingPlan ? (
              <div className="space-y-5">
                {/* Export do Notion */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Export do Notion</h3>
                  <button
                    onClick={async () => {
                      const success = await copyPlanToNotion()
                      if (success) setClipboardModal(true)
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933l3.222-.187zM2.83.14L16.042 0c1.634-.047 2.055.046 2.802.605l3.875 2.706c.42.327.56.607.56 1.026v16.304c0 .84-.233 1.354-1.4 1.448L6.326 23.02c-1.121.046-1.775-.14-2.428-.933L1.336 19.1c-.746-.887-.98-1.634-.98-2.428V1.74c0-.793.233-1.4.98-1.6h1.494z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 text-sm">Kopírovať do Notion</p>
                      <p className="text-xs text-gray-400">S tabuľkami pre progressive overload</p>
                    </div>
                  </button>
                </div>

                {/* Zdieľanie */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Zdieľanie</h3>
                  <button
                    onClick={async () => {
                      let text = `${trainingPlan.name}\n\n`
                      trainingPlan.schedule.forEach(day => {
                        text += `${DAY_NAMES[day.dayIndex]}: ${day.workoutName || 'Voľno'}\n`
                      })
                      text += `\nVytvorené v FitFlow`
                      if (navigator.share) {
                        await navigator.share({ title: trainingPlan.name, text })
                      } else {
                        await navigator.clipboard.writeText(text)
                        setClipboardModal(true)
                      }
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 text-sm">Zdieľať plán</p>
                      <p className="text-xs text-gray-400">Pošli kamarátom</p>
                    </div>
                  </button>
                </div>

                {/* Integrácie */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Integrácie</h3>
                  <button
                    onClick={() => {
                      const now = new Date()
                      const dayOfWeek = now.getDay()
                      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
                      let ics = [
                        'BEGIN:VCALENDAR',
                        'VERSION:2.0',
                        'PRODID:-//FitFlow//Training Plan//SK',
                        'CALSCALE:GREGORIAN',
                        'METHOD:PUBLISH',
                        'X-WR-CALNAME:FitFlow',
                      ]
                      trainingPlan.schedule.forEach((day) => {
                        if (day.workoutId) {
                          const eventDate = new Date(now)
                          eventDate.setDate(now.getDate() + mondayOffset + day.dayIndex)
                          const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '')
                          ics.push(
                            'BEGIN:VEVENT',
                            `UID:fitflow-${dateStr}-${day.dayIndex}@fitflow.app`,
                            `DTSTART:${dateStr}T070000`,
                            `DTEND:${dateStr}T080000`,
                            `SUMMARY:${day.workoutName}`,
                            `DESCRIPTION:Trening z FitFlow`,
                            'RRULE:FREQ=WEEKLY',
                            'END:VEVENT'
                          )
                        }
                      })
                      ics.push('END:VCALENDAR')
                      const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'fitflow-plan.ics'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 text-sm">Pridať do kalendára</p>
                      <p className="text-xs text-gray-400">Google, Apple, Outlook</p>
                    </div>
                  </button>
                </div>

                {/* Záloha */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Záloha</h3>
                  <button
                    onClick={() => {
                      const data = { plan: trainingPlan, workouts: savedWorkouts, exportedAt: new Date().toISOString() }
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `fitflow-backup-${new Date().toISOString().split('T')[0]}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 text-sm">Stiahnuť zálohu</p>
                      <p className="text-xs text-gray-400">Celý plán + tréningy</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Žiadny plán</p>
                <p className="text-gray-400 text-sm">Najprv vytvor tréningový plán</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clipboard Modal */}
      {clipboardModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setClipboardModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-sm">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-900">Plán skopírovaný</p>
              </div>

              {/* Steps */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">1</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Otvorte si Notion</p>
                    <p className="text-xs text-gray-400 mt-0.5">Vytvorte novú stránku alebo otvorte existujúcu</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">2</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Vložte obsah</p>
                    <p className="text-xs text-gray-400 mt-0.5">Kliknite na miesto kam chcete vložiť plán</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">3</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Použite klávesovú skratku</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-1">
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded font-mono text-xs text-gray-600">Ctrl</span>
                        <span className="text-gray-300 py-1">+</span>
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded font-mono text-xs text-gray-600">V</span>
                      </div>
                      <span className="text-xs text-gray-300">alebo</span>
                      <div className="flex gap-1">
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded font-mono text-xs text-gray-600">⌘</span>
                        <span className="text-gray-300 py-1">+</span>
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded font-mono text-xs text-gray-600">V</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setClipboardModal(false)}
                className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WorkoutPanel
