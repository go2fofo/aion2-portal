<template>
  <div class="min-h-screen bg-watercolor font-sans custom-scroll">
    <!-- 顶部导航栏 -->
    <nav class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-sky-600 font-black hover:text-sky-800 transition-colors group"
      >
        <span class="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 group-active:scale-90 transition-all flex items-center justify-center">
          <svg class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="tracking-wider">返回首页</span>
      </button>
      <div class="text-xl font-black text-[#45a6d5] tracking-widest">角色档案</div>
      <div class="w-10"></div> <!-- 占位保持居中 -->
    </nav>

    <div v-if="loading" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="relative w-32 h-32 mb-6">
        <img src="/xiaoji1.png" class="w-full h-full object-contain animate-bounce-slow" />
        <div class="absolute -bottom-2 inset-x-0 h-2 bg-slate-200/30 blur-md rounded-full scale-x-75 animate-pulse"></div>
      </div>
      <div class="text-sky-600 font-black text-xl tracking-widest animate-pulse">正在读取档案...</div>
    </div>

    <div v-else-if="!member" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="text-6xl mb-4">👻</div>
      <div class="text-slate-400 font-bold text-xl">查无此人</div>
      <button @click="router.back()" class="mt-8 bg-[#45a6d5] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform">返回列表</button>
    </div>

    <main v-else class="max-w-[95%] md:max-w-[90%] mx-auto px-4 pt-8 animate-fade-in-up space-y-6">
      <!-- 头部卡片：个人形象与核心信息 -->
      <div class="relative bg-white/70 backdrop-blur-sm rounded-[3rem] p-6 md:p-10 shadow-xl border-4 border-white overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-sky-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <!-- 头像区 -->
          <div class="relative group shrink-0">
            <div class="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] border-4 border-white shadow-[0_12px_30px_rgba(69,166,213,0.15)] overflow-hidden bg-sky-50 transition-all group-hover:shadow-[0_12px_40px_rgba(69,166,213,0.25)]">
              <img :src="member.profile_url || '/bbbswz.png'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <!-- 等级徽章 -->
            <div class="absolute -bottom-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-black text-2xl px-5 py-2 rounded-2xl border-4 border-white shadow-lg z-20">
              Lv.{{ member.level }}
            </div>
          </div>

          <!-- 信息与核心数值区 -->
          <div class="flex-1 w-full space-y-6">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex flex-col md:flex-row items-center gap-4">
                <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">{{ member.name }}</h1>
                <div class="flex items-center gap-2">
                  <span v-if="member.role === 'leader'" class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-md animate-bounce">👑 军团长</span>
                  <span v-else-if="member.role === 'officer'" class="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-md">🛡️ 百夫长</span>
                  <span v-else class="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-md">⚔️ 成员</span>
                </div>
              </div>

              <!-- 刷新按钮 -->
              <button 
                @click="syncMemberData" 
                :disabled="syncing"
                class="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-sky-100 text-sky-600 font-black text-sm shadow-sm hover:border-sky-300 hover:text-sky-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-sky-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span class="relative flex items-center justify-center">
                  <svg v-if="syncing" class="w-5 h-5 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4522" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="opacity-75"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12C4 7.58172 7.58172 4 12 4C14.5 4 16.7341 5.14722 18.2002 6.94444M18.2002 6.94444V3M18.2002 6.94444H14.5M20 12C20 16.4183 16.4183 20 12 20C9.5 20 7.26595 18.8528 5.7998 17.0556M5.7998 17.0556V21M5.7998 17.0556H9.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="relative">{{ syncing ? '同步中...' : '刷新数据' }}</span>
              </button>
            </div>

            <div class="bg-sky-50/50 p-4 rounded-3xl border border-sky-100/50 inline-block md:block">
              <p class="text-slate-600 font-black italic text-lg leading-relaxed">
                "{{ member.title_name || member.note || '这只宝宝很懒，什么都没留下~' }}"
              </p>
            </div>

            <!-- 核心档案数值网格 -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <!-- 基础信息 -->
              <div class="bg-white/80 p-3 rounded-2xl border-2 border-sky-100 shadow-sm flex items-center gap-3">
                <span class="text-xl bg-sky-50 p-2 rounded-xl">🛡️</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">职业</div>
                  <div class="text-sky-800 font-black text-xs">{{ member.class_name }}</div>
                </div>
              </div>
              <div class="bg-white/80 p-3 rounded-2xl border-2 border-yellow-100 shadow-sm flex items-center gap-3">
                <span class="text-xl bg-yellow-50 p-2 rounded-xl">⚔️</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">装等</div>
                  <div class="text-yellow-600 font-black text-xs">{{ member.item_level || 'N/A' }}</div>
                </div>
              </div>
              <div class="bg-white/80 p-3 rounded-2xl border-2 border-pink-100 shadow-sm flex items-center gap-3">
                <span class="text-xl bg-pink-50 p-2 rounded-xl">{{ member.gender === 'female' ? '♀' : '♂' }}</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">性别</div>
                  <div class="text-pink-600 font-black text-xs">{{ member.gender === 'female' ? '女' : '男' }}</div>
                </div>
              </div>
              <div class="bg-white/80 p-3 rounded-2xl border-2 border-indigo-100 shadow-sm flex items-center gap-3">
                <span class="text-xl bg-indigo-50 p-2 rounded-xl">🏳️</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">种族</div>
                  <div class="text-indigo-800 font-black text-xs">{{ member.race_id === 1 ? '天族' : '魔族' }}</div>
                </div>
              </div>

              <!-- 核心战斗数值 -->
              <div 
                v-for="stat in coreCombatStats" 
                :key="stat.type"
                class="bg-white/80 p-3 rounded-2xl border-2 shadow-sm flex items-center gap-3 border-slate-50"
                :class="stat.bg"
              >
                <span class="text-xl p-2 rounded-xl bg-white/50">{{ stat.icon }}</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">{{ stat.label }}</div>
                  <div class="font-black text-xs" :class="stat.color">{{ stat.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 佩戴称号卡片组 -->
      <div v-if="equippedTitles.length > 0" class="space-y-4">
        <h3 class="font-black text-sky-900 text-lg flex items-center gap-2 px-2">
          <span class="bg-white p-1.5 rounded-xl shadow-sm">🎖️</span> 已佩戴称号
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="title in equippedTitles" 
            :key="title.id"
            class="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border-4 p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden"
            :class="title.equipCategory === 'Attack' ? 'border-rose-100' : title.equipCategory === 'Defense' ? 'border-sky-100' : 'border-amber-100'"
          >
            <!-- 装饰背景 -->
            <div 
              class="absolute top-0 right-0 w-24 h-24 blur-2xl opacity-10 -translate-y-1/2 translate-x-1/2"
              :class="title.equipCategory === 'Attack' ? 'bg-rose-400' : title.equipCategory === 'Defense' ? 'bg-sky-400' : 'bg-amber-400'"
            ></div>

            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  :class="[
                    title.equipCategory === 'Attack' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 
                    title.equipCategory === 'Defense' ? 'bg-sky-50 text-sky-500 border border-sky-100' : 
                    'bg-amber-50 text-amber-500 border border-amber-100'
                  ]"
                >
                  {{ getEquipCategoryLabel(title.equipCategory) }}
                </span>
                <span class="text-lg">✨</span>
              </div>

              <h4 class="text-xl font-black text-slate-800 mb-4 group-hover:text-sky-700 transition-colors">
                {{ title.name }}
              </h4>

              <div class="space-y-3 mt-auto">
                <!-- 属性列表展示 -->
                <div v-if="title.statList?.length" class="space-y-1">
                  <div class="text-[9px] font-black text-slate-300 uppercase tracking-tighter">基础属性</div>
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="(s, idx) in title.statList" :key="idx"
                      class="text-[11px] font-bold text-slate-600 bg-slate-50/50 px-2 py-1 rounded-lg border border-slate-100/50"
                    >
                      {{ s.desc }}
                    </span>
                  </div>
                </div>

                <div v-if="title.equipStatList?.length" class="space-y-1">
                  <div class="text-[9px] font-black text-sky-300 uppercase tracking-tighter">佩戴加成</div>
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="(s, idx) in title.equipStatList" :key="idx"
                      class="text-[11px] font-black text-sky-600 bg-sky-50/50 px-2 py-1 rounded-lg border border-sky-100/50"
                    >
                      {{ s.desc }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 战斗素质与多维度分析 (抽离为独立组件) -->
      <MemberAIAnalysis 
        v-if="member" 
        :member="member" 
        :equipment-data="member.equipment_data" 
        @update:analysis="(data) => member.ai_analysis_data = data"
      />

      <!-- 详细能力值看板 -->
      <div class="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white relative overflow-hidden group/board">
        <!-- 装饰背景 -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl transition-transform group-hover/board:scale-110 duration-1000"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-100/30 rounded-full blur-3xl transition-transform group-hover/board:scale-110 duration-1000"></div>

        <div class="relative z-10">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h3 class="font-black text-slate-800 text-3xl mb-2 flex items-center gap-3">
                <span class="bg-gradient-to-br from-sky-400 to-blue-600 text-white p-3 rounded-[1.5rem] shadow-lg shadow-sky-200/50">📊</span> 
                全维能力数据中心
              </h3>
              <p class="text-slate-400 font-bold text-sm ml-16 tracking-wide">FULL ATTRIBUTE DATA DASHBOARD</p>
            </div>
            <div class="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Data Synchronized</span>
            </div>
          </div>

          <div v-if="loadingEquipment" class="flex flex-col items-center justify-center py-24 gap-4">
            <div class="relative w-16 h-16">
              <div class="absolute inset-0 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
            </div>
            <span class="text-slate-400 font-black animate-pulse">正在解析全量属性...</span>
          </div>
          
          <div v-else-if="groupedStats.length === 0" class="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div class="text-4xl mb-4">🏜️</div>
            <div class="text-slate-400 font-black italic">未检测到详细属性记录</div>
          </div>

          <div v-else class="space-y-12">
            <!-- 1. 顶部核心双属性布局 (角色基础 & 主神属性) -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <template v-for="group in groupedStats.filter(g => ['角色基础属性', '主神属性'].includes(g.name))" :key="group.name">
                <div class="flex flex-col gap-8 bg-slate-50/40 p-8 rounded-[3.5rem] border border-slate-100/50 shadow-inner relative overflow-hidden group/topcard">
                  <!-- 分组标题 -->
                  <div class="flex items-center justify-between px-2 relative z-10">
                    <div class="flex items-center gap-4">
                      <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-4 border-white" :class="group.bg">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" v-html="group.iconSvg" :class="group.color"></svg>
                      </div>
                      <div>
                        <h4 class="font-black text-slate-800 text-2xl tracking-tight uppercase">{{ group.name }}</h4>
                        <div class="flex items-center gap-2 mt-1">
                          <div class="h-1.5 w-12 rounded-full" :class="group.bg.replace('bg-', 'bg-').split(' ')[0]"></div>
                          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dimension Analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-10 items-center relative z-10">
                    <!-- 雷达图展示 (放在上方) -->
                    <div class="w-full md:w-2/3 h-[320px] relative bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                      <VChart 
                        v-if="group.name === '角色基础属性' ? baseStatRadarOption : lordStatRadarOption" 
                        class="w-full h-full" 
                        :option="group.name === '角色基础属性' ? baseStatRadarOption : lordStatRadarOption" 
                        autoresize 
                      />
                      <div v-else class="text-slate-200 text-xs font-black">数据不足以生成图表</div>
                    </div>

                    <!-- 属性列表 (紧凑型，改为 3 列以适应上下布局) -->
                    <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div 
                        v-for="stat in group.list" 
                        :key="stat.type"
                        class="relative p-4 rounded-[2rem] bg-white border-2 border-slate-50 shadow-sm hover:shadow-lg transition-all"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <!-- <div class="w-10 h-10 rounded-xl bg-slate-50 shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                              <div v-if="stat.iconSvg" v-html="stat.iconSvg" class="w-6 h-6 flex items-center justify-center"></div>
                              <div v-else class="w-2 h-2 rounded-full bg-slate-200"></div>
                            </div> -->
                            <div class="flex flex-col">
                              <span class="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">{{ stat.type }}</span>
                              <span class="text-xs font-black text-slate-600 truncate max-w-[80px]">{{ stat.name }}</span>
                            </div>
                          </div>
                          <span class="text-base font-black tracking-tighter tabular-nums" :class="group.color">{{ stat.value }}</span>
                        </div>
                        <!-- 二级加成摘要 -->
                        <div v-if="stat.statSecondList?.length" class="mt-2 pt-2 border-t border-slate-50 flex flex-wrap gap-1">
                          <span 
                            v-for="(bonus, bIdx) in stat.statSecondList" :key="bIdx"
                            class="text-[8px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md"
                          >
                            {{ bonus }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- 2. 下方常规属性列表 (攻击、防御、生存) -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div 
                v-for="group in groupedStats.filter(g => !['角色基础属性', '主神属性'].includes(g.name))" 
                :key="group.name"
                class="flex flex-col gap-6 bg-slate-50/30 p-8 rounded-[3rem] border border-slate-100/50"
              >
                <!-- 分组标题 -->
                <div class="flex items-center gap-4 px-2">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-4 border-white" :class="group.bg">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" v-html="group.iconSvg" :class="group.color"></svg>
                  </div>
                  <div>
                    <h4 class="font-black text-slate-800 text-xl tracking-tight uppercase">{{ group.name }}</h4>
                    <div class="h-1 w-12 rounded-full mt-1" :class="group.bg.replace('bg-', 'bg-').split(' ')[0]"></div>
                  </div>
                </div>

                <!-- 属性列表 (垂直列表模式) -->
                <div class="space-y-3">
                  <div 
                    v-for="stat in group.list" 
                    :key="stat.type"
                    class="p-4 rounded-[2rem] bg-white border-2 border-slate-50 shadow-sm transition-all hover:shadow-md hover:border-sky-100"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <!-- <div class="w-9 h-9 rounded-xl bg-slate-50 shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                          <div v-if="stat.iconSvg" v-html="stat.iconSvg" class="w-5 h-5 flex items-center justify-center"></div>
                          <div v-else class="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        </div> -->
                        <div class="flex flex-col">
                          <span class="text-[8px] font-black text-slate-300 uppercase mb-0.5">{{ stat.type }}</span>
                          <span class="text-sm font-black text-slate-600">{{ stat.name }}</span>
                        </div>
                      </div>
                      <div class="flex flex-col items-end">
                        <span class="text-lg font-black tracking-tighter" :class="group.color">{{ stat.value }}</span>
                        <span v-if="stat.extra" class="text-[9px] font-black text-emerald-500">+{{ stat.extra }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 装备概览 -->
      <div class="space-y-8">
        <!-- 装备概览 -->
        <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
           <h3 class="font-black text-sky-900 text-xl mb-6 flex items-center gap-3">
             <span class="bg-yellow-100 p-2 rounded-2xl">🎒</span> 装备概览
           </h3>
           <div v-if="loadingEquipment" class="text-center py-12">
             <div class="inline-flex flex-col items-center gap-3">
               <svg class="w-12 h-12 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                 <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4522" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="opacity-75"></path>
               </svg>
               <span class="text-slate-400 font-black">正在解析深度装备数据...</span>
             </div>
           </div>
           <div v-else-if="equipmentList.length === 0" class="text-center py-12 text-slate-400 font-black">暂无装备档案</div>
           <div v-else class="space-y-16">
             <!-- 分组展示普通装备 -->
             <div v-for="group in groupedEquipment" :key="group.label" class="space-y-8">
               <div class="flex items-center gap-3">
                 <span class="p-2 rounded-2xl text-xl" :class="group.theme">{{ group.icon }}</span>
                 <h4 class="font-black text-sky-900 text-xl tracking-widest">{{ group.label }}</h4>
                 <div class="flex-1 h-px bg-slate-100 ml-4"></div>
               </div>
               
               <div v-for="(row, rIdx) in group.rows" :key="rIdx" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <template v-for="item in row" :key="item.isPlaceholder ? item.slotPosName : item.id">
                   <!-- 实际装备卡片 -->
                   <div 
                     v-if="!item.isPlaceholder"
                     class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                     :class="getGradeInfo(item.grade).border"
                   >
                     <!-- 卡片背景装饰 -->
                     <div 
                       class="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"
                       :class="getGradeInfo(item.grade).light"
                     ></div>

                     <!-- 头部：部位与品质 -->
                     <div class="px-6 pt-6 flex items-center justify-between mb-4">
                       <div class="flex items-center gap-2">
                         <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
                           {{ slotMap[item.slotPosName] || item.slotPosName }}
                         </span>
                         <span v-if="item.exceedLevel > 0" class="px-3 py-1 rounded-full text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-100 shadow-sm">
                           突破 {{ item.exceedLevel }}
                         </span>
                       </div>
                       <div class="flex flex-col items-end gap-1">
                         <div 
                           class="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-widest bg-gradient-to-r"
                           :class="getGradeInfo(item.grade).gradient"
                         >
                           {{ getGradeInfo(item.grade).name }}
                         </div>
                         <div class="text-[8px] font-bold text-slate-400 opacity-60">{{ getGradeInfo(item.grade).desc }}</div>
                       </div>
                     </div>

                     <!-- 主体：图标与名称 -->
                     <div class="px-6 flex items-start gap-5 mb-6">
                       <div class="relative shrink-0 group-hover:scale-105 transition-transform">
                         <div class="w-20 h-20 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-slate-50 relative z-10">
                           <img :src="formatIconUrl(item.icon)" class="w-full h-full object-cover p-2" />
                         </div>
                         <!-- 强化浮标 -->
                         <div v-if="item.enchantLevel > 0" class="absolute -top-2 -right-2 z-20 bg-red-500 text-white text-xs font-black w-8 h-8 flex items-center justify-center rounded-full border-4 border-white shadow-lg">
                           +{{ item.enchantLevel }}
                         </div>
                         <!-- 稀度光环 -->
                         <div 
                           class="absolute inset-0 blur-xl opacity-30 rounded-full"
                           :class="getGradeInfo(item.grade).light"
                         ></div>
                       </div>

                       <div class="flex-1 min-w-0 pt-1">
                         <h4 class="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-2" :title="item.name">{{ item.name }}</h4>
                         <div class="flex flex-wrap items-center gap-2">
                           <span class="text-[10px] font-mono text-slate-300">#{{ item.id }}</span>
                           <span v-if="item.fullDetail?.categoryName" class="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                             {{ item.fullDetail.categoryName }}
                           </span>
                           <span v-if="item.fullDetail?.equipLevel" class="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                             需求等级 {{ item.fullDetail.equipLevel }}
                           </span>
                         </div>
                       </div>
                     </div>

                     <!-- 数据详情区 -->
                     <div class="px-6 pb-6 mt-auto space-y-4">
                       <!-- 主属性区 (带强化加成) -->
                       <div v-if="item.fullDetail?.mainStats?.length" class="space-y-2">
                         <div class="flex items-center gap-2 mb-1">
                           <span class="w-1 h-3 bg-sky-400 rounded-full"></span>
                           <span class="text-[10px] font-black text-slate-400 uppercase">基础属性</span>
                         </div>
                         <div class="grid grid-cols-1 gap-1.5">
                           <div v-for="(stat, sIdx) in item.fullDetail.mainStats" :key="sIdx" class="flex items-center justify-between bg-white border border-slate-50 p-2 rounded-xl shadow-sm">
                             <span class="text-xs text-slate-500 font-bold">{{ stat.name }}</span>
                             <div class="flex items-center gap-1.5">
                               <span class="text-xs text-slate-800 font-black">{{ stat.value }}</span>
                               <span v-if="stat.extra && stat.extra !== '0' && stat.extra !== '0%'" class="text-[10px] text-red-500 font-black">
                                 (+{{ stat.extra }})
                               </span>
                             </div>
                           </div>
                         </div>
                       </div>

                       <!-- 附加属性列表 (SubStats) -->
                       <div v-if="item.fullDetail?.subStats?.length" class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-inner">
                         <div class="flex items-center gap-2 mb-3">
                           <span class="w-1 h-3 bg-purple-400 rounded-full"></span>
                           <span class="text-[10px] font-black text-slate-400 uppercase">随机属性</span>
                         </div>
                         <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                           <div v-for="(stat, sIdx) in item.fullDetail.subStats" :key="sIdx" class="flex items-center justify-between">
                             <span class="text-[11px] text-slate-400 font-bold truncate">{{ stat.name }}</span>
                             <span class="text-[11px] text-slate-600 font-black">+{{ stat.value }}</span>
                           </div>
                         </div>
                       </div>

                       <!-- 神石详情 (GodStone) -->
                       <div v-if="item.fullDetail?.godStoneStat?.length" class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-100 shadow-sm">
                         <div v-for="(god, gIdx) in item.fullDetail.godStoneStat" :key="gIdx" class="flex gap-3">
                           <div class="w-10 h-10 shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                             <img :src="formatIconUrl(god.icon)" class="w-full h-full object-contain p-1" />
                           </div>
                           <div class="min-w-0">
                             <div class="text-xs font-black text-amber-700 mb-1">{{ god.name }}</div>
                             <div class="text-[9px] text-amber-600/80 font-bold leading-tight line-clamp-2" :title="god.desc">{{ god.desc }}</div>
                           </div>
                         </div>
                       </div>

                       <!-- 魔石/灵石详情 (详细展示) -->
                       <div v-if="item.fullDetail?.magicStoneStat?.length || item.fullDetail?.magicStoneSlotCount" class="bg-white rounded-2xl p-4 border border-slate-50 shadow-sm space-y-3">
                         <div class="flex items-center justify-between mb-1">
                           <div class="flex items-center gap-2">
                             <span class="w-1 h-3 bg-emerald-400 rounded-full"></span>
                             <span class="text-[10px] font-black text-slate-400 uppercase">镶嵌魔石</span>
                           </div>
                           <span class="text-[9px] font-bold text-slate-300">槽位: {{ item.fullDetail.magicStoneStat?.length || 0 }}/{{ item.fullDetail.magicStoneSlotCount || 0 }}</span>
                         </div>
                         
                         <div class="grid grid-cols-2 gap-2">
                           <!-- 已镶嵌魔石 -->
                           <div 
                             v-for="(stone, stIdx) in item.fullDetail.magicStoneStat" 
                             :key="stIdx"
                             class="flex items-center gap-2 p-2 rounded-xl border transition-all hover:shadow-md group/stone"
                             :class="[
                               stone.grade === 'Legend' ? 'bg-orange-50 border-orange-100' : 
                               stone.grade === 'Unique' ? 'bg-purple-50 border-purple-100' : 
                               stone.grade === 'Rare' ? 'bg-blue-50 border-blue-100' : 
                               'bg-slate-50 border-slate-100'
                             ]"
                           >
                             <div class="w-6 h-6 shrink-0 relative">
                               <img :src="formatIconUrl(stone.icon)" class="w-full h-full object-contain" />
                               <!-- 品质小点 -->
                               <div 
                                 class="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white"
                                 :class="[
                                   stone.grade === 'Legend' ? 'bg-orange-500' : 
                                   stone.grade === 'Unique' ? 'bg-purple-500' : 
                                   stone.grade === 'Rare' ? 'bg-blue-500' : 
                                   'bg-slate-400'
                                 ]"
                               ></div>
                             </div>
                             <div class="min-w-0">
                               <div class="text-[10px] font-black text-slate-700 truncate leading-none mb-1">{{ stone.name }}</div>
                               <div 
                                 class="text-[10px] font-black"
                                 :class="[
                                   stone.grade === 'Legend' ? 'text-orange-600' : 
                                   stone.grade === 'Unique' ? 'text-purple-600' : 
                                   stone.grade === 'Rare' ? 'text-blue-600' : 
                                   'text-slate-500'
                                 ]"
                               >
                                 {{ stone.value }}
                               </div>
                             </div>
                           </div>
                           
                           <!-- 空槽位 -->
                           <div 
                             v-for="i in Math.max(0, (item.fullDetail.magicStoneSlotCount || 0) - (item.fullDetail.magicStoneStat?.length || 0))" 
                             :key="'empty-'+i"
                             class="flex items-center gap-2 p-2 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 text-slate-200"
                           >
                             <div class="w-6 h-6 flex items-center justify-center text-lg">+</div>
                             <div class="text-[10px] font-bold">待镶嵌</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <!-- 占位卡片 -->
                   <div v-else class="flex flex-col bg-slate-50/50 rounded-[2.5rem] border-4 border-dashed border-slate-100 opacity-60">
                     <div class="px-6 pt-6 flex items-center justify-between mb-4">
                       <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white text-slate-300 border border-slate-100 shadow-sm">
                         {{ slotMap[item.slotPosName] || item.slotPosName }}
                       </span>
                     </div>
                     <div class="px-6 flex flex-col items-center justify-center py-12 gap-4">
                       <div class="w-16 h-16 rounded-3xl border-4 border-white shadow-inner bg-white flex items-center justify-center text-slate-100">
                         <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                         </svg>
                       </div>
                       <span class="text-xs font-black text-slate-200 tracking-widest uppercase">待装备</span>
                     </div>
                   </div>
                 </template>
               </div>
             </div>

             <!-- 符文专区：独立一行 -->
             <div class="space-y-8">
               <div class="flex items-center gap-3">
                 <span class="w-2 h-6 bg-amber-400 rounded-full"></span>
                 <h4 class="font-black text-amber-900 text-lg tracking-widest">古代符文</h4>
               </div>
               <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <template v-for="item in runeRow" :key="item.isPlaceholder ? item.slotPosName : item.id">
                   <!-- 实际符文卡片 -->
                   <div 
                     v-if="!item.isPlaceholder"
                     class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                     :class="getGradeInfo(item.grade).border"
                   >
                     <!-- 卡片背景装饰 -->
                     <div class="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" :class="getGradeInfo(item.grade).light"></div>

                     <!-- 头部 -->
                     <div class="px-6 pt-6 flex items-center justify-between mb-4">
                       <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-50 text-amber-500 border border-amber-100 shadow-sm">
                         {{ slotMap[item.slotPosName] || item.slotPosName }}
                       </span>
                       <div class="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-widest bg-gradient-to-r" :class="getGradeInfo(item.grade).gradient">
                         {{ getGradeInfo(item.grade).name }}
                       </div>
                     </div>

                     <!-- 主体 -->
                     <div class="px-6 flex items-start gap-5 mb-6">
                       <div class="relative shrink-0 group-hover:scale-105 transition-transform">
                         <div class="w-20 h-20 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-slate-50 relative z-10">
                           <img :src="formatIconUrl(item.icon)" class="w-full h-full object-cover p-2" />
                         </div>
                         <div class="absolute inset-0 blur-xl opacity-30 rounded-full" :class="getGradeInfo(item.grade).light"></div>
                       </div>
                       <div class="flex-1 min-w-0 pt-1">
                         <h4 class="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-2">{{ item.name }}</h4>
                         <span class="text-[10px] font-mono text-slate-300">#{{ item.id }}</span>
                       </div>
                     </div>

                     <!-- 属性数据 -->
                     <div v-if="item.fullDetail" class="px-6 pb-6 mt-auto space-y-3">
                       <div v-if="item.fullDetail.mainStats?.length" class="grid grid-cols-1 gap-1.5">
                         <div v-for="(stat, sIdx) in item.fullDetail.mainStats" :key="sIdx" class="flex items-center justify-between bg-amber-50/30 border border-amber-50 p-2 rounded-xl">
                           <span class="text-xs text-amber-600 font-bold">{{ stat.name }}</span>
                           <span class="text-xs text-amber-900 font-black">{{ stat.value }}</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   <!-- 符文占位 -->
                   <div v-else class="flex flex-col bg-amber-50/20 rounded-[2.5rem] border-4 border-dashed border-amber-100 opacity-40">
                     <div class="px-6 pt-6 flex items-center justify-between mb-4">
                       <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white text-amber-200 border border-amber-50 shadow-sm">
                         {{ slotMap[item.slotPosName] || item.slotPosName }}
                       </span>
                     </div>
                     <div class="px-6 flex flex-col items-center justify-center py-12 gap-4">
                       <div class="w-16 h-16 rounded-3xl border-4 border-white shadow-inner bg-white flex items-center justify-center text-amber-50">
                         <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                         </svg>
                       </div>
                       <span class="text-xs font-black text-amber-100 tracking-widest uppercase">未开启</span>
                     </div>
                   </div>
                 </template>
               </div>
             </div>

             <!-- 阿卡纳专区：独立一行 -->
             <div v-if="arcanaList.length > 0" class="pt-8">
               <div class="flex items-center gap-3 mb-8">
                 <span class="bg-indigo-100 p-2 rounded-2xl text-xl">✨</span>
                 <h3 class="font-black text-indigo-900 text-xl">阿卡纳组合</h3>
                 <span class="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl font-black shadow-sm">{{ arcanaList.length }} / 5</span>
               </div>
               
               <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                 <div 
                   v-for="item in arcanaList" 
                   :key="item.id" 
                   class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                   :class="getGradeInfo(item.grade).border"
                 >
                   <!-- 头部：部位 -->
                   <div class="px-6 pt-6 flex items-center justify-between mb-4">
                     <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-500 border border-indigo-100 shadow-sm">
                       {{ slotMap[item.slotPosName] || item.slotPosName }}
                     </span>
                     <div 
                       class="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-widest bg-gradient-to-r"
                       :class="getGradeInfo(item.grade).gradient"
                     >
                       {{ getGradeInfo(item.grade).name }}
                     </div>
                   </div>

                   <!-- 主体：图标与名称 -->
                   <div class="px-6 flex flex-col items-center text-center gap-4 mb-6">
                     <div class="relative shrink-0 group-hover:scale-110 transition-transform duration-500">
                       <div class="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-slate-50 relative z-10 p-2">
                         <img :src="formatIconUrl(item.icon)" class="w-full h-full object-contain" />
                       </div>
                       <!-- 强化浮标 -->
                       <div v-if="item.enchantLevel > 0" class="absolute -top-2 -right-2 z-20 bg-indigo-600 text-white text-xs font-black w-8 h-8 flex items-center justify-center rounded-full border-4 border-white shadow-lg">
                         +{{ item.enchantLevel }}
                       </div>
                       <!-- 稀有度光环 -->
                       <div 
                         class="absolute inset-0 blur-2xl opacity-40 rounded-full"
                         :class="getGradeInfo(item.grade).light"
                       ></div>
                     </div>

                     <div class="min-w-0">
                       <h4 class="text-base font-black text-slate-800 leading-tight mb-1">{{ item.name }}</h4>
                       <span class="text-[10px] font-mono text-slate-300">#{{ item.id }}</span>
                     </div>
                   </div>

                   <!-- 阿卡纳详情数据区 -->
                   <div v-if="item.fullDetail" class="px-6 pb-6 mt-auto space-y-4">
                     <!-- 1. 套装信息 (Set Info) -->
                     <div v-if="item.fullDetail.set" class="bg-indigo-900/5 rounded-2xl p-4 border border-indigo-100/50">
                       <div class="flex items-center justify-between mb-3">
                         <div class="flex items-center gap-2">
                           <span class="w-1.5 h-3 bg-indigo-500 rounded-full"></span>
                           <span class="text-[11px] font-black text-indigo-900">套装: {{ item.fullDetail.set.name }}</span>
                         </div>
                         <span class="text-[10px] font-black text-indigo-500 bg-white px-2 py-0.5 rounded-lg shadow-sm">
                           {{ item.fullDetail.set.equippedCount }} / {{ item.fullDetail.set.items?.length }}
                         </span>
                       </div>
                       
                       <!-- 已激活套装属性 -->
                       <div v-if="item.fullDetail.set.bonuses?.length" class="space-y-1.5">
                         <div 
                           v-for="(bonus, bIdx) in item.fullDetail.set.bonuses" 
                           :key="bIdx"
                           class="flex items-start gap-2"
                           :class="item.fullDetail.set.equippedCount >= bonus.degree ? 'opacity-100' : 'opacity-40 grayscale'"
                         >
                           <span class="shrink-0 w-4 h-4 rounded-md bg-indigo-100 text-[10px] flex items-center justify-center font-black text-indigo-600">
                             {{ bonus.degree }}
                           </span>
                           <div class="flex-1">
                             <div v-for="(desc, dIdx) in bonus.descriptions" :key="dIdx" class="text-[10px] font-bold text-indigo-800 leading-tight">
                               {{ desc }}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>

                     <!-- 2. 主属性区 -->
                     <div v-if="item.fullDetail.mainStats?.length" class="space-y-2">
                       <div class="flex items-center gap-2 mb-1">
                         <span class="w-1 h-3 bg-indigo-400 rounded-full"></span>
                         <span class="text-[10px] font-black text-slate-400 uppercase">基础加成</span>
                       </div>
                       <div class="grid grid-cols-1 gap-1.5">
                         <div v-for="(stat, sIdx) in item.fullDetail.mainStats" :key="sIdx" class="flex items-center justify-between bg-white border border-slate-50 p-2 rounded-xl shadow-sm">
                           <span class="text-xs text-slate-500 font-bold">{{ stat.name }}</span>
                           <div class="flex items-center gap-1.5">
                             <span class="text-xs text-indigo-900 font-black">{{ stat.value }}</span>
                             <span v-if="stat.extra && stat.extra !== '0'" class="text-[10px] text-red-500 font-black">
                               (+{{ stat.extra }})
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <!-- 3. 副技能区 (SubSkills) -->
                     <div v-if="item.fullDetail.subSkills?.length" class="bg-white rounded-2xl p-4 border border-slate-50 shadow-sm space-y-3">
                       <div class="flex items-center gap-2 mb-1">
                         <span class="w-1 h-3 bg-purple-400 rounded-full"></span>
                         <span class="text-[10px] font-black text-slate-400 uppercase">附加技能</span>
                       </div>
                       <div class="grid grid-cols-1 gap-2">
                         <div 
                           v-for="(skill, skIdx) in item.fullDetail.subSkills" 
                           :key="skIdx"
                           class="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-purple-200 transition-colors group/skill"
                         >
                           <div class="w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-white shadow-sm bg-white p-0.5">
                             <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-contain" />
                           </div>
                           <div class="flex-1 min-w-0">
                             <div class="text-[11px] font-black text-slate-700 truncate mb-0.5">{{ skill.name }}</div>
                             <div class="text-[9px] font-bold text-purple-500">等级 {{ skill.level }}</div>
                           </div>
                         </div>
                       </div>
                     </div>

                     <!-- 4. 随机属性 (如果存在) -->
                     <div v-if="item.fullDetail.subStats?.length" class="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50 shadow-inner">
                       <div class="flex items-center gap-2 mb-3">
                         <span class="w-1 h-3 bg-indigo-300 rounded-full"></span>
                         <span class="text-[10px] font-black text-slate-400 uppercase">附加能力</span>
                       </div>
                       <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                         <div v-for="(stat, sIdx) in item.fullDetail.subStats" :key="sIdx" class="flex items-center justify-between">
                           <span class="text-[11px] text-slate-400 font-bold truncate">{{ stat.name }}</span>
                           <span class="text-[11px] text-indigo-600 font-black">+{{ stat.value }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <!-- 角色技能 -->
        <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
           <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center gap-3">
             <span class="bg-purple-100 p-2 rounded-2xl">⚡</span> 角色技能
           </h3>
           
           <div v-if="loadingEquipment" class="text-center py-8 text-slate-400 font-bold">读取技能信息中...</div>
           <div v-else-if="skillList.length === 0" class="text-center py-8 text-slate-400 font-bold">暂无技能数据</div>
           
           <div v-else class="space-y-12">
             <!-- 主动技能 -->
             <div v-if="activeSkills.length > 0">
               <div class="flex items-center gap-3 mb-6">
                 <span class="w-1.5 h-6 bg-[#45a6d5] rounded-full"></span>
                 <h4 class="font-black text-sky-800 text-lg">主动技能</h4>
                 <span class="text-xs bg-sky-50 text-sky-600 px-3 py-1 rounded-xl font-black shadow-sm">{{ activeSkills.length }}</span>
               </div>
               <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-x-4 gap-y-8">
                 <div 
                   v-for="skill in activeSkills" 
                   :key="skill.id" 
                   class="flex flex-col items-center gap-2 group cursor-pointer"
                   :title="skill.name"
                 >
                   <div 
                     class="relative w-full aspect-square rounded-2xl border-2 transition-all overflow-hidden"
                     :class="[
                       skill.skillLevel === 0 ? 'opacity-40 grayscale border-slate-200' : 'border-white shadow-md group-hover:border-sky-300 group-hover:-translate-y-1'
                     ]"
                   >
                     <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-cover" />
                     <div class="absolute bottom-0 left-0 right-0 py-1 text-[10px] font-black text-center text-white" :class="skill.skillLevel === 0 ? 'bg-slate-400' : 'bg-[#45a6d5]/90'">
                       Lv.{{ skill.skillLevel }}
                     </div>
                     <div v-if="skill.equip === 1" class="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                   </div>
                   <div class="text-[10px] font-black text-slate-600 text-center leading-tight truncate w-full px-1" :class="{ 'text-slate-400': skill.skillLevel === 0 }">
                     {{ skill.name }}
                   </div>
                 </div>
               </div>
             </div>

             <!-- 烙印技能 -->
             <div v-if="stigmaSkills.length > 0">
               <div class="flex items-center gap-3 mb-6">
                 <span class="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                 <h4 class="font-black text-purple-800 text-lg">烙印技能</h4>
                 <span class="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-xl font-black shadow-sm">{{ stigmaSkills.length }}</span>
               </div>
               <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-x-4 gap-y-8">
                 <div 
                   v-for="skill in stigmaSkills" 
                   :key="skill.id" 
                   class="flex flex-col items-center gap-2 group cursor-pointer"
                   :title="skill.name"
                 >
                   <div 
                     class="relative w-full aspect-square rounded-2xl border-2 transition-all overflow-hidden"
                     :class="[
                       skill.skillLevel === 0 ? 'opacity-40 grayscale border-slate-200' : 'border-purple-200 shadow-md group-hover:border-purple-400 group-hover:-translate-y-1'
                     ]"
                   >
                     <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-cover" />
                     <div class="absolute bottom-0 left-0 right-0 py-1 text-[10px] font-black text-center text-white" :class="skill.skillLevel === 0 ? 'bg-slate-400' : 'bg-purple-500/90'">
                       Lv.{{ skill.skillLevel }}
                     </div>
                     <div v-if="skill.equip === 1" class="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                   </div>
                   <div class="text-[10px] font-black text-purple-700 text-center leading-tight truncate w-full px-1" :class="{ 'text-slate-400': skill.skillLevel === 0 }">
                     {{ skill.name }}
                   </div>
                 </div>
               </div>
             </div>

             <!-- 被动技能 -->
             <div v-if="passiveSkills.length > 0">
               <div class="flex items-center gap-3 mb-6">
                 <span class="w-1.5 h-6 bg-slate-400 rounded-full"></span>
                 <h4 class="font-black text-slate-700 text-lg">被动技能</h4>
                 <span class="text-xs bg-slate-50 text-slate-500 px-3 py-1 rounded-xl font-black shadow-sm">{{ passiveSkills.length }}</span>
               </div>
               <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-x-4 gap-y-8">
                 <div 
                   v-for="skill in passiveSkills" 
                   :key="skill.id" 
                   class="flex flex-col items-center gap-2 group cursor-pointer"
                   :title="skill.name"
                 >
                   <div 
                     class="relative w-full aspect-square rounded-2xl border-2 transition-all overflow-hidden"
                     :class="[
                       skill.skillLevel === 0 ? 'opacity-40 grayscale border-slate-200' : 'border-slate-100 shadow-sm group-hover:border-slate-300 group-hover:-translate-y-1'
                     ]"
                   >
                     <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-cover" />
                     <div class="absolute bottom-0 left-0 right-0 py-1 text-[10px] font-black text-center text-white" :class="skill.skillLevel === 0 ? 'bg-slate-400' : 'bg-slate-500/90'">
                       Lv.{{ skill.skillLevel }}
                     </div>
                   </div>
                   <div class="text-[10px] font-black text-slate-500 text-center leading-tight truncate w-full px-1" :class="{ 'text-slate-400': skill.skillLevel === 0 }">
                     {{ skill.name }}
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <!-- 伙伴与外观 -->
        <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
           <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center gap-3">
             <span class="bg-pink-100 p-2 rounded-2xl">🦋</span> 伙伴与外观
           </h3>
           <div v-if="loadingEquipment" class="text-center py-8 text-slate-400 font-bold">读取外观信息中...</div>
           <div v-else-if="!pet && !wing && skinList.length === 0" class="text-center py-8 text-slate-400 font-bold">暂无相关数据</div>
           <div v-else class="space-y-10">
              <!-- 宠物伙伴 -->
              <div v-if="pet">
                <div class="flex items-center gap-3 mb-4">
                  <span class="w-1.5 h-5 bg-sky-400 rounded-full"></span>
                  <h4 class="font-black text-sky-800 text-sm">宠物伙伴</h4>
                </div>
                <div class="flex flex-wrap gap-4">
                  <div class="flex items-center gap-4 bg-[#F0F9FF] p-4 rounded-3xl border-2 border-white shadow-sm min-w-[240px] hover:scale-[1.02] transition-transform">
                    <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-sky-100 shadow-inner shrink-0">
                      <img :src="formatIconUrl(pet.icon)" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="text-[10px] text-sky-400 font-black uppercase mb-0.5 tracking-tighter">Companion</div>
                      <div class="text-sky-900 font-black text-lg leading-tight">{{ pet.name }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 飞行翅膀 -->
              <div v-if="wing">
                <div class="flex items-center gap-3 mb-4">
                  <span class="w-1.5 h-5 bg-pink-400 rounded-full"></span>
                  <h4 class="font-black text-pink-800 text-sm">飞行翅膀</h4>
                </div>
                <div class="flex flex-wrap gap-4">
                  <div class="flex items-center gap-4 bg-[#FDF2F8] p-4 rounded-3xl border-2 border-white shadow-sm min-w-[240px] hover:scale-[1.02] transition-transform">
                    <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-pink-100 shadow-inner shrink-0">
                      <img :src="formatIconUrl(wing.icon)" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="text-[10px] text-pink-400 font-black uppercase mb-0.5 tracking-tighter">Wings</div>
                      <div class="text-pink-900 font-black text-lg leading-tight">{{ wing.name }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 时装外观 -->
              <div v-if="skinList.length > 0">
                <div class="flex items-center gap-3 mb-4">
                  <span class="w-1.5 h-5 bg-purple-400 rounded-full"></span>
                  <h4 class="font-black text-purple-800 text-sm">时装外观</h4>
                  <span class="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-bold">{{ skinList.length }}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div v-for="skin in skinList" :key="skin.id" class="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-white shadow-sm hover:scale-[1.02] transition-transform group">
                    <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-inner shrink-0">
                      <img :src="formatIconUrl(skin.icon)" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div class="text-[10px] text-slate-400 font-black uppercase mb-0.5 tracking-tighter">Costume</div>
                      <div class="text-slate-800 font-black text-base leading-tight">{{ skin.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <!-- 称号成就 -->
        <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
          <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center gap-3">
            <span class="bg-amber-100 p-2 rounded-2xl">🏆</span> 称号成就馆
          </h3>
          <div v-if="!member.title_list?.length" class="text-center py-12 text-slate-400 font-black">暂无称号档案</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="title in member.title_list" 
              :key="title.id"
              class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-lg group relative overflow-hidden"
              :class="[
                title.equipCategory ? 'border-sky-200 shadow-md scale-[1.02]' : 'border-slate-50 opacity-80 hover:opacity-100'
              ]"
            >
              <!-- 佩戴角标 -->
              <div v-if="title.equipCategory" class="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl shadow-sm z-20">
                已佩戴 ({{ getEquipCategoryLabel(title.equipCategory) }})
              </div>

              <!-- 称号标题 -->
              <div class="px-6 pt-6 pb-4">
                <div class="flex items-center gap-2 mb-2">
                  <span 
                    class="px-2 py-0.5 rounded-md text-[9px] font-black text-white uppercase tracking-widest"
                    :class="getGradeInfo(title.grade).bg"
                  >
                    {{ getGradeInfo(title.grade).name }}
                  </span>
                  <span v-if="title.ownedPercent" class="text-[9px] font-bold text-slate-300">持有率 {{ title.ownedPercent }}%</span>
                </div>
                <h4 class="text-lg font-black text-slate-800 leading-tight">{{ title.name }}</h4>
              </div>

              <!-- 属性列表 -->
              <div class="px-6 pb-6 space-y-3">
                <!-- 基础属性 -->
                <div v-if="title.statList?.length" class="space-y-1">
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">基础加成</div>
                  <div v-for="(stat, sIdx) in title.statList" :key="sIdx" class="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    {{ stat.desc }}
                  </div>
                </div>

                <!-- 佩戴属性 -->
                <div v-if="title.equipStatList?.length" class="space-y-1">
                  <div class="text-[9px] font-black text-sky-400 uppercase tracking-tighter mb-1">佩戴额外加成</div>
                  <div class="grid grid-cols-1 gap-1">
                    <div v-for="(stat, sIdx) in title.equipStatList" :key="sIdx" class="text-xs font-black text-sky-700 bg-sky-50/50 px-3 py-1.5 rounded-xl border border-sky-100">
                      {{ stat.desc }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 档案备注 -->
        <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
          <h3 class="font-black text-sky-900 text-xl mb-6 flex items-center gap-3">
            <span class="bg-slate-100 p-2 rounded-2xl">📝</span> 档案备注
          </h3>
          <div class="bg-[#F0F9FF] p-8 rounded-[2rem] text-sky-800 font-bold text-lg leading-relaxed border-2 border-white shadow-inner">
            {{ member.note || '暂无详细备注信息。这只宝宝似乎很低调，还没有填写个性签名。' }}
          </div>
        </div>
      </div>
    </main>

    <!-- 底部动态草地层 -->
    <div class="relative w-full h-32 md:h-48 pointer-events-none overflow-hidden z-0 opacity-80 mt-10">
      <!-- 远景草坡 -->
      <svg class="absolute bottom-0 w-[120%] -left-[10%] h-full text-[#A3D95B]" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,20 1200,60 L1200,120 L0,120 Z" fill="currentColor"/>
      </svg>
      
      <!-- 近景草坡 (带波浪动画) -->
      <svg class="absolute -bottom-4 w-[150%] -left-[25%] h-[80%] text-[#B2E455] animate-grass-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,60 C300,20 600,100 900,40 C1050,10 1200,80 1200,80 L1200,150 L0,150 Z" fill="currentColor"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { $alert, $loading } = useNuxtApp()

const loading = ref(true)
const syncing = ref(false)
const member = ref(null)

// 新增：装备技能相关状态
const loadingEquipment = ref(false)
const skillList = ref([])
const equipmentList = ref([])

// 区分普通装备与阿卡纳
 const normalEquipment = computed(() => equipmentList.value.filter(item => !item.slotPosName?.startsWith('Arcana') && !item.slotPosName?.startsWith('Rune')))
 const arcanaList = computed(() => equipmentList.value.filter(item => item.slotPosName?.startsWith('Arcana')))
 
 // 装备布局分组配置
  const layoutGroups = [
    { 
      label: '神兵利器', 
      icon: '⚔️', 
      theme: 'bg-rose-100 text-rose-600', 
      dot: 'bg-rose-400',
      pairs: [['MainHand', 'SubHand']] 
    },
    { 
      label: '战阵护甲', 
      icon: '🛡️', 
      theme: 'bg-blue-100 text-blue-600', 
      dot: 'bg-blue-400',
      pairs: [['Torso', 'Pants'], ['Shoulder', 'Gloves'], ['Helmet', 'Boots']] 
    },
    { 
      label: '奇珍饰品', 
      icon: '💍', 
      theme: 'bg-amber-100 text-amber-600', 
      dot: 'bg-amber-400',
      pairs: [['Necklace', 'Amulet'], ['Earring1', 'Earring2'], ['Ring1', 'Ring2'], ['Belt', 'Cape'], ['Bracelet1', 'Bracelet2']] 
    }
  ]

 const groupedEquipment = computed(() => {
   return layoutGroups.map(group => {
     return {
       label: group.label,
       rows: group.pairs.map(pair => {
         return pair.map(slot => {
           const item = equipmentList.value.find(e => e.slotPosName === slot)
           return item || { slotPosName: slot, isPlaceholder: true }
         })
       })
     }
   })
 })

 const runeRow = computed(() => {
   const pair = ['Rune1', 'Rune2']
   return pair.map(slot => {
     const item = equipmentList.value.find(e => e.slotPosName === slot)
     return item || { slotPosName: slot, isPlaceholder: true }
   })
 })

// 技能分类
const activeSkills = computed(() => skillList.value.filter(s => s.category === 'Active'))
const passiveSkills = computed(() => skillList.value.filter(s => s.category === 'Passive'))
const stigmaSkills = computed(() => skillList.value.filter(s => s.category === 'Dp'))

const pet = ref(null)
const wing = ref(null)
const skinList = ref([])

// 获取佩戴中的称号对象
const equippedTitles = computed(() => {
  if (!member.value?.title_list || !Array.isArray(member.value.title_list)) return []
  return member.value.title_list.filter(t => t.equipCategory)
})

// 获取所有佩戴称号的详细数值卡片
const equippedTitleStats = computed(() => {
  if (!member.value?.title_list || !Array.isArray(member.value.title_list)) return []
  
  const allStats = []
  member.value.title_list.forEach(title => {
    if (title.equipCategory) {
      // 收集基础属性
      if (title.statList) {
        title.statList.forEach(s => {
          if (s.desc) allStats.push({ 
            id: `${title.id}-base`, 
            name: title.name, 
            value: s.desc, 
            category: title.equipCategory,
            type: 'base'
          })
        })
      }
      // 收集佩戴属性
      if (title.equipStatList) {
        title.equipStatList.forEach(s => {
          if (s.desc) allStats.push({ 
            id: `${title.id}-equip`, 
            name: title.name, 
            value: s.desc, 
            category: title.equipCategory,
            type: 'extra'
          })
        })
      }
    }
  })
  return allStats
})

// 新增：获取角色核心战斗属性 (HP, MP, 攻击等)
const coreCombatStats = computed(() => {
  if (!member.value?.equipment_data?.raw_info?.stat?.statList) return []
  
  const stats = member.value.equipment_data.raw_info.stat.statList
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

// 获取属性图标
/**
 * Aion 2 属性图标获取函数
 * 包含：基础属性 (Main), 神性属性 (Lords), 战斗属性 (Combat)
 */
/**
 * Aion 2 属性图标获取函数 - 纯 SVG 驱动版
 */
const getStatIcon = (type) => {
  if (!type) return { svg: null }
  
  const upperType = type.toUpperCase()

  // 颜色定义 (符合 Aion 2 视觉规范)
  const COLORS = {
    EPIC: '#FF3E3E',      // 红色 (Epic/攻击)
    LORD: '#FFD700',      // 金色 (主神属性)
    MAGIC: '#4DA6FF',     // 蓝色 (魔法/智力)
    PHYSICAL: '#FFA24D',  // 橙色 (物理/力量)
    SURVIVAL: '#4DFF88',  // 绿色 (生命/生存)
    UTILITY: '#A78BFA',   // 紫色 (特殊/速度)
    DEFAULT: '#94A3B8'    // 灰色 (基础)
  }

  // 扩展 SVG 路径库 (24x24 视口)
  const paths = {
    // 基础 7 维
    STR: '<path d="M12 2l3.5 3.5L12 9l-3.5-3.5L12 2zM5 11l3.5 3.5L5 18l-3.5-3.5L5 11zM19 11l3.5 3.5L19 18l-3.5-3.5L19 11zM12 13l3.5 3.5L12 20l-3.5-3.5L12 13z" fill="currentColor"/>',
    DEX: '<path d="M13 3l-2 3h10l-9 14 2-3H4l9-14z" fill="currentColor"/>',
    INT: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    WIS: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2"/>',
    VIT: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',
    CON: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2"/>',
    AGI: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>',
    
    // 主神/神性图标
    LordBase: '<path d="M12 2l2.4 7.6H22l-6.2 4.5L18.2 22l-6.2-4.8L5.8 22l2.4-7.9L2 9.6h7.6L12 2z" fill="currentColor"/>',
    Justice: '<path d="M12 3L4 9v11l8 3 8-3V9l-8-6zm0 14a3 3 0 110-6 3 3 0 010 6z" fill="currentColor"/>',
    Freedom: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Destruction: '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" fill="currentColor"/>',
    
    // 战斗核心
    Attack: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l8.5-8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Defense: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/>',
    Accuracy: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Critical: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="white" stroke-width="1"/>',
    Resist: '<path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor"/>',
    Evasion: '<path d="M17.6 19.7c-1.5 1.5-3.5 2.3-5.6 2.3-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8c0 2.1-.8 4.1-2.3 5.6M12 10v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    
    // 资源
    HP: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',
    MP: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    Regen: '<path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    
    // 速度/特殊
    Speed: '<path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>',
    CombatSpeed: '<path d="M21 5l-8 8-4-4L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 5h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    MoveSpeed: '<path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>',
    Amplify: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  }

  // 构造 SVG 包装器
  const wrapSvg = (path, color, isLord = false) => {
    const glow = isLord ? `filter: drop-shadow(0 0 4px ${color}cc);` : ''
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: ${color}; ${glow}">${path}</svg>`
  }

  // 1. 处理基础属性
  const mainStatsMap = {
    STR: { color: COLORS.PHYSICAL, path: paths.STR },
    DEX: { color: COLORS.PHYSICAL, path: paths.DEX },
    AGI: { color: COLORS.UTILITY, path: paths.AGI },
    INT: { color: COLORS.MAGIC, path: paths.INT },
    WIS: { color: COLORS.MAGIC, path: paths.WIS },
    VIT: { color: COLORS.SURVIVAL, path: paths.VIT },
    CON: { color: COLORS.SURVIVAL, path: paths.CON }
  }
  
  if (mainStatsMap[upperType]) {
    const config = mainStatsMap[upperType]
    return { svg: wrapSvg(config.path, config.color) }
  }

  // 2. 处理主神属性 (Lords)
  const lordStats = ['JUSTICE', 'FREEDOM', 'ILLUSION', 'LIFE', 'TIME', 'DESTRUCTION', 'DEATH', 'WISDOM', 'DESTINY', 'SPACE']
  if (lordStats.includes(upperType)) {
    let path = paths.LordBase
    if (upperType === 'JUSTICE') path = paths.Justice
    if (upperType === 'FREEDOM') path = paths.Freedom
    if (upperType === 'DESTRUCTION') path = paths.Destruction
    
    return { svg: wrapSvg(path, COLORS.LORD, true) }
  }

  // 3. 战斗与详细属性映射
  const combatMap = {
    // 攻击类
    PHYSICALATTACK: { color: COLORS.EPIC, path: paths.Attack },
    MAGICALATTACK: { color: COLORS.MAGIC, path: paths.Attack },
    WEAPONACCURACY: { color: COLORS.EPIC, path: paths.Accuracy },
    MAGICALACCURACY: { color: COLORS.MAGIC, path: paths.Accuracy },
    CRITICAL: { color: COLORS.EPIC, path: paths.Critical },
    MAGICALCRITICAL: { color: COLORS.MAGIC, path: paths.Critical },
    PVEAMPLIFYDAMAGE: { color: COLORS.EPIC, path: paths.Amplify },
    PVPAMPLIFYDAMAGE: { color: COLORS.EPIC, path: paths.Amplify },
    // 防御类
    PHYSICALDEFENSE: { color: COLORS.DEFAULT, path: paths.Defense },
    MAGICALDEFENSE: { color: COLORS.DEFAULT, path: paths.Defense },
    EVASION: { color: COLORS.DEFAULT, path: paths.Evasion },
    MAGICALRESIST: { color: COLORS.MAGIC, path: paths.Resist },
    BLOCK: { color: COLORS.DEFAULT, path: paths.Defense },
    PARRY: { color: COLORS.DEFAULT, path: paths.Attack },
    CRITICALRESIST: { color: COLORS.DEFAULT, path: paths.Resist },
    // 生存类
    HP: { color: COLORS.SURVIVAL, path: paths.HP },
    MP: { color: COLORS.MAGIC, path: paths.MP },
    HPREGEN: { color: COLORS.SURVIVAL, path: paths.Regen },
    MPREGEN: { color: COLORS.MAGIC, path: paths.Regen },
    COMBATSPEED: { color: COLORS.UTILITY, path: paths.CombatSpeed },
    MOVESPEED: { color: COLORS.UTILITY, path: paths.MoveSpeed }
  }

  const config = combatMap[upperType] || { color: COLORS.DEFAULT, path: paths.STR }
  return { svg: wrapSvg(config.path, config.color) }
}
// 新增：获取角色全量详细属性列表并分组
const groupedStats = computed(() => {
  const rawData = member.value?.equipment_data?.raw_info?.stat
  if (!rawData) return []
  
  // 整合所有属性来源
  const allStats = [
    ...(rawData.statList || []),
    ...(rawData.mainStatList || [])
  ]
  
  // 排除 ItemLevel
  const filteredStats = allStats.filter(s => s.type !== 'ItemLevel')
  
  // 定义分组逻辑
  const groups = [
    {
      name: '主神属性',
      iconSvg: '<path d="M12 2l2.4 7.6H22l-6.2 4.5L18.2 22l-6.2-4.8L5.8 22l2.4-7.9L2 9.6h7.6L12 2z" fill="currentColor"/>',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      types: ['Justice', 'Freedom', 'Illusion', 'Life', 'Time', 'Destruction', 'Death', 'Wisdom', 'Destiny', 'Space']
    },
    {
      name: '角色基础属性',
      iconSvg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      types: ['STR', 'INT', 'DEX', 'WIS', 'VIT', 'CON', 'AGI']
    },
    {
      name: '攻击属性',
      iconSvg: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l8.5-8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      types: ['PhysicalAttack', 'MagicalAttack', 'WeaponAccuracy', 'MagicalAccuracy', 'Critical', 'MagicalCritical', 'AttackSpeed', 'CastingSpeed', 'PvEAmplifyDamage', 'PvPAmplifyDamage', 'AdditionalHitRate', 'AmplifyWeaponDamage']
    },
    {
      name: '防御属性',
      iconSvg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/>',
      color: 'text-sky-500',
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      types: ['PhysicalDefense', 'MagicalDefense', 'Evasion', 'MagicalResist', 'Block', 'Parry', 'PvEReduceDamage', 'PvPReduceDamage', 'CriticalResist', 'DamageResist']
    },
    {
      name: '生存与资源',
      iconSvg: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      types: ['HP', 'MP', 'HpRegen', 'MpRegen', 'HpRegenCombat', 'MpRegenCombat', 'HealAmplify', 'CombatSpeed', 'MoveSpeed', 'Concentration']
    }
  ]

  return groups.map(group => {
    // 使用 Map 去重，防止同一个属性在多个来源中重复
    const uniqueStats = new Map()
    
    filteredStats
      .filter(s => {
        // 增强匹配：支持不区分大小写的类型匹配
        const upperType = s.type?.toUpperCase()
        return group.types.some(t => t.toUpperCase() === upperType)
      })
      .forEach(s => {
        const upperType = s.type?.toUpperCase()
        if (!uniqueStats.has(upperType)) {
          const iconInfo = getStatIcon(s.type)
          uniqueStats.set(upperType, {
            ...s,
            iconSvg: iconInfo.svg,
            extra: s.extra || null,
            statSecondList: s.statSecondList || null
          })
        }
      })
      
    return { ...group, list: Array.from(uniqueStats.values()) }
  }).filter(g => g.list.length > 0)
})

// 生成雷达图配置的通用函数
const createRadarOption = (title, stats, color, areaColor) => {
  if (!stats || stats.length === 0) return null
  
  // 过滤出有数值的属性
  const validStats = stats.filter(s => s.value !== undefined && s.value !== null)
  if (validStats.length < 3) return null // 雷达图至少需要3个点

  return {
    radar: {
      indicator: validStats.map(s => ({ name: s.name, max: Math.max(s.value * 1.5, 100) })),
      radius: '60%',
      center: ['50%', '50%'],
      axisName: {
        color: '#64748b',
        fontWeight: 'bold',
        fontSize: 10,
        formatter: (name) => {
          const item = validStats.find(s => s.name === name)
          return `${name}\n${item ? item.value : 0}`
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.05)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.05)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: validStats.map(s => s.value),
        name: title,
        areaStyle: { color: areaColor },
        lineStyle: { color: color, width: 2 },
        itemStyle: { color: color },
        symbol: 'none'
      }]
    }]
  }
}

const baseStatRadarOption = computed(() => {
  const group = groupedStats.value.find(g => g.name === '角色基础属性')
  return createRadarOption('基础能力', group?.list, '#9333ea', 'rgba(147, 51, 234, 0.2)')
})

const lordStatRadarOption = computed(() => {
  const group = groupedStats.value.find(g => g.name === '主神属性')
  return createRadarOption('主神之力', group?.list, '#d97706', 'rgba(217, 119, 6, 0.2)')
})

// 翻译佩戴分类
const getEquipCategoryLabel = (cat) => {
  const map = {
    Attack: '攻击',
    Defense: '防御',
    Etc: '其他'
  }
  return map[cat] || cat
}

// 装备品级配置映射
const gradeConfig = {
  Common: { name: '普通', color: 'slate', desc: '基础材料装', bg: 'bg-slate-500', border: 'border-slate-100', light: 'bg-slate-400', gradient: 'from-slate-400 to-slate-600' },
  Superior: { name: '优秀', color: 'emerald', desc: '入门级', bg: 'bg-emerald-500', border: 'border-emerald-100', light: 'bg-emerald-400', gradient: 'from-emerald-400 to-emerald-600' },
  Heroic: { name: '英雄', color: 'blue', desc: '进阶级', bg: 'bg-blue-500', border: 'border-blue-100', light: 'bg-blue-400', gradient: 'from-blue-400 to-blue-600' },
  Fabled: { name: '传承', color: 'amber', desc: '中端主流', bg: 'bg-amber-500', border: 'border-amber-100', light: 'bg-amber-400', gradient: 'from-amber-400 to-amber-600' },
  Unique: { name: '唯一', color: 'orange', desc: '中端主流', bg: 'bg-orange-500', border: 'border-orange-100', light: 'bg-orange-400', gradient: 'from-orange-400 to-orange-600' },
  Eternal: { name: '永恒', color: 'indigo', desc: '高端核心', bg: 'bg-indigo-500', border: 'border-indigo-100', light: 'bg-indigo-400', gradient: 'from-indigo-400 to-indigo-600' },
  Mythic: { name: '神话', color: 'purple', desc: '高端核心', bg: 'bg-purple-500', border: 'border-purple-100', light: 'bg-purple-400', gradient: 'from-purple-400 to-purple-600' },
  Epic: { name: '史诗', color: 'red', desc: '顶级毕业装备', bg: 'bg-red-500', border: 'border-red-100', light: 'bg-red-400', gradient: 'from-red-400 to-red-600' }
}

const getGradeInfo = (grade) => gradeConfig[grade] || gradeConfig.Common

// 处理图片 URL (去掉首尾反引号)
const formatIconUrl = (url) => {
  if (!url) return ''
  return url.replace(/`/g, '').trim()
}

const fetchMemberDetail = async () => {
  loading.value = true
  $loading.show('正在调取档案中...')
  
  const { data, error } = await supabase
    .from('legion_members')
    .select('*')
    .eq('id', route.params.id)
    .maybeSingle()
  
  if (data) {
    member.value = data
    
    // 1. 优先从缓存读取数据并展示 (秒开)
    if (data.equipment_data) {
      member.value.equipment_data = data.equipment_data
      applyCachedData(data.equipment_data)
      // 如果已有缓存，基础档案加载完就可以隐藏全局 loading 了
      $loading.hide()
      loading.value = false
    }

    // 2. 执行自动同步 (如果是无缓存进入，loading 会在 backgroundSync 结束后隐藏)
    backgroundSync()
  } else {
    console.error('Member not found', error)
    $loading.hide()
    loading.value = false
  }
}

// 应用缓存数据
const applyCachedData = (cached) => {
  if (!cached) return
  
  // 1. 技能
  if (cached.skill?.skillList) {
    skillList.value = cached.skill.skillList
  }
  
  // 2. 装备 (注意：聚合后的数据在 equipment.equipmentList 中)
  if (cached.equipment?.equipmentList) {
    equipmentList.value = cached.equipment.equipmentList
  } else if (Array.isArray(cached.equipment)) {
    // 兼容旧格式
    equipmentList.value = cached.equipment
  }
  
  // 3. 伙伴外观
  if (cached.petwing) {
    pet.value = cached.petwing.pet || null
    wing.value = cached.petwing.wing || null
  } else {
    // 兼容旧格式
    pet.value = cached.pet || null
    wing.value = cached.wing || null
  }
  
  if (cached.equipment?.skinList) {
    skinList.value = cached.equipment.skinList
  } else if (cached.skinList) {
    // 兼容旧格式
    skinList.value = cached.skinList
  }
}

// 静默后台同步
const backgroundSync = async () => {
  if (!member.value) return
  
  // 如果没有缓存数据，则显示局部加载状态，并保持全局 loading
  if (!member.value.equipment_data) {
    loadingEquipment.value = true
  }

  try {
    const res = await $fetch('/api/aion/sync', {
      query: {
        memberId: member.value.id,
        characterId: member.value.character_id,
        serverId: member.value.server_id
      }
    })
    
    if (res.success && res.data) {
      applyCachedData(res.data)
      member.value.equipment_data = res.data
      // 同步更新称号列表
      if (res.data.raw_info?.title?.titleList) {
        member.value.title_list = res.data.raw_info.title.titleList
      }
      if (res.data.raw_info?.profile?.titleName) {
        member.value.title_name = res.data.raw_info.profile.titleName
      }
    }
  } catch (e) {
    console.error('Background Sync Error:', e)
  } finally {
    loadingEquipment.value = false
    loading.value = false
    $loading.hide() // 无论成功失败，最后都隐藏全局 loading
  }
}

// 手动同步数据
const syncMemberData = async () => {
  if (!member.value || syncing.value) return
  
  syncing.value = true
  $loading.show('正在同步最新全量数据...')
  
  try {
    const res = await $fetch('/api/aion/sync', {
      query: {
        memberId: member.value.id,
        characterId: member.value.character_id,
        serverId: member.value.server_id
      }
    })
    
    if (res.success && res.data) {
      applyCachedData(res.data)
      member.value.equipment_data = res.data
      // 同步更新称号列表
      if (res.data.raw_info?.title?.titleList) {
        member.value.title_list = res.data.raw_info.title.titleList
      }
      if (res.data.raw_info?.profile?.titleName) {
        member.value.title_name = res.data.raw_info.profile.titleName
      }
      $alert('同步成功', '成员档案及装备详情已更新至最新状态')
    } else {
      $alert('同步失败', res.error || '无法获取官方数据')
    }
  } catch (e) {
    console.error('Sync Error:', e)
    $alert('同步出错', '网络请求失败，请稍后再试')
  } finally {
    syncing.value = false
    $loading.hide()
  }
}

// --- 辅助逻辑与映射 ---

// 获取装备/技能详情
const fetchEquipmentDetail = async (characterId, serverId) => {
  if (!characterId || !serverId) return
  
  loadingEquipment.value = true
  try {
    const data = await $fetch('/api/aion/equipment', {
      query: { characterId, serverId }
    })
    
    if (data && !data.error) {
      // 1. 技能
      if (data.skill?.skillList) {
        skillList.value = data.skill.skillList
      }
      
      // 2. 装备
      if (data.equipment?.equipmentList) {
        equipmentList.value = data.equipment.equipmentList
      }
      
      // 3. 宠物/翅膀/时装
      if (data.petwing) {
        pet.value = data.petwing.pet
        wing.value = data.petwing.wing
      }
      if (data.equipment?.skinList) {
        skinList.value = data.equipment.skinList
      }
      
      // 可选：在这里可以将数据更新回 supabase，保持缓存最新
      // updateMemberEquipmentCache(...)
    }
  } catch (e) {
    console.error('Failed to fetch equipment details:', e)
  }
  loadingEquipment.value = false
}

// 装备部位汉化
const slotMap = {
  'MainHand': '主手武器',
  'SubHand': '副手武器',
  'Helmet': '头部防具',
  'Torso': '胸部防具',
  'Pants': '腿部防具',
  'Gloves': '手部防具',
  'Boots': '脚部防具',
  'Shoulder': '肩部防具',
  'Cape': '披风/背饰',
  'Belt': '腰带饰品',
  'Earring1': '左耳环',
  'Earring2': '右耳环',
  'Ring1': '左戒指',
  'Ring2': '右戒指',
  'Necklace': '项链饰品',
  'Bracelet1': '左手镯',
  'Bracelet2': '右手镯',
  'Amulet': '护身符',
  'Rune1': '符文槽位1',
  'Rune2': '符文槽位2',
  'Arcana1': '阿卡纳1',
  'Arcana2': '阿卡纳2',
  'Arcana3': '阿卡纳3',
  'Arcana4': '阿卡纳4',
  'Arcana5': '阿卡纳5'
}

onMounted(() => {
  fetchMemberDetail()
})
</script>

<style scoped>
.bg-watercolor {
  background-color: #C7F3FE;
  background-image: 
    radial-gradient(at 10% 10%, rgba(255,255,255,0.5) 0%, transparent 40%),
    radial-gradient(at 90% 90%, rgba(174,226,249,0.3) 0%, transparent 40%);
}

.custom-scroll { scrollbar-width: thin; scrollbar-color: #AEE2F9 #E6F7FF; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #E6F7FF; }
::-webkit-scrollbar-thumb { background: #AEE2F9; border-radius: 9999px; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes grass-wave {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-20px); }
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes walk-across {
  0% { transform: translateX(0) rotate(0deg); }
  10% { transform: translateX(10vw) rotate(-5deg); }
  20% { transform: translateX(20vw) rotate(5deg); }
  30% { transform: translateX(30vw) rotate(-5deg); }
  40% { transform: translateX(40vw) rotate(5deg); }
  50% { transform: translateX(50vw) rotate(-5deg); }
  60% { transform: translateX(60vw) rotate(5deg); }
  70% { transform: translateX(70vw) rotate(-5deg); }
  80% { transform: translateX(80vw) rotate(5deg); }
  90% { transform: translateX(90vw) rotate(-5deg); }
  100% { transform: translateX(110vw) rotate(0deg); }
}

.animate-grass-wave { animation: grass-wave 8s ease-in-out infinite alternate; }
.animate-sway { animation: sway 3s ease-in-out infinite; }
.animate-walk-across { animation: walk-across linear infinite; }

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 2px;
}
</style>