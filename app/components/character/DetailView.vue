<script setup>
import { computed } from 'vue'
import ProfileHeader from './ProfileHeader.vue'
import RankingHonorList from './RankingHonorList.vue'
import StatDashboard from './StatDashboard.vue'
import EquipmentOverview from './EquipmentOverview.vue'
import SkillList from './SkillList.vue'
import PetAppearance from './PetAppearance.vue'
import TitleAchievementList from './TitleAchievementList.vue'
import Note from './Note.vue'

const props = defineProps({
  member: {
    type: Object,
    required: true
  },
  equipmentList: {
    type: Array,
    default: () => []
  },
  skillList: {
    type: Array,
    default: () => []
  },
  pet: {
    type: Object,
    default: null
  },
  wing: {
    type: Object,
    default: null
  },
  skinList: {
    type: Array,
    default: () => []
  },
  loadingEquipment: {
    type: Boolean,
    default: false
  },
  syncing: {
    type: Boolean,
    default: false
  },
  showAiAnalysis: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['sync', 'update:analysis'])

// --- 数据处理逻辑 (从 [id].vue 迁移) ---

// 核心战斗数值
const coreCombatStats = computed(() => {
  if (!props.member?.equipment_data?.raw_info?.stat?.statList) return []
  
  const stats = props.member.equipment_data.raw_info.stat.statList
  const interestingTypes = {
    'HP': { label: '生命值', icon: '❤️', color: 'text-red-500', bg: 'bg-red-50' },
    'MP': { label: '精神力', icon: '💙', color: 'text-blue-500', bg: 'bg-blue-50' },
    'PhysicalAttack': { label: '物理攻击', icon: '⚔️', color: 'text-rose-500', bg: 'bg-rose-50' },
    'MagicalAttack': { label: '魔法攻击', icon: '✨', color: 'text-purple-500', bg: 'bg-purple-50' },
    'PhysicalDefense': { label: '物理防御', icon: '🛡️', color: 'text-sky-500', bg: 'bg-sky-50' },
    'MagicalDefense': { label: '魔法防御', icon: '🔮', color: 'text-indigo-500', bg: 'bg-indigo-50' }
  }

  return stats
    .filter(s => interestingTypes[s.type])
    .map(s => ({
      ...s,
      ...interestingTypes[s.type]
    }))
})
const arcanaList = computed(() => {
  return props.equipmentList.filter(e => e.slotPosName && e.slotPosName.startsWith('Arcana'))
})

// 排名列表
const rankingList = computed(() => {
  const list = props.member?.equipment_data?.raw_info?.ranking?.rankingList
  if (!list || !Array.isArray(list)) return []
  
  const typeMap = {
    1: '深渊排名', 3: '个人竞技场', 4: '要塞战', 5: '混沌竞技场', 6: '协力竞技场', 20: '赛季竞技 A', 21: '赛季竞技 B'
  }

  return list
    .filter(item => item.rank !== null)
    .map(item => ({
      ...item,
      displayName: item.rankingContentsName || typeMap[item.rankingContentsType] || '未知玩法',
      changeType: !item.rankChange ? 'stable' : item.rankChange < 0 ? 'up' : 'down',
      absChange: Math.abs(item.rankChange || 0)
    }))
})

// 属性分组
const getStatIcon = (type) => {
  if (!type) return { svg: null }
  const upperType = type.toUpperCase()
  const COLORS = { EPIC: '#FF3E3E', LORD: '#FFD700', MAGIC: '#4DA6FF', PHYSICAL: '#FFA24D', SURVIVAL: '#4DFF88', UTILITY: '#A78BFA', DEFAULT: '#94A3B8' }
  const paths = {
    STR: '<path d="M12 2l3.5 3.5L12 9l-3.5-3.5L12 2zM5 11l3.5 3.5L5 18l-3.5-3.5L5 11zM19 11l3.5 3.5L19 18l-3.5-3.5L19 11zM12 13l3.5 3.5L12 20l-3.5-3.5L12 13z" fill="currentColor"/>',
    DEX: '<path d="M13 3l-2 3h10l-9 14 2-3H4l9-14z" fill="currentColor"/>',
    INT: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    WIS: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2"/>',
    VIT: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',
    CON: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2"/>',
    AGI: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>',
    LordBase: '<path d="M12 2l2.4 7.6H22l-6.2 4.5L18.2 22l-6.2-4.8L5.8 22l2.4-7.9L2 9.6h7.6L12 2z" fill="currentColor"/>',
    Justice: '<path d="M12 3L4 9v11l8 3 8-3V9l-8-6zm0 14a3 3 0 110-6 3 3 0 010 6z" fill="currentColor"/>',
    Freedom: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Destruction: '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" fill="currentColor"/>',
    Attack: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l8.5-8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Defense: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/>',
    Accuracy: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Critical: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="white" stroke-width="1"/>',
    Resist: '<path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor"/>',
    Evasion: '<path d="M17.6 19.7c-1.5 1.5-3.5 2.3-5.6 2.3-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8c0 2.1-.8 4.1-2.3 5.6M12 10v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    HP: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',
    MP: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Regen: '<path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    Speed: '<path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>',
    CombatSpeed: '<path d="M21 5l-8 8-4-4L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 5h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    MoveSpeed: '<path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>',
    Amplify: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  }
  const wrapSvg = (path, color, isLord = false) => {
    const glow = isLord ? `filter: drop-shadow(0 0 4px ${color}cc);` : ''
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: ${color}; ${glow}">${path}</svg>`
  }
  const mainStatsMap = { STR: { color: COLORS.PHYSICAL, path: paths.STR }, DEX: { color: COLORS.PHYSICAL, path: paths.DEX }, AGI: { color: COLORS.UTILITY, path: paths.AGI }, INT: { color: COLORS.MAGIC, path: paths.INT }, WIS: { color: COLORS.MAGIC, path: paths.WIS }, VIT: { color: COLORS.SURVIVAL, path: paths.VIT }, CON: { color: COLORS.SURVIVAL, path: paths.CON } }
  if (mainStatsMap[upperType]) return { svg: wrapSvg(mainStatsMap[upperType].path, mainStatsMap[upperType].color) }
  const lordStats = ['JUSTICE', 'FREEDOM', 'ILLUSION', 'LIFE', 'TIME', 'DESTRUCTION', 'DEATH', 'WISDOM', 'DESTINY', 'SPACE']
  if (lordStats.includes(upperType)) {
    let path = paths.LordBase
    if (upperType === 'JUSTICE') path = paths.Justice
    if (upperType === 'FREEDOM') path = paths.Freedom
    if (upperType === 'DESTRUCTION') path = paths.Destruction
    return { svg: wrapSvg(path, COLORS.LORD, true) }
  }
  const combatMap = { PHYSICALATTACK: { color: COLORS.EPIC, path: paths.Attack }, MAGICALATTACK: { color: COLORS.MAGIC, path: paths.Attack }, WEAPONACCURACY: { color: COLORS.EPIC, path: paths.Accuracy }, MAGICALACCURACY: { color: COLORS.MAGIC, path: paths.Accuracy }, CRITICAL: { color: COLORS.EPIC, path: paths.Critical }, MAGICALCRITICAL: { color: COLORS.MAGIC, path: paths.Critical }, PVEAMPLIFYDAMAGE: { color: COLORS.EPIC, path: paths.Amplify }, PVPAMPLIFYDAMAGE: { color: COLORS.EPIC, path: paths.Amplify }, PHYSICALDEFENSE: { color: COLORS.DEFAULT, path: paths.Defense }, MAGICALDEFENSE: { color: COLORS.DEFAULT, path: paths.Defense }, EVASION: { color: COLORS.DEFAULT, path: paths.Evasion }, MAGICALRESIST: { color: COLORS.MAGIC, path: paths.Resist }, BLOCK: { color: COLORS.DEFAULT, path: paths.Defense }, PARRY: { color: COLORS.DEFAULT, path: paths.Attack }, CRITICALRESIST: { color: COLORS.DEFAULT, path: paths.Resist }, HP: { color: COLORS.SURVIVAL, path: paths.HP }, MP: { color: COLORS.MAGIC, path: paths.MP }, HPREGEN: { color: COLORS.SURVIVAL, path: paths.Regen }, MPREGEN: { color: COLORS.MAGIC, path: paths.Regen }, COMBATSPEED: { color: COLORS.UTILITY, path: paths.CombatSpeed }, MOVESPEED: { color: COLORS.UTILITY, path: paths.MoveSpeed } }
  const config = combatMap[upperType] || { color: COLORS.DEFAULT, path: paths.STR }
  return { svg: wrapSvg(config.path, config.color) }
}

const groupedStats = computed(() => {
  const rawData = props.member?.equipment_data?.raw_info?.stat
  if (!rawData) return []
  const allStats = [...(rawData.statList || []), ...(rawData.mainStatList || [])]
  const filteredStats = allStats.filter(s => s.type !== 'ItemLevel')
  const groups = [
    { name: '主神属性', iconSvg: '<path d="M12 2l2.4 7.6H22l-6.2 4.5L18.2 22l-6.2-4.8L5.8 22l2.4-7.9L2 9.6h7.6L12 2z" fill="currentColor"/>', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', types: ['Justice', 'Freedom', 'Illusion', 'Life', 'Time', 'Destruction', 'Death', 'Wisdom', 'Destiny', 'Space'] },
    { name: '角色基础属性', iconSvg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', types: ['STR', 'INT', 'DEX', 'WIS', 'VIT', 'CON', 'AGI'] },
    { name: '攻击属性', iconSvg: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l8.5-8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', types: ['PhysicalAttack', 'MagicalAttack', 'WeaponAccuracy', 'MagicalAccuracy', 'Critical', 'MagicalCritical', 'AttackSpeed', 'CastingSpeed', 'PvEAmplifyDamage', 'PvPAmplifyDamage', 'AdditionalHitRate', 'AmplifyWeaponDamage'] },
    { name: '防御属性', iconSvg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/>', color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-100', types: ['PhysicalDefense', 'MagicalDefense', 'Evasion', 'MagicalResist', 'Block', 'Parry', 'PvEReduceDamage', 'PvPReduceDamage', 'CriticalResist', 'DamageResist'] },
    { name: '生存与资源', iconSvg: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', types: ['HP', 'MP', 'HpRegen', 'MpRegen', 'HpRegenCombat', 'MpRegenCombat', 'HealAmplify', 'CombatSpeed', 'MoveSpeed', 'Concentration'] }
  ]
  return groups.map(group => {
    const uniqueStats = new Map()
    filteredStats.filter(s => { const upperType = s.type?.toUpperCase(); return group.types.some(t => t.toUpperCase() === upperType) }).forEach(s => {
      const upperType = s.type?.toUpperCase()
      if (!uniqueStats.has(upperType)) {
        const iconInfo = getStatIcon(s.type)
        uniqueStats.set(upperType, { ...s, iconSvg: iconInfo.svg, extra: s.extra || null, statSecondList: s.statSecondList || null })
      }
    })
    return { ...group, list: Array.from(uniqueStats.values()) }
  }).filter(g => g.list.length > 0)
})

// 装备布局分组
const layoutGroups = [
  { label: '神兵利器', icon: '⚔️', theme: 'bg-rose-100 text-rose-600', pairs: [['MainHand', 'SubHand']] },
  { label: '战阵护甲', icon: '🛡️', theme: 'bg-blue-100 text-blue-600', pairs: [['Torso', 'Pants'], ['Shoulder', 'Gloves'], ['Helmet', 'Boots']] },
  { label: '奇珍饰品', icon: '💍', theme: 'bg-amber-100 text-amber-600', pairs: [['Necklace', 'Amulet'], ['Earring1', 'Earring2'], ['Ring1', 'Ring2'], ['Belt', 'Cape'], ['Bracelet1', 'Bracelet2']] }
]

const groupedEquipment = computed(() => {
  return layoutGroups.map(group => {
    return {
      label: group.label,
      theme: group.theme,
      icon: group.icon,
      rows: group.pairs.map(pair => {
        return pair.map(slot => {
          const item = props.equipmentList.find(e => e.slotPosName === slot)
          return item || { slotPosName: slot, isPlaceholder: true }
        })
      })
    }
  })
})

const runeRow = computed(() => {
  const pair = ['Rune1', 'Rune2']
  return pair.map(slot => {
    const item = props.equipmentList.find(e => e.slotPosName === slot)
    return item || { slotPosName: slot, isPlaceholder: true }
  })
})

// 技能分类
const activeSkills = computed(() => props.skillList.filter(s => s.category === 'Active'))
const passiveSkills = computed(() => props.skillList.filter(s => s.category === 'Passive'))
const stigmaSkills = computed(() => props.skillList.filter(s => s.category === 'Dp'))

</script>

<template>
  <main class="max-w-[95%] md:max-w-[90%] mx-auto px-4 pt-8 animate-fade-in-up space-y-6">
    <!-- 1. 头部卡片 -->
    <ProfileHeader 
      :member="member" 
      :syncing="syncing" 
      :core-combat-stats="coreCombatStats" 
      @sync="emit('sync')" 
    />

    <!-- 2. AI 分析 (可选) -->
    <MemberAIAnalysis 
      v-if="member && showAiAnalysis" 
      :member="member" 
      :equipment-data="member.equipment_data" 
      @update:analysis="(data) => emit('update:analysis', data)"
    />

    <!-- 3. 排名荣誉 -->
    <RankingHonorList :ranking-list="rankingList" />

    <!-- 4. 详细能力看板 -->
    <StatDashboard 
      :grouped-stats="groupedStats" 
      :loading-equipment="loadingEquipment" 
    />

    <!-- 5. 装备概览 -->
    <EquipmentOverview 
      :loading-equipment="loadingEquipment" 
      :equipment-list="equipmentList" 
      :grouped-equipment="groupedEquipment" 
      :rune-row="runeRow" 
      :arcana-list="arcanaList" 
    />

    <!-- 6. 角色技能 -->
    <SkillList 
      :loading-equipment="loadingEquipment" 
      :skill-list="skillList" 
      :active-skills="activeSkills" 
      :passive-skills="passiveSkills" 
      :stigma-skills="stigmaSkills" 
    />

    <!-- 7. 伙伴与外观 -->
    <PetAppearance 
      :loading-equipment="loadingEquipment" 
      :pet="pet" 
      :wing="wing" 
      :skin-list="skinList" 
    />

    <!-- 8. 称号成就 -->
    <TitleAchievementList :member="member" />

    <!-- 9. 档案备注 -->
    <Note :member="member" />
  </main>
</template>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
