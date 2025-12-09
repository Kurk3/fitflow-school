import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Download, Share2, ChevronDown, ChevronUp, Clock, Dumbbell, Target, Zap } from 'lucide-react'
import { generatePlan, savePlan, exportPlanToJSON, exportPlanToCSV, exportPlanToText } from '../utils/planGenerator'

function MyPlan() {
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [expandedDay, setExpandedDay] = useState(0)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [userGoals, setUserGoals] = useState(null)

  useEffect(() => {
    // Load user data
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
    const goals = JSON.parse(localStorage.getItem('userGoals') || '{}')

    setUserProfile(profile)
    setUserGoals(goals)

    // Generate plan based on user data
    if (goals.trainingStyle && goals.workoutFrequency) {
      const generatedPlan = generatePlan(profile, goals)
      setPlan(generatedPlan)
      savePlan(generatedPlan)
    }
  }, [])

  const handleExport = (format) => {
    if (!plan) return

    switch (format) {
      case 'json':
        exportPlanToJSON(plan)
        break
      case 'csv':
        exportPlanToCSV(plan)
        break
      case 'text':
        exportPlanToText(plan)
        break
    }
    setShowExportMenu(false)
  }

  const handleShare = async () => {
    if (!plan) return

    const shareText = `Môj tréningový plán: ${plan.name}\n\nŠtýl: ${plan.styleName}\nFrekvencia: ${plan.frequencyName}\nSplit: ${plan.splitType}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: plan.name,
          text: shareText
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Skopírované do schránky!')
    }
  }

  const handleEnterApp = () => {
    navigate('/dashboard')
  }

  const getDayName = (index) => {
    const days = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa']
    return days[index]
  }

  const getGoalLabel = (goal) => {
    const labels = {
      'lose-weight': 'Schudnúť',
      'build-muscle': 'Nabrať svaly',
      'get-fit': 'Zlepšiť kondíciu',
      'stay-healthy': 'Udržať zdravie',
      'strength': 'Zvýšiť silu'
    }
    return labels[goal] || goal
  }

  const getExperienceLabel = (exp) => {
    const labels = {
      'beginner': 'Začiatočník',
      'intermediate': 'Mierne pokročilý',
      'advanced': 'Pokročilý'
    }
    return labels[exp] || exp
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-500">Generujem tvoj plán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Tvoj tréningový plán</h1>
          <p className="text-neutral-500">Pripravili sme pre teba personalizovaný plán</p>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-neutral-200 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Prehľad tvojich volieb</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                <Dumbbell className="w-4 h-4" />
                <span>Štýl</span>
              </div>
              <div className="font-semibold text-neutral-900">{plan.styleName}</div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                <span>Frekvencia</span>
              </div>
              <div className="font-semibold text-neutral-900">{plan.frequencyName}</div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                <Target className="w-4 h-4" />
                <span>Cieľ</span>
              </div>
              <div className="font-semibold text-neutral-900">{getGoalLabel(userGoals?.primaryGoal)}</div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                <Zap className="w-4 h-4" />
                <span>Skúsenosti</span>
              </div>
              <div className="font-semibold text-neutral-900">{getExperienceLabel(userGoals?.experienceLevel)}</div>
            </div>
          </div>
        </div>

        {/* Plan Stats */}
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-neutral-200 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">{plan.name}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-3xl font-bold text-neutral-900">{plan.stats.daysPerWeek}</div>
              <div className="text-sm text-neutral-500">tréningov/týždeň</div>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-3xl font-bold text-neutral-900">{plan.stats.totalExercises}</div>
              <div className="text-sm text-neutral-500">cvikov celkom</div>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-3xl font-bold text-neutral-900">{plan.stats.totalSets}</div>
              <div className="text-sm text-neutral-500">sérií celkom</div>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-3xl font-bold text-neutral-900">~{plan.stats.estimatedDuration}</div>
              <div className="text-sm text-neutral-500">min/tréning</div>
            </div>
          </div>

          {/* Weekly Calendar */}
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-3">Týždenný rozvrh</h3>
            <div className="grid grid-cols-7 gap-2">
              {plan.weeklyRotation.map((day, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl text-center ${
                    day === 'Voľno'
                      ? 'bg-neutral-100 text-neutral-400'
                      : 'bg-neutral-900 text-white'
                  }`}
                >
                  <div className="text-xs mb-1">{getDayName(index).slice(0, 3)}</div>
                  <div className="text-sm font-medium">{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workout Days Detail */}
        <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900">Detail tréningov</h2>
          </div>

          {plan.schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="border-b border-neutral-100 last:border-b-0">
              <button
                onClick={() => setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)}
                className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-bold">
                    {dayIndex + 1}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-neutral-900">{day.name}</div>
                    <div className="text-sm text-neutral-500">{day.exercises.length} cvikov</div>
                  </div>
                </div>
                {expandedDay === dayIndex ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {expandedDay === dayIndex && (
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    {day.exercises.map((exercise, exIndex) => (
                      <div
                        key={exIndex}
                        className="p-4 bg-neutral-50 rounded-xl"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-neutral-900">{exercise.name}</div>
                            <div className="text-sm text-neutral-500">{exercise.muscle}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-neutral-900">
                              {exercise.sets} x {exercise.reps}
                            </div>
                            <div className="text-xs text-neutral-400">
                              Odpočinok: {exercise.rest}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs rounded-lg">
                            {exercise.equipment}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-lg ${
                            exercise.difficulty === 'beginner'
                              ? 'bg-green-100 text-green-700'
                              : exercise.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:border-neutral-300 hover:bg-neutral-50 transition-all"
              >
                <Download className="w-5 h-5" />
                Export
              </button>

              {showExportMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-10">
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                  >
                    CSV (Excel)
                  </button>
                  <button
                    onClick={() => handleExport('text')}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                  >
                    Text
                  </button>
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:border-neutral-300 hover:bg-neutral-50 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Zdieľať
            </button>

            {/* Enter App Button */}
            <button
              onClick={handleEnterApp}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-soft transition-all"
            >
              Vstúpiť do aplikácie
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-400">
          Tvoj plán je uložený a môžeš ho kedykoľvek upraviť v aplikácii
        </p>
      </div>
    </div>
  )
}

export default MyPlan
