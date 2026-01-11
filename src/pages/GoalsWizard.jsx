import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GoalsWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const totalSteps = 11

  // Personal profile data
  const [profile, setProfile] = useState({
    gender: '',
    ageCategory: '',
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
    availableEquipment: '',
    workoutDuration: '',
    healthLimitations: '',
    focusAreas: []
  })

  // Age categories
  const ageCategories = [
    { value: '15-20', label: '15-20 rokov' },
    { value: '20-25', label: '20-25 rokov' },
    { value: '25-30', label: '25-30 rokov' },
    { value: '30-35', label: '30-35 rokov' },
    { value: '35-40', label: '35-40 rokov' },
    { value: '40-50', label: '40-50 rokov' },
    { value: '50+', label: '50+ rokov' }
  ]

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save profile
      const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      localStorage.setItem('userProfile', JSON.stringify({
        ...existingProfile,
        gender: profile.gender,
        ageCategory: profile.ageCategory,
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
      case 2: return profile.ageCategory !== ''
      case 3: return profile.height > 0 && profile.currentWeight > 0
      case 4: return profile.activityLevel !== ''
      case 5: return goals.availableEquipment !== ''
      case 6: return goals.workoutDuration !== ''
      case 7: return goals.healthLimitations !== ''
      case 8: return goals.primaryGoal !== ''
      case 9: return goals.experienceLevel !== ''
      case 10: return goals.workoutFrequency !== ''
      case 11: return goals.trainingStyle !== ''
      default: return false
    }
  }

  const progress = Math.round((step / totalSteps) * 100)

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

          {/* Step 2: Age Category */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Koľko máš rokov?</h2>
                <p className="text-neutral-500">Pomôže nám prispôsobiť náročnosť tréningu</p>
              </div>

              <div className="space-y-3">
                {ageCategories.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setProfile({ ...profile, ageCategory: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      profile.ageCategory === option.value
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
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer fit-neutral-900"
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
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer fit-neutral-900"
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
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer fit-neutral-900"
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

          {/* Step 5: Available Equipment */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Aké vybavenie máš k dispozícii?</h2>
                <p className="text-neutral-500">Pomôže nám vybrať vhodné cviky</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Žiadne vybavenie', desc: 'Len vlastná váha tela' },
                  { value: 'home-basic', label: 'Základné doma', desc: 'Činky, kettlebell, gumy' },
                  { value: 'full-gym', label: 'Plne vybavená posilňovňa', desc: 'Stroje, činky, všetko vybavenie' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, availableEquipment: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      goals.availableEquipment === option.value
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

          {/* Step 6: Workout Duration */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Koľko času máš na tréning?</h2>
                <p className="text-neutral-500">Prispôsobíme dĺžku tvojich tréningov</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: '15-20', label: '15-20 minút', desc: 'Krátke, intenzívne tréningy' },
                  { value: '30-45', label: '30-45 minút', desc: 'Štandardná dĺžka tréningu' },
                  { value: '45-60', label: '45-60 minút', desc: 'Dlhšie, komplexné tréningy' },
                  { value: '60+', label: '60+ minút', desc: 'Rozsiahle tréningy s oddychom' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, workoutDuration: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      goals.workoutDuration === option.value
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

          {/* Step 7: Health Limitations */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Máš nejaké zdravotné obmedzenia?</h2>
                <p className="text-neutral-500">Vyhneme sa cvikom, ktoré by ti mohli uškodiť</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Žiadne obmedzenia', desc: 'Môžem cvičiť bez obmedzení' },
                  { value: 'back', label: 'Problémy s chrbtom', desc: 'Bolesti chrbta, platničky' },
                  { value: 'knees', label: 'Problémy s kolenami', desc: 'Bolesti kolien, artróza' },
                  { value: 'shoulders', label: 'Problémy s ramenami', desc: 'Bolesti ramien, rotátorová manžeta' },
                  { value: 'other', label: 'Iné obmedzenia', desc: 'Iné zdravotné problémy' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setGoals({ ...goals, healthLimitations: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      goals.healthLimitations === option.value
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

          {/* Step 8: Primary Goal */}
          {step === 8 && (
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

          {/* Step 9: Experience Level */}
          {step === 9 && (
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

          {/* Step 10: Workout Frequency */}
          {step === 10 && (
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

          {/* Step 11: Training Style */}
          {step === 11 && (
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
