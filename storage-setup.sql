-- Configuration du bucket de storage pour les images des souvenirs
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer le bucket 'memories' pour stocker les images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'memories',
  'memories',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Politique RLS pour permettre aux utilisateurs de voir leurs propres images
CREATE POLICY "Users can view their own memory images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'memories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique RLS pour permettre aux utilisateurs d'uploader leurs propres images
CREATE POLICY "Users can upload their own memory images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'memories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique RLS pour permettre aux utilisateurs de mettre à jour leurs propres images
CREATE POLICY "Users can update their own memory images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'memories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique RLS pour permettre aux utilisateurs de supprimer leurs propres images
CREATE POLICY "Users can delete their own memory images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'memories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
); 