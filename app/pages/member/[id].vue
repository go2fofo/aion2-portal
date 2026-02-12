<template>
  <div class="min-h-screen bg-watercolor font-sans custom-scroll pb-20">
    <!-- 顶部导航栏 -->
    <nav class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-sky-600 font-black hover:text-sky-800 transition-colors group"
      >
        <span class="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">👈</span>
        <span>返回军团</span>
      </button>
      <div class="text-xl font-black text-[#45a6d5] tracking-widest">成员档案</div>
      <div class="w-10"></div> <!-- 占位保持居中 -->
    </nav>

    <div v-if="loading" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="text-6xl animate-bounce mb-4">🐣</div>
      <div class="text-sky-600 font-bold text-xl animate-pulse">正在读取档案...</div>
    </div>

    <div v-else-if="!member" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="text-6xl mb-4">👻</div>
      <div class="text-slate-400 font-bold text-xl">查无此人</div>
      <button @click="router.back()" class="mt-8 bg-[#45a6d5] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform">返回列表</button>
    </div>

    <main v-else class="max-w-[95%] md:max-w-[90%] mx-auto px-4 pt-8 animate-fade-in-up space-y-8">
      <!-- 头部卡片：个人形象与核心信息 -->
      <div class="relative bg-white/70 backdrop-blur-sm rounded-[3rem] p-6 md:p-10 shadow-xl border-4 border-white overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-sky-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <!-- 头像区 -->
          <div class="relative group">
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-[0_8px_20px_rgba(69,166,213,0.2)] overflow-hidden bg-sky-50">
              <img :src="member.profile_url || '/bbbswz.png'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <!-- 等级徽章 -->
            <div class="absolute -bottom-2 -right-2 bg-[#f9b11d] text-white font-black text-lg px-3 py-1 rounded-full border-4 border-white shadow-md">
              Lv.{{ member.level }}
            </div>
          </div>

          <!-- 信息区 -->
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{{ member.name }}</h1>
              <span v-if="member.role === 'leader'" class="bg-yellow-400 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-sm animate-pulse">👑 军团长</span>
              <span v-else-if="member.role === 'officer'" class="bg-purple-400 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-sm">🛡️ 百夫长</span>
              <span v-else class="bg-sky-400 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-sm">⚔️ 成员</span>
            </div>
            
            <p class="text-slate-500 font-bold mb-6 italic">
              "{{ member.title_name || member.note || '这只宝宝很懒，什么都没留下~' }}"
            </p>

            <!-- 核心标签 -->
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <div class="bg-white/80 px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-2 shadow-sm">
                <span class="text-lg">🛡️</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Class</div>
                  <div class="text-sky-800 font-black leading-none">{{ member.class_name }}</div>
                </div>
              </div>
              
              <div class="bg-white/80 px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-2 shadow-sm">
                <span class="text-lg">⚔️</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Item Level</div>
                  <div class="text-yellow-600 font-black leading-none">{{ member.item_level || 'N/A' }}</div>
                </div>
              </div>

              <div class="bg-white/80 px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-2 shadow-sm">
                <span class="text-lg">{{ member.gender === 'female' ? '♀' : '♂' }}</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Gender</div>
                  <div class="text-sky-800 font-black leading-none">{{ member.gender === 'female' ? '女' : '男' }}</div>
                </div>
              </div>

              <div class="bg-white/80 px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-2 shadow-sm">
                <span class="text-lg">🏳️</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Race</div>
                  <div class="text-sky-800 font-black leading-none">{{ member.race_id === 1 ? '天族' : '魔族' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 战斗素质与多维度分析 (改为顶部全宽) -->
      <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white overflow-hidden relative">
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>
        
        <div class="relative z-10">
          <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center gap-3">
            <span class="bg-sky-100 p-2 rounded-2xl">📊</span> 战斗素质与多维度分析
          </h3>
          
          <div class="flex flex-col lg:flex-row gap-12 items-center">
            <!-- 雷达图部分 -->
            <div class="w-full lg:w-1/2 h-[350px] md:h-[450px]">
              <VChart class="w-full h-full" :option="radarOption" autoresize />
            </div>
            
            <!-- 多维度分析文案与评价 -->
            <div class="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 战力评级 -->
              <div class="bg-[#F0F9FF] p-6 rounded-3xl border-2 border-white shadow-sm flex flex-col items-center justify-center text-center">
                <div class="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">综合战力评级</div>
                <div class="text-5xl font-black italic" :class="getRatingColor(member.item_level)">{{ getRating(member.item_level) }}</div>
                <div class="mt-4 flex gap-1">
                  <span v-for="i in 5" :key="i" class="text-lg">{{ i <= getStarCount(member.item_level) ? '⭐' : '☆' }}</span>
                </div>
              </div>

              <!-- 战斗特性 -->
              <div class="bg-[#FFF9EB] p-6 rounded-3xl border-2 border-white shadow-sm flex flex-col items-center justify-center text-center">
                <div class="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">战斗风格特性</div>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span v-for="tag in combatTags" :key="tag" class="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-yellow-700 border border-yellow-200 shadow-sm">
                    # {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 核心指标摘要 -->
              <div class="md:col-span-2 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border-2 border-white shadow-sm">
                <div class="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">核心素质分析报告</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="stat in analysisStats" :key="stat.label" class="flex flex-col">
                    <span class="text-[10px] text-slate-400 font-bold">{{ stat.label }}</span>
                    <div class="flex items-end gap-1">
                      <span class="text-xl font-black text-slate-800">{{ stat.value }}</span>
                      <span class="text-[10px] text-sky-500 font-bold mb-1">{{ stat.trend }}</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div class="h-full bg-sky-400 rounded-full" :style="{ width: stat.percent + '%' }"></div>
                    </div>
                  </div>
                </div>
                <p class="mt-6 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-100 pt-4">
                   <span class="text-sky-600 font-black mr-2">分析结论:</span>
                   {{ analysisConclusion }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 装备与技能 (垂直排列) -->
      <div class="space-y-8">
        <!-- 装备概览 -->
        <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
           <h3 class="font-black text-sky-900 text-xl mb-6 flex items-center gap-3">
             <span class="bg-yellow-100 p-2 rounded-2xl">🎒</span> 装备概览
           </h3>
           <div v-if="loadingEquipment" class="text-center py-8 text-slate-400 font-bold">读取装备信息中...</div>
           <div v-else-if="equipmentList.length === 0" class="text-center py-8 text-slate-400 font-bold">暂无装备数据</div>
           <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             <div 
               v-for="item in equipmentList" 
               :key="item.id" 
               class="flex items-center gap-4 p-4 rounded-3xl border-2 transition-all hover:scale-[1.02] bg-white group shadow-sm relative overflow-hidden"
               :class="[
                 item.grade === 'Unique' ? 'border-orange-100 hover:border-orange-300 bg-gradient-to-br from-white to-orange-50/30' : 
                 item.grade === 'Epic' ? 'border-purple-100 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30' : 
                 'border-slate-100 hover:border-sky-200'
               ]"
             >
               <!-- 稀有度背景光晕 -->
               <div v-if="item.grade === 'Unique'" class="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-200/20 blur-2xl rounded-full"></div>
               <div v-if="item.grade === 'Epic'" class="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-200/20 blur-2xl rounded-full"></div>

               <!-- 装备图标 -->
               <div class="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-inner bg-slate-50 z-10">
                 <img :src="formatIconUrl(item.icon)" class="w-full h-full object-cover p-1 group-hover:scale-110 transition-transform" />
                 <!-- 强化等级 -->
                 <div v-if="item.enchantLevel > 0" class="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-bl-xl font-black shadow-lg">
                   +{{ item.enchantLevel }}
                 </div>
               </div>
               
               <!-- 装备文字 -->
               <div class="flex-1 min-w-0 z-10">
                 <div class="flex items-center justify-between mb-0.5">
                   <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ slotMap[item.slotPosName] || item.slotPosName }}</div>
                   <div class="text-[8px] font-mono text-slate-300">#{{ item.id }}</div>
                 </div>
                 <div class="text-sm font-black text-slate-800 truncate leading-tight mb-1" :title="item.name">{{ item.name }}</div>
                 
                 <div class="flex flex-wrap items-center gap-1.5">
                   <!-- 品质标签 -->
                   <span 
                     class="text-[9px] px-1.5 py-0.5 rounded-lg font-black tracking-wider uppercase"
                     :class="[
                       item.grade === 'Unique' ? 'bg-orange-500 text-white' : 
                       item.grade === 'Epic' ? 'bg-purple-500 text-white' : 
                       'bg-slate-500 text-white'
                     ]"
                   >
                     {{ item.grade }}
                   </span>
                   
                   <!-- 突破等级 -->
                   <span v-if="item.exceedLevel > 0" class="text-[9px] text-sky-700 font-black bg-sky-100/80 px-1.5 py-0.5 rounded-lg border border-sky-200">
                     突破 {{ item.exceedLevel }}
                   </span>

                   <!-- 强化等级文本 -->
                   <span v-if="item.enchantLevel > 0" class="text-[9px] text-red-700 font-black bg-red-50 px-1.5 py-0.5 rounded-lg border border-red-100">
                     强化 {{ item.enchantLevel }}
                   </span>
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
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const loading = ref(true)
const member = ref(null)

// 新增：装备技能相关状态
const loadingEquipment = ref(false)
const skillList = ref([])
const equipmentList = ref([])

// 技能分类
const activeSkills = computed(() => skillList.value.filter(s => s.category === 'Active'))
const passiveSkills = computed(() => skillList.value.filter(s => s.category === 'Passive'))
const stigmaSkills = computed(() => skillList.value.filter(s => s.category === 'Dp'))

const pet = ref(null)
const wing = ref(null)
const skinList = ref([])

// 处理图片 URL (去掉首尾反引号)
const formatIconUrl = (url) => {
  if (!url) return ''
  return url.replace(/`/g, '').trim()
}

const fetchMemberDetail = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('legion_members')
    .select('*')
    .eq('id', route.params.id)
    .single()
  
  if (data) {
    member.value = data
    // 获取到成员信息后，再去拉取装备详情
    fetchEquipmentDetail(data.character_id, data.server_id)
  } else {
    console.error('Member not found', error)
  }
  loading.value = false
}

// --- 多维度分析辅助逻辑 ---

const getRating = (itemLevel) => {
  if (!itemLevel) return 'N/A'
  if (itemLevel > 3500) return 'SSS'
  if (itemLevel > 3200) return 'SS'
  if (itemLevel > 2900) return 'S'
  if (itemLevel > 2500) return 'A'
  return 'B'
}

const getRatingColor = (itemLevel) => {
  if (!itemLevel) return 'text-slate-300'
  if (itemLevel > 3500) return 'text-red-500 animate-pulse'
  if (itemLevel > 3200) return 'text-orange-500'
  if (itemLevel > 2900) return 'text-yellow-500'
  if (itemLevel > 2500) return 'text-purple-500'
  return 'text-sky-500'
}

const getStarCount = (itemLevel) => {
  if (!itemLevel) return 0
  return Math.min(5, Math.floor(itemLevel / 700))
}

const combatTags = computed(() => {
  const tags = []
  if (!member.value) return tags
  
  // 基于职业的特性
  const className = member.value.class_name
  if (['剑星', '守护星'].includes(className)) tags.push('近战王者', '坚如磐石')
  if (['弓星', '杀星'].includes(className)) tags.push('爆发输出', '身手矫健')
  if (['魔道星', '精灵星'].includes(className)) tags.push('元素主宰', '群体控制')
  if (['治愈星', '护法星'].includes(className)) tags.push('团队核心', '圣光洗礼')

  // 基于战力的特性
  if (member.value.item_level > 3000) tags.push('神装加持', '巅峰战力')
  else if (member.value.item_level > 2500) tags.push('资深精英')
  
  return tags.length > 0 ? tags : ['潜力新人']
})

const analysisStats = computed(() => {
  if (!member.value) return []
  const base = member.value.item_level || 2000
  return [
    { label: '进攻潜能', value: Math.floor(base * 0.8), trend: '+5.2%', percent: Math.min(100, (base/4000)*100 + 10) },
    { label: '生存韧性', value: Math.floor(base * 0.75), trend: '+2.1%', percent: Math.min(100, (base/4000)*100 - 5) },
    { label: '团队贡献', value: '极高', trend: 'TOP 5%', percent: 92 },
    { label: '成长速度', value: '稳定', trend: 'NEW', percent: 75 }
  ]
})

const analysisConclusion = computed(() => {
  if (!member.value) return ''
  const name = member.value.name
  const rating = getRating(member.value.item_level)
  if (rating.includes('S')) {
    return `${name} 是军团中不可或缺的顶尖战力，其战斗素质在多维度评估中均表现卓越。建议作为核心攻坚成员，参与高难度副本与军团战役。`
  }
  return `${name} 拥有良好的成长潜力和扎实的基础素质。目前处于快速提升期，活跃度极高，是军团未来的中坚力量。`
})

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

// 综合素质雷达图配置
const radarOption = computed(() => {
  const baseValue = member.value?.item_level ? Math.min(95, (member.value.item_level / 4000) * 100) : 60
  
  // 根据职业微调雷达图重心
  const className = member.value?.class_name || ''
  const offset = (idx) => {
    if (className.includes('守护') || className.includes('剑星')) return [0, 15, 0, 10, -5, -5, 5, 0][idx] || 0
    if (className.includes('杀星') || className.includes('弓星')) return [15, -10, 5, -10, 15, 10, 0, -5][idx] || 0
    if (className.includes('治愈') || className.includes('护法')) return [-10, 5, 15, 10, -10, 0, 5, 15][idx] || 0
    return 0
  }

  const dataValues = [0, 1, 2, 3, 4, 5, 6, 7].map(i => Math.max(30, Math.min(100, baseValue + offset(i) + (Math.random() * 10 - 5))))

  return {
    radar: {
      indicator: [
        { name: '攻击力量', max: 100 },
        { name: '防御韧性', max: 100 },
        { name: '战术配合', max: 100 },
        { name: '生存意志', max: 100 },
        { name: '爆发潜能', max: 100 },
        { name: '机动灵活', max: 100 },
        { name: '装备底蕴', max: 100 },
        { name: '团队贡献', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '50%'],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#64748b',
        fontWeight: '900',
        fontSize: 12,
        formatter: (value) => `{a|${value}}`,
        rich: {
          a: {
            backgroundColor: '#f8fafc',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            borderRadius: 4,
            padding: [4, 8],
            color: '#475569'
          }
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(230, 247, 255, 0.2)', 'rgba(230, 247, 255, 0.4)', 'rgba(230, 247, 255, 0.6)', 'rgba(230, 247, 255, 0.8)', 'rgba(230, 247, 255, 1)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(69, 166, 213, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(69, 166, 213, 0.3)' } }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dataValues,
            name: '战斗素质',
            areaStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(249, 177, 29, 0.1)' },
                  { offset: 1, color: 'rgba(249, 177, 29, 0.6)' }
                ]
              }
            },
            lineStyle: { color: '#f9b11d', width: 3 },
            itemStyle: { color: '#f9b11d', borderWidth: 2, borderColor: '#fff' },
            symbol: 'circle',
            symbolSize: 6
          }
        ]
      }
    ]
  }
})

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
</style>