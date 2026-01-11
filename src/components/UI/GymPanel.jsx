import { useState, useMemo } from 'react'
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths
} from 'date-fns'
import { sk } from 'date-fns/locale'

// Push/Pull/Legs tréningové plány - používame len neutral/primary farby
const trainingPlans = {
  push: {
    name: 'Push',
    description: 'Hrudník, ramená, triceps',
    color: 'bg-fit-900',
    colorLight: 'bg-fit-900',
    colorText: 'text-white',  
    icon: 'P',
    muscles: ['Hrudník', 'Ramená', 'Triceps'],
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', muscle: 'Hrudník', notes: 'Hlavný cvik na hrudník' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', muscle: 'Hrudník', notes: 'Horná časť hrudníka' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', muscle: 'Hrudník', notes: 'Izolačný cvik' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', muscle: 'Ramená', notes: 'Hlavný cvik na ramená' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', muscle: 'Ramená', notes: 'Bočné delty' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '10-12', muscle: 'Triceps', notes: 'Káblový cvik' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', muscle: 'Triceps', notes: 'Dlhá hlava tricepsu' },
    ]
  },
  pull: {
    name: 'Pull',
    description: 'Chrbát, biceps, zadné delty',
    color: 'bg-fit-500',
    colorLight: 'bg-fit-500',
    colorText: 'text-white',
    icon: 'P',
    muscles: ['Chrbát', 'Biceps', 'Ramená'],
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '6-8', muscle: 'Chrbát', notes: 'Hlavný ťahový cvik' },
      { name: 'Pull-ups', sets: 4, reps: '8-12', muscle: 'Chrbát', notes: 'Širší chrbát' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', muscle: 'Chrbát', notes: 'Hustota chrbta' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', muscle: 'Ramená', notes: 'Zadné delty a rotátory' },
      { name: 'Lat Pulldown', sets: 3, reps: '10-12', muscle: 'Chrbát', notes: 'Latissimusy' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', muscle: 'Biceps', notes: 'Hlavný cvik na biceps' },
      { name: 'Hammer Curls', sets: 3, reps: '10-12', muscle: 'Biceps', notes: 'Brachialis' },
    ]
  },
  legs: {
    name: 'Legs',
    description: 'Stehná, hamstringy, lýtka, zadok',
    color: 'bg-fit-300',
    colorLight: 'bg-fit-300',
    colorText: 'text-neutral-900',
    icon: 'L',
    muscles: ['Stehná', 'Zadné stehenné svaly', 'Lýtka', 'Zadok'],
    exercises: [
      { name: 'Squats', sets: 4, reps: '8-10', muscle: 'Stehná', notes: 'Hlavný cvik na nohy' },
      { name: 'Romanian Deadlift', sets: 4, reps: '10-12', muscle: 'Zadné stehenné svaly', notes: 'Hamstringy a zadok' },
      { name: 'Leg Press', sets: 3, reps: '10-12', muscle: 'Stehná', notes: 'Bezpečná alternatíva' },
      { name: 'Walking Lunges', sets: 3, reps: '12 každá', muscle: 'Stehná', notes: 'Unilaterálny cvik' },
      { name: 'Leg Curls', sets: 3, reps: '12-15', muscle: 'Zadné stehenné svaly', notes: 'Izolačný cvik' },
      { name: 'Hip Thrusts', sets: 3, reps: '10-12', muscle: 'Zadok', notes: 'Aktivácia gluteov' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', muscle: 'Lýtka', notes: 'Stojace alebo sediace' },
    ]
  }
}

// Ikony ako komponenty
const Icons = {
  clipboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  dumbbell: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  fire: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
  ),
  lightning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  refresh: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  trendingUp: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

// Získanie typu tréningu pre daný deň
const getWorkoutForDay = (dayIndex) => {
  const rotation = ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest']
  return rotation[dayIndex % 7]
}

function GymPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('plan')
  const [expandedPlan, setExpandedPlan] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generovanie kalendárnych dní pre aktuálny mesiac
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = addDays(startDate, 41) // 6 riadkov * 7 dní
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentMonth])

  // Počítanie dní od začiatku programu
  const programStartDate = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), [])

  const getWorkoutForDate = (date) => {
    const daysDiff = Math.floor((date - programStartDate) / (1000 * 60 * 60 * 24))
    return getWorkoutForDay(daysDiff >= 0 ? daysDiff : 7 + (daysDiff % 7))
  }

  const tabs = [
    { id: 'plan', label: 'Tréningový plán', icon: Icons.clipboard },
    { id: 'calendar', label: 'Kalendár', icon: Icons.calendar },
    { id: 'stats', label: 'Štatistiky', icon: Icons.chart }
  ]

  const getWorkoutStyle = (workout) => {
    switch(workout) {
      case 'push': return { bg: 'bg-fit-900', text: 'text-white' }
      case 'pull': return { bg: 'bg-fit-500', text: 'text-white' }
      case 'legs': return { bg: 'bg-fit-300', text: 'text-neutral-900' }
      case 'rest': return { bg: 'bg-green-700', text: 'text-white' }
      default: return { bg: 'bg-fit-300', text: 'text-neutral-600' }
    }
  }

  const getWorkoutLabel = (workout) => {
    switch(workout) {
      case 'push': return 'Push'
      case 'pull': return 'Pull'
      case 'legs': return 'Legs'
      case 'rest': return 'Rest'
      default: return ''
    }
  }

  const todayWorkout = getWorkoutForDate(new Date())

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 rounded-xl">
              <span className="text-white">{Icons.dumbbell}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Môj Gym</h2>
              <p className="text-sm text-neutral-500">Push / Pull / Legs program</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500"
          >
            {Icons.close}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-neutral-900' : 'text-neutral-500'}>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Tréningový plán Tab */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            {/* Today's Workout Banner */}
            <div className={`${getWorkoutStyle(todayWorkout).bg} rounded-2xl p-5 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    {format(new Date(), 'EEEE, d. MMMM yyyy', { locale: sk })}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {todayWorkout === 'rest' ? 'Deň odpočinku' : `${getWorkoutLabel(todayWorkout)} Day`}
                  </h3>
                  {todayWorkout !== 'rest' && (
                    <p className="text-white/80 text-sm mt-1">
                      {trainingPlans[todayWorkout]?.description}
                    </p>
                  )}
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white">{Icons.dumbbell}</span>
                </div>
              </div>
            </div>

            {/* PPL Cards */}
            {Object.entries(trainingPlans).map(([key, plan]) => (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                {/* Plan Header */}
                <button
                  onClick={() => setExpandedPlan(expandedPlan === key ? null : key)}
                  className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{plan.name[0]}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-neutral-900">{plan.name} Day</h3>
                      <p className="text-sm text-neutral-500">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 hidden sm:inline">{plan.exercises.length} cvikov</span>
                    <span className={`text-neutral-400 transition-transform duration-200 ${expandedPlan === key ? 'rotate-180' : ''}`}>
                      {Icons.chevronDown}
                    </span>
                  </div>
                </button>

                {/* Expanded Exercises */}
                {expandedPlan === key && (
                  <div className="border-t border-neutral-100">
                    {/* Muscle Tags */}
                    <div className="p-4 bg-neutral-50 flex flex-wrap gap-2">
                      {plan.muscles.map((muscle) => (
                        <span key={muscle} className={`px-3 py-1.5 ${plan.colorLight} rounded-lg text-xs font-semibold ${plan.colorText} border border-neutral-200`}>
                          {muscle}
                        </span>
                      ))}
                    </div>

                    {/* Exercise List */}
                    <div className="divide-y divide-neutral-100">
                      {plan.exercises.map((exercise, index) => (
                        <div key={index} className="p-4 hover:bg-neutral-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 ${plan.colorLight} rounded-lg flex items-center justify-center text-sm font-bold ${plan.colorText}`}>
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-neutral-900">{exercise.name}</h4>
                                <p className="text-sm text-neutral-500">{exercise.notes}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-neutral-900">{exercise.sets} × {exercise.reps}</div>
                              <div className="text-xs text-neutral-500">{exercise.muscle}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className={`p-4 ${plan.colorLight} border-t border-neutral-200`}>
                      <div className="flex justify-between text-sm">
                        <span className={plan.colorText}>Celkovo sety:</span>
                        <span className={`font-bold ${plan.colorText}`}>
                          {plan.exercises.reduce((acc, ex) => acc + ex.sets, 0)} setov
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Legend */}
            <div className="bg-white rounded-xl p-4 border border-neutral-200">
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Legenda</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-8 h-8 bg-fit-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-sm text-neutral-700 font-medium">Push - Tlakové</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-8 h-8 bg-fit-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-sm text-neutral-700 font-medium">Pull - Ťahové</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-8 h-8 bg-fit-300 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <span className="text-sm text-neutral-700 font-medium">Legs - Nohy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kalendár Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* PPL Rotácia */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-neutral-900 rounded-lg text-white">
                  {Icons.refresh}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">PPL Rotácia</h3>
                  <p className="text-sm text-neutral-500">6 dní tréning + 1 deň odpočinok</p>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[
                  { day: 'Push', type: 'push' },
                  { day: 'Pull', type: 'pull' },
                  { day: 'Legs', type: 'legs' },
                  { day: 'Push', type: 'push' },
                  { day: 'Pull', type: 'pull' },
                  { day: 'Legs', type: 'legs' },
                  { day: 'Rest', type: 'rest' }
                ].map((item, i) => {
                  const style = getWorkoutStyle(item.type)
                  return (
                    <div key={i} className={`py-2.5 px-1 rounded-lg text-center ${style.bg}`}>
                      <span className={`text-xs sm:text-sm font-bold ${style.text}`}>{item.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              {/* Month Navigation */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600"
                >
                  {Icons.chevronLeft}
                </button>
                <h3 className="font-bold text-neutral-900 text-lg capitalize">
                  {format(currentMonth, 'LLLL yyyy', { locale: sk })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600"
                >
                  {Icons.chevronRight}
                </button>
              </div>

              {/* Week Headers */}
              <div className="grid grid-cols-7 bg-neutral-50 border-b border-neutral-100">
                {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day) => (
                  <div key={day} className="p-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  const workout = getWorkoutForDate(date)
                  const style = getWorkoutStyle(workout)
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                  const isTodayDate = isToday(date)

                  return (
                    <div
                      key={index}
                      className={`p-2 border-b border-r border-neutral-100 min-h-[70px] md:min-h-[80px] transition-colors ${
                        isTodayDate ? 'bg-neutral-900' : isCurrentMonth ? 'bg-white hover:bg-neutral-50' : 'bg-neutral-50/50'
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-1.5 ${
                        isTodayDate ? 'text-white' : isCurrentMonth ? 'text-neutral-900' : 'text-neutral-300'
                      }`}>
                        {format(date, 'd')}
                      </div>
                      <div className={`text-xs font-bold px-1.5 py-1 rounded text-center ${
                        isTodayDate ? 'bg-white text-neutral-900' : isCurrentMonth ? `${style.bg} ${style.text}` : 'bg-neutral-200 text-neutral-400'
                      }`}>
                        <span className="hidden sm:inline">{getWorkoutLabel(workout)}</span>
                        <span className="sm:hidden">{getWorkoutLabel(workout)[0]}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Today's Workout Card */}
            <div className="bg-neutral-900 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                    <span>{Icons.calendar}</span>
                    <span className="capitalize">{format(new Date(), 'EEEE, d. MMMM', { locale: sk })}</span>
                  </div>
                  <h3 className="text-2xl font-bold mt-2">
                    {todayWorkout === 'rest' ? 'Deň odpočinku' : `${getWorkoutLabel(todayWorkout)} Day`}
                  </h3>
                  {todayWorkout !== 'rest' && trainingPlans[todayWorkout] && (
                    <p className="text-neutral-400 text-sm mt-1">{trainingPlans[todayWorkout].description}</p>
                  )}
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getWorkoutStyle(todayWorkout).bg} border-2 border-white/20`}>
                  <span className="text-white">{Icons.dumbbell}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Štatistiky Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Weekly Overview */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-neutral-900 rounded-lg text-white">
                  {Icons.chart}
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Týždenný prehľad</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <div className="p-2 bg-neutral-200 rounded-lg w-fit mb-3 text-neutral-600">
                    {Icons.calendar}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">6</div>
                  <div className="text-sm text-neutral-500">Tréningov/týždeň</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <div className="p-2 bg-neutral-200 rounded-lg w-fit mb-3 text-neutral-600">
                    {Icons.clipboard}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">21</div>
                  <div className="text-sm text-neutral-500">Cvikov celkovo</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <div className="p-2 bg-neutral-200 rounded-lg w-fit mb-3 text-neutral-600">
                    {Icons.fire}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">~70</div>
                  <div className="text-sm text-neutral-500">Setov/týždeň</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <div className="p-2 bg-neutral-200 rounded-lg w-fit mb-3 text-neutral-600">
                    {Icons.clock}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">~6h</div>
                  <div className="text-sm text-neutral-500">Čas v gym</div>
                </div>
              </div>
            </div>

            {/* Muscle Coverage */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-neutral-900 rounded-lg text-white">
                  {Icons.target}
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Pokrytie svalov</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Hrudník', sets: 10 },
                  { name: 'Chrbát', sets: 14 },
                  { name: 'Ramená', sets: 9 },
                  { name: 'Biceps', sets: 6 },
                  { name: 'Triceps', sets: 6 },
                  { name: 'Stehná', sets: 10 },
                  { name: 'Hamstringy', sets: 7 },
                  { name: 'Lýtka', sets: 4 },
                ].map((muscle) => (
                  <div key={muscle.name} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium text-neutral-700">{muscle.name}</div>
                    <div className="flex-1 bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                        style={{ width: `${(muscle.sets / 14) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm text-neutral-500 text-right font-medium">{muscle.sets} setov</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PPL Benefits */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-neutral-900 rounded-lg text-white">
                  {Icons.trendingUp}
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Výhody PPL programu</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Icons.target, title: 'Optimálna frekvencia', desc: 'Každý sval 2× týždenne' },
                  { icon: Icons.lightning, title: 'Efektívny split', desc: 'Synergické svaly spolu' },
                  { icon: Icons.refresh, title: 'Flexibilita', desc: 'Ľahko prispôsobiteľný' },
                  { icon: Icons.trendingUp, title: 'Progres', desc: 'Ideálne pre rast svalov' },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="p-2 bg-neutral-900 rounded-lg text-white">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{benefit.title}</h4>
                      <p className="text-sm text-neutral-500">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GymPanel
