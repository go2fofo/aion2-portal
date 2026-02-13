/*
 * @Author: whq
 * @Date: 2026-02-13 12:10:10
 * @LastEditTime: 2026-02-13 16:37:59
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/server/api/aion/ai-analysis.post.ts
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { member, equipmentData } = body

  // 从数据库获取管理员配置的 AI 模型
  const client = await serverSupabaseClient(event)
  const { data: configData } = await client
    .from('site_config')
    .select('value')
    .eq('key', 'ai_model_config')
    .maybeSingle()

  const modelId = configData?.value?.modelId || 'deepseek'
  const dbKeys = configData?.value?.keys || {}

  if (!member) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing member data',
    })
  }

  // 获取配置
  const config = useRuntimeConfig()
  
  // 默认模型配置
  const models: Record<string, { url: string, name: string, key: string }> = {
    'deepseek': {
      url: 'https://api.deepseek.com/chat/completions',
      name: 'deepseek-chat',
      key: (dbKeys.deepseek || config.deepseekApiKey || process.env.DEEPSEEK_API_KEY || '').trim()
    },
    'siliconflow': {
      url: 'https://api.siliconflow.cn/v1/chat/completions',
      name: 'deepseek-ai/DeepSeek-V3',
      key: (dbKeys.siliconflow || config.deepseekApiKey || process.env.DEEPSEEK_API_KEY || '').trim()
    },
    'gpt-4o': {
      url: 'https://api.openai.com/v1/chat/completions',
      name: 'gpt-4o',
      key: (dbKeys['gpt-4o'] || config.openaiApiKey || process.env.OPENAI_API_KEY || '').trim()
    },
    'gemini': {
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      name: 'gemini-2.0-flash',
      key: (dbKeys.gemini || config.geminiApiKey || process.env.GEMINI_API_KEY || '').trim()
    }
  }

  const selectedModel = models[modelId] || models['deepseek']

  if (!selectedModel.key) {
    return {
      success: false,
      message: `未配置 ${modelId} 的 API Key。请在管理后台 [AI 模型配置] 页面设置密钥，或在服务器环境变量中配置 NUXT_${modelId.toUpperCase().replace(/-/g, '_')}_API_KEY。`
    }
  }

  const systemPrompt = `你是一个《永恒之塔2》(AION2) 的资深游戏分析专家 AI。
你的任务是根据玩家提供的角色数据（包括等级、职业、装等、装备详情、称号等），进行深度的多维度分析。

你需要提供：
1. 综合素质评估：分析该角色的强项和弱项。
2. 战术建议：在副本或 PVP 中该角色应扮演的角色和操作重点。
3. 提升建议：根据当前装备情况，建议优先提升或更换的部位。
4. 趣味评价：给出一个符合角色特性的霸气称号。

请保持回复专业且富有游戏氛围，字数控制在 200 字以内。`

  const equipmentList = equipmentData?.equipment?.equipmentList || []
  const skills = equipmentData?.skill?.skillList || []
  const activeSkills = skills.filter((s: any) => s.category === 'Active').map((s: any) => s.name).join(', ')
  const stigmaSkills = skills.filter((s: any) => s.category === 'Dp').map((s: any) => s.name).join(', ')
  
  const equipmentSummary = equipmentList.map((item: any) => {
    return `${item.slotPosName}: ${item.name} (${item.grade || '普通'}) +${item.enchantLevel || 0}`
  }).join('\n')

  const userPrompt = `玩家数据如下：
名字：${member.name}
等级：${member.level}
职业：${member.class_name}
装等：${member.item_level}
当前佩戴称号：${member.title_name || '无'}

装备列表：
${equipmentSummary || '暂无详细装备数据'}

核心技能：
主动：${activeSkills || '无'}
烙印：${stigmaSkills || '无'}

请进行深度分析。`

  try {
    const response = await $fetch<any>(selectedModel.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedModel.key}`,
        'Content-Type': 'application/json'
      },
      body: {
        model: selectedModel.name,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }
    })

    const analysisContent = response.choices[0].message.content

    // 将分析结果持久化到 Supabase
    await client
      .from('legion_members')
      .update({
        ai_analysis_data: {
          content: analysisContent,
          model: selectedModel.name,
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', member.id)

    return {
      success: true,
      content: analysisContent,
      model: selectedModel.name
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return {
      success: false,
      message: 'AI 分析请求失败，请检查网络或 API 配置。',
      error: error.message
    }
  }
})
