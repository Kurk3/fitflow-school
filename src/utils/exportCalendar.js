import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export workout calendar to iCalendar (.ics) format
 * Can be imported to Google Calendar, Apple Calendar, Outlook, etc.
 */
export const exportToICalendar = (workoutData) => {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FitFlow//Workout Calendar//SK',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:FitFlow Workouty',
    'X-WR-TIMEZONE:Europe/Bratislava',
  ]

  // Convert workout data to events
  Object.entries(workoutData).forEach(([dateString, count]) => {
    const date = new Date(dateString)
    const formattedDate = dateString.replace(/-/g, '')

    const summary = count === 1 ? 'FitFlow Workout' : `FitFlow Workout (${count}x)`
    const description = count === 1
      ? 'Dokončený workout v FitFlow aplikácii'
      : `Dokončené ${count} workouty v FitFlow aplikácii`

    icsLines.push(
      'BEGIN:VEVENT',
      `UID:fitflow-${dateString}@fitflow.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${formattedDate}`,
      `DTEND;VALUE=DATE:${formattedDate}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    )
  })

  icsLines.push('END:VCALENDAR')

  // Create and download .ics file
  const icsContent = icsLines.join('\r\n')
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'fitflow-calendar.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

/**
 * Export workout calendar to CSV format
 */
export const exportToCSV = (workoutData) => {
  const csvLines = ['Dátum,Počet Workoutov,Deň v týždni']

  const dayNames = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']

  // Sort dates
  const sortedDates = Object.keys(workoutData).sort()

  sortedDates.forEach((dateString) => {
    const date = new Date(dateString)
    const dayName = dayNames[date.getDay()]
    const count = workoutData[dateString]
    csvLines.push(`${dateString},${count},${dayName}`)
  })

  // Create and download CSV file
  const csvContent = csvLines.join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' }) // BOM for proper encoding
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'fitflow-workouts.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

/**
 * Export workout calendar to PNG image
 */
export const exportToPNG = async (calendarRef) => {
  if (!calendarRef.current) return

  try {
    const canvas = await html2canvas(calendarRef.current, {
      scale: 2,
      backgroundColor: '#111827', // gray-900
      logging: false,
      useCORS: true,
    })

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'fitflow-calendar.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    })
  } catch (error) {
    console.error('Error generating PNG:', error)
    alert('Chyba pri generovaní PNG obrázku')
  }
}

/**
 * Export workout calendar to PDF
 */
export const exportToPDF = (workoutData) => {
  const pdf = new jsPDF()

  // Title
  pdf.setFontSize(20)
  pdf.setFont(undefined, 'bold')
  pdf.text('FitFlow - Workout Kalendár', 105, 20, { align: 'center' })

  // Date range
  const dates = Object.keys(workoutData).sort()
  if (dates.length > 0) {
    const firstDate = new Date(dates[0])
    const lastDate = new Date(dates[dates.length - 1])
    const formatDate = (date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
    }
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')
    pdf.text(`${formatDate(firstDate)} - ${formatDate(lastDate)}`, 105, 28, { align: 'center' })
  }

  // Stats summary
  let yPos = 40
  pdf.setFontSize(12)
  pdf.setFont(undefined, 'bold')
  pdf.text('Štatistiky:', 20, yPos)

  pdf.setFont(undefined, 'normal')
  yPos += 8
  const totalDays = Object.keys(workoutData).length
  const totalWorkouts = Object.values(workoutData).reduce((sum, count) => sum + count, 0)
  const maxWorkouts = Math.max(...Object.values(workoutData))

  pdf.text(`Dni s workoutom: ${totalDays}`, 25, yPos)
  yPos += 6
  pdf.text(`Celkovo workoutov: ${totalWorkouts}`, 25, yPos)
  yPos += 6
  pdf.text(`Maximum za deň: ${maxWorkouts}`, 25, yPos)

  // Legend
  yPos += 12
  pdf.setFont(undefined, 'bold')
  pdf.text('Legenda farieb:', 20, yPos)
  yPos += 8

  const colors = [
    { label: 'Žiadny workout', r: 31, g: 41, b: 55 },  // gray-800
    { label: '1 workout', r: 20, g: 83, b: 45 },       // green-900
    { label: '2 workouty', r: 21, g: 128, b: 61 },     // green-700
    { label: '3 workouty', r: 34, g: 197, b: 94 },     // green-500
    { label: '4+ workoutov', r: 74, g: 222, b: 128 },  // green-400
  ]

  pdf.setFont(undefined, 'normal')
  colors.forEach((color, index) => {
    pdf.setFillColor(color.r, color.g, color.b)
    pdf.rect(25, yPos - 3, 5, 5, 'F')
    pdf.text(color.label, 33, yPos)
    yPos += 7
  })

  // Workout list
  yPos += 8
  pdf.setFont(undefined, 'bold')
  pdf.text('Workouty:', 20, yPos)
  yPos += 8

  pdf.setFontSize(10)
  pdf.setFont(undefined, 'normal')

  const dayNames = ['Ned', 'Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob']
  const sortedDates = Object.keys(workoutData).sort().reverse() // newest first

  sortedDates.forEach((dateString) => {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }

    const date = new Date(dateString)
    const dayName = dayNames[date.getDay()]
    const count = workoutData[dateString]
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`

    pdf.text(`${formattedDate} (${dayName})`, 25, yPos)
    pdf.text(`${count}x`, 75, yPos)
    yPos += 6
  })

  // Footer
  const pageCount = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(128)
    pdf.text(
      `Vygenerované ${new Date().toLocaleDateString('sk-SK')} | FitFlow`,
      105,
      290,
      { align: 'center' }
    )
  }

  // Save PDF
  pdf.save('fitflow-calendar.pdf')
}
