// Vercel serverless function for Companion requests
// Requires env: OPENAI_API_KEY

type CompanionMode = 'action' | 'chat' | 'autonomous'

interface CompanionRequestBody {
  mode: CompanionMode
  action?: string
  text?: string
  threadId?: string
  voiceId: string
  rules?: string[]
  tweaks?: string
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = req.body as CompanionRequestBody
  if (!body || !body.mode || !body.voiceId || !body.text) {
    res.status(400).json({ error: 'Missing required fields: mode, voiceId, text' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY not set. Configure env to enable Companion.' })
    return
  }

  const systemPrompt = [
    'You are the Atelier Moslow Companion. Produce concise, high-quality rewrites.',
    'Honor provided voice profile and rules. Avoid clichés and banned terms.',
    'Prefer letter cadence over florid prose. Vary sentence lengths. No em/en dash unless explicitly needed for emphasis.',
  ].join(' ')

  const userContent = [
    body.action ? `Action: ${body.action}` : null,
    body.tweaks ? `Tweaks: ${body.tweaks}` : null,
    body.rules && body.rules.length ? `Rules: ${body.rules.join(' | ')}` : null,
    `Voice: ${body.voiceId}`,
    `Text:\n${body.text}`,
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        max_tokens: 2000,
        temperature: 0.4,
      }),
    })

    if (!completion.ok) {
      const errText = await completion.text()
      res.status(502).json({ error: `Upstream error: ${completion.status} ${errText}` })
      return
    }

    const data = await completion.json()
    const text = data?.choices?.[0]?.message?.content?.trim()

    if (!text) {
      res.status(502).json({ error: 'No content returned from model' })
      return
    }

    res.status(200).json({ text, auditFlags: [] })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Unknown server error' })
  }
}
