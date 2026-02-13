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
  const config = useRuntimeConfig()
  
  const envKeys = {
    deepseek: (config.deepseekApiKey || process.env.NUXT_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim(),
    siliconflow: (config.deepseekApiKey || process.env.NUXT_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim(), 
    'gpt-4o': (config.openaiApiKey || process.env.NUXT_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '').trim(),
    gemini: (config.geminiApiKey || process.env.NUXT_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim()
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
