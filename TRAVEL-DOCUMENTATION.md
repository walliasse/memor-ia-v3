# 🚀 Travel - Documentation

## Vue d'ensemble

Travel est la fonctionnalité de recherche intelligente de memor.ia qui permet aux utilisateurs de retrouver leurs souvenirs en utilisant le langage naturel. Elle combine une approche hybride RAG (Retrieval-Augmented Generation) avec des embeddings OpenAI et un filtrage intelligent.

## 🏗️ Architecture

### Composants principaux

1. **Query Parser** (`src/lib/queryParser.ts`)
   - Analyse les requêtes en langage naturel
   - Extrait les filtres implicites (dates, lieux, activités, émotions)
   - Gère les mots flous et les saisons

2. **Embedding Service** (`src/lib/embeddingService.ts`)
   - Génère des embeddings via OpenAI
   - Calcule les similarités cosinus
   - Gère les erreurs et les fallbacks

3. **Vector Search Service** (`src/lib/vectorSearchService.ts`)
   - Effectue des recherches vectorielles dans Supabase
   - Combine filtres et recherche sémantique
   - Gère les fallbacks vers la recherche textuelle

4. **Travel Search Service** (`src/lib/travelSearchService.ts`)
   - Orchestre le pipeline complet
   - Fusionne les filtres et classe les résultats
   - Log les recherches pour l'analyse

5. **React Hook** (`src/hooks/useTravelSearch.ts`)
   - Interface React pour la recherche
   - Gère l'état et les erreurs
   - Fournit les actions utilisateur

### Base de données

```sql
-- Extension pgvector pour les embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Colonne embedding dans la table memories
ALTER TABLE memories ADD COLUMN embedding vector(1536);

-- Index pour la recherche vectorielle
CREATE INDEX memories_embedding_idx ON memories USING ivfflat (embedding vector_cosine_ops);

-- Fonction de recherche vectorielle
CREATE FUNCTION match_memories(query_embedding vector(1536), ...)
```

## 🔧 Configuration

### Variables d'environnement

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Migration de base de données

Exécutez le fichier SQL de migration :

```bash
# Dans Supabase Dashboard > SQL Editor
# Ou via Supabase CLI
supabase db push
```

## 📖 Utilisation

### Interface utilisateur

1. **Accéder à Travel** : Onglet "Naviguer" dans l'application
2. **Saisir une requête** : Utilisez le langage naturel
3. **Voir les résultats** : Souvenirs classés par pertinence
4. **Analyser la requête** : Visualisation des filtres extraits

### Exemples de requêtes

```
✅ Requêtes simples :
- "Mes moments de bonheur"
- "Souvenirs avec mes amis"
- "Voyages et découvertes"

✅ Requêtes avec filtres temporels :
- "Souvenirs d'été 2023"
- "Mes moments de joie en 2024"
- "Vacances de printemps"

✅ Requêtes avec lieux :
- "Souvenirs à Paris"
- "Moments dans le sud"
- "Voyages à l'étranger"

✅ Requêtes avec activités :
- "Restaurants et gastronomie"
- "Activités sportives"
- "Concerts et festivals"

✅ Requêtes avec émotions :
- "Moments de joie"
- "Souvenirs nostalgiques"
- "Expériences inspirantes"
```

### Indexation des souvenirs

Pour activer Travel, les souvenirs existants doivent être indexés :

1. **Automatique** : Les nouveaux souvenirs sont indexés automatiquement
2. **Manuel** : Via la page Réglages > Intelligence Artificielle > Indexer

## 🧠 Fonctionnement technique

### Pipeline de recherche

1. **Parsing de la requête**
   ```typescript
   const parsedQuery = parseQuery("Souvenirs d'été 2023 à Paris")
   // Résultat :
   {
     originalQuery: "Souvenirs d'été 2023 à Paris",
     filters: {
       dateRange: { start: "2023-06-21", end: "2023-09-22" },
       locations: ["paris", "île-de-france"],
       seasons: ["été"]
     },
     vectorQuery: "Souvenirs",
     confidence: 0.9
   }
   ```

2. **Génération d'embedding**
   ```typescript
   const embedding = await embeddingService.generateEmbedding("Souvenirs")
   // Retourne un vecteur de 1536 dimensions
   ```

3. **Recherche hybride**
   ```sql
   SELECT *, 1 - (embedding <=> $1) as similarity
   FROM memories
   WHERE user_id = $2
     AND date >= '2023-06-21' AND date <= '2023-09-22'
     AND (LOWER(location) LIKE '%paris%' OR LOWER(location) LIKE '%île-de-france%')
   ORDER BY similarity DESC
   LIMIT 10
   ```

4. **Classement des résultats**
   - Score de similarité vectorielle
   - Bonus pour les correspondances exactes
   - Tri par pertinence décroissante

### Gestion des erreurs

- **Fallback vectoriel** : Si le parsing échoue, recherche vectorielle simple
- **Fallback textuel** : Si les embeddings échouent, recherche textuelle
- **Logging** : Toutes les erreurs sont loggées pour l'analyse

## 🎯 Fonctionnalités avancées

### Mots flous

Le système reconnaît et étend automatiquement les expressions géographiques :

```typescript
const FUZZY_LOCATIONS = {
  'le sud': ['sud de la france', 'provence', 'languedoc', 'côte d\'azur'],
  'la montagne': ['alpes', 'pyrennées', 'massif central', 'jura'],
  'la mer': ['côte atlantique', 'côte méditerranéenne', 'bretagne', 'normandie']
}
```

### Gestion des saisons

Conversion automatique des saisons en plages de dates :

```typescript
const SEASON_KEYWORDS = {
  'été': { start: '06-21', end: '09-22' },
  'hiver': { start: '12-21', end: '03-20' }
}
```

### Analyse de requête

Affichage en temps réel des filtres extraits :

- 📅 Périodes détectées
- 📍 Lieux identifiés
- 🎯 Activités reconnues
- 😊 Émotions perçues

## 🔮 Évolution future (Approche 2)

L'architecture est préparée pour l'intégration d'un LLM :

### Interface standardisée

```typescript
interface ParsedQuery {
  originalQuery: string
  filters: QueryFilters
  vectorQuery: string
  confidence: number
}
```

### Remplacement du parser

Le module `queryParser.ts` peut être remplacé par un LLM :

```typescript
// Actuel : parsing basé sur des règles
const parsedQuery = parseQuery(query)

// Futur : parsing par LLM
const parsedQuery = await llmParseQuery(query)
```

### Self-Querying

Le LLM pourrait analyser la requête et générer directement la requête SQL :

```typescript
const sqlQuery = await llm.generateSQLQuery(userQuery, schema)
```

## 📊 Métriques et analytics

### Logs de recherche

Chaque recherche est loggée avec :

- Requête utilisateur
- Filtres extraits
- Temps de traitement
- Nombre de résultats
- Taux de succès

### Statistiques disponibles

- Nombre total de recherches
- Temps de traitement moyen
- Requêtes les plus populaires
- Taux de satisfaction

## 🛠️ Développement

### Structure des fichiers

```
src/
├── lib/
│   ├── queryParser.ts          # Parsing des requêtes
│   ├── embeddingService.ts     # Service OpenAI
│   ├── vectorSearchService.ts  # Recherche Supabase
│   ├── travelSearchService.ts  # Orchestration
│   └── types.ts               # Types TypeScript
├── hooks/
│   └── useTravelSearch.ts     # Hook React
└── pages/
    └── AiSearch.tsx           # Interface utilisateur
```

### Tests

```bash
# Tests unitaires (à implémenter)
npm test

# Tests d'intégration
npm run test:integration
```

### Déploiement

1. **Migration de base de données**
2. **Configuration des variables d'environnement**
3. **Indexation des souvenirs existants**
4. **Tests de fonctionnalité**

## 🚨 Dépannage

### Problèmes courants

1. **Erreur "OpenAI API key required"**
   - Vérifiez `VITE_OPENAI_API_KEY` dans les variables d'environnement

2. **Aucun résultat trouvé**
   - Vérifiez que les souvenirs sont indexés
   - Essayez une requête plus simple

3. **Erreur de recherche vectorielle**
   - Vérifiez que l'extension pgvector est activée
   - Vérifiez les permissions RLS

4. **Temps de réponse lent**
   - Vérifiez la taille des embeddings
   - Optimisez les index de base de données

### Logs de débogage

Activez les logs détaillés :

```typescript
// Dans travelSearchService.ts
console.log('Query analysis:', parsedQuery)
console.log('Search results:', results)
```

## 📚 Ressources

- [Documentation OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Documentation Supabase pgvector](https://supabase.com/docs/guides/ai/vector-embeddings)
- [Guide RAG](https://python.langchain.com/docs/use_cases/question_answering/)

---

**Version** : 1.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe memor.ia 