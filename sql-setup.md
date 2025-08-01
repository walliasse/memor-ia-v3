# Configuration Supabase pour memor.ia

## 1. Configuration de la base de données

### Tables principales

```sql
-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  birth_date DATE NOT NULL CHECK (birth_date <= CURRENT_DATE)
);

-- Table des souvenirs
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  image_url TEXT,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  v1_id BIGINT UNIQUE,
  CONSTRAINT memories_date_check CHECK (date <= CURRENT_DATE),
  CONSTRAINT memories_birth_date_check CHECK (
    date >= (SELECT birth_date FROM profiles WHERE id = user_id)
  )
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS memories_user_id_idx ON public.memories(user_id);
CREATE INDEX IF NOT EXISTS memories_date_idx ON public.memories(date);
CREATE INDEX IF NOT EXISTS memories_user_date_idx ON public.memories(user_id, date);
CREATE INDEX IF NOT EXISTS memories_embedding_idx ON public.memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### RLS (Row Level Security)

```sql
-- Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour memories
CREATE POLICY "Users can view own memories" ON public.memories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memories" ON public.memories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memories" ON public.memories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own memories" ON public.memories
  FOR DELETE USING (auth.uid() = user_id);
```

### Fonction pour la recherche vectorielle

```sql
-- Fonction pour la recherche vectorielle (optionnel)
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_filter uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  date date,
  location text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    memories.id,
    memories.content,
    memories.date,
    memories.location,
    1 - (memories.embedding <=> query_embedding) AS similarity
  FROM memories
  WHERE 
    memories.user_id = user_filter
    AND 1 - (memories.embedding <=> query_embedding) > match_threshold
  ORDER BY memories.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

## 2. Configuration du Storage

### Bucket pour les images

```sql
-- Créer le bucket pour les images de souvenirs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'memories',
  'memories',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Politiques RLS pour le storage
CREATE POLICY "Users can upload own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 3. Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
VITE_OPENAI_API_KEY=votre_clé_api_openai
```

## 4. Installation des dépendances

```bash
npm install @supabase/supabase-js
npm install openai
```

## 5. Migration des données existantes

Si vous avez des données existantes, vous devrez :

1. Ajouter la colonne birth_date aux profils existants
2. Mettre à jour les souvenirs qui pourraient avoir des dates invalides

```sql
-- Pour les profils existants sans date de naissance, définir une date par défaut
UPDATE profiles 
SET birth_date = '1990-01-01' 
WHERE birth_date IS NULL;

-- Supprimer les souvenirs avec des dates futures ou antérieures à la naissance
DELETE FROM memories 
WHERE date > CURRENT_DATE 
   OR date < (SELECT birth_date FROM profiles WHERE id = memories.user_id);
``` 