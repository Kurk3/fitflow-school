import { useToast } from '../../context/ToastContext'
import { Check, X, Info } from 'lucide-react'

function Toast() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4" />
      case 'error':
        return <X className="w-4 h-4" />
      case 'info':
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-neutral-900 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'info':
      default:
        return 'bg-white text-neutral-900 border border-neutral-200'
    }
  }

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-elevated animate-slide-in-right ${getStyles(toast.type)}`}
        >
          <span className="flex-shrink-0">
            {getIcon(toast.type)}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors ml-2"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
