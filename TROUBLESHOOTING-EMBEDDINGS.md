# Guide de dépannage - Problèmes d'embeddings

## Problème identifié

Les embeddings stockés dans votre base de données ne sont pas au bon format. Au lieu d'être des vecteurs PostgreSQL, ils sont stockés comme des chaînes JSON très longues (environ 19000 caractères).

## Symptômes

- Erreurs dans la console : `Memory X has invalid embedding: {hasEmbedding: true, isArray: false, length: 19192, expectedLength: 1536}`
- Recherche non pertinente avec des scores de similarité à 0
- Mêmes résultats retournés peu importe la requête

## Solution

### Étape 1 : Nettoyer les embeddings existants

1. Allez dans votre dashboard Supabase
2. Ouvrez l'éditeur SQL
3. Exécutez le script `clean_embeddings.sql` :

```sql
-- Nettoyer tous les embeddings
UPDATE memories 
SET embedding = NULL 
WHERE embedding IS NOT NULL;
```

### Étape 2 : Réindexer tous les souvenirs

1. Dans votre application, allez dans **Réglages**
2. Cliquez sur **"Nettoyer et réindexer"**
3. Attendez que le processus se termine

### Étape 3 : Vérifier que ça fonctionne

1. Testez la recherche Travel avec différentes requêtes
2. Vérifiez que les scores de similarité ne sont plus à 0
3. Vérifiez que les résultats sont pertinents

## Corrections apportées au code

### 1. Format de stockage des embeddings

Les embeddings sont maintenant stockés au format PostgreSQL vector :
```typescript
// Avant (incorrect)
embedding: embedding

// Après (correct)
embedding: embedding ? `[${embedding.join(',')}]` : null
```

### 2. Parsing des embeddings dans la recherche

Le service de recherche vectorielle peut maintenant traiter les embeddings stockés :
```typescript
// Parser l'embedding depuis la chaîne JSON stockée
let memoryEmbedding: number[]
try {
  if (typeof memory.embedding === 'string') {
    memoryEmbedding = JSON.parse(memory.embedding)
  } else if (Array.isArray(memory.embedding)) {
    memoryEmbedding = memory.embedding
  }
} catch (parseError) {
  // Gérer l'erreur
}
```

### 3. Bouton de nettoyage et réindexation

Ajout d'un bouton dans les réglages pour nettoyer et réindexer tous les souvenirs.

## Prévention

Pour éviter ce problème à l'avenir :

1. Toujours utiliser le format `[${embedding.join(',')}]` pour stocker les embeddings
2. Vérifier que les embeddings sont bien des tableaux de nombres avant de les stocker
3. Tester la recherche après chaque modification

## Vérification

Pour vérifier que les embeddings sont corrects :

```sql
-- Vérifier le format des embeddings
SELECT 
  id,
  CASE 
    WHEN embedding IS NULL THEN 'NULL'
    WHEN jsonb_typeof(embedding::jsonb) = 'array' THEN 'ARRAY'
    ELSE 'INVALID'
  END as embedding_type,
  CASE 
    WHEN embedding IS NULL THEN 0
    WHEN jsonb_typeof(embedding::jsonb) = 'array' THEN jsonb_array_length(embedding::jsonb)
    ELSE length(embedding::text)
  END as embedding_length
FROM memories 
WHERE embedding IS NOT NULL
LIMIT 5;
```

Les embeddings corrects doivent avoir :
- `embedding_type` = 'ARRAY'
- `embedding_length` = 1536 