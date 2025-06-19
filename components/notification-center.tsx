"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Music, ShoppingBag, Users, Sparkles } from "lucide-react"

interface Notification {
  id: string
  type: "music" | "shop" | "community" | "general"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "music",
    title: "NEW TRACK ALERT",
    message: 'Britney just dropped "Electric Soul" - listen now!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    actionUrl: "/music",
  },
  {
    id: "2",
    type: "shop",
    title: "GRWM VIDEO LIVE",
    message: 'New "Date Night Glam" tutorial is now available',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    actionUrl: "/marketplace",
  },
]

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  onUnreadCountChange: (count: number) => void
}

export function NotificationCenter({ isOpen, onClose, onUnreadCountChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  useEffect(() => {
    const count = notifications.filter((n) => !n.isRead).length
    onUnreadCountChange(count)
  }, [notifications, onUnreadCountChange])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "music":
        return Music
      case "shop":
        return ShoppingBag
      case "community":
        return Users
      default:
        return Sparkles
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) return `${minutes}M AGO`
    return `${hours}H AGO`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-20 right-6 w-80 max-h-96 z-30"
        >
          <Card className="bg-black border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold tracking-wider">NOTIFICATIONS</h3>
                <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:text-gray-300 p-1">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>NO NOTIFICATIONS YET</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                          !notification.isRead ? "bg-white/5" : ""
                        }`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white rounded flex-shrink-0">
                            <Icon className="w-4 h-4 text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-bold text-sm tracking-wider">{notification.title}</h4>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white p-1 flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                            <span className="text-gray-500 text-xs mt-2 block">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
