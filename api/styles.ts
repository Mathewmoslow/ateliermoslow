// Vercel serverless endpoint for writing style storage
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-side)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing; /api/styles will return 500.')
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export default async function handler(req: any, res: any) {
  if (!supabase) {
    res.status(500).json({ error: 'Supabase env not configured' })
    return
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('writing_styles').select('*').order('created_at', { ascending: false })
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ styles: data ?? [] })
    return
  }

  if (req.method === 'POST') {
    const { name, content } = req.body || {}
    if (!name || !content) {
      res.status(400).json({ error: 'Missing name or content' })
      return
    }
    const { data, error } = await supabase.from('writing_styles').insert({ name, content }).select().single()
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ style: data })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
