import { useState, useRef } from 'react'
import ExportDropdown from './ExportDropdown'
import { exportToICalendar, exportToCSV, exportToPNG, exportToPDF } from '../../utils/exportCalendar'

function WorkoutCalendar({ workoutData }) {
  const [hoveredDate, setHoveredDate] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const calendarRef = useRef(null)

  const handleExport = async (format) => {
    switch (format) {
      case 'icalendar':
        exportToICalendar(workoutData)
        break
      case 'csv':
        exportToCSV(workoutData)
        break
      case 'png':
        await exportToPNG(calendarRef)
        break
      case 'pdf':
        exportToPDF(workoutData)
        break
      default:
        console.error('Unknown export format:', format)
    }
  }

  // Generate array of last 84 days (12 weeks)
  const generateCalendarDays = () => {
    const days = []
    const today = new Date()

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    return days
  }

  const days = generateCalendarDays()

  // Get workout count for a specific date
  const getWorkoutCount = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return workoutData[dateString] || 0
  }

  // Get color based on workout count
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100'
    if (count === 1) return 'bg-emerald-100'
    if (count === 2) return 'bg-emerald-200'
    if (count === 3) return 'bg-emerald-400'
    return 'bg-emerald-500'
  }

  // Format date for tooltip
  const formatDate = (date) => {
    const months = [
      'Január',
      'Február',
      'Marec',
      'Apríl',
      'Máj',
      'Jún',
      'Júl',
      'August',
      'September',
      'Október',
      'November',
      'December',
    ]
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  // Handle mouse over for tooltip
  const handleMouseOver = (date, event) => {
    setHoveredDate(date)
    const rect = event.target.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  // Group days by week
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  // Get month labels
  const getMonthLabels = () => {
    const labels = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
    let lastMonth = -1

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0]
      const month = firstDay.getMonth()

      if (month !== lastMonth) {
        labels.push({
          month: monthNames[month],
          weekIndex,
        })
        lastMonth = month
      }
    })

    return labels
  }

  const monthLabels = getMonthLabels()

  return (
    <div className="space-y-4" ref={calendarRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Aktivita</h3>

        <div className="flex items-center gap-4">
          {/* Color Legend */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Menej</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300" />
              <div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200" />
              <div className="w-3 h-3 rounded-sm bg-emerald-200 border border-emerald-300" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-500" />
              <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-600" />
            </div>
            <span>Viac</span>
          </div>

          {/* Export Dropdown */}
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 font-medium"
                style={{ marginLeft: index === 0 ? 0 : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 16}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex">
            <div className="flex flex-col gap-1 text-xs text-gray-600 mr-2">
              <div className="h-3">Pon</div>
              <div className="h-3"></div>
              <div className="h-3">Str</div>
              <div className="h-3"></div>
              <div className="h-3">Pia</div>
              <div className="h-3"></div>
              <div className="h-3">Ned</div>
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date, dayIndex) => {
                    const count = getWorkoutCount(date)
                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${getColor(count)} border ${count === 0 ? 'border-gray-300' : 'border-emerald-300'} cursor-pointer transition-all hover:ring-2 hover:ring-primary-900 hover:scale-125`}
                        onMouseEnter={(e) => handleMouseOver(date, e)}
                        onMouseLeave={() => setHoveredDate(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDate && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-primary-900 text-white text-xs px-3 py-2 rounded-lg shadow-elevated">
            <div className="font-semibold">{formatDate(hoveredDate)}</div>
            <div className="text-gray-100">
              {getWorkoutCount(hoveredDate) === 0
                ? 'Žiadny workout'
                : getWorkoutCount(hoveredDate) === 1
                ? '1 workout'
                : `${getWorkoutCount(hoveredDate)} workouty`}
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-900" />
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Object.keys(workoutData).length}
          </div>
          <div className="text-xs text-gray-600">Dni s workoutom</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Object.values(workoutData).reduce((sum, count) => sum + count, 0)}
          </div>
          <div className="text-xs text-gray-600">Celkovo workoutov</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {Math.max(...Object.values(workoutData))}
          </div>
          <div className="text-xs text-gray-600">Max za deň</div>
        </div>
      </div>
    </div>
  )
}

export default WorkoutCalendar
