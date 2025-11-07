import { useState } from 'react'
import Model from 'react-body-highlighter'

function BodyDiagram({ onMuscleClick, selectedMuscle }) {
  const [hoveredMuscle, setHoveredMuscle] = useState(null)
  const [view, setView] = useState('anterior') // anterior = predok, posterior = zadok

  // Mapovanie zo slovenských názvov na anglické pre highlighting
  const muscleReverseMap = {
    'Hrudník (Pectorals)': 'chest',
    'Biceps': 'biceps',
    'Triceps': 'triceps',
    'Ramená (Shoulders)': 'deltoids',
    'Brucho (Abs)': 'abs',
    'Šikmé brušné svaly': 'obliques',
    'Chrbát (Back)': 'trapezius',
    'Stehná (Quads)': 'quadriceps',
    'Zadné stehenné svaly (Hamstrings)': 'hamstring',
    'Lýtka (Calves)': 'calves',
    'Zadok (Glutes)': 'gluteal',
    'Predlaktia': 'forearms',
    'Krk': 'neck',
    'Hlava': 'head'
  }

  // Vytvor data pre highlighting vybraného svalu
  const exerciseData = selectedMuscle && muscleReverseMap[selectedMuscle]
    ? [{ name: 'Selected', muscles: [muscleReverseMap[selectedMuscle]], exercises: [] }]
    : []

  const handleMuscleClick = (muscle) => {
    console.log('Clicked muscle:', muscle)
    // Mapovanie z anglických názvov na slovenské
    const muscleMap = {
      'chest': 'Hrudník (Pectorals)',
      'biceps': 'Biceps',
      'triceps': 'Triceps',
      'deltoids': 'Ramená (Shoulders)',
      'front-deltoids': 'Ramená (Shoulders)',
      'back-deltoids': 'Ramená (Shoulders)',
      'abs': 'Brucho (Abs)',
      'obliques': 'Šikmé brušné svaly',
      'back': 'Chrbát (Back)',
      'upper-back': 'Chrbát (Back)',
      'lower-back': 'Chrbát (Back)',
      'trapezius': 'Chrbát (Back)',
      'quadriceps': 'Stehná (Quads)',
      'hamstring': 'Zadné stehenné svaly (Hamstrings)',
      'calves': 'Lýtka (Calves)',
      'gluteal': 'Zadok (Glutes)',
      'forearms': 'Predlaktia',
      'adductors': 'Stehná (Quads)',
      'abductors': 'Stehná (Quads)',
      'neck': 'Krk',
      'head': 'Hlava'
    }

    const slovakName = muscleMap[muscle.muscle] || muscle.muscle
    if (onMuscleClick) {
      onMuscleClick(slovakName)
    }
  }

  const toggleView = () => {
    setView(view === 'anterior' ? 'posterior' : 'anterior')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {/* Toggle button */}
      <div className="mb-6">
        <button
          onClick={toggleView}
          className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm"
        >
          {view === 'anterior' ? 'Predná strana' : 'Zadná strana'}
        </button>
      </div>

      {/* Body model */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <Model
          data={exerciseData}
          onClick={handleMuscleClick}
          type={view}
          style={{ width: '500px', height: '800px' }}
          highlightedColors={['#4b5563', '#6b7280']}
          bodyColor="#d4a57a"
        />
      </div>

      {/* View label */}
      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-gray-700">
          {view === 'anterior' ? 'Predná strana tela' : 'Zadná strana tela'}
        </p>
      </div>
    </div>
  )
}

export default BodyDiagram
