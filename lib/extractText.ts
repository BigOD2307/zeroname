import mammoth from 'mammoth'

// Import dynamique de pdf-parse pour éviter les problèmes avec Next.js
let pdf: any = null
async function getPdfParser() {
  if (!pdf) {
    pdf = (await import('pdf-parse')).default
  }
  return pdf
}

export type FileType = 'pdf' | 'doc' | 'image' | 'text' | 'unknown'

export function detectFileType(file: File): FileType {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return 'doc'
  if (type.startsWith('image/')) return 'image'
  if (type === 'text/plain' || name.endsWith('.txt')) return 'text'
  return 'unknown'
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParser = await getPdfParser()
    const data = await pdfParser(buffer)
    return data.text || ''
  } catch (error) {
    console.error('Erreur extraction PDF:', error)
    throw new Error('Impossible d\'extraire le texte du PDF')
  }
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error('Erreur extraction DOCX:', error)
    throw new Error('Impossible d\'extraire le texte du document Word')
  }
}

export async function extractTextFromFile(
  buffer: Buffer,
  fileType: FileType,
  mimeType: string
): Promise<string> {
  switch (fileType) {
    case 'pdf':
      return extractTextFromPDF(buffer)
    case 'doc':
      return extractTextFromDocx(buffer)
    case 'text':
      return buffer.toString('utf-8')
    case 'image':
      // Pour les images, on retourne null et on utilisera GPT Vision
      return '__IMAGE__'
    default:
      throw new Error('Format de fichier non supporté')
  }
}

export function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

