import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, Calendar, FileText, Image, Table } from 'lucide-react'

function ExportDropdown({ onExport }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const exportOptions = [
    {
      id: 'icalendar',
      icon: Calendar,
      title: 'iCalendar (.ics)',
      description: 'Importovať do kalendára',
    },
    {
      id: 'pdf',
      icon: FileText,
      title: 'PDF Document',
      description: 'Vytlačiť alebo uložiť',
    },
    {
      id: 'png',
      icon: Image,
      title: 'PNG Image',
      description: 'Obrázok kalendára',
    },
    {
      id: 'csv',
      icon: Table,
      title: 'CSV Spreadsheet',
      description: 'Excel/Sheets formát',
    },
  ]

  const handleExport = (format) => {
    onExport(format)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors text-gray-700"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Export</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-elevated z-50 overflow-hidden">
          {exportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                  index !== exportOptions.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{option.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExportDropdown
