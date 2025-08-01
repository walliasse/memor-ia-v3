-- Supprimer la contrainte d'unicité sur user_id et date
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer la contrainte d'unicité
ALTER TABLE memories DROP CONSTRAINT IF EXISTS memories_user_id_date_key;

-- Vérifier que la contrainte a été supprimée
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE' 
    AND tc.table_name = 'memories'; 