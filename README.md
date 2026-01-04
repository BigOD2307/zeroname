# Zeroname

> Ton mentor RH automatisé - Analyse ton CV face à n'importe quelle offre d'emploi

## 🎯 Description

Zeroname est un outil gratuit qui analyse ta candidature avant de l'envoyer. Il te donne :
- Un **score de compatibilité** précis entre ton CV et l'offre
- Des **recommandations concrètes** pour améliorer ton CV
- Une **lettre de motivation personnalisée** prête à envoyer
- Des **conseils comportementaux** pour l'entretien

## 🚀 Fonctionnalités

- Upload de CV (PDF, Word, Image)
- Upload d'offre d'emploi (PDF, Word, Image, Texte)
- Analyse IA avec GPT-4.1 / GPT-5.2
- Vision AI pour les images (CV ou offres en screenshot)
- Système de lead magnet (email à la première visite)
- Limite de 3 analyses gratuites par utilisateur
- Stockage des emails dans Google Sheets

## 🛠 Stack technique

- **Frontend** : Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend** : Next.js API Routes
- **IA** : OpenAI GPT-4.1/5.2 (avec Vision)
- **Extraction de texte** : pdf-parse, mammoth
- **Stockage emails** : Google Sheets API

## 📦 Installation

```bash
# Cloner le repo
cd ZeroName

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Configurer les variables dans .env.local
# - OPENAI_API_KEY
# - GOOGLE_SERVICE_ACCOUNT_EMAIL (optionnel)
# - GOOGLE_PRIVATE_KEY (optionnel)
# - GOOGLE_SHEET_ID (optionnel)

# Lancer en développement
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `OPENAI_API_KEY` | Clé API OpenAI | ✅ Oui |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email du service account Google | ❌ Non |
| `GOOGLE_PRIVATE_KEY` | Clé privée du service account | ❌ Non |
| `GOOGLE_SHEET_ID` | ID de la feuille Google Sheets | ❌ Non |

### Configuration Google Sheets (optionnel)

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activer l'API Google Sheets
3. Créer un Service Account
4. Télécharger le fichier JSON des credentials
5. Partager ta Google Sheet avec l'email du service account
6. Copier les valeurs dans `.env.local`

Si Google Sheets n'est pas configuré, les emails seront simplement loggés en console.

## 🎨 Personnalisation

- Couleurs : `tailwind.config.js` (palette `zero`)
- Fonts : Clash Display (titres) et Satoshi (corps)
- Animations : Framer Motion

## 📁 Structure du projet

```
ZeroName/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # API analyse CV
│   │   └── save-email/route.ts   # API stockage email
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnalysisResults.tsx
│   ├── EmailCapture.tsx
│   ├── Header.tsx
│   ├── LimitReached.tsx
│   └── UploadSection.tsx
├── lib/
│   ├── aiAnalyzer.ts             # Intégration OpenAI
│   └── extractText.ts            # Extraction PDF/DOCX
└── README.md
```

## 🚀 Déploiement

Déployer sur Vercel :

```bash
npm install -g vercel
vercel
```

N'oublie pas de configurer les variables d'environnement sur Vercel.

## 📄 Licence

MIT

