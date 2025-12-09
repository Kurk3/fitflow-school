import { useNotifications } from '../../context/NotificationContext'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'teraz'
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h`
  const d = Math.floor(h / 24)
  return `${d} d`
}

export default function NotificationPanel({ onClose }) {
  const { notifications, unreadCount, markAllAsRead, markAsRead, removeNotification, clearAll } = useNotifications()

  return (
    <div className="absolute top-16 right-4 md:right-6 z-40 w-80 sm:w-96 bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-xl shadow-elevated overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-neutral-900 text-white text-xs font-bold">{unreadCount}</span>
          <h3 className="text-sm font-semibold text-neutral-900">Notifikácie</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllAsRead} className="text-xs font-medium text-neutral-600 hover:text-neutral-900">Označiť ako prečítané</button>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100" aria-label="Zavrieť">
            <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-neutral-500">Žiadne notifikácie</div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50">
                <div className={`mt-0.5 w-2 h-2 rounded-full ${n.read ? 'bg-neutral-300' : 'bg-neutral-900'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'text-neutral-700' : 'text-neutral-900 font-semibold'}`}>{n.title}</p>
                  <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="mt-1 text-[11px] text-neutral-500">{timeAgo(n.time)}</div>
                </div>
                <div className="flex items-center gap-1">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-[11px] px-2 py-1 rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200">Prečítať</button>
                  )}
                  <button onClick={() => removeNotification(n.id)} className="p-1 rounded-md hover:bg-neutral-100" aria-label="Odstrániť">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a2 2 0 012-2h3a2 2 0 012 2m-7 0h8" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-neutral-200 bg-white/70 flex items-center justify-end">
          <button onClick={clearAll} className="text-xs font-medium text-neutral-600 hover:text-neutral-900">Vymazať všetko</button>
        </div>
      )}
    </div>
  )
}
