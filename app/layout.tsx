import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zeroname | Ton mentor RH automatisé',
  description: 'Analyse ton CV face à une offre d\'emploi précise. Obtiens des recommandations concrètes et une lettre de motivation personnalisée.',
  keywords: ['CV', 'emploi', 'candidature', 'lettre de motivation', 'recrutement', 'IA'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="noise">
        {children}
      </body>
    </html>
  )
}

