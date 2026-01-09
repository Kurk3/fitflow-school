import { useNavigate } from 'react-router-dom'
import { Dumbbell, Target, Calendar, BarChart3, Users, Sparkles, ArrowRight, Check } from 'lucide-react'

function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Dumbbell,
      title: 'Interaktívny 3D Model',
      description: 'Klikni na sval a okamžite získaj cviky prispôsobené tvojim cieľom.'
    },
    {
      icon: Target,
      title: 'Tri tréningové režimy',
      description: 'Bodybuilding, Calisthenics alebo Pilates - vyber si čo ti sedí.'
    },
    {
      icon: Calendar,
      title: 'Plánovanie tréningov',
      description: 'Vytváraj a ukladaj vlastné tréningové plány na každý deň.'
    },
    {
      icon: BarChart3,
      title: 'Sledovanie pokroku',
      description: 'Monitoruj svoje úspechy a sleduj ako sa zlepšuješ.'
    },
    {
      icon: Users,
      title: 'Gym vybavenie',
      description: 'Prehľad cvikov podľa dostupného vybavenia v posilňovni.'
    },
    {
      icon: Sparkles,
      title: 'Personalizácia',
      description: 'Cviky a odporúčania prispôsobené tvojej úrovni a cieľom.'
    }
  ]

  const benefits = [
    'Bez potreby osobného trénera',
    'Cviky pre všetky úrovne',
    'Detailné inštrukcie a animácie',
    'Kompletne zadarmo'
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-neutral-900 rounded-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span className="text-base font-bold text-neutral-900">FitFlow</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Prihlásiť sa
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Vyskúšať demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium text-neutral-600">Nová verzia 2.0</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Tvoj osobný
            <br />
            <span className="text-neutral-400">tréningový asistent</span>
          </h1>

          <p className="text-lg text-neutral-500 mb-8 max-w-2xl mx-auto">
            Interaktívny 3D model ľudského tela, ktorý ti pomôže nájsť správne cviky pre každý sval. Vyber sval, získaj cviky, trénuj efektívne.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-all"
            >
              Spustiť aplikáciu
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
            >
              Vytvoriť účet
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-neutral-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white border-y border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Všetko čo potrebuješ
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto">
              FitFlow kombinuje modernú technológiu s overenými tréningovými metódami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors"
              >
                <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Ako to funguje?
            </h2>
            <p className="text-neutral-500 text-lg">
              Tri jednoduché kroky k lepšiemu tréningu.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Vyber sval', desc: 'Klikni na interaktívny 3D model a vyber svalovú skupinu, ktorú chceš trénovať.' },
              { step: '02', title: 'Prezri cviky', desc: 'Získaj zoznam cvikov prispôsobených tvojmu tréningovému štýlu - bodybuilding, calisthenics alebo pilates.' },
              { step: '03', title: 'Trénuj', desc: 'Pridaj cviky do svojho tréningového plánu a sleduj svoj pokrok.' }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 p-6 bg-white rounded-2xl border border-neutral-200">
                <div className="flex-shrink-0">
                  <span className="text-3xl font-bold text-neutral-200">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-neutral-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pripravený začať?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              Spusti aplikáciu a začni trénovať efektívnejšie už dnes. Žiadna registrácia nie je potrebná.
            </p>
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all"
            >
              Spustiť FitFlow
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-neutral-900 rounded-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span className="font-semibold text-neutral-900">FitFlow</span>
          </div>
          <p className="text-sm text-neutral-400">
            © 2024 FitFlow. Všetky práva vyhradené.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
