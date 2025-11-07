import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GoalsWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [goals, setGoals] = useState({
    primaryGoal: '',
    experienceLevel: '',
    workoutFrequency: '',
    focusAreas: [],
    targetWeight: '',
    timeline: ''
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Ulož ciele a presmeruj na dashboard
      localStorage.setItem('userGoals', JSON.stringify(goals))
      localStorage.setItem('onboardingCompleted', 'true')
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    navigate('/dashboard')
  }

  const toggleFocusArea = (area) => {
    setGoals(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }))
  }

  const isStepValid = () => {
    switch(step) {
      case 1: return goals.primaryGoal !== ''
      case 2: return goals.experienceLevel !== ''
      case 3: return goals.workoutFrequency !== ''
      case 4: return goals.focusAreas.length > 0
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">
            FitFlow
          </h1>
          <p className="text-gray-600">Nastavme tvoje fitness ciele</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Krok {step} z 4</span>
            <span className="text-sm font-medium text-gray-700">{step * 25}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-gray-700 to-gray-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

          {/* Step 1: Primary Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Aký je tvoj hlavný cieľ?</h2>
                <p className="text-gray-600">Vyber si, čo chceš dosiahnuť</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'lose-weight', label: 'Schudnúť', icon: '⚖️' },
                  { value: 'build-muscle', label: 'Nabrať svaly', icon: '💪' },
                  { value: 'get-fit', label: 'Zlepšiť kondíciu', icon: '🏃' },
                  { value: 'stay-healthy', label: 'Udržať zdravie', icon: '❤️' },
                  { value: 'strength', label: 'Zvýšiť silu', icon: '🏋️' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, primaryGoal: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      goals.primaryGoal === option.value
                        ? 'border-gray-500 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="text-lg font-semibold text-gray-800">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Experience Level */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Aká je tvoja úroveň skúseností?</h2>
                <p className="text-gray-600">Pomôže nám prispôsobiť cviky pre teba</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Začiatočník', desc: 'Práve začínam s fitnessom' },
                  { value: 'intermediate', label: 'Mierne pokročilý', desc: 'Cvičím pravidelne niekoľko mesiacov' },
                  { value: 'advanced', label: 'Pokročilý', desc: 'Cvičím už roky a mám skúsenosti' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, experienceLevel: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      goals.experienceLevel === option.value
                        ? 'border-gray-500 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-lg text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Workout Frequency */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ako často plánuješ cvičiť?</h2>
                <p className="text-gray-600">Realisticky odhadni svoju dostupnosť</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: '2-3', label: '2-3x týždenne', desc: 'Ideálne pre začiatočníkov' },
                  { value: '4-5', label: '4-5x týždenne', desc: 'Pre pravidelných cvičencov' },
                  { value: '6-7', label: '6-7x týždenne', desc: 'Pre pokročilých' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, workoutFrequency: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      goals.workoutFrequency === option.value
                        ? 'border-gray-500 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-lg text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Focus Areas */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ktoré svalové skupiny chceš rozvíjať?</h2>
                <p className="text-gray-600">Môžeš vybrať viacero</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'chest', label: 'Hrudník' },
                  { value: 'back', label: 'Chrbát' },
                  { value: 'shoulders', label: 'Ramená' },
                  { value: 'arms', label: 'Ruky' },
                  { value: 'abs', label: 'Brucho' },
                  { value: 'legs', label: 'Nohy' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleFocusArea(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goals.focusAreas.includes(option.value)
                        ? 'border-gray-500 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all"
              >
                Späť
              </button>
            )}

            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-all"
            >
              Preskočiť
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                isStepValid()
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Dokončiť' : 'Ďalej'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Tvoje údaje sú v bezpečí a použijú sa len na personalizáciu tvojho tréningového plánu
        </p>
      </div>
    </div>
  )
}

export default GoalsWizard
