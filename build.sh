#!/bin/bash

echo "🚀 Début du build Vercel..."

# Vérifier les variables d'environnement
echo "🔍 Vérification des variables d'environnement..."
if [ -z "$VITE_SUPABASE_URL" ]; then
  echo "❌ VITE_SUPABASE_URL manquante"
  exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ VITE_SUPABASE_ANON_KEY manquante"
  exit 1
fi

echo "✅ Variables d'environnement configurées"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
  echo "❌ Le dossier dist n'a pas été créé"
  exit 1
fi

# Vérifier que index.html existe
if [ ! -f "dist/index.html" ]; then
  echo "❌ Le fichier index.html n'a pas été créé"
  exit 1
fi

echo "✅ Build terminé avec succès"
echo "📁 Contenu du dossier dist:"
ls -la dist/ 