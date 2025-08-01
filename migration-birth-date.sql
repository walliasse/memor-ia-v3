-- Migration pour ajouter la date de naissance et les contraintes temporelles
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter la colonne birth_date à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- 2. Mettre à jour les profils existants avec une date par défaut
UPDATE public.profiles 
SET birth_date = '1990-01-01' 
WHERE birth_date IS NULL;

-- 3. Rendre la colonne birth_date obligatoire
ALTER TABLE public.profiles 
ALTER COLUMN birth_date SET NOT NULL;

-- 4. Ajouter une contrainte pour empêcher les dates futures dans profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_birth_date_check 
CHECK (birth_date <= CURRENT_DATE);

-- 5. Ajouter une contrainte pour empêcher les souvenirs dans le futur
ALTER TABLE public.memories 
ADD CONSTRAINT memories_date_check 
CHECK (date <= CURRENT_DATE);

-- 6. Créer une fonction pour vérifier la validité des dates de souvenirs
CREATE OR REPLACE FUNCTION check_memory_date_validity()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que la date du souvenir n'est pas avant la date de naissance de l'utilisateur
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = NEW.user_id 
    AND NEW.date < birth_date
  ) THEN
    RAISE EXCEPTION 'La date du souvenir ne peut pas être antérieure à votre date de naissance';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer un trigger pour vérifier la validité des dates
DROP TRIGGER IF EXISTS check_memory_date_trigger ON public.memories;
CREATE TRIGGER check_memory_date_trigger
  BEFORE INSERT OR UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION check_memory_date_validity();

-- 8. Nettoyer les souvenirs invalides existants (optionnel - à exécuter avec précaution)
-- DELETE FROM public.memories 
-- WHERE date > CURRENT_DATE 
--    OR EXISTS (
--      SELECT 1 FROM profiles 
--      WHERE id = memories.user_id 
--      AND memories.date < birth_date
--    );

-- 9. Vérifier que tout fonctionne
SELECT 
  'Profils avec date de naissance:' as info,
  COUNT(*) as count
FROM public.profiles 
WHERE birth_date IS NOT NULL;

SELECT 
  'Souvenirs valides:' as info,
  COUNT(*) as count
FROM public.memories 
WHERE date <= CURRENT_DATE;

-- 10. Vérifier les souvenirs potentiellement invalides
SELECT 
  'Souvenirs potentiellement invalides:' as info,
  COUNT(*) as count
FROM public.memories m
JOIN public.profiles p ON m.user_id = p.id
WHERE m.date < p.birth_date; 