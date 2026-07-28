<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeTabGroup: {
    type: [String, Number],
    required: true
  },
  gameData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update-character',
  'delete-character',
  'toggle-lock',
  'toggle-task'
])

const { $confirm } = useNuxtApp()

// 根据 activeTabGroup 过滤当前展示的角色列表
const filteredCharacters = computed(() => {
  const characters = props.gameData?.characters || []
  const groups = props.gameData?.groups || []
  const tab = props.activeTabGroup

  if (tab === 'all') {
    return characters
  }
  if (tab === 'default') {
    return characters.filter(c => !c.group || !groups.some(g => g.id === c.group))
  }
  return characters.filter(c => Number(c.group) === Number(tab))
})

// 获取当前 Tab 的标题名称
const currentTabTitle = computed(() => {
  const tab = props.activeTabGroup
  if (tab === 'all') return '全部角色'
  if (tab === 'default') return '默认分组'
  const found = props.gameData?.groups?.find(g => Number(g.id) === Number(tab))
  return found ? found.name : '未知分组'
})

// 根据分组 ID 获取分组名称
const getGroupName = (groupId) => {
  if (!groupId) return '默认分组'
  const found = props.gameData?.groups?.find(g => Number(g.id) === Number(groupId))
  return found ? found.name : '默认分组'
}

// 战斗力格式化函数
const formatCombatPower = (val) => {
  if (!val) return '0'
  return Number(val).toLocaleString()
}

// 事件抛出处理
const handleStatChange = (char, field, value) => {
  const updatedChar = { ...char, [field]: Number(value) }
  emit('update-character', updatedChar)
}

const handleTextChange = (char, field, value) => {
  const updatedChar = { ...char, [field]: value }
  emit('update-character', updatedChar)
}

const handleToggleLock = (char) => {
  emit('toggle-lock', char)
}

const handleDelete = async (char) => {
  try {
    await $confirm?.('确定要删除该角色吗？删除后不可恢复', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    emit('delete-character', char)
  } catch {
    // 取消删除
  }
}

const handleToggleTask = (char, field) => {
  const updatedChar = { ...char, [field]: !char[field] }
  emit('update-character', updatedChar)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 分组头部信息展示 -->
    <div class="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-[#45a6d5]"></div>
        <div>
          <h2 class="text-base font-black text-slate-800">{{ currentTabTitle }}</h2>
          <p class="text-xs font-bold text-slate-400">当前分组共有 {{ filteredCharacters.length }} 个角色</p>
        </div>
      </div>
    </div>

    <!-- 角色卡片列表网格 -->
    <div v-if="filteredCharacters.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="char in filteredCharacters" 
        :key="char.id || char.characterId"
        class="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-4 hover:border-[#45a6d5] transition-all flex flex-col"
        :class="char.locked ? 'opacity-90 bg-slate-50/50' : ''"
      >
        <!-- 顶部标题栏 -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <button 
              type="button"
              class="w-8 h-8 rounded-xl flex items-center justify-center border text-xs font-bold transition-all shadow-sm"
              :class="char.locked ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
              @click="handleToggleLock(char)"
              title="切换锁定状态"
            >
              {{ char.locked ? '锁定' : '解锁' }}
            </button>
            <div class="w-10 h-10 rounded-2xl bg-sky-50 text-[#45a6d5] font-black flex items-center justify-center border border-sky-100 shadow-sm overflow-hidden">
              <img v-if="char.profileImage" :src="char.profileImage" alt="avatar" class="w-full h-full object-cover" />
              <span v-else>{{ char.characterName ? char.characterName.charAt(0) : '角' }}</span>
            </div>
            <div>
              <div class="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>{{ char.characterName || '未命名角色' }}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {{ char.className || '选择职业' }}
                </span>
              </div>
              <div class="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-2">
                <span>等级: {{ char.characterLevel || 1 }}</span>
                <span>{{ char.raceName || '未知种族' }}</span>
                <span>{{ char.serverName || '未知服务器' }}</span>
              </div>
            </div>
          </div>
          <!-- 状态标识 -->
          <div>
            <span v-if="char.locked" class="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500">已锁定</span>
            <span v-else class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600">可刷</span>
          </div>
        </div>

        <!-- 基础数值指标卡片区（匹配主题风格，不含 emoji） -->
        <div class="grid grid-cols-3 gap-2">
          <!-- 基纳数 -->
          <div class="p-2.5 bg-slate-50/70 border border-slate-200/60 rounded-2xl flex flex-col justify-between space-y-1">
            <span class="text-[10px] font-bold text-slate-400">基纳数(万)</span>
            <input 
              type="number" 
              :value="char.kina || 0"
              :disabled="char.locked"
              @change="(e) => handleStatChange(char, 'kina', e.target.value)"
              class="w-full bg-white px-2 py-1 rounded-xl border border-slate-200 text-xs font-black text-slate-800 outline-none focus:border-[#45a6d5] disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          <!-- 装分卡片（采用指定卡片样式） -->
          <div class="bg-white/80 p-2.5 rounded-2xl border-2 border-yellow-100 shadow-sm flex flex-col justify-between space-y-1">
            <div class="text-[10px] text-slate-400 font-black uppercase leading-none">装等</div>
            <div class="text-yellow-600 font-black text-xs">{{ char.itemLevel || char.equipmentScore || 'N/A' }}</div>
          </div>

          <!-- 战斗力卡片（采用指定卡片样式） -->
          <div class="bg-white/80 p-2.5 rounded-2xl border-2 border-emerald-100 shadow-sm flex flex-col justify-between space-y-1">
            <div class="text-[10px] text-slate-400 font-black uppercase leading-none">战斗力</div>
            <div class="text-emerald-700 font-black text-xs">{{ formatCombatPower(char.combatPower) }}</div>
          </div>
        </div>

        <!-- 副本及核心进度区 -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2 flex flex-col justify-between">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>远征副本</span>
              <span class="font-black text-[#45a6d5]">{{ char.dailyRuns || 0 }} / 14</span>
            </div>
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>存储补充</span>
              <span class="font-black text-amber-600">{{ char.storedDailyRuns || 0 }} / 30</span>
            </div>
          </div>

          <div class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2 flex flex-col justify-between">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>超越副本</span>
              <span class="font-black text-purple-600">{{ char.transcendRuns || 0 }} / 14</span>
            </div>
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>存储补充</span>
              <span class="font-black text-amber-600">{{ char.storedTranscendRuns || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- 奥德能量进度 -->
        <div class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>奥德能量</span>
            <span class="font-black text-slate-700">{{ char.energy || 0 }} / 840</span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              class="bg-[#45a6d5] h-full rounded-full transition-all duration-300" 
              :style="{ width: `${Math.min(100, ((char.energy || 0) / 840) * 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- 任务状态按钮组 -->
        <div class="grid grid-cols-4 gap-2 pt-1">
          <button 
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="char.dailyMission ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'"
            @click="handleToggleTask(char, 'dailyMission')"
          >
            日常任务
          </button>
          <button 
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="char.dailySignIn ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'"
            @click="handleToggleTask(char, 'dailySignIn')"
          >
            每日签到
          </button>
          <button 
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="char.awakening ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'"
            @click="handleToggleTask(char, 'awakening')"
          >
            觉醒之战
          </button>
          <button 
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="char.weeklyEnergyPurchased ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'"
            @click="handleToggleTask(char, 'weeklyEnergyPurchased')"
          >
            能量兑换
          </button>
        </div>

        <!-- 备注输入框 -->
        <div>
          <textarea 
            :value="char.note || ''"
            :disabled="char.locked"
            placeholder="点击添加备注信息..."
            rows="2"
            @change="(e) => handleTextChange(char, 'note', e.target.value)"
            class="w-full bg-slate-50/70 border border-slate-200/60 p-2.5 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#45a6d5] resize-none disabled:bg-slate-100"
          ></textarea>
        </div>

        <!-- 底部操作与元信息标签 -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-400">
          <span>分组: {{ getGroupName(char.group) }}</span>
          
          <div class="flex items-center gap-2" v-if="!char.locked">
            <button 
              type="button"
              class="px-3 py-1 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-black text-[10px]"
              @click="handleDelete(char)"
            >
              删除
            </button>
          </div>
          <span v-else class="text-slate-400">已锁定保护</span>
        </div>
      </div>
    </div>

    <!-- 空状态展示 -->
    <div v-else class="bg-white border border-slate-200/80 p-12 rounded-3xl text-center space-y-3 shadow-sm">
      <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center font-black">
        空
      </div>
      <div class="text-sm font-black text-slate-700">当前分组下暂无角色</div>
      <p class="text-xs font-bold text-slate-400">请切换其他分组或新增角色来查看详细面板~</p>
    </div>
  </div>
</template>