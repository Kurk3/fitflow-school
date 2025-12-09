import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'fitflow_notifications'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const seededRef = useRef(false)

  useEffect(() => {
    try {
      // Always start fresh with seed data for demo purposes
      const now = new Date()
      const seed = [
          {
            id: crypto.randomUUID(),
            title: 'Nový osobný rekord!',
            message: 'Gratulujem! Dosiahol si 10 tréningov tento mesiac.',
            time: now.toISOString(),
            read: false,
            type: 'achievement'
          },
          {
            id: crypto.randomUUID(),
            title: 'Týždenný pokrok',
            message: 'Tento týždeň si absolvoval 4 tréningy. Skvelá práca!',
            time: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
            read: false,
            type: 'progress'
          },
          {
            id: crypto.randomUUID(),
            title: 'Streak: 7 dní',
            message: 'Udržuješ 7-dňový tréningový streak! Tak ďalej.',
            time: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
            read: true,
            type: 'streak'
          },
          {
            id: crypto.randomUUID(),
            title: 'Pripomienka hydratácie',
            message: 'Nezabudni piť dostatok vody počas tréningu.',
            time: new Date(now.getTime() - 1000 * 60 * 180).toISOString(),
            read: true,
            type: 'reminder'
          },
          {
            id: crypto.randomUUID(),
            title: 'Rast váh',
            message: 'Minulý týždeň si zvýšil váhy pri benchi o 5kg!',
            time: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
            read: true,
            type: 'progress'
          },
          {
            id: crypto.randomUUID(),
            title: 'Tip na regeneráciu',
            message: 'Po ťažkom tréningu skús 10 minút stretchingu.',
            time: new Date(now.getTime() - 1000 * 60 * 60 * 36).toISOString(),
            read: true,
            type: 'tip'
          }
        ]
        setNotifications(seed)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch {}
  }, [notifications])

  // Simple demo: schedule a mock push after a short delay (one-shot per load)
  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    const t1 = setTimeout(() => {
      addNotification({
        title: 'Denná pripomienka',
        message: 'Čas na tréning! Plánoval si dnes Push deň.',
        type: 'reminder'
      })
    }, 8000)
    const t2 = setTimeout(() => {
      addNotification({
        title: 'Mini výzva',
        message: 'Skús dnes 20 drepov navyše pre lepší progres nôh.',
        type: 'challenge'
      })
    }, 15000)
    const t3 = setTimeout(() => {
      addNotification({
        title: 'Týždenné zhrnutie',
        message: 'Tento týždeň si spálil 2400 kalórií. Úžasné!',
        type: 'summary'
      })
    }, 22000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const addNotification = ({ title, message, type = 'info' }) => {
    const item = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      time: new Date().toISOString(),
      read: false
    }
    setNotifications((prev) => [item, ...prev])
    return item.id
  }

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => setNotifications([])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext)
