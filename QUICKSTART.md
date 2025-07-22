# 🚀 Test rapide Supabase

## Étape 1: Configuration

1. **Créer un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet (nom libre, mot de passe libre)
   - Attendez quelques minutes que ça se créé

2. **Récupérer les clés** :
   - Dans votre projet > Settings > API
   - Copiez "Project URL" et "anon public"

3. **Configurer l'app** :
   - Copiez le fichier d'exemple : `cp .env.example .env`
   - Éditez `.env` avec vos vraies clés :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_clé_anon
   ```
   
   ⚠️ **Sécurité** : Le fichier `.env` ne sera jamais commité (protégé par .gitignore)

## Étape 2: Test

1. **Lancer l'app** :
   ```bash
   npm run dev
   ```

2. **Vérifier** :
   - L'app se lance sans erreur
   - En bas à droite, vous voyez "Auth: Non connecté"
   - Pas d'erreur dans la console

## Étape 3: Créer les tables (plus tard)

Une fois que l'app fonctionne, on créera les tables dans Supabase pour stocker les souvenirs.

## En cas de problème

- Vérifiez que vos clés Supabase sont bonnes
- Vérifiez que le fichier `.env` est bien à la racine
- Redémarrez `npm run dev` après avoir créé le `.env`

---

Une fois que cette étape fonctionne, on peut connecter les boutons ! 🎉 