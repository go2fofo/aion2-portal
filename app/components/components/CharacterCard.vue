<script setup>
import { computed } from "vue";

// 1. 定义 Props
const props = defineProps({
  // 角色列表数据
  characters: {
    type: Array,
    default: () => [],
  },
  // 分组获取方法
  getGroupName: {
    type: Function,
    default: (groupId) => groupId || "默认分组",
  },
  // 戦斗力格式化方法
  formatCombatPower: {
    type: Function,
    default: (val) => val || 0,
  },
  // ⚙️ 核心配置对象
  config: {
    type: Object,
    default: () => ({
      columns: 3,                 // 列数: 1, 2, 3, 4
      mode: "default",            // 显示模式: "simple"(简单模式) | "default"(列表/标准模式) | "custom"(自定义模式)
      customFields: {             // 自定义模式下控制显隐的开关
        showCombatPower: true,    // 是否显示装等/战力
        showDungeons: true,       // 是否显示副本进度 (远征/超越)
        showEnergy: true,         // 是否显示奥德能量
        showTasks: true,          // 是否显示任务状态按钮
        showNotes: true,          // 是否显示备注框
      },
    }),
  },
});

// 2. 定义 Emits（向父组件抛出所有交互事件）
const emit = defineEmits([
  "click-gameplay",
  "toggle-lock",
  "toggle-task",
  "text-change",
  "delete",
]);

// 3. 动态计算网格列数样式 (Tailwind 适配)
const gridColsClass = computed(() => {
  const cols = props.config?.columns || 3;
  switch (cols) {
    case 1: return "grid-cols-1";
    case 2: return "grid-cols-1 md:grid-cols-2";
    case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    case 3:
    default:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }
});

// 4. 当前模式判断辅助
const currentMode = computed(() => props.config?.mode || "default");
const fields = computed(() => props.config?.customFields || {});
</script>

<template>
  <div
    v-if="characters.length > 0"
    class="grid gap-5"
    :class="gridColsClass"
  >
    <div
      v-for="char in characters"
      :key="char.characterId || char.id"
      class="relative bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-4 border-[#45a6d5] transition-all flex flex-col overflow-hidden"
      :class="char.locked ? 'opacity-95 bg-slate-50/50' : ''"
    >
      <!-- 右上角“游玩消耗”精致角标按钮 -->
      <button
        type="button"
        class="absolute top-0 right-0 px-3.5 py-1.5 bg-gradient-to-l from-purple-500 to-indigo-500 text-white font-black text-[12px] rounded-bl-2xl shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-all tracking-wider z-10"
        @click="emit('click-gameplay', char)"
      >
        点击进行游玩消耗/补充
      </button>

      <!-- 顶部标题栏（所有模式均展示） -->
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3 pr-16"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="w-8 h-8 rounded-xl flex items-center justify-center border text-xs font-bold transition-all shadow-sm"
            :class="
              char.locked
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            "
            @click="emit('toggle-lock', char)"
            :title="
              char.locked
                ? '已锁定（点击解锁以允许删除）'
                : '未锁定（点击锁定以防止误删）'
            "
          >
            {{ char.locked ? "🔒" : "🔓" }}
          </button>
          <div
            class="w-10 h-10 rounded-2xl bg-sky-50 text-[#45a6d5] font-black flex items-center justify-center border border-sky-100 shadow-sm overflow-hidden"
          >
            <img
              v-if="char.profileImage"
              :src="char.profileImage"
              alt="avatar"
              class="w-full h-full object-cover"
            />
            <span v-else>{{
              char.characterName ? char.characterName.charAt(0) : "角"
            }}</span>
          </div>
          <div>
            <div class="text-sm font-black text-slate-800 flex items-center gap-2">
              <span>{{ char.characterName || "未命名角色" }}</span>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                {{ char.className || "选择职业" }}
              </span>
            </div>
            <div
              class="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-2"
            >
              <span>等级: {{ char.characterLevel || 1 }}</span>
              <span>{{ char.raceName || "未知种族" }}</span>
              <span>{{ char.serverName || "未知服务器" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 模式一：基础数值指标（非 simple 模式或 custom 模式下显示） ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showCombatPower)"
        class="grid grid-cols-2 gap-3"
      >
        <div
          class="bg-white/80 p-3 rounded-2xl border-2 border-yellow-100 shadow-sm flex flex-col justify-between space-y-1"
        >
          <div class="text-[10px] text-slate-400 font-black uppercase leading-none">
            装等
          </div>
          <div class="text-yellow-600 font-black text-xs">
            {{ char.itemLevel || char.equipmentScore || "N/A" }}
          </div>
        </div>

        <div
          class="bg-white/80 p-3 rounded-2xl border-2 border-emerald-100 shadow-sm flex flex-col justify-between space-y-1"
        >
          <div class="text-[10px] text-slate-400 font-black uppercase leading-none">
            战斗力
          </div>
          <div class="text-emerald-700 font-black text-xs">
            {{ formatCombatPower(char.combatPower) }}
          </div>
        </div>
      </div>

      <!-- ================= 模式二：副本及核心进度区 ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showDungeons)"
        class="grid grid-cols-2 gap-2 text-xs"
      >
        <div
          class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2 flex flex-col justify-between"
        >
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500"
          >
            <span>远征副本</span>
            <span class="font-black text-[#45a6d5]"
              >{{ char.dailyRuns || 0 }} / 14</span
            >
          </div>
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500"
          >
            <span>存储补充</span>
            <span class="font-black text-amber-600"
              >{{ char.storedDailyRuns || 0 }} / 30</span
            >
          </div>
        </div>

        <div
          class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2 flex flex-col justify-between"
        >
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500"
          >
            <span>超越副本</span>
            <span class="font-black text-purple-600"
              >{{ char.transcendRuns || 0 }} / 14</span
            >
          </div>
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500"
          >
            <span>存储补充</span>
            <span class="font-black text-amber-600">{{
              char.storedTranscendRuns || 0
            }}</span>
          </div>
        </div>
      </div>

      <!-- ================= 模式三：奥德能量进度 ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showEnergy)"
        class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3 shadow-sm"
      >
        <div class="flex items-center justify-between text-xs">
          <span class="font-black text-slate-700 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
            奥德能量
          </span>
          <div class="flex items-center gap-1.5 font-black text-xs">
            <span class="text-[#45a6d5]" title="基础奥德">{{ char.energy || 0 }}</span>
            （
            <span class="text-slate-300">+</span>
            <span class="text-amber-600" title="存储奥德">{{
              char.storedEnergy || 0
            }}</span>
            ）
            <span class="text-slate-400 font-medium"
              >/ {{ char.premiumMember ? 840 : 560 }}</span
            >
          </div>
        </div>

        <div
          class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex p-0.5 bg-slate-100 border border-slate-200/60"
        >
          <div
            class="bg-[#45a6d5] h-full rounded-l-full transition-all duration-500 relative"
            :style="{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  ((char.energy || 0) / (char.premiumMember ? 840 : 560)) * 100
                )
              )}%`,
            }"
            title="基础奥德"
          ></div>
          <div
            class="bg-amber-500 h-full rounded-r-full transition-all duration-500 relative opacity-90"
            :style="{
              width: `${Math.min(
                100 -
                  Math.min(
                    100,
                    ((char.energy || 0) / (char.premiumMember ? 840 : 560)) * 100
                  ),
                ((char.storedEnergy || 0) / (char.premiumMember ? 840 : 560)) * 100
              )}%`,
            }"
            title="存储奥德"
          ></div>
        </div>

        <div
          class="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-0.5"
        >
          <span class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#45a6d5]"></span>
            基础
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1"></span>
            存储
          </span>
          <span
            >总计:
            <strong class="text-slate-700">{{
              (char.energy || 0) + (char.storedEnergy || 0)
            }}</strong>
            点</span
          >
        </div>
      </div>

      <!-- ================= 模式四：任务状态按钮组 ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showTasks)"
        class="grid grid-cols-4 gap-2 pt-1"
      >
        <button
          type="button"
          class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
          :class="
            char.dailyMission
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          "
          @click="emit('toggle-task', char, 'dailyMission')"
        >
          日常任务
        </button>
        <button
          type="button"
          class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
          :class="
            char.dailySignIn
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          "
          @click="emit('toggle-task', char, 'dailySignIn')"
        >
          每日签到
        </button>
        <button
          type="button"
          class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
          :class="
            char.awakening
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          "
          @click="emit('toggle-task', char, 'awakening')"
        >
          觉醒之战
        </button>
        <button
          type="button"
          class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
          :class="
            char.weeklyEnergyPurchased
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          "
          @click="emit('toggle-task', char, 'weeklyEnergyPurchased')"
        >
          能量兑换
        </button>
      </div>

      <!-- ================= 模式五：备注输入框 ================= -->
      <div v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showNotes)">
        <textarea
          :value="char.note || ''"
          :disabled="char.locked"
          placeholder="点击添加备注信息..."
          rows="2"
          @change="(e) => emit('text-change', char, 'note', e.target.value)"
          class="w-full bg-slate-50/70 border border-slate-200/60 p-2.5 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#45a6d5] resize-none disabled:bg-slate-100"
        ></textarea>
      </div>

      <!-- 底部操作与元信息标签（所有模式均展示） -->
      <div
        class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-400"
      >
        <span>分组: {{ getGroupName(char.group) }}</span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1 rounded-xl transition-all font-black text-[10px]"
            :class="
              char.locked
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            "
            :disabled="char.locked"
            @click="emit('delete', char)"
            :title="char.locked ? '角色已锁定，无法删除（需先解锁）' : '删除角色'"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>