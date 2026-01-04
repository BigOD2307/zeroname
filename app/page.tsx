'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EmailCapture from '@/components/EmailCapture'
import UploadSection from '@/components/UploadSection'
import AnalysisResults from '@/components/AnalysisResults'
import Header from '@/components/Header'
import LimitReached from '@/components/LimitReached'

export type AnalysisResult = {
  score: number
  scoreExplanation: string
  strengths: string[]
  weaknesses: string[]
  cvRecommendations: string[]
  coverLetter: string
  behaviorTips: string[]
  conclusion: string
}

export default function Home() {
  const [hasEmail, setHasEmail] = useState<boolean | null>(null)
  const [usageCount, setUsageCount] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Vérifier si l'email a déjà été fourni
    const email = localStorage.getItem('zeroname_email')
    const usage = parseInt(localStorage.getItem('zeroname_usage') || '0')
    setHasEmail(!!email)
    setUsageCount(usage)
  }, [])

  const handleEmailSubmit = async (email: string) => {
    try {
      // Enregistrer l'email dans Google Sheets
      await fetch('/api/save-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      // Sauvegarder localement
      localStorage.setItem('zeroname_email', email)
      document.cookie = `zeroname_email=${email}; max-age=31536000; path=/`
      setHasEmail(true)
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err)
      // Continuer quand même
      localStorage.setItem('zeroname_email', email)
      setHasEmail(true)
    }
  }

  const handleAnalysis = async (cvFile: File, jobDescription: File | string) => {
    if (usageCount >= 3) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('cv', cvFile)
      
      if (typeof jobDescription === 'string') {
        formData.append('jobDescriptionText', jobDescription)
      } else {
        formData.append('jobDescription', jobDescription)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      // Vérifier le type de contenu
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Réponse non-JSON reçue:', text.substring(0, 200))
        throw new Error('Erreur serveur : réponse invalide')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || 'Une erreur est survenue')
      }

      const data = await response.json()
      setResults(data)

      // Incrémenter le compteur d'utilisation
      const newUsage = usageCount + 1
      localStorage.setItem('zeroname_usage', newUsage.toString())
      setUsageCount(newUsage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setResults(null)
    setError(null)
  }

  // Loading state
  if (hasEmail === null) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-zero-accent border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen gradient-bg">
      <Header usageCount={usageCount} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <AnimatePresence mode="wait">
          {!hasEmail ? (
            <EmailCapture key="email" onSubmit={handleEmailSubmit} />
          ) : usageCount >= 3 ? (
            <LimitReached key="limit" />
          ) : results ? (
            <AnalysisResults 
              key="results" 
              results={results} 
              onReset={resetAnalysis}
              remainingUses={3 - usageCount}
            />
          ) : (
            <UploadSection 
              key="upload" 
              onAnalyze={handleAnalysis}
              isAnalyzing={isAnalyzing}
              error={error}
              remainingUses={3 - usageCount}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

