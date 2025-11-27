import { useState, useEffect } from 'react'

const steps = [
  {
    id: 1,
    title: 'Vitaj vo FitFlow!',
    description: 'Tvoj osobný fitness sprievodca. Ukážeme ti, ako aplikáciu používať.',
    target: null,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Vyber si svalovú partiu',
    description: 'Klikni na 3D model tela a vyber sval, ktorý chceš trénovať. Model môžeš otáčať ťahaním myši.',
    target: 'model',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Prezri si cviky',
    description: 'Po kliknutí na sval sa otvorí panel s cvikmi. Môžeš si prezrieť detaily a pridať cviky do tréningu.',
    target: 'panel',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Prepínaj tréningový mód',
    description: 'Hore v strede môžeš prepínať medzi Bodybuilding, Calisthenics a Pilates pre rôzne typy cvičení.',
    target: 'modes',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Môj Gym - PPL Program',
    description: 'Klikni na čiernu činku vpravo hore pre preddefinovaný Push/Pull/Legs tréningový plán s kalendárom.',
    target: 'gym',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
      </svg>
    )
  },
  {
    id: 6,
    title: 'Tvoj tréning',
    description: 'Vybrané cviky sa ukladajú do tréningu. Klikni na ikonu clipboardu vpravo pre prehľad a export.',
    target: 'workout',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  {
    id: 7,
    title: 'Si pripravený!',
    description: 'Teraz už vieš všetko potrebné. Začni kliknutím na svalovú partiu a vytvor si svoj tréning!',
    target: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
]

function OnboardingWizard({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem('fitflow_onboarding_complete', 'true')
    setTimeout(() => onComplete?.(), 300)
  }

  const handleSkip = () => {
    setIsVisible(false)
    localStorage.setItem('fitflow_onboarding_complete', 'true')
    setTimeout(() => onSkip?.(), 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-elevated max-w-md w-full overflow-hidden animate-fade-in">
        {/* Progress bar */}
        <div className="h-1 bg-neutral-100">
          <div
            className="h-full bg-neutral-900 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Krok {currentStep + 1} z {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Preskočiť
            </button>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-white mb-5">
            {step.icon}
          </div>

          {/* Title & Description */}
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            {step.title}
          </h2>
          <p className="text-neutral-500 leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-neutral-900 w-6'
                    : index < currentStep
                      ? 'bg-neutral-400'
                      : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
              >
                Späť
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-1 px-4 py-3 bg-neutral-900 rounded-xl text-white font-medium hover:bg-neutral-800 transition-colors ${
                isFirstStep ? 'w-full' : ''
              }`}
            >
              {isLastStep ? 'Začať trénovať' : 'Ďalej'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWizard
