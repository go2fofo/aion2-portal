import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { syncAion2Updates } from '../../../utils/aion2Updates'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  try {
    const res = await syncAion2Updates(client, { force: true })
    return { success: true, data: res }
  } catch (e: any) {
    return { success: false, error: e?.message || String(e) }
  }
})

