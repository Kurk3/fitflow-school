import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GoalsWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const totalSteps = 8

  // Personal profile data
  const [profile, setProfile] = useState({
    gender: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    height: 170,
    currentWeight: 70,
    targetWeight: 70,
    activityLevel: ''
  })

  // Goals data
  const [goals, setGoals] = useState({
    primaryGoal: '',
    experienceLevel: '',
    workoutFrequency: '',
    trainingStyle: '',
    focusAreas: []
  })

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save profile
      const birthDate = profile.birthYear && profile.birthMonth && profile.birthDay
        ? `${profile.birthYear}-${profile.birthMonth.padStart(2, '0')}-${profile.birthDay.padStart(2, '0')}`
        : null

      const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      localStorage.setItem('userProfile', JSON.stringify({
        ...existingProfile,
        gender: profile.gender,
        birthDate,
        height: profile.height,
        currentWeight: profile.currentWeight,
        targetWeight: profile.targetWeight,
        activityLevel: profile.activityLevel
      }))

      // Save goals
      localStorage.setItem('userGoals', JSON.stringify(goals))
      localStorage.setItem('onboardingCompleted', 'true')
      navigate('/my-plan')
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

  const isStepValid = () => {
    switch(step) {
      case 1: return profile.gender !== ''
      case 2: return profile.birthDay && profile.birthMonth && profile.birthYear
      case 3: return profile.height > 0 && profile.currentWeight > 0
      case 4: return profile.activityLevel !== ''
      case 5: return goals.primaryGoal !== ''
      case 6: return goals.experienceLevel !== ''
      case 7: return goals.workoutFrequency !== ''
      case 8: return goals.trainingStyle !== ''
      default: return false
    }
  }

  const progress = Math.round((step / totalSteps) * 100)

  // Generate year options (1940-2010)
  const years = Array.from({ length: 71 }, (_, i) => 2010 - i)
  const months = [
    { value: '1', label: 'Január' }, { value: '2', label: 'Február' },
    { value: '3', label: 'Marec' }, { value: '4', label: 'Apríl' },
    { value: '5', label: 'Máj' }, { value: '6', label: 'Jún' },
    { value: '7', label: 'Júl' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'Október' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ]
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Nastavenie profilu
          </h1>
          <p className="text-neutral-500">Pomôž nám prispôsobiť tvoj tréning</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-neutral-900">Krok {step} z {totalSteps}</span>
            <span className="text-sm font-medium text-neutral-900">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200">

          {/* Step 1: Gender */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aké je tvoje pohlavie?</h2>
                <p className="text-neutral-500">Pomôže nám prispôsobiť odporúčania</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'male', label: 'Muž' },
                  { value: 'female', label: 'Žena' },
                  { value: 'other', label: 'Iné' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setProfile({ ...profile, gender: option.value })}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      profile.gender === option.value
                        ? 'border-neutral-900 bg-neutral-50 shadow-soft'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="font-semibold text-neutral-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Birth Date */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Kedy si sa narodil/a?</h2>
                <p className="text-neutral-500">Použijeme to na výpočet veku a odporúčaní</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Deň</label>
                  <select
                    value={profile.birthDay}
                    onChange={(e) => setProfile({ ...profile, birthDay: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none bg-neutral-50 focus:bg-white"
                  >
                    <option value="">-</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Mesiac</label>
                  <select
                    value={profile.birthMonth}
                    onChange={(e) => setProfile({ ...profile, birthMonth: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none bg-neutral-50 focus:bg-white"
                  >
                    <option value="">-</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Rok</label>
                  <select
                    value={profile.birthYear}
                    onChange={(e) => setProfile({ ...profile, birthYear: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all outline-none bg-neutral-50 focus:bg-white"
                  >
                    <option value="">-</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Height & Weight */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Tvoje telesné miery</h2>
                <p className="text-neutral-500">Pomôže nám vypočítať BMI a sledovať pokrok</p>
              </div>

              <div className="space-y-6">
                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Výška: <span className="text-neutral-900 font-bold">{profile.height} cm</span>
                  </label>
                  <input
                    type="range"
                    min="140"
                    max="220"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                  />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>140 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>

                {/* Current Weight */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Aktuálna váha: <span className="text-neutral-900 font-bold">{profile.currentWeight} kg</span>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={profile.currentWeight}
                    onChange={(e) => setProfile({ ...profile, currentWeight: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                  />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>40 kg</span>
                    <span>150 kg</span>
                  </div>
                </div>

                {/* Target Weight */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Cieľová váha: <span className="text-neutral-900 font-bold">{profile.targetWeight} kg</span>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={profile.targetWeight}
                    onChange={(e) => setProfile({ ...profile, targetWeight: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                  />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>40 kg</span>
                    <span>150 kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Activity Level */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aká je tvoja úroveň aktivity?</h2>
                <p className="text-neutral-500">Mimo tréningov, ako aktívny je tvoj životný štýl?</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'sedentary', label: 'Sedavý', desc: 'Kancelárska práca, minimum pohybu' },
                  { value: 'lightly-active', label: 'Mierne aktívny', desc: 'Občasná chôdza, ľahká aktivita' },
                  { value: 'active', label: 'Aktívny', desc: 'Pravidelný pohyb, aktívna práca' },
                  { value: 'very-active', label: 'Veľmi aktívny', desc: 'Fyzicky náročná práca alebo šport denne' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setProfile({ ...profile, activityLevel: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      profile.activityLevel === option.value
                        ? 'border-neutral-900 bg-neutral-50 shadow-soft'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-neutral-900">{option.label}</div>
                    <div className="text-sm text-neutral-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Primary Goal */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aký je tvoj hlavný cieľ?</h2>
                <p className="text-neutral-500">Vyber si, čo chceš dosiahnuť</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'lose-weight', label: 'Schudnúť' },
                  { value: 'build-muscle', label: 'Nabrať svaly' },
                  { value: 'get-fit', label: 'Zlepšiť kondíciu' },
                  { value: 'stay-healthy', label: 'Udržať zdravie' },
                  { value: 'strength', label: 'Zvýšiť silu' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, primaryGoal: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      goals.primaryGoal === option.value
                        ? 'border-neutral-900 bg-neutral-50 shadow-soft'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-lg font-semibold text-neutral-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Experience Level */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aká je tvoja úroveň skúseností?</h2>
                <p className="text-neutral-500">Pomôže nám prispôsobiť cviky pre teba</p>
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
                        ? 'border-neutral-900 bg-neutral-50 shadow-soft'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-lg text-neutral-900">{option.label}</div>
                    <div className="text-sm text-neutral-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Workout Frequency */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Ako často plánuješ cvičiť?</h2>
                <p className="text-neutral-500">Realisticky odhadni svoju dostupnosť</p>
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
                        ? 'border-neutral-900 bg-neutral-50 shadow-soft'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-lg text-neutral-900">{option.label}</div>
                    <div className="text-sm text-neutral-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Training Style */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aký štýl tréningu preferuješ?</h2>
                <p className="text-neutral-500">Vyber si typ cvičenia, ktorý ti najviac vyhovuje</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: 'bodybuilding',
                    label: 'Bodybuilding',
                    desc: 'Budovanie svalovej hmoty s činkami a strojmi'
                  },
                  {
                    value: 'calisthenics',
                    label: 'Calisthenics',
                    desc: 'Cvičenie s vlastnou váhou tela'
                  },
                  {
                    value: 'pilates',
                    label: 'Pilates',
                    desc: 'Core, flexibilita a kontrola pohybu'
                  }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, trainingStyle: option.value })}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      goals.trainingStyle === option.value
                        ? 'border-neutral-900 bg-neutral-50 shadow-soft'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-lg text-neutral-900 mb-2">{option.label}</div>
                    <div className="text-sm text-neutral-500">{option.desc}</div>
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
                className="px-6 py-3 border-2 border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:border-neutral-300 hover:bg-neutral-50 transition-all"
              >
                Späť
              </button>
            )}

            <button
              onClick={handleSkip}
              className="px-6 py-3 text-neutral-500 hover:text-neutral-900 font-medium transition-all"
            >
              Preskočiť
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                isStepValid()
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-soft'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? 'Dokončiť' : 'Ďalej'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-400">
          Tvoje údaje sú v bezpečí a použijú sa len na personalizáciu tvojho tréningového plánu
        </p>
      </div>
    </div>
  )
}

export default GoalsWizard
