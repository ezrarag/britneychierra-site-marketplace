"use client"

import type React from "react"
import { useState } from "react"
import { Toaster } from "sonner"
import { Navigation } from "@/components/navigation"
import { NotificationCenter } from "@/components/notification-center"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  return (
    <>
      <Navigation unreadCount={unreadCount} onNotificationClick={() => setIsNotificationOpen(!isNotificationOpen)} />
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onUnreadCountChange={setUnreadCount}
      />
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
          },
        }}
      />
    </>
  )
}
