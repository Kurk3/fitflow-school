import { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

const demoNotifications = [
  {
    id: 'demo-1',
    title: 'Vitaj vo FitFlow!',
    message: 'Začni trénovať kliknutím na svalovú skupinu na 3D modeli.',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Tip na dnes',
    message: 'Nezabudni na rozcvičku pred tréningom! Predídeš zraneniam.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'demo-3',
    title: '7-dňový streak!',
    message: 'Si na vlne! Už týždeň trénuješ pravidelne.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Nový achievement',
    message: 'Odomkol si "Nadšenec" - dokončil si 10 workoutov!',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Osobný rekord!',
    message: 'Bench Press: Nový max 80kg! Skvelá práca.',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Týždenný prehľad',
    message: 'Tento týždeň: 5 tréningov, 12 500kg celkový objem.',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'demo-7',
    title: 'Nezabudni na nohy!',
    message: 'Už 5 dní si netrénoval dolnú časť tela.',
    timestamp: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'demo-8',
    title: 'Nový cvik objavený',
    message: 'Vyskúšal si Bulgarian Split Squat. Pridané do histórie.',
    timestamp: new Date(Date.now() - 518400000).toISOString(),
  },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('fitflow_notifications')
    const parsed = stored ? JSON.parse(stored) : []

    // If empty or not exists, seed with demo notifications
    if (!parsed || parsed.length === 0) {
      setNotifications(demoNotifications)
      localStorage.setItem('fitflow_notifications', JSON.stringify(demoNotifications))
    } else {
      setNotifications(parsed)
    }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (notifications.length > 0 || localStorage.getItem('fitflow_notifications')) {
      localStorage.setItem('fitflow_notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  const addNotification = (title, message) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
