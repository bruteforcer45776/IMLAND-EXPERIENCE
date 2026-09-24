import { createClient } from 'npm:@supabase/supabase-js@2.57.4'

const allowedOrigins = new Set([
  'https://imland-experience-collaborazione.area-di-lavo-2221.chatgpt.site',
  'https://www.imlandradio.it',
  'https://imlandradio.it',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:4174',
  'http://127.0.0.1:4180',
])

const response = (body: unknown, status: number, origin: string) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'vary': 'Origin',
  },
})

Deno.serve(async request => {
  const origin = request.headers.get('origin') || ''
  const allowed = allowedOrigins.has(origin) || /^http:\/\/localhost:\d+$/.test(origin)
  if (!allowed) return response({ error: 'Origine non autorizzata.' }, 403, 'null')
  if (request.method === 'OPTIONS') return response({ ok: true }, 200, origin)
  if (request.method !== 'POST') return response({ error: 'Metodo non consentito.' }, 405, origin)

  const payload = await request.json().catch(() => null)
  const experiment = String(payload?.experiment || '')
  const variant = String(payload?.variant || '')
  const event = String(payload?.event || '')
  const page = String(payload?.page || '').slice(0, 120)
  if (experiment !== 'header_app_cta_v1' || !/^[AB]$/.test(variant) || !['impression', 'conversion'].includes(event) || !page.startsWith('/')) {
    return response({ error: 'Evento non valido.' }, 400, origin)
  }

  const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
  const secretKey = secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const url = Deno.env.get('SUPABASE_URL')
  if (!url || !secretKey) return response({ error: 'Servizio non configurato.' }, 503, origin)
  const admin = createClient(url, secretKey, { auth: { persistSession: false } })
  const { error } = await admin.rpc('record_ab_event', { p_experiment: experiment, p_variant: variant, p_event: event, p_page: page })
  if (error) return response({ error: 'Registrazione non disponibile.' }, 500, origin)
  return response({ ok: true }, 202, origin)
})
