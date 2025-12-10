export interface Profile {
  id: string
  display_name?: string
  avatar_url?: string
  bio?: string
  voice_profile?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  status?: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  project_id: string | null
  user_id: string
  title: string
  content: Record<string, unknown> | null
  plaintext?: string | null
  summary?: string | null
  word_count?: number | null
  status?: string | null
  created_at: string
  updated_at: string
}
