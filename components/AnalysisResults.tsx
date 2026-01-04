'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Lightbulb, 
  Copy, 
  Check,
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Award,
  AlertTriangle
} from 'lucide-react'
import type { AnalysisResult } from '@/app/page'

interface AnalysisResultsProps {
  results: AnalysisResult
  onReset: () => void
  remainingUses: number
}

export default function AnalysisResults({ results, onReset, remainingUses }: AnalysisResultsProps) {
  const [copiedLetter, setCopiedLetter] = useState(false)
  const [activeTab, setActiveTab] = useState<'analysis' | 'letter' | 'tips'>('analysis')

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedLetter(true)
    setTimeout(() => setCopiedLetter(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#eab308'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '🎯 Excellent match'
    if (score >= 65) return '✅ Bon match'
    if (score >= 50) return '⚠️ Match partiel'
    return '❌ Match faible'
  }

  const getScoreAdvice = (score: number) => {
    if (score >= 80) return 'Ton profil correspond très bien. Postule avec confiance !'
    if (score >= 65) return 'Bonne correspondance. Quelques ajustements maximiseront tes chances.'
    if (score >= 50) return 'Profil acceptable. Applique les recommandations pour améliorer ton dossier.'
    return 'Écart important. Considère d\'autres postes ou une formation complémentaire.'
  }

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (results.score / 100) * circumference

  const tabs = [
    { id: 'analysis', label: 'Analyse', icon: Target, mobileLabel: 'Analyse' },
    { id: 'letter', label: 'Lettre', icon: FileText, mobileLabel: 'Lettre' },
    { id: 'tips', label: 'Conseils', icon: Lightbulb, mobileLabel: 'Conseils' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 sm:gap-2 text-zero-text-muted hover:text-zero-text transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Nouvelle analyse</span>
          <span className="sm:hidden">Retour</span>
        </button>
        <span className="text-xs sm:text-sm text-zero-text-muted">
          {remainingUses} restante{remainingUses > 1 ? 's' : ''}
        </span>
      </div>

      {/* Score Card - Compact on mobile */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {/* Score Circle - Smaller on mobile */}
          <div className="relative flex-shrink-0">
            <svg className="w-24 h-24 sm:w-32 sm:h-32 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#1e1e2a"
                strokeWidth="6"
                className="sm:hidden"
              />
              <circle
                cx="64"
                cy="64"
                r="40"
                fill="none"
                stroke="#1e1e2a"
                strokeWidth="8"
                className="hidden sm:block"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke={getScoreColor(results.score)}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="sm:hidden"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="40"
                fill="none"
                stroke={getScoreColor(results.score)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="hidden sm:block"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: getScoreColor(results.score) }}
              >
                {results.score}%
              </motion.span>
            </div>
          </div>

          {/* Score Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
              {getScoreLabel(results.score)}
            </h2>
            <p className="text-zero-text-muted text-sm sm:text-base mb-2">
              {results.scoreExplanation}
            </p>
            <p className="text-xs sm:text-sm text-zero-accent">
              💡 {getScoreAdvice(results.score)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs - Scrollable on mobile */}
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              activeTab === tab.id
                ? 'bg-zero-accent text-white'
                : 'bg-zero-surface text-zero-text-muted hover:bg-zero-surface-light'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="sm:hidden">{tab.mobileLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'analysis' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Strengths */}
            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                Points forts
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {results.strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                Points à améliorer
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {results.weaknesses.map((weakness, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{weakness}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CV Recommendations */}
            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-zero-accent" />
                Actions recommandées
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {results.cvRecommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-zero-surface-light/50"
                  >
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zero-accent/20 text-zero-accent text-xs sm:text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm sm:text-base">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'letter' && (
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-display text-base sm:text-lg font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-zero-accent" />
                Lettre de motivation
              </h3>
              <button
                onClick={() => copyToClipboard(results.coverLetter)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg sm:rounded-xl bg-zero-surface-light hover:bg-zero-accent/20 transition-colors w-full sm:w-auto"
              >
                {copiedLetter ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm sm:text-base">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Copier le texte</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-zero-darker rounded-lg sm:rounded-xl p-4 sm:p-6 whitespace-pre-wrap font-body leading-relaxed text-sm sm:text-base max-h-[60vh] overflow-y-auto">
              {results.coverLetter}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Préparation entretien
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {results.behaviorTips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-500/5 border border-blue-500/20"
                  >
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Conclusion */}
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zero-accent/10 to-purple-500/10 border border-zero-accent/30">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <Target className="w-4 h-4 text-zero-accent" />
                Verdict final
              </h4>
              <p className="text-zero-text-muted text-sm sm:text-base">{results.conclusion}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
