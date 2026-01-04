# Configuration Supabase pour Zeroname

## 🚀 Étapes rapides

### 1. Créer un compte Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Crée un compte (gratuit)
3. Crée un nouveau projet

### 2. Créer les tables

Dans l'éditeur SQL de Supabase, exécute ces requêtes :

```sql
-- Table des emails (lead magnet)
CREATE TABLE emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emails_email ON emails(email);
CREATE INDEX idx_emails_created_at ON emails(created_at);

-- Table des feedbacks (avis utilisateurs)
CREATE TABLE feedback (
  id BIGSERIAL PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
```

### 3. Configurer les permissions (Row Level Security)

Dans l'éditeur SQL :

```sql
-- Activer RLS
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion depuis l'API (service role)
-- Cette politique permet à l'API backend d'insérer des emails
CREATE POLICY "Allow service role inserts" ON emails
  FOR INSERT
  TO service_role
  WITH CHECK (true);
```

### 4. Récupérer les clés API

1. Va dans **Settings** > **API**
2. Copie :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pour le frontend)
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (pour le backend - garde-la secrète !)

### 5. Ajouter dans `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ton-anon-key-ici
SUPABASE_SERVICE_ROLE_KEY=ton-service-role-key-ici
```

### 6. Exporter les emails en CSV

Dans Supabase :
1. Va dans **Table Editor** > **emails**
2. Clique sur **Export** > **CSV**
3. Télécharge le fichier

Ou via SQL :
```sql
COPY emails TO '/tmp/emails.csv' WITH CSV HEADER;
```

## ✅ Vérification

Une fois configuré, les emails seront automatiquement enregistrés dans Supabase quand un utilisateur s'inscrit.

Tu peux vérifier dans **Table Editor** > **emails** que les nouveaux emails apparaissent.

