# 🚀 Travel - Guide de déploiement

## Qu'est-ce que Travel ?

Travel est la fonctionnalité de recherche intelligente de memor.ia qui permet de retrouver ses souvenirs en langage naturel. Elle utilise des embeddings OpenAI et une recherche vectorielle pour comprendre le contexte de vos requêtes.

## 🚀 Déploiement rapide

### 1. Configuration des variables d'environnement

Ajoutez votre clé OpenAI dans `.env` :

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Migration de la base de données

Exécutez la migration SQL dans votre projet Supabase :

```sql
-- Copiez et exécutez le contenu de supabase/migrations/20241201_add_vector_search.sql
-- Ou utilisez la commande :
supabase db push
```

### 3. Indexation des souvenirs existants

1. Connectez-vous à l'application
2. Allez dans **Réglages** > **Intelligence Artificielle**
3. Cliquez sur **Indexer** pour traiter vos souvenirs existants

## 🎯 Utilisation

### Interface utilisateur

1. **Accédez à Travel** via l'onglet "Naviguer"
2. **Saisissez votre requête** en langage naturel
3. **Visualisez les résultats** classés par pertinence
4. **Analysez votre requête** avec les filtres détectés

### Exemples de requêtes

```
✅ Recherches simples :
"Mes moments de bonheur"
"Souvenirs avec mes amis"
"Voyages et découvertes"

✅ Avec filtres temporels :
"Souvenirs d'été 2023"
"Mes moments de joie en 2024"
"Vacances de printemps"

✅ Avec lieux :
"Souvenirs à Paris"
"Moments dans le sud"
"Voyages à l'étranger"

✅ Avec activités :
"Restaurants et gastronomie"
"Activités sportives"
"Concerts et festivals"

✅ Avec émotions :
"Moments de joie"
"Souvenirs nostalgiques"
"Expériences inspirantes"
```

## 🔧 Configuration avancée

### Variables d'environnement complètes

```env
# OpenAI
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Modèle d'embedding

Par défaut, Travel utilise `text-embedding-3-small`. Pour changer :

```typescript
// Dans src/lib/embeddingService.ts
const DEFAULT_MODEL = 'text-embedding-3-large' // ou autre modèle
```

### Seuil de similarité

Ajustez le seuil de correspondance :

```typescript
// Dans src/lib/vectorSearchService.ts
const { data, error } = await supabase.rpc('match_memories', {
  query_embedding: queryEmbedding,
  match_threshold: 0.8, // Augmentez pour plus de précision
  match_count: limit,
  user_id: userId
})
```

## 🧠 Fonctionnalités techniques

### Parsing intelligent

Travel analyse automatiquement vos requêtes pour extraire :

- **📅 Périodes** : "été 2023" → 21 juin au 22 septembre 2023
- **📍 Lieux** : "le sud" → Provence, Languedoc, Côte d'Azur
- **🎯 Activités** : "restaurant" → recherche dans le contenu
- **😊 Émotions** : "joie" → recherche sémantique

### Recherche hybride

1. **Parsing** de la requête en langage naturel
2. **Génération** d'embedding via OpenAI
3. **Recherche** vectorielle dans Supabase
4. **Filtrage** par métadonnées (date, lieu)
5. **Classement** par pertinence

### Fallbacks robustes

- Si le parsing échoue → recherche vectorielle simple
- Si les embeddings échouent → recherche textuelle
- Logging complet pour le débogage

## 📊 Monitoring et analytics

### Logs de recherche

Chaque recherche est loggée avec :

```typescript
{
  userId: "user-id",
  query: "Souvenirs d'été 2023",
  parsedQuery: { filters: {...}, confidence: 0.9 },
  resultsCount: 5,
  processingTime: 1200,
  success: true
}
```

### Métriques disponibles

- Nombre total de recherches
- Temps de traitement moyen
- Requêtes les plus populaires
- Taux de succès

## 🚨 Dépannage

### Problèmes courants

#### 1. "OpenAI API key required"
```bash
# Vérifiez votre clé dans .env
VITE_OPENAI_API_KEY=sk-your-key-here
```

#### 2. Aucun résultat trouvé
- Vérifiez que vos souvenirs sont indexés
- Essayez une requête plus simple
- Vérifiez les permissions RLS

#### 3. Erreur de recherche vectorielle
```sql
-- Vérifiez que pgvector est activé
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Vérifiez les permissions
SELECT * FROM memories WHERE user_id = 'your-user-id' LIMIT 1;
```

#### 4. Temps de réponse lent
- Optimisez les index de base de données
- Vérifiez la taille des embeddings
- Considérez l'utilisation d'un cache

### Logs de débogage

Activez les logs détaillés :

```typescript
// Dans la console du navigateur
localStorage.setItem('debug', 'travel:*')
```

## 🔮 Évolution future

### Approche 2 - LLM Integration

L'architecture est préparée pour l'intégration d'un LLM :

```typescript
// Remplacement du parser actuel
const parsedQuery = await llmParseQuery(userQuery)

// Self-querying
const sqlQuery = await llm.generateSQLQuery(userQuery, schema)
```

### Fonctionnalités prévues

- [ ] Analyse de sentiment avancée
- [ ] Suggestions de requêtes intelligentes
- [ ] Recherche par similarité d'images
- [ ] Export des résultats de recherche
- [ ] Partage de recherches

## 📚 Ressources

- [Documentation complète](./TRAVEL-DOCUMENTATION.md)
- [Guide de migration](./IMPORT-V1.md)
- [Architecture technique](./ARCHITECTURE.md)

## 🤝 Support

Pour toute question ou problème :

1. Consultez la [documentation complète](./TRAVEL-DOCUMENTATION.md)
2. Vérifiez les [logs de débogage](#logs-de-débogage)
3. Ouvrez une issue sur GitHub

---

**Version** : 1.0  
**Dernière mise à jour** : Décembre 2024  
**Compatibilité** : memor.ia v3+ 