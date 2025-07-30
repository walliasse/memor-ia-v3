-- Script pour nettoyer les embeddings mal formatés
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Voir les embeddings problématiques
SELECT 
  id,
  content,
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
LIMIT 10;

-- 2. Nettoyer tous les embeddings (les remettre à NULL)
UPDATE memories 
SET embedding = NULL 
WHERE embedding IS NOT NULL;

-- 3. Vérifier que tous les embeddings sont NULL
SELECT 
  COUNT(*) as total_memories,
  COUNT(embedding) as memories_with_embedding,
  COUNT(*) - COUNT(embedding) as memories_without_embedding
FROM memories; 