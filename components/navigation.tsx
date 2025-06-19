"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationProps {
  unreadCount?: number
  onNotificationClick?: () => void
}

export function Navigation({ unreadCount = 0, onNotificationClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: "/music", label: "MUSIC" },
    { href: "/marketplace", label: "SHOP" },
    { href: "/community", label: "COMMUNITY" },
    { href: "/about", label: "ABOUT" },
  ]

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-transparent">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">
            BRITNEYCHIERRA
          </Link>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <Button
              onClick={onNotificationClick}
              className="relative bg-transparent hover:bg-white/10 text-white border border-white/20 p-2"
              size="sm"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </Button>

            {/* Hamburger Menu */}
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-transparent hover:bg-white/10 text-white p-2"
              size="sm"
            >
              <div className="flex flex-col gap-1">
                <motion.div
                  animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
                  className="w-6 h-0.5 bg-white origin-center"
                />
                <motion.div animate={{ opacity: isMenuOpen ? 0 : 1 }} className="w-6 h-0.5 bg-white" />
                <motion.div
                  animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
                  className="w-6 h-0.5 bg-white origin-center"
                />
              </div>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-4xl font-black tracking-wider transition-colors ${
                      pathname === item.href ? "text-white" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
