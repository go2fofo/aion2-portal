import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return { success: false, error: 'Unauthorized' }

  const body: any = await readBody(event)

  const character_id = String(body?.character_id || '').trim()
  const character_name = String(body?.character_name || '').trim()
  const server_id = Number(body?.server_id)

  if (!character_id) return { success: false, error: 'Missing character_id' }
  if (!character_name) return { success: false, error: 'Missing character_name' }
  if (!Number.isFinite(server_id)) return { success: false, error: 'Missing server_id' }

  const payload = {
    user_id: user.id,
    character_id,
    character_name,
    server_id,
    server_name: body?.server_name ? String(body.server_name) : null,
    server_short_name: body?.server_short_name ? String(body.server_short_name) : null,
    race_id: body?.race_id !== undefined && body?.race_id !== null ? Number(body.race_id) : null,
    race_name: body?.race_name ? String(body.race_name) : null,
    class_name: body?.class_name ? String(body.class_name) : null,
    character_level: body?.character_level !== undefined && body?.character_level !== null ? Number(body.character_level) : null,
    combat_power: body?.combat_power !== undefined && body?.combat_power !== null ? Number(body.combat_power) : null,
    item_level: body?.item_level !== undefined && body?.item_level !== null ? Number(body.item_level) : null,
    remark: body?.remark ? String(body.remark) : null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await client
    .from('my_members')
    .upsert(payload, { onConflict: 'user_id,character_id,server_id' })
    .select('*')
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
})

