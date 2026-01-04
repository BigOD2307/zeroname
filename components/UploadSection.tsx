'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Image, X, Sparkles, AlertCircle, FileType, Camera } from 'lucide-react'

interface UploadSectionProps {
  onAnalyze: (cv: File, jobDescription: File | string) => void
  isAnalyzing: boolean
  error: string | null
  remainingUses: number
}

type FileWithPreview = {
  file: File
  type: 'pdf' | 'doc' | 'image' | 'other'
  name: string
}

export default function UploadSection({ onAnalyze, isAnalyzing, error, remainingUses }: UploadSectionProps) {
  const [cvFile, setCvFile] = useState<FileWithPreview | null>(null)
  const [jobFile, setJobFile] = useState<FileWithPreview | null>(null)
  const [jobText, setJobText] = useState('')
  const [useTextInput, setUseTextInput] = useState(true) // Default to text on mobile
  const [dragOverCv, setDragOverCv] = useState(false)
  const [dragOverJob, setDragOverJob] = useState(false)

  const cvInputRef = useRef<HTMLInputElement>(null)
  const jobInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (file: File): 'pdf' | 'doc' | 'image' | 'other' => {
    const type = file.type.toLowerCase()
    const name = file.name.toLowerCase()
    
    if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
    if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return 'doc'
    if (type.startsWith('image/')) return 'image'
    return 'other'
  }

  const handleFileSelect = useCallback((
    file: File,
    setter: (f: FileWithPreview | null) => void
  ) => {
    const fileType = getFileType(file)
    setter({
      file,
      type: fileType,
      name: file.name
    })
  }, [])

  const handleDrop = useCallback((
    e: React.DragEvent,
    setter: (f: FileWithPreview | null) => void,
    setDragOver: (v: boolean) => void
  ) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file, setter)
  }, [handleFileSelect])

  const handleSubmit = () => {
    if (!cvFile) return
    if (!jobFile && !jobText.trim()) return
    
    onAnalyze(cvFile.file, jobFile ? jobFile.file : jobText)
  }

  const FileTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
      case 'doc': return <FileType className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
      case 'image': return <Image className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
      default: return <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-zero-text-muted" />
    }
  }

  const truncateFileName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name
    const ext = name.split('.').pop()
    const baseName = name.slice(0, maxLength - 3 - (ext?.length || 0))
    return `${baseName}...${ext}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4"
    >
      {/* Title */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
        >
          Analyse ta candidature
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zero-text-muted text-sm sm:text-base md:text-lg"
        >
          Upload ton CV et l'offre d'emploi
        </motion.p>
      </div>

      {/* Upload zones - Stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* CV Upload */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-xs sm:text-sm font-medium text-zero-text-muted mb-2">
            📄 Ton CV
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOverCv(true) }}
            onDragLeave={() => setDragOverCv(false)}
            onDrop={(e) => handleDrop(e, setCvFile, setDragOverCv)}
            onClick={() => cvInputRef.current?.click()}
            className={`upload-zone rounded-xl sm:rounded-2xl p-4 sm:p-8 cursor-pointer transition-all min-h-[140px] sm:min-h-[200px] flex flex-col items-center justify-center ${
              dragOverCv ? 'drag-over' : ''
            } ${cvFile ? 'border-green-500/50 bg-green-500/5' : ''}`}
          >
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file, setCvFile)
              }}
            />
            {cvFile ? (
              <div className="text-center">
                <FileTypeIcon type={cvFile.type} />
                <p className="mt-2 sm:mt-3 font-medium text-sm sm:text-base">{truncateFileName(cvFile.name)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setCvFile(null) }}
                  className="mt-2 text-xs sm:text-sm text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" /> Supprimer
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-3 mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-zero-text-muted" />
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-zero-text-muted sm:hidden" />
                </div>
                <p className="text-center">
                  <span className="text-zero-accent font-medium text-sm sm:text-base">
                    Importer ou prendre en photo
                  </span>
                </p>
                <p className="text-xs text-zero-text-muted mt-2">
                  PDF, Word, ou Image
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-zero-text-muted">
              💼 L'offre d'emploi
            </label>
            <button
              onClick={() => setUseTextInput(!useTextInput)}
              className="text-xs text-zero-accent hover:text-zero-accent-light transition-colors"
            >
              {useTextInput ? '📁 Fichier' : '📝 Texte'}
            </button>
          </div>
          
          {useTextInput ? (
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Colle ici le texte de l'offre d'emploi..."
              className="w-full h-[140px] sm:h-[200px] p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zero-surface border border-zero-surface-light focus:border-zero-accent focus:outline-none transition-colors resize-none text-sm sm:text-base"
            />
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOverJob(true) }}
              onDragLeave={() => setDragOverJob(false)}
              onDrop={(e) => handleDrop(e, setJobFile, setDragOverJob)}
              onClick={() => jobInputRef.current?.click()}
              className={`upload-zone rounded-xl sm:rounded-2xl p-4 sm:p-8 cursor-pointer transition-all min-h-[140px] sm:min-h-[200px] flex flex-col items-center justify-center ${
                dragOverJob ? 'drag-over' : ''
              } ${jobFile ? 'border-green-500/50 bg-green-500/5' : ''}`}
            >
              <input
                ref={jobInputRef}
                type="file"
                accept=".pdf,.doc,.docx,image/*,.txt"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file, setJobFile)
                }}
              />
              {jobFile ? (
                <div className="text-center">
                  <FileTypeIcon type={jobFile.type} />
                  <p className="mt-2 sm:mt-3 font-medium text-sm sm:text-base">{truncateFileName(jobFile.name)}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setJobFile(null) }}
                    className="mt-2 text-xs sm:text-sm text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" /> Supprimer
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-3 mb-3 sm:mb-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-zero-text-muted" />
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-zero-text-muted sm:hidden" />
                  </div>
                  <p className="text-center">
                    <span className="text-zero-accent font-medium text-sm sm:text-base">
                      Importer ou photographier
                    </span>
                  </p>
                  <p className="text-xs text-zero-text-muted mt-2">
                    PDF, Word, Image, ou Texte
                  </p>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4 sm:mb-6"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base">{error}</p>
        </motion.div>
      )}

      {/* Submit button - Full width on mobile */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button
          onClick={handleSubmit}
          disabled={!cvFile || (!jobFile && !jobText.trim()) || isAnalyzing}
          className="w-full sm:w-auto btn-primary px-6 sm:px-8 py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg inline-flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Analyser ma candidature</span>
            </>
          )}
        </button>
        <p className="text-zero-text-muted text-xs sm:text-sm mt-3 sm:mt-4">
          {remainingUses} analyse{remainingUses > 1 ? 's' : ''} restante{remainingUses > 1 ? 's' : ''}
        </p>
      </motion.div>
    </motion.div>
  )
}
