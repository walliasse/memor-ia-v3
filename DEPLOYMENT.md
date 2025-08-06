# Guide de Déploiement Memor.ia

## 🚀 Déploiement sur Vercel

### 1. Variables d'environnement requises

Configurez ces variables dans votre projet Vercel (Settings → Environment Variables) :

#### Variables obligatoires :
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Variables optionnelles (pour l'IA) :
```bash
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Configuration Vercel

Le fichier `vercel.json` est déjà configuré avec :
- Build command : `npm run build`
- Output directory : `dist`
- Framework : `vite`
- Routes SPA (Single Page Application)

### 3. Étapes de déploiement

1. **Poussez votre code sur GitHub**
2. **Connectez votre repo à Vercel**
3. **Configurez les variables d'environnement**
4. **Déployez**

### 4. Diagnostic des problèmes

#### Écran blanc sur Vercel

Si vous avez un écran blanc, vérifiez :

1. **Console du navigateur** (F12) pour les erreurs JavaScript
2. **Logs Vercel** dans le dashboard
3. **Variables d'environnement** configurées
4. **Configuration Supabase** valide

#### Debug en production

Appuyez sur `Ctrl+Shift+D` pour afficher les informations de debug.

### 5. Vérification du déploiement

1. **Testez l'authentification**
2. **Vérifiez la connexion Supabase**
3. **Testez l'IA** (si configurée)
4. **Vérifiez les fonctionnalités principales**

### 6. Problèmes courants

#### Variables d'environnement manquantes
- Erreur : "Variables d'environnement manquantes"
- Solution : Configurez toutes les variables dans Vercel

#### Erreur Supabase
- Erreur : "Configuration Supabase manquante"
- Solution : Vérifiez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

#### Erreur OpenAI
- Erreur : "OpenAI API key is required"
- Solution : Configurez `VITE_OPENAI_API_KEY` dans Vercel

### 7. Support

Si le problème persiste :
1. Vérifiez les logs Vercel
2. Testez en local avec `npm run build && npm run preview`
3. Comparez les variables d'environnement local vs production 