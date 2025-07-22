# 🗄️ Setup des tables Supabase

## SQL à exécuter dans Supabase

Allez dans votre projet Supabase > **SQL Editor** > **New Query**, puis copiez-collez ce SQL :

```sql
-- Table des profils utilisateur
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des souvenirs
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    image_url TEXT,
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS memories_user_date_idx 
    ON public.memories(user_id, date DESC);
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