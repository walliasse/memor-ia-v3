// Types pour les données
export interface Memory {
  id: string
  user_id: string
  content: string
  date: string
  location?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  name?: string
  bio?: string
  created_at: string
  updated_at: string
}