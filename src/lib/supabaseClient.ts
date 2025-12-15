import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const missingEnv = !supabaseUrl || !supabaseAnonKey

function createMockClient(): SupabaseClient {
  console.warn('Running without Supabase env; using mock auth client.')
  const noop = () => Promise.resolve({ data: null, error: null } as any)
  const auth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null } as any),
    signInWithOAuth: noop,
    signOut: noop,
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
      error: null,
    }),
  }
  return { auth } as unknown as SupabaseClient
}

export const supabase = missingEnv
  ? createMockClient()
  : createClient(supabaseUrl as string, supabaseAnonKey as string)
