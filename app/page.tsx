"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-[8vw] md:text-[12vw] lg:text-[14vw] font-black leading-[0.8] tracking-tighter">
              <span className="text-white">BRITNEY</span>
              <br />
              <span className="text-gray-500">CHIERRA.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-transparent">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-between items-center text-lg"
          >
            <Link href="/music" className="hover:text-gray-300 transition-colors">
              Music
            </Link>
            <Link href="/marketplace" className="hover:text-gray-300 transition-colors">
              Shop
            </Link>
            <Link href="/community" className="hover:text-gray-300 transition-colors">
              Community
            </Link>
            <Link href="/admin" className="hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
