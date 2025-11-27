import { useState } from 'react'

function ExerciseForm({ exercise, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    sets: exercise.sets || 3,
    reps: exercise.reps || 10,
    weight: exercise.weight || 0,
    unit: exercise.unit || 'kg'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sets' || name === 'reps' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-300">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Sety</label>
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            min="1"
            max="10"
            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Opakovania</label>
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Váha</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Jednotka</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
            <option value="bw">BW</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-3 rounded-lg transition-colors shadow-soft"
        >
          Uložiť
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-colors border border-gray-300"
        >
          Zrušiť
        </button>
      </div>
    </form>
  )
}

export default ExerciseForm
