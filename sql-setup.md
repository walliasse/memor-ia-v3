# 🗄️ Setup des tables Supabase

## SQL à exécuter dans Supabase

Allez dans votre projet Supabase > **SQL Editor** > **New Query**, puis copiez-collez ce SQL :

```sql
-- Table des profils utilisateur (compatible import v1)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    bio TEXT,
    -- Champs additionnels pour compatibilité v1
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    favorite1 TEXT,
    favorite2 TEXT,
    favorite3 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des souvenirs (compatible import v1)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    image_url TEXT,
    -- Champs additionnels pour compatibilité v1
    embedding VECTOR(1536), -- Support des embeddings OpenAI
    tags TEXT[], -- Support des tags
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sécurité RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politique : les utilisateurs peuvent voir leurs propres souvenirs
CREATE POLICY "Users can view own memories" ON public.memories
    FOR SELECT USING (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent créer leurs propres souvenirs  
CREATE POLICY "Users can insert own memories" ON public.memories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent modifier leurs propres souvenirs
CREATE POLICY "Users can update own memories" ON public.memories
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent supprimer leurs propres souvenirs
CREATE POLICY "Users can delete own memories" ON public.memories
    FOR DELETE USING (auth.uid() = user_id);

-- NOUVELLE POLITIQUE POUR L'INSERTION DES PROFILS
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- AJOUT DE LA COLONNE v1_id POUR LA MIGRATION
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS v1_id BIGINT UNIQUE;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS memories_user_date_idx 
    ON public.memories(user_id, date DESC);

-- Index pour les embeddings (décommentez si pgvector est installé)
-- CREATE INDEX IF NOT EXISTS memories_embedding_idx 
--     ON public.memories USING ivfflat (embedding vector_cosine_ops);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_memories_modtime
    BEFORE UPDATE ON public.memories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
```

## Après avoir exécuté le SQL

1. **Vérifiez dans Table Editor** que vous avez une table `memories`
2. **Testez l'app** : créez un souvenir pour voir si ça fonctionne
3. **Vérifiez dans la table** que le souvenir est bien sauvegardé

## En cas d'erreur

- Si "auth.users not found" : activez l'authentification dans Authentication > Settings
- Si "permission denied" : vérifiez que RLS est bien activé
- Si "function not found" : Supabase devrait avoir les fonctions par défaut

---

Une fois que c'est fait, l'app devrait être **100% fonctionnelle** ! 🎉 