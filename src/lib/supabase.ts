import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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