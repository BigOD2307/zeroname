import { NextRequest, NextResponse } from 'next/server'
import { detectFileType, extractTextFromFile, bufferToBase64, type FileType } from '@/lib/extractText'
import { analyzeWithText, analyzeWithVision, analyzeWithBothImages } from '@/lib/aiAnalyzer'

export const maxDuration = 60 // Timeout de 60 secondes pour Vercel
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  // Logger pour debug
  console.log('📥 Requête reçue pour analyse')
  
  try {
    const formData = await request.formData()
    console.log('✅ FormData parsé')
    
    // Récupérer le CV
    const cvFile = formData.get('cv') as File | null
    if (!cvFile) {
      return NextResponse.json(
        { error: 'CV requis' },
        { status: 400 }
      )
    }

    // Récupérer l'offre d'emploi (fichier ou texte)
    const jobFile = formData.get('jobDescription') as File | null
    const jobText = formData.get('jobDescriptionText') as string | null

    if (!jobFile && !jobText) {
      return NextResponse.json(
        { error: 'Offre d\'emploi requise' },
        { status: 400 }
      )
    }

    // Traiter le CV
    let cvContent: string
    let cvIsImage = false

    try {
      console.log('📄 Traitement du CV:', cvFile.name, cvFile.type)
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer())
      const cvFileType = detectFileType(cvFile)
      console.log('📄 Type détecté:', cvFileType)

      if (cvFileType === 'image') {
        cvContent = bufferToBase64(cvBuffer, cvFile.type)
        cvIsImage = true
      } else if (cvFileType === 'unknown') {
        return NextResponse.json(
          { error: 'Format de CV non supporté. Utilisez PDF, Word ou une image.' },
          { status: 400 }
        )
      } else {
        console.log('📄 Extraction du texte du CV...')
        cvContent = await extractTextFromFile(cvBuffer, cvFileType, cvFile.type)
        console.log('📄 Texte extrait, longueur:', cvContent.length)
        if (cvContent === '__IMAGE__') {
          cvContent = bufferToBase64(cvBuffer, cvFile.type)
          cvIsImage = true
        }
        // Vérifier que l'extraction a fonctionné
        if (!cvIsImage && (!cvContent || cvContent.trim().length < 10)) {
          console.error('❌ Texte CV trop court ou vide')
          return NextResponse.json(
            { error: 'Impossible d\'extraire le texte du CV. Vérifiez que le fichier n\'est pas corrompu.' },
            { status: 400 }
          )
        }
      }
    } catch (error) {
      console.error('Erreur extraction CV:', error)
      return NextResponse.json(
        { error: 'Erreur lors du traitement du CV. Vérifiez le format du fichier.' },
        { status: 400 }
      )
    }

    // Traiter l'offre d'emploi
    let jobContent: string
    let jobIsImage = false

    if (jobFile) {
      try {
        const jobBuffer = Buffer.from(await jobFile.arrayBuffer())
        const jobFileType = detectFileType(jobFile)
        
        if (jobFileType === 'image') {
          jobContent = bufferToBase64(jobBuffer, jobFile.type)
          jobIsImage = true
        } else if (jobFileType === 'unknown') {
          return NextResponse.json(
            { error: 'Format d\'offre d\'emploi non supporté. Utilisez PDF, Word, image ou texte.' },
            { status: 400 }
          )
        } else {
          jobContent = await extractTextFromFile(jobBuffer, jobFileType, jobFile.type)
          if (jobContent === '__IMAGE__') {
            jobContent = bufferToBase64(jobBuffer, jobFile.type)
            jobIsImage = true
          }
          // Vérifier que l'extraction a fonctionné
          if (!jobIsImage && (!jobContent || jobContent.trim().length < 10)) {
            return NextResponse.json(
              { error: 'Impossible d\'extraire le texte de l\'offre. Vérifiez que le fichier n\'est pas corrompu.' },
              { status: 400 }
            )
          }
        }
      } catch (error) {
        console.error('Erreur extraction offre:', error)
        return NextResponse.json(
          { error: 'Erreur lors du traitement de l\'offre d\'emploi. Vérifiez le format du fichier.' },
          { status: 400 }
        )
      }
    } else {
      jobContent = jobText!.trim()
      if (jobContent.length < 20) {
        return NextResponse.json(
          { error: 'L\'offre d\'emploi est trop courte. Fournissez plus de détails.' },
          { status: 400 }
        )
      }
    }

    // Vérifier que l'API OpenAI est configurée
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY non configurée')
      return NextResponse.json(
        { error: 'Configuration serveur manquante. Contactez le support.' },
        { status: 500 }
      )
    }

    // Analyser selon le type de contenu
    let result

    try {
      console.log('🤖 Démarrage de l\'analyse IA...')
      console.log('🤖 CV est image:', cvIsImage, 'Offre est image:', jobIsImage)
      
      if (cvIsImage && jobIsImage) {
        // Les deux sont des images
        result = await analyzeWithBothImages(cvContent, jobContent)
      } else if (cvIsImage) {
        // Seulement le CV est une image
        result = await analyzeWithVision(cvContent, jobContent)
      } else if (jobIsImage) {
        // Seulement l'offre est une image - on inverse la logique
        result = await analyzeWithVision(jobContent, cvContent)
      } else {
        // Les deux sont du texte
        result = await analyzeWithText(cvContent, jobContent)
      }

      // Valider que le résultat a la structure attendue
      if (!result || typeof result.score !== 'number') {
        console.error('❌ Réponse IA invalide:', result)
        throw new Error('Réponse IA invalide')
      }

      console.log('✅ Analyse terminée avec succès, score:', result.score)
      return NextResponse.json(result, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Erreur analyse IA:', error)
      
      if (error instanceof Error) {
        // Si c'est une erreur OpenAI
        if (error.message.includes('API key') || error.message.includes('authentication')) {
          return NextResponse.json(
            { error: 'Erreur d\'authentification avec l\'IA. Vérifiez la configuration.' },
            { status: 500 }
          )
        }
        if (error.message.includes('rate limit') || error.message.includes('quota')) {
          return NextResponse.json(
            { error: 'Limite d\'utilisation atteinte. Réessayez plus tard.' },
            { status: 429 }
          )
        }
      }
      
      return NextResponse.json(
        { error: 'Erreur lors de l\'analyse. Réessayez ou contactez le support.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Erreur générale analyse:', error)
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Une erreur inattendue est survenue'
    
    console.error('❌ Détails de l\'erreur:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return NextResponse.json(
      { error: errorMessage },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

