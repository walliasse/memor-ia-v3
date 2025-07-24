import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'
import type { ExportData, ImportProgress, ImportResult, SouvenirData, UserProfile } from '@/types/import'

export function useImport() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const validateExportData = (data: any): data is ExportData => {
    if (!data || typeof data !== 'object') return false
    if (!data.version || !data.exportDate || !data.userId || !data.tables) return false
    if (!data.tables.souvenirs || !Array.isArray(data.tables.souvenirs)) return false
    if (!data.tables.user_profiles || !Array.isArray(data.tables.user_profiles)) return false
    return true
  }

  const validateUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  const sanitizeString = (str: string | undefined): string | null => {
    if (!str || typeof str !== 'string') return null
    const trimmed = str.trim()
    return trimmed === '' ? null : trimmed
  }

  const convertSouvenirToV2 = (souvenir: SouvenirData): any => {
    // La v1 utilisait un ID numérique. On le stocke dans v1_id.
    // L'ID principal (UUID) sera généré par Supabase à l'insertion.
    return {
      user_id: souvenir.user_id,
      content: sanitizeString(souvenir.text_content) || '',
      date: souvenir.memory_date,
      location: null,
      image_url: sanitizeString(souvenir.photo_url),
      created_at: souvenir.created_at,
      updated_at: new Date().toISOString(),
      v1_id: souvenir.id, // Stocke l'ancien ID numérique
    }
  }

  const convertProfileToV2 = (profile: UserProfile): any => {
    return {
      id: profile.id,
      email: user?.email || '',
      name: [profile.first_name, profile.last_name].filter(Boolean).join(' ') || null,
      bio: null, // v1 n'avait pas de bio
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const importData = async (file: File): Promise<ImportResult> => {
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    setLoading(true)
    setProgress({
      step: 'Lecture du fichier...',
      progress: 0,
      total: 100,
      errors: [],
      completed: false
    })

    try {
      // Lire le fichier JSON
      const fileContent = await file.text()
      let exportData: ExportData

      try {
        exportData = JSON.parse(fileContent)
      } catch (error) {
        throw new Error('Fichier JSON invalide')
      }

      // Validation de base
      if (!validateExportData(exportData)) {
        throw new Error('Structure de données invalide')
      }

      // Vérification de sécurité
      if (exportData.userId !== user.id) {
        throw new Error('Ces données appartiennent à un autre utilisateur')
      }

      const errors: string[] = []
      let importedProfiles = 0
      let importedSouvenirs = 0
      let importedAIRequests = 0

      const totalItems = exportData.tables.user_profiles.length + 
                        exportData.tables.souvenirs.length + 
                        (exportData.tables.ai_requests?.length || 0)
      let processedItems = 0

      // Import des profils utilisateur
      setProgress({
        step: 'Import des profils utilisateur...',
        progress: Math.round((processedItems / totalItems) * 100),
        total: totalItems,
        errors: [...errors],
        completed: false
      })

      for (const profile of exportData.tables.user_profiles) {
        try {
          if (!validateUUID(profile.id)) {
            errors.push(`Profil ${profile.id}: UUID invalide`)
            continue
          }

          if (profile.id !== user.id) {
            errors.push(`Profil ${profile.id}: appartient à un autre utilisateur`)
            continue
          }

          const v2Profile = convertProfileToV2(profile)
          
          const { error } = await supabase
            .from('profiles')
            .upsert(v2Profile, { onConflict: 'id' })

          if (error) {
            errors.push(`Profil ${profile.id}: ${error.message}`)
          } else {
            importedProfiles++
          }
        } catch (error) {
          errors.push(`Profil ${profile.id}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
        }

        processedItems++
        setProgress({
          step: 'Import des profils utilisateur...',
          progress: Math.round((processedItems / totalItems) * 100),
          total: totalItems,
          errors: [...errors],
          completed: false
        })
      }

      // Import des souvenirs
      setProgress({
        step: 'Import des souvenirs...',
        progress: Math.round((processedItems / totalItems) * 100),
        total: totalItems,
        errors: [...errors],
        completed: false
      })

      for (const souvenir of exportData.tables.souvenirs) {
        try {
          // ON NE VALIDE PLUS L'ID ICI, CAR C'EST UN NOMBRE
          // if (!validateUUID(souvenir.id)) {
          //   errors.push(`Souvenir ${souvenir.id}: UUID invalide`)
          //   continue
          // }

          if (souvenir.user_id !== user.id) {
            errors.push(`Souvenir ${souvenir.id}: appartient à un autre utilisateur`)
            continue
          }

          if (!souvenir.text_content?.trim()) {
            errors.push(`Souvenir ${souvenir.id}: contenu vide`)
            continue
          }

          const v2Memory = convertSouvenirToV2(souvenir)
          
          const { error } = await supabase
            .from('memories')
            // On utilise onConflict sur v1_id pour éviter les doublons
            .upsert(v2Memory, { onConflict: 'v1_id' })

          if (error) {
            errors.push(`Souvenir ${souvenir.id}: ${error.message}`)
          } else {
            importedSouvenirs++
          }
        } catch (error) {
          errors.push(`Souvenir ${souvenir.id}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
        }

        processedItems++
        setProgress({
          step: 'Import des souvenirs...',
          progress: Math.round((processedItems / totalItems) * 100),
          total: totalItems,
          errors: [...errors],
          completed: false
        })
      }

      // Finalisation
      setProgress({
        step: 'Import terminé',
        progress: 100,
        total: totalItems,
        errors: [...errors],
        completed: true,
        success: true
      })

      const result: ImportResult = {
        success: true,
        imported: {
          profiles: importedProfiles,
          souvenirs: importedSouvenirs,
          aiRequests: importedAIRequests
        },
        errors,
        message: `Import réussi : ${importedSouvenirs} souvenirs importés`
      }

      toast({
        title: "Import réussi !",
        description: `${importedSouvenirs} souvenirs ont été importés.`,
      })

      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      setProgress({
        step: 'Erreur lors de l\'import',
        progress: 0,
        total: 100,
        errors: [errorMessage],
        completed: true,
        success: false
      })

      toast({
        title: "Erreur d'import",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetProgress = () => {
    setProgress(null)
  }

  return {
    importData,
    loading,
    progress,
    resetProgress
  }
} 