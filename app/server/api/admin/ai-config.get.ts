/*
 * @Author: whq
 * @Date: 2026-02-13 15:02:04
 * @LastEditTime: 2026-03-27 16:16:00
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/server/api/admin/ai-config.get.ts
 */
import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. 获取数据库中的配置
  const client = await serverSupabaseClient(event)
  const { data: dbConfig } = await client
    .from('site_config')
    .select('value, updated_at')
    .eq('key', 'ai_model_config')
    .maybeSingle()

  // 2. 获取运行时配置 (环境变量)
  const config = useRuntimeConfig(event)
  
  const envKeys = {
    deepseek: (config.deepseekApiKey || '').trim(),
    siliconflow: (config.deepseekApiKey || '').trim(), 
    'gpt-4o': (config.openaiApiKey || '').trim(),
    gemini: (config.geminiApiKey || '').trim()
  }

  const dbKeys = dbConfig?.value?.keys || {}
  const modelId = dbConfig?.value?.modelId || 'deepseek'

  // 合并逻辑：优先使用 DB，DB 没有则展示 ENV
  const mergedKeys = {
    deepseek: dbKeys.deepseek || envKeys.deepseek,
    siliconflow: dbKeys.siliconflow || envKeys.siliconflow,
    'gpt-4o': dbKeys['gpt-4o'] || envKeys['gpt-4o'],
    gemini: dbKeys.gemini || envKeys.gemini
  }

  return {
    success: true,
    data: {
      modelId,
      keys: mergedKeys,
      updated_at: dbConfig?.updated_at
    }
  }
})
