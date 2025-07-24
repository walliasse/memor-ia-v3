// Types pour l'import des données depuis memor.ia v1

export interface ExportData {
  version: string              // "1.0.0"
  exportDate: string          // ISO timestamp
  userId: string              // UUID de l'utilisateur
  tables: {
    user_profiles: UserProfile[]
    souvenirs: SouvenirData[]
    ai_requests: AIRequest[]
    feedbacks?: Feedback[]
  }
  storage?: {
    souvenirs: StorageFile[]   // URLs des images
  }
}

export interface UserProfile {
  id: string                  // UUID (clé primaire)
  first_name?: string
  last_name?: string
  birth_date?: string         // Format YYYY-MM-DD
  favorite1?: string
  favorite2?: string
  favorite3?: string
  created_at?: string         // ISO timestamp
  updated_at?: string
}

export interface SouvenirData {
  id: string                  // UUID (clé primaire)
  user_id: string            // UUID (clé étrangère)
  memory_date: string        // Format YYYY-MM-DD
  text_content: string
  embedding?: number[]       // Tableau de floats (1536 éléments)
  tags?: string[]           // Tableau de strings
  photo_url?: string        // URL complète
  created_at: string        // ISO timestamp
}

export interface AIRequest {
  id: string
  user_id: string
  created_at: string
}

export interface Feedback {
  id: string
  user_id: string
  content: string
  created_at: string
}

export interface StorageFile {
  url: string
  path: string
  size?: number
}

export interface ImportProgress {
  step: string              // "Import des souvenirs"
  progress: number          // 45
  total: number            // 100
  errors: string[]         // ["Erreur souvenir xyz: ..."]
  completed: boolean       // false
  success?: boolean        // true si terminé avec succès
}

export interface ImportResult {
  success: boolean
  imported: {
    profiles: number
    souvenirs: number
    aiRequests: number
  }
  errors: string[]
  message: string
} 