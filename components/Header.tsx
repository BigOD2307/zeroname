'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface HeaderProps {
  usageCount: number
}

export default function Header({ usageCount }: HeaderProps) {
  const remainingUses = Math.max(0, 3 - usageCount)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-zero-accent to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight">
            zero<span className="gradient-text">name</span>
          </span>
        </div>

        {remainingUses > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="text-zero-text-muted hidden sm:inline">Analyses :</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                    i < remainingUses 
                      ? 'bg-zero-accent' 
                      : 'bg-zero-surface-light'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
