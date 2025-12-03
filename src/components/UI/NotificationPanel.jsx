import { X, Trash2 } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

function NotificationPanel({ onClose }) {
  const { notifications, removeNotification, clearAllNotifications } = useNotifications()

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Práve teraz'
    if (diffMins < 60) return `pred ${diffMins} min`
    if (diffHours < 24) return `pred ${diffHours} hod`
    if (diffDays === 1) return 'Včera'
    return `pred ${diffDays} dňami`
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-neutral-200 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <h3 className="font-bold text-neutral-900">Notifikácie</h3>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600"
              title="Vymazať všetky"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-neutral-400">Žiadne notifikácie</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-neutral-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-neutral-900 truncate">
                      {notification.title}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 rounded transition-all flex-shrink-0"
                  >
                    <X className="w-3 h-3 text-neutral-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
