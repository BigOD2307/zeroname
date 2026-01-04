'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Heart, Star, Send, Check, MessageSquare } from 'lucide-react'

export default function LimitReached() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitFeedback = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    
    try {
      const email = localStorage.getItem('zeroname_email') || ''
      
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, email })
      })
      
      setSubmitted(true)
    } catch (error) {
      console.error('Erreur feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[70vh] flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-zero-accent to-purple-500 flex items-center justify-center mx-auto mb-4 sm:mb-6"
        >
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
          Merci d'avoir utilisé Zeroname ! ✨
        </h2>
        
        <p className="text-zero-text-muted text-base sm:text-lg mb-6 sm:mb-8">
          Tu as utilisé tes 3 analyses gratuites. On espère que ça t'a aidé !
        </p>

        {/* Feedback Section */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 text-left"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-zero-accent" />
              <span className="font-medium text-sm sm:text-base">Ton avis compte !</span>
            </div>
            
            {/* Star Rating */}
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-zero-text-muted mb-2">
                Comment évalues-tu Zeroname ?
              </p>
              <div className="flex justify-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-zero-surface-light'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Un commentaire ? Une suggestion ? (optionnel)"
                className="w-full h-24 p-3 rounded-xl bg-zero-surface border border-zero-surface-light focus:border-zero-accent focus:outline-none transition-colors resize-none text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={rating === 0 || isSubmitting}
              className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer mon avis
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <p className="font-medium">Merci pour ton retour ! 🙏</p>
              <p className="text-sm text-zero-text-muted">
                Ton avis nous aide à améliorer Zeroname.
              </p>
            </div>
          </motion.div>
        )}

        {/* Coming Soon */}
        <div className="p-4 rounded-xl bg-zero-accent/10 border border-zero-accent/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="font-medium text-sm">Version Premium bientôt !</span>
          </div>
          <p className="text-xs text-zero-text-muted">
            Analyses illimitées, export PDF, et plus encore. 
            Tu seras notifié par email.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-zero-text-muted mt-6">
          💡 En attendant, applique les recommandations reçues pour maximiser tes chances !
        </p>
      </div>
    </motion.div>
  )
}
