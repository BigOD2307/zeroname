'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, FileText, Target, Lightbulb, Zap } from 'lucide-react'

interface EmailCaptureProps {
  onSubmit: (email: string) => void
}

export default function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Entre une adresse email valide')
      return
    }

    setIsSubmitting(true)
    await onSubmit(email)
    setIsSubmitting(false)
  }

  const features = [
    { icon: Target, text: 'Score de compatibilité' },
    { icon: FileText, text: 'Lettre de motivation' },
    { icon: Lightbulb, text: 'Conseils entretien' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-2xl w-full text-center">
        {/* Hero */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zero-accent/10 border border-zero-accent/20 text-zero-accent text-sm mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>Analyse IA gratuite</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Ton CV est-il vraiment
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="gradient-text">adapté à ce poste ?</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zero-text-muted mb-6 sm:mb-8 max-w-lg mx-auto px-2">
            Analyse instantanée de ton CV face à n'importe quelle offre d'emploi. 
            Obtiens des recommandations concrètes.
          </p>
        </motion.div>

        {/* Features - Mobile optimized */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-zero-surface border border-zero-surface-light"
            >
              <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zero-accent" />
              <span className="text-xs sm:text-sm whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Email Form - Mobile optimized */}
        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="relative max-w-md mx-auto px-2"
        >
          {/* Desktop: inline button */}
          <div className="hidden sm:block relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zero-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="ton.email@exemple.com"
              className="w-full pl-12 pr-36 py-4 rounded-2xl bg-zero-surface border border-zero-surface-light focus:border-zero-accent focus:outline-none transition-colors text-lg"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Accéder
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Mobile: stacked layout */}
          <div className="sm:hidden space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zero-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="ton.email@exemple.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zero-surface border border-zero-surface-light focus:border-zero-accent focus:outline-none transition-colors text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Accéder gratuitement
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-2"
            >
              {error}
            </motion.p>
          )}
          <p className="text-zero-text-muted text-xs sm:text-sm mt-4">
            ✨ 100% gratuit • 3 analyses • Sans carte bancaire
          </p>
        </motion.form>
      </div>

      {/* Background decoration - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-1/4 left-1/4 w-96 h-96 bg-zero-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  )
}
