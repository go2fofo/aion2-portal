<template>
  <div class="min-h-screen w-full relative bg-watercolor font-sans custom-scroll overflow-x-hidden" :class="{ 'h-screen overflow-hidden': showIntro && isClient }">
    
    <ClientOnly>
      <!-- 视频引导层 -->
      <div 
        class="fixed inset-0 z-[100] bg-sky-50 flex flex-col items-center justify-center h-[100dvh] w-screen overflow-hidden transition-all duration-1000 ease-in-out"
        :class="{ 'opacity-0 pointer-events-none translate-y-[-100%]': !showIntro }"
        @wheel.prevent="handleIntroScroll" 
        @touchmove.prevent="handleIntroScroll"
      >
        
        <!-- 背景氛围层 (极简白/浅蓝) -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <video
            v-show="!isPlayingOutro"
            src="/bbbssp.mp4"
            class="w-full h-full object-cover blur-[100px] scale-150 saturate-200 opacity-50"
            autoplay
            loop
            muted
            playsinline
          ></video>
          <video
            v-show="isPlayingOutro"
            ref="outroBgRef"
            src="/bbbsout.mp4"
            class="w-full h-full object-cover blur-[100px] scale-150 saturate-200 opacity-50"
            muted
            playsinline
          ></video>
        </div>

        <!-- 前景视频层 -->
        <div class="relative z-10 flex-1 w-full flex flex-col items-center justify-center p-8 animate-float-slow" @click="handleIntroClick">
          <div class="relative w-full max-w-4xl aspect-square flex items-center justify-center">
            <!-- 循环播放的引导视频 -->
            <video
              v-show="!isPlayingOutro"
              ref="introVideoRef"
              src="/bbbssp.mp4"
              class="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-[3rem] video-glow bg-white cursor-pointer"
              autoplay
              loop
              muted
              playsinline
              x5-video-player-type="h5-page"
              x5-playsinline="true"
              webkit-playsinline="true"
            ></video>
            
            <!-- 过渡视频 -->
            <video
              v-show="isPlayingOutro"
              ref="outroVideoRef"
              src="/bbbsout.mp4"
              class="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-[3rem] video-glow bg-white"
              muted
              playsinline
              preload="auto"
              @ended="onOutroEnded"
            ></video>
          </div>
        </div>

        <!-- 底部提示区域 -->
        <div v-if="!isPlayingOutro" class="relative z-20 pb-12 w-full text-center flex flex-col items-center gap-2 animate-arrow">
          <div class="text-[#45a6d5] font-black text-xl tracking-widest drop-shadow-sm">上滑开启冒险</div>
          <div class="w-8 h-8 flex items-center justify-center text-[#45a6d5]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- 全局背景装饰层 (极致层级与位置优化) -->
    <div v-show="!showIntro" class="fixed inset-0 w-full h-full z-[15] pointer-events-none transition-opacity duration-1000">
      <!-- 左侧巴士 (面向右) -->
      <div class="absolute top-[2%] -left-32 w-[30rem] md:w-[55rem] h-auto opacity-80 rotate-3">
        <img src="/bbbscmt.png" class="w-full h-full object-contain -scale-x-100" />
      </div>
      <!-- 右侧巴士 (面向左) -->
      <div class="absolute top-[2%] -right-32 w-[30rem] md:w-[55rem] h-auto opacity-80 -rotate-3">
        <img src="/bbbscmt.png" class="w-full h-full object-contain" />
      </div>
    </div>

    <!-- 云朵层：引导结束后才显示 -->
    <div v-show="!showIntro" class="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000" :class="showIntro ? 'opacity-0' : 'opacity-100'">
      <div v-for="n in 5" :key="'blur-'+n" 
        class="absolute bg-white/55 blur-xl rounded-full animate-cloud-soft"
        :style="{
          width: 120 + (n * 40) + 'px',
          height: 70 + (n * 18) + 'px',
          top: (n * 16) + '%',
          left: (n % 2 === 0 ? '8%' : '72%'),
          animationDuration: (8 + n * 2) + 's'
        }"
      ></div>

      <transition-group name="cloud-fade" appear>
        <img v-for="c in clouds" :key="c.id" :src="c.image"
             class="absolute cloud-item"
             :style="{ top: c.top + '%', left: c.left + '%', width: c.size + 'px', opacity: c.opacity, '--bob-amp': `-${c.bob}px`, '--wiggle-amp': `${c.wiggle}px`, '--breath-scale': c.breath, '--rot-amp': `${c.rot}deg`, '--offset-x': `${c.ox}px`, '--offset-y': `${c.oy}px` }" />
      </transition-group>
    </div>

    <nav class="relative z-50 p-6 flex items-center">
      <NuxtLink to="/" class="flex items-center gap-2 group transition-all active:scale-95">
        <div class="w-12 h-12 bg-white rounded-full p-1 shadow-md border-2 border-[#AEE2F9] group-hover:border-[#45a6d5] group-hover:rotate-12 transition-all duration-500 overflow-hidden">
          <img src="/bbbswz.png" class="w-full h-full object-contain group-hover:scale-110 transition-transform rounded-full" />
        </div>
        <div class="flex flex-col leading-none">
          <span class="text-[#45a6d5] font-black text-xl tracking-tighter group-hover:text-sky-600 transition-colors">BBBS</span>
          <span class="text-[10px] font-bold text-sky-300 uppercase tracking-widest scale-75 origin-left">Portal</span>
        </div>
      </NuxtLink>
      <div class="flex-1 text-center">
        <span class="text-2xl md:text-3xl font-black text-[#45a6d5] tracking-widest">AION2</span>
      </div>
      
      <!-- 用户状态区 -->
      <div v-if="user" class="group relative">
        <div class="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:bg-white">
          <img src="/bbbswz.png" class="w-6 h-6 rounded-full" />
          <span class="text-xs font-bold text-sky-800">@ {{ displayUsername }}</span>
        </div>
        <!-- 登出菜单 -->
        <div class="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-sky-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
          <button @click="logout" class="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-50 transition-colors">
            退出登录
          </button>
        </div>
      </div>
      <div v-else>
        <NuxtLink to="/login" class="bg-[#f9b11d] hover:bg-[#fbc02d] text-white px-5 py-2 rounded-full font-black text-sm shadow-[0_3px_0_0_#d98a00] active:translate-y-1 active:shadow-none transition-all">
          登录 / 注册
        </NuxtLink>
      </div>
    </nav>

    <main class="relative z-20 flex flex-col items-center pt-8 h-full">
      <div class="relative mb-8 flex flex-col items-center max-w-full px-4 w-full">
        <!-- 装饰元素 -->
        <div class="absolute -top-6 -right-4 md:-right-12 text-3xl md:text-5xl animate-bounce">☀️</div>
        <img src="/xiaoniao.png" class="absolute top-4 -left-2 md:top-10 md:-left-20 w-10 h-10 md:w-16 md:h-16 -rotate-12 object-contain drop-shadow-md animate-bounce" style="animation-duration: 3s;" />
        
        <h2 class="relative text-3xl sm:text-5xl md:text-7xl font-black tracking-widest drop-shadow-[0_2px_0_#fff] md:drop-shadow-[0_4px_0_#fff] flex flex-col md:block items-center gap-2">
          <span class="inline-block transform hover:scale-110 transition-transform duration-300 cursor-default text-[#0ea5e9]" style="text-shadow: 2px 2px 0px #0284c7, 4px 4px 0px #bae6fd;">宝宝巴士</span>
          <span class="inline-block ml-0 md:ml-4 transform -rotate-3 md:-rotate-6 bg-[#f9b11d] text-white px-3 py-1 md:px-4 md:py-1 rounded-2xl text-2xl sm:text-4xl md:text-6xl shadow-[3px_3px_0_0_#d98a00] md:shadow-[4px_4px_0_0_#d98a00] hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-white">
            军团
            <span class="absolute -top-2 -right-2 text-xl md:text-2xl animate-ping">✨</span>
          </span>
        </h2>
        <p class="mt-2 text-sky-700 font-bold text-sm md:text-base">宝宝巴士，带你的每一个本都是宝宝本</p>
        <div class="mt-1 flex gap-2">
          <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
          <span class="w-2 h-2 rounded-full bg-[#AEE2F9]"></span>
          <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
        </div>
      </div>

      <div class="w-[95%] md:w-[90%] px-4 md:px-6 pb-20 relative">
        <!-- 移动端侧边悬浮 Tab 菜单 (优化版) -->
        <div class="md:hidden">
           <!-- 悬浮触发按钮 (小鸟造型) -->
           <div
             ref="floatingBtnRef"
             @touchstart="startDrag"
             @touchmove="onDrag"
             @touchend="endDrag"
             @click="toggleMenu"
             class="fixed z-50 transition-transform active:scale-90 touch-none"
             :style="{ 
               top: btnPos.y + 'px', 
               left: btnPos.x + 'px', 
               transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
             }"
           >
             <div class="relative w-14 h-14 bg-[#f9b11d] rounded-full shadow-[0_4px_12px_rgba(249,177,29,0.4)] border-2 border-white flex items-center justify-center overflow-hidden group">
               <!-- 闭眼/睁眼动画 -->
               <img src="/xiaoniao.png" class="w-10 h-10 object-contain animate-bounce-short z-10" />
               <!-- 菜单展开指示器 -->
               <div class="absolute inset-0 bg-white/20 scale-0 rounded-full transition-transform duration-300" :class="{ 'scale-100': showMobileMenu }"></div>
             </div>
             <!-- 呼吸光晕 -->
             <div class="absolute inset-0 rounded-full border-2 border-[#f9b11d] opacity-50 animate-ping pointer-events-none" v-if="!showMobileMenu && !isDragging"></div>
           </div>

           <!-- 侧边弹出菜单遮罩 -->
           <transition name="fade">
             <div 
               v-if="showMobileMenu" 
               class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 touch-none"
               @click="showMobileMenu = false"
               @touchmove.prevent
             ></div>
           </transition>

           <!-- 垂直列表菜单 (替代扇形) -->
            <div 
              v-if="showMobileMenu"
              class="fixed z-40 pointer-events-none"
              :style="{ 
                top: btnPos.y + 28 + 'px', 
                left: btnPos.x + 28 + 'px'
              }"
            >
              <TransitionGroup 
                name="staggered-list" 
                tag="div" 
                class="flex flex-col gap-3 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
                :style="{
                  transform: isRightSide 
                    ? 'translate(-100%, -50%) translate(-35px, 0)' 
                    : 'translate(0, -50%) translate(35px, 0)'
                }"
                appear
              >
                <button 
                  v-for="(tab, index) in visibleTabs" :key="tab.id"
                  @click="activeTab = tab.id; showMobileMenu = false"
                  class="pointer-events-auto relative flex items-center justify-center px-4 py-2 rounded-xl border-2 shadow-sm font-black text-xs transition-all duration-300 active:scale-95 whitespace-nowrap min-w-[5rem]"
                  :class="activeTab === tab.id ? 'bg-[#45a6d5] text-white border-white scale-110 shadow-md' : 'bg-white text-[#45a6d5] border-[#E6F7FF] hover:border-[#45a6d5]'"
                  :style="{
                    '--delay': `${index * 0.06}s`,
                    '--start-x': isRightSide ? '30px' : '-30px'
                  }"
                >
                  {{ tab.name }}
                </button>
              </TransitionGroup>
            </div>
        </div>

        <!-- 桌面端横向排列 Tab -->
        <div class="hidden md:flex justify-center gap-4 mb-8 flex-wrap">
          <button 
            v-for="tab in visibleTabs" :key="tab.id"
            @click="activeTab = tab.id"
            class="relative group"
          >
            <!-- 选中时的小鸟 (绝对定位在左上角/左侧) -->
            <transition name="pop">
              <img 
                v-if="activeTab === tab.id" 
                src="/xiaoniao.png" 
                class="absolute -top-3 -left-4 w-8 h-8 object-contain z-10 animate-bounce" 
                style="animation-duration: 1s;"
              />
            </transition>
            
            <!-- 按钮主体 -->
            <div :class="[
              'relative px-6 py-2 rounded-full font-black text-lg border-4 transition-all duration-300 flex items-center',
              activeTab === tab.id 
                ? 'bg-[#f9b11d] text-white border-white shadow-[0_6px_0_#d98a00] scale-110 rotate-1' 
                : 'bg-white text-[#45a6d5] border-[#E6F7FF] shadow-[0_4px_0_#AEE2F9] hover:-translate-y-1 hover:shadow-[0_6px_0_#AEE2F9]'
            ]">
              {{ tab.name }}
            </div>
          </button>
        </div>

        <div class="panel-cartoon min-h-[360px] p-4 md:p-8 relative overflow-hidden">
          <div class="absolute -bottom-6 -right-6 text-[8rem] opacity-5 pointer-events-none italic font-black">B.B.B.S</div>
          
          <transition name="fade" mode="out-in">
            <div :key="activeTab" class="h-full">
              <!-- Tab 1: 军团伴说 (News) -->
              <div v-if="activeTab === 'news'" class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <!-- 左侧置顶/重要公告 -->
                <div class="p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-md flex flex-col h-full">
                  <h3 class="text-[#45a6d5] font-black text-xl flex items-center gap-2 mb-4"><span>🔔</span> 最新动态</h3>
                  
                  <div v-if="loadingPosts" class="flex-1 flex items-center justify-center text-slate-400 font-bold">
                    加载中...
                  </div>
                  <div v-else-if="posts.length === 0" class="flex-1 flex items-center justify-center text-slate-400 font-bold">
                    暂无动态
                  </div>
                  <div v-else class="space-y-3 flex-1 overflow-y-auto custom-scroll pr-2">
                    <div v-for="post in posts" :key="post.id" class="p-4 bg-white rounded-2xl border-2 border-white flex justify-between items-center hover:scale-[1.02] transition-transform">
                      <span class="font-bold text-sky-900 italic truncate flex-1 mr-4">{{ post.title }}</span>
                      <span class="text-xs text-sky-400 whitespace-nowrap">{{ new Date(post.created_at).toLocaleDateString() }}</span>
                    </div>
                  </div>
                </div>

                <!-- 右侧模拟列表 (这里可以保留静态，或者也从 posts 读取不同类型的) -->
                <div class="space-y-4">
                  <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
                    <div class="w-12 h-12 flex items-center justify-center bg-[#f9b11d] text-white font-black rounded-xl">#{{ i }}</div>
                    <div class="flex-1">
                      <span class="font-black text-sky-900">定潇帽喜豆 #888+8{{ i }}</span>
                    </div>
                    <button class="w-9 h-9 flex items-center justify-center rounded-full bg-[#AEE2F9] text-white">💙</button>
                  </div>
                </div>
              </div>

              <!-- Tab 2: 军团鲜哒 (Fresh) -->
              <div v-else-if="activeTab === 'fresh'" class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                 <div v-if="loadingPosts" class="col-span-full flex items-center justify-center text-slate-400 font-bold">加载中...</div>
                 <template v-else>
                    <div v-for="post in posts" :key="post.id" class="p-4 bg-[#F0F9FF] rounded-2xl border-2 border-white hover:-translate-y-1 transition-transform">
                      <div class="text-4xl mb-2">🐼</div>
                      <p class="text-sky-900 font-bold line-clamp-2">{{ post.title }}</p>
                      <p class="text-xs text-sky-400 mt-2">{{ new Date(post.created_at).toLocaleDateString() }}</p>
                    </div>
                    <!-- 补充空位 -->
                    <div v-if="posts.length === 0" class="col-span-full flex flex-col items-center justify-center text-slate-400 py-10">
                      <span class="text-4xl mb-2">📭</span>
                      <span class="font-bold">暂无新鲜事</span>
                    </div>
                 </template>
              </div>

              <!-- 其他 Tab 内容暂保持静态或后续扩展 -->
              <div v-else-if="activeTab === 'analysis'" class="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div class="p-6 bg-white rounded-2xl border-2 border-[#E6F7FF] flex flex-col">
                  <p class="text-sky-900 font-bold mb-4">战力解析面板</p>
                  <div class="flex-1 min-h-[300px]">
                    <VChart class="w-full h-full" :option="radarOption" autoresize />
                  </div>
                </div>
                <div class="p-6 bg-white rounded-2xl border-2 border-[#E6F7FF] flex flex-col">
                  <p class="text-sky-900 font-bold mb-4">趋势折线</p>
                  <div class="flex-1 min-h-[300px]">
                    <VChart class="w-full h-full" :option="lineOption" autoresize />
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'rank'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="flex items-center gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
                  <div class="w-10 h-10 flex items-center justify-center bg-[#f9b11d] text-white font-black rounded-xl">#{{ i }}</div>
                  <div class="flex flex-col">
                    <span class="font-black text-sky-900">大王叫我来巡山</span>
                    <span class="text-xs font-bold text-yellow-500 italic font-mono text-lg leading-none">999,821</span>
                  </div>
                </div>
              </div>

              <!-- Tab: 角色查询 (Search) -->
              <div v-else-if="activeTab === 'search'" class="h-full">
                <CharacterSearchModule />
              </div>

              <!-- Tab: 造价计算 (Cost) -->
              <div v-else-if="activeTab === 'cost'" class="h-full">
                <CostCalculatorPlus />
              </div>

              <!-- Tab: 基纳比价 (Kinah Compare) -->
              <div v-else-if="activeTab === 'kinah'" class="h-full">
                <KinahCompare />
              </div>

              <!-- Tab 5: 军团成员 (Members) -->
              <div v-else-if="activeTab === 'members'" class="h-full flex flex-col">
                <!-- 顶部搜索和筛选栏 -->
                <div class="flex flex-col sm:flex-row gap-4 mb-4 items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-white">
                  <!-- 搜索框 -->
                  <div class="relative w-full sm:w-64">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input 
                      v-model="memberSearchQuery" 
                      type="text" 
                      placeholder="搜索成员..." 
                      class="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-[#E6F7FF] focus:border-[#45a6d5] outline-none text-slate-700 font-bold bg-white transition-colors"
                    />
                  </div>
                  
                  <!-- 职业筛选 (水平滚动) -->
                  <div class="flex-1 w-full overflow-x-auto custom-scroll pb-1 sm:pb-0">
                    <div class="flex gap-2">
                      <!-- 排序下拉框 (新增) -->
                      <div class="relative inline-block text-left mr-2">
                         <select 
                           v-model="sortOrder" 
                           class="appearance-none bg-white border-2 border-yellow-300 text-yellow-600 px-3 py-1.5 pr-8 rounded-lg text-xs font-black focus:outline-none focus:border-yellow-500 cursor-pointer"
                         >
                           <option value="role">按职位</option>
                           <option value="item_level">按战力</option>
                           <option value="level">按等级</option>
                         </select>
                         <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-600">
                           <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                         </div>
                      </div>

                      <button 
                        @click="selectedClass = ''"
                        class="px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all border-2"
                        :class="selectedClass === '' ? 'bg-[#45a6d5] text-white border-[#45a6d5]' : 'bg-white text-slate-500 border-white hover:border-[#E6F7FF]'"
                      >
                        全部 ({{ members.length }})
                      </button>
                      <button 
                        v-for="cls in uniqueClasses" 
                        :key="cls"
                        @click="selectedClass = cls"
                        class="px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all border-2"
                        :class="selectedClass === cls ? 'bg-[#45a6d5] text-white border-[#45a6d5]' : 'bg-white text-slate-500 border-white hover:border-[#E6F7FF]'"
                      >
                        {{ cls }} ({{ members.filter(m => m.class_name === cls).length }})
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 成员列表区域 -->
                <div v-if="loadingMembers" class="flex-1 flex items-center justify-center text-slate-400 font-bold">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-3xl animate-bounce">⏳</span>
                    <span>加载中...</span>
                  </div>
                </div>
                
                <div v-else-if="filteredMembers.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
                  <span class="text-4xl mb-2">👻</span>
                  <span class="font-bold">未找到相关成员</span>
                </div>

                <div v-else class="flex-1 overflow-y-auto custom-scroll p-2 -mx-2">
                  <!-- 军团统计看板 -->
                  <div class="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-white/70 backdrop-blur-sm p-4 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center justify-center group hover:shadow-md transition-all">
                      <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">军团总人数</span>
                      <div class="flex items-end gap-1">
                        <span class="text-3xl font-black text-sky-600 leading-none">{{ members.length }}</span>
                        <span class="text-xs font-bold text-sky-400 mb-1">人</span>
                      </div>
                    </div>
                    <div class="bg-white/70 backdrop-blur-sm p-4 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center justify-center group hover:shadow-md transition-all">
                      <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">平均等级</span>
                      <div class="flex items-end gap-1">
                        <span class="text-3xl font-black text-emerald-500 leading-none">
                          {{ members.length ? Math.round(members.reduce((acc, m) => acc + (m.level || 0), 0) / members.length) : 0 }}
                        </span>
                        <span class="text-xs font-bold text-emerald-400 mb-1">级</span>
                      </div>
                    </div>
                    <div class="bg-white/70 backdrop-blur-sm p-4 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center justify-center group hover:shadow-md transition-all">
                      <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">物理职业</span>
                      <div class="flex items-end gap-1">
                        <span class="text-3xl font-black text-rose-500 leading-none">
                          {{ members.filter(m => ['劍星', '守護星', '殺星', '弓星', '機甲星'].includes(m.class_name)).length }}
                        </span>
                        <span class="text-xs font-bold text-rose-400 mb-1">人</span>
                      </div>
                    </div>
                    <div class="bg-white/70 backdrop-blur-sm p-4 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center justify-center group hover:shadow-md transition-all">
                      <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">魔法/支援</span>
                      <div class="flex items-end gap-1">
                        <span class="text-3xl font-black text-indigo-500 leading-none">
                          {{ members.filter(m => ['魔道星', '精靈星', '治癒星', '護法星', '藝人'].includes(m.class_name)).length }}
                        </span>
                        <span class="text-xs font-bold text-indigo-400 mb-1">人</span>
                      </div>
                    </div>
                  </div>

                  <!-- 军团长区域 (仅当未筛选或筛选结果包含军团长时显示) -->
                  <div v-if="leaders.length > 0 && !memberSearchQuery && !selectedClass" class="mb-8">
                     <div class="flex items-center gap-2 mb-4">
                        <span class="text-2xl">👑</span>
                        <h3 class="font-black text-slate-800 text-lg">军团指挥部</h3>
                        <div class="h-[2px] flex-1 bg-gradient-to-r from-yellow-200 to-transparent"></div>
                     </div>
                     <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <NuxtLink :to="'/member/' + member.id" v-for="member in leaders" :key="member.id" class="relative bg-gradient-to-br from-yellow-50 to-white p-4 rounded-2xl border-2 border-yellow-200 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
                           <div class="relative">
                              <img :src="member.profile_url || '/bbbswz.png'" class="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-md object-cover bg-white" />
                              <div class="absolute -top-2 -right-1 text-xl drop-shadow-md">👑</div>
                           </div>
                           <div class="flex-1 min-w-0">
                              <h4 class="font-black text-slate-800 text-lg truncate flex items-center gap-1">
                                {{ member.name }}
                                <span v-if="member.gender === 'female'" class="text-pink-400 text-xs">♀</span>
                                <span v-else-if="member.gender === 'male'" class="text-blue-400 text-xs">♂</span>
                              </h4>
                              <div class="flex items-center gap-2 mt-1 flex-wrap">
                                <span class="bg-yellow-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">军团长</span>
                                <span class="text-xs text-slate-500 font-bold">Lv.{{ member.level }}</span>
                                <span v-if="member.item_level" class="text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 rounded flex items-center gap-0.5" title="装备分数">
                                  ⚔️ {{ member.item_level }}
                                </span>
                              </div>
                              <div class="text-xs text-slate-400 mt-1 truncate">{{ member.title_name || member.note || '暂无签名' }}</div>
                           </div>
                        </NuxtLink>
                     </div>
                  </div>

                  <!-- 普通成员列表 -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    <NuxtLink 
                      :to="'/member/' + member.id"
                      v-for="member in otherMembers" 
                      :key="member.id" 
                      class="group relative bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-white hover:border-[#AEE2F9] p-3 flex flex-col items-center transition-all hover:-translate-y-1 hover:shadow-lg will-change-transform cursor-pointer"
                    >
                      <!-- 职位徽章 (精英军官) -->
                      <div v-if="member.role === 'officer'" class="absolute -top-2 -right-2 z-10">
                        <span class="bg-purple-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">精英军官</span>
                      </div>
                      
                      <div class="relative w-14 h-14 sm:w-16 sm:h-16 mb-2">
                        <img 
                          loading="lazy" 
                          :src="member.profile_url || '/bbbswz.png'" 
                          class="w-full h-full rounded-full object-cover border-2 border-white shadow-sm bg-slate-100 group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div class="absolute bottom-0 right-0 bg-[#45a6d5] text-white text-[10px] font-bold px-1.5 rounded-full border border-white min-w-[20px] text-center">
                          {{ member.level }}
                        </div>
                        <!-- 职位徽章 (军团兵) -->
                        <div v-if="member.role === 'member'" class="absolute -bottom-1 -left-1">
                          <span class="bg-slate-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white scale-90 origin-left">军团兵</span>
                        </div>
                      </div>
                      
                      <h4 class="font-bold text-slate-800 text-xs sm:text-sm truncate w-full text-center px-1" :title="member.name">{{ member.name }}</h4>
                      <span class="text-[10px] sm:text-xs text-slate-500 font-medium mb-1 truncate w-full text-center">{{ member.class_name || '未知' }}</span>
                      
                      <div class="flex items-center gap-1 justify-center w-full">
                        <span class="text-[10px] text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full">{{ member.class_name || '未知' }}</span>
                        <!-- 装备分数 -->
                        <span v-if="member.item_level" class="text-[10px] text-yellow-600 bg-yellow-50/80 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5" title="装备分数">
                          ⚔️{{ member.item_level }}
                        </span>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'join'" class="h-full flex flex-col items-center justify-center text-center px-4">
                <div class="relative w-48 md:w-64 mb-6 group">
                  <img src="/bbbscmt.png" class="w-full h-auto drop-shadow-xl group-hover:scale-110 transition-transform duration-500 -scale-x-100" />
                  <div class="absolute -top-4 -right-4 bg-[#f9b11d] text-white text-xs font-black px-3 py-1 rounded-full shadow-md animate-bounce">
                    宝宝巴士 🚌
                  </div>
                </div>
                <h4 class="text-2xl font-black text-sky-900 mb-2">准备好上车了吗？</h4>
                <p class="text-sky-700/60 mb-6 font-medium">我们需要最勇敢的宝宝加入艾昂大陆的冒险！</p>
                <button class="bg-[#f9b11d] hover:bg-[#fbc02d] text-white px-12 py-4 rounded-3xl font-black text-xl shadow-[0_8px_0_0_#d98a00] active:translate-y-1 active:shadow-none transition-all">
                  提交申请书
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- 底部动态草地层 -->
    <div class="absolute bottom-0 w-full h-32 md:h-48 pointer-events-none overflow-hidden z-10">
      <!-- 远景草坡 -->
      <svg class="absolute bottom-0 w-[120%] -left-[10%] h-full text-[#A3D95B]" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,20 1200,60 L1200,120 L0,120 Z" fill="currentColor"/>
      </svg>
      
      <!-- 近景草坡 (带波浪动画) -->
      <svg class="absolute -bottom-4 w-[150%] -left-[25%] h-[80%] text-[#B2E455] animate-grass-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,60 C300,20 600,100 900,40 C1050,10 1200,80 1200,80 L1200,150 L0,150 Z" fill="currentColor"/>
      </svg>

      <!-- 随机花朵 (SVG 设计) -->
      <div class="absolute bottom-6 left-[15%] w-8 h-8 animate-sway origin-bottom" style="animation-delay: 0.2s">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" fill="#F9B11D"/>
          <path d="M12 5C12 5 14 2 16 4C18 6 15 8 15 8M12 19C12 19 10 22 8 20C6 18 9 16 9 16M5 12C5 12 2 10 4 8C6 6 8 9 8 9M19 12C19 12 22 14 20 16C18 18 16 15 16 15M7 17C7 17 4 19 5 21C6 23 9 20 9 20M17 7C17 7 20 5 19 3C18 1 15 4 15 4M17 17C17 17 19 20 21 19C23 18 20 15 20 15M7 7C7 7 5 4 3 5C1 6 4 9 4 9" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="absolute bottom-8 left-[45%] w-6 h-6 animate-sway origin-bottom" style="animation-delay: 1.5s">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21V15M12 15C12 15 16 13 16 9C16 5 12 3 12 3C12 3 8 5 8 9C8 13 12 15 12 15Z" stroke="#FF8787" stroke-width="2" fill="#FFE3E3"/>
          <path d="M10 11C10 11 9 10 9 8.5C9 7 10 6 10 6" stroke="#FF8787" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="absolute bottom-5 left-[85%] w-10 h-10 animate-sway origin-bottom" style="animation-delay: 0.8s">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4" fill="#6B4226"/>
          <circle cx="12" cy="12" r="9" stroke="#F9B11D" stroke-width="4" stroke-dasharray="2 2"/>
          <path d="M12 3V5M12 19V21M3 12H5M19 12H21" stroke="#F9B11D" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="absolute bottom-10 left-[65%] w-7 h-7 animate-sway origin-bottom" style="animation-delay: 2.1s">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21V11M12 11C14 11 16 9 16 7C16 5 14 3 12 3C10 3 8 5 8 7C8 9 10 11 12 11Z" fill="#D8F5A2" stroke="#B2E455" stroke-width="2"/>
          <path d="M12 15C12 15 15 14 16 16M12 18C12 18 9 17 8 19" stroke="#B2E455" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 奔跑的小羊 (xiaoyang.png) -->
      <div class="absolute bottom-4 -left-16 animate-walk-across" style="animation-duration: 20s;">
        <div class="relative w-12 h-10 flex items-center justify-center">
          <img src="/xiaoyang.png" class="w-full h-full object-contain drop-shadow-sm" />
          <div class="absolute -top-6 -right-4 text-[10px] font-black text-sky-500 bg-white/90 px-2 py-1 rounded-full shadow-sm whitespace-nowrap opacity-0 animate-speech-bubble border border-sky-100">
            咩~
          </div>
        </div>
      </div>

      <!-- 宝宝巴士 (bbbscmt.png) - 正在巡逻的巴士 -->
      <div class="absolute bottom-2 -left-32 animate-walk-across z-20 pointer-events-none" style="animation-duration: 25s; animation-delay: 5s;">
        <div class="relative w-24 md:w-32 h-auto flex flex-col items-center">
          <img src="/bbbscmt.png" class="w-full h-full object-contain drop-shadow-md -scale-x-100" />
          <div class="absolute -top-8 bg-white/90 px-3 py-1 rounded-2xl shadow-sm border border-sky-100 text-[10px] font-black text-sky-600 whitespace-nowrap opacity-0 animate-speech-bubble" style="animation-delay: 6s;">
            嘀嘀~ 宝宝巴士出发啦!
          </div>
        </div>
      </div>
      
      <!-- 追逐的小鸡 (SVG 设计) -->
      <div class="absolute bottom-5 -left-16 animate-walk-across" style="animation-duration: 20s; animation-delay: 2s;">
        <div class="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-sm">
            <!-- 身体 -->
            <circle cx="12" cy="14" r="7" fill="#FFD93D"/>
            <!-- 眼睛 -->
            <circle cx="15" cy="12" r="1" fill="#2D3436"/>
            <!-- 嘴巴 -->
            <path d="M19 13L21 14L19 15Z" fill="#FF9494" stroke="#FF9494" stroke-width="1" stroke-linejoin="round"/>
            <!-- 翅膀 -->
            <path d="M10 14C10 14 7 13 6 15" stroke="#F9B11D" stroke-width="2" stroke-linecap="round"/>
            <!-- 腿 -->
            <line x1="11" y1="21" x2="11" y2="23" stroke="#F9B11D" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="14" y1="21" x2="14" y2="23" stroke="#F9B11D" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const isClient = process.client

// 用户显示名
const displayUsername = ref('guest')

// 获取用户信息
const fetchUserInfo = async () => {
  if (!user.value) return
  
  // 1. 优先尝试从 admin_user_list 获取（如果已同步）
  const { data, error } = await supabase
    .from('admin_user_list')
    .select('username')
    .eq('id', user.value.id)
    .maybeSingle()
    
  if (data?.username) {
    displayUsername.value = data.username
  } else {
    // 2. 降级使用邮箱前缀
    displayUsername.value = user.value.email?.split('@')[0] || 'guest'
  }
}

watchEffect(() => {
  if (user.value) {
    fetchUserInfo()
  }
})

// Tab 标签页配置 (改用异步数据)
const tabs = ref([])
// 默认占位 Tab
const defaultTabs = [
  { id: 'news', name: '军团伴说', hidden: false },
  { id: 'fresh', name: '军团鲜哒', hidden: false },
  { id: 'analysis', name: '战力解析', hidden: false },
  { id: 'cost', name: '造价计算', hidden: false },
  { id: 'kinah', name: '基纳比价', hidden: false },
  { id: 'rank', name: '战力排行', hidden: false },
  { id: 'search', name: '即时查询', hidden: false },
  { id: 'members', name: '军团成员', hidden: false },
  { id: 'join', name: '入团手续', hidden: false }
]

const activeTab = useState('homeActiveTab', () => 'news')
const showMobileMenu = ref(false)

const visibleTabs = computed(() => tabs.value.filter(t => !t.hidden))

// 悬浮按钮拖拽逻辑
const floatingBtnRef = ref(null)
const windowWidth = ref(0)
const windowHeight = ref(0)
const btnPos = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = { x: 0, y: 0 }
const initialBtnPos = { x: 0, y: 0 }
const isRightSide = computed(() => (btnPos.x + 30) > windowWidth.value / 2)

const startDrag = (e) => {
  isDragging.value = true
  const touch = e.touches[0]
  dragStart.x = touch.clientX
  dragStart.y = touch.clientY
  initialBtnPos.x = btnPos.x
  initialBtnPos.y = btnPos.y
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const touch = e.touches[0]
  const dx = touch.clientX - dragStart.x
  const dy = touch.clientY - dragStart.y
  
  // 限制边界
  let newX = initialBtnPos.x + dx
  let newY = initialBtnPos.y + dy
  
  newX = Math.max(0, Math.min(newX, windowWidth.value - 60))
  newY = Math.max(0, Math.min(newY, windowHeight.value - 60))
  
  btnPos.x = newX
  btnPos.y = newY
}

const endDrag = () => {
  isDragging.value = false
  // 磁吸效果：自动吸附到最近的左右边缘
  if (btnPos.x + 30 > windowWidth.value / 2) {
    btnPos.x = windowWidth.value - 60 // 吸附到右边 (留出按钮宽度)
  } else {
    btnPos.x = 10 // 吸附到左边
  }
}

const toggleMenu = () => {
  // 防止拖拽结束时误触发点击
  if (Math.abs(btnPos.x - initialBtnPos.x) < 5 && Math.abs(btnPos.y - initialBtnPos.y) < 5) {
    showMobileMenu.value = !showMobileMenu.value
  }
}

// 动态内容列表
const posts = ref([])
const loadingPosts = ref(false)

// 成员列表
const members = ref([])
const loadingMembers = ref(false)
const memberSearchQuery = ref('')
const selectedClass = ref('')
const sortOrder = ref('role') // 默认按职位排序

const filteredMembers = computed(() => {
  let list = members.value.filter(m => {
    const matchName = m.name.toLowerCase().includes(memberSearchQuery.value.toLowerCase())
    const matchClass = selectedClass.value ? m.class_name === selectedClass.value : true
    return matchName && matchClass
  })
  
  // 排序逻辑
  return list.sort((a, b) => {
    // 1. 如果选择了按职位排序，则优先比较职位权重
    if (sortOrder.value === 'role') {
      const roleWeight = { 'leader': 3, 'officer': 2, 'member': 1 }
      const weightDiff = roleWeight[b.role] - roleWeight[a.role]
      if (weightDiff !== 0) return weightDiff
    }
    
    // 2. 根据选择排序
    if (sortOrder.value === 'item_level') {
        // 战力降序 (如果战力一样，按等级降序)
        const itemLevelDiff = (b.item_level || 0) - (a.item_level || 0)
        if (itemLevelDiff !== 0) return itemLevelDiff
    }
    
    // 3. 默认/兜底：等级降序
    return b.level - a.level
  })
})

const uniqueClasses = computed(() => {
  const classes = new Set(members.value.map(m => m.class_name).filter(Boolean))
  return Array.from(classes).sort()
})

const leaders = computed(() => {
  return filteredMembers.value.filter(m => m.role === 'leader')
})

const otherMembers = computed(() => {
  // 如果有搜索或筛选，为了不打乱，全部显示在 grid 中（除了军团长单独显示时）
  if (memberSearchQuery.value || selectedClass.value) {
    return filteredMembers.value
  }
  return filteredMembers.value.filter(m => m.role !== 'leader')
})

// 1. 获取 Tab 配置
const fetchTabs = async () => {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'home_tabs')
    .single()
  
  if (error) {
    console.error('Error fetching tabs:', error)
    $alert('获取tabs配置失败',JSON.stringify(error),JSON.stringify(data))
    tabs.value = defaultTabs
    return
  }

  if (data?.value) {
    let tabsData = data.value
    
    // 尝试解析字符串 (防止数据库存储为 JSON 字符串)
    if (typeof tabsData === 'string') {
      try {
        tabsData = JSON.parse(tabsData)
      } catch (e) {
        console.error('JSON parse error:', e)
      }
    }
    
    // 深度解析：处理嵌套结构
    if (tabsData && typeof tabsData === 'object') {
        // Case 1: Wrapped in "value" key { value: [...] }
        if (!Array.isArray(tabsData) && Array.isArray(tabsData.value)) {
            tabsData = tabsData.value
        } 
        // Case 2: Single object { id: '...', name: '...' }
        else if (!Array.isArray(tabsData) && tabsData.id && tabsData.name) {
            tabsData = [tabsData]
        }
        // Case 3: Dictionary/Map { "0": {...}, "1": {...} }
        else if (!Array.isArray(tabsData)) {
            const values = Object.values(tabsData)
            const validItems = values.filter(v => v && typeof v === 'object' && v.id && v.name)
            if (validItems.length > 0) {
                tabsData = validItems
            }
        }
    }

    if (Array.isArray(tabsData) && tabsData.length > 0) {
      tabs.value = tabsData
      if (!tabs.value.some(t => t.id === 'kinah')) {
        tabs.value.push({ id: 'kinah', name: '基纳比价', hidden: false })
      }
      // 确保当前选中项有效且可见
      const currentTabVisible = tabs.value.find(t => t.id === activeTab.value && !t.hidden)
      if (!currentTabVisible) {
        const firstVisible = tabs.value.find(t => !t.hidden)
        if (firstVisible) {
          activeTab.value = firstVisible.id
        }
      }
    } else {
      tabs.value = defaultTabs
    }
  } else {
    tabs.value = defaultTabs
  }
}

// 监听 Mobile Menu 状态，锁定/解锁 Body 滚动
watch(showMobileMenu, (val) => {
  if (process.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})

// 2. 根据当前 Tab 获取内容
const fetchPosts = async () => {
  loadingPosts.value = true
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('type', activeTab.value) // 筛选当前 Tab 类型
    .order('created_at', { ascending: false }) // 按时间倒序
  
  if (data) {
    posts.value = data
  } else {
    posts.value = []
  }
  loadingPosts.value = false
}

// 3. 获取成员列表
const fetchMembers = async () => {
  loadingMembers.value = true
  const { data, error } = await supabase
    .from('legion_members')
    .select('*')
    // 简单的排序策略：军团长 -> 百夫长 -> 普通成员，然后再按等级降序
    // Supabase 排序语法限制，这里先按等级降序，前端再微调职位顺序
    .order('level', { ascending: false })
  
  if (data) {
    // 原始数据赋值，具体排序交给 computed 处理
    members.value = data
  } else {
    members.value = []
  }
  loadingMembers.value = false
}

onActivated(() => {
  if (route.path === '/' && activeTab.value === 'members') {
    fetchMembers()
  }
})

// 监听 Tab 切换，自动拉取对应内容
watch(activeTab, (val) => {
  if (val === 'members') {
    fetchMembers()
  } else if (val === 'cost' || val === 'search') {
    // 自身组件内部处理加载
  } else {
    fetchPosts()
  }
}, { immediate: true })

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.error(error)
  router.push('/login')
}

// 视频引导相关逻辑
const introPlayed = useState('introPlayed', () => false)
const showIntro = ref(true)
const introStorageKey = 'aion2_intro_played_v1'
if (process.client) {
  try {
    const seen = localStorage.getItem(introStorageKey) === '1'
    introPlayed.value = seen
    showIntro.value = !seen
  } catch {
    showIntro.value = !introPlayed.value
  }
} else {
  showIntro.value = !introPlayed.value
}

// ECharts 配置
const radarOption = ref({
  radar: {
    indicator: [
      { name: '攻击', max: 100 },
      { name: '防御', max: 100 },
      { name: '敏捷', max: 100 },
      { name: '智力', max: 100 },
      { name: '体力', max: 100 },
      { name: '幸运', max: 100 }
    ],
    radius: '70%',
    center: ['50%', '50%'],
  },
  series: [
    {
      name: '战力分布',
      type: 'radar',
      data: [
        {
          value: [80, 50, 90, 80, 70, 60],
          name: '当前角色',
          areaStyle: {
            color: 'rgba(69, 166, 213, 0.3)'
          },
          lineStyle: {
            color: '#45a6d5'
          },
          itemStyle: {
            color: '#45a6d5'
          }
        }
      ]
    }
  ]
})

const lineOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    top: '10%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#94a3b8' } }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#94a3b8' } },
    splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } }
  },
  series: [
    {
      name: '活跃度',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(69, 166, 213, 0.5)' },
            { offset: 1, color: 'rgba(69, 166, 213, 0.01)' }
          ]
        }
      },
      itemStyle: { color: '#45a6d5' }
    }
  ]
})

const isPlayingOutro = ref(false)
const introVideoRef = ref(null)
const outroVideoRef = ref(null)
const outroBgRef = ref(null)

// 监听过渡视频引用，自动加快播放速度
watch([outroVideoRef, outroBgRef], ([video, bg]) => {
  if (video) video.playbackRate = 1.5
  if (bg) bg.playbackRate = 1.5
})

const handleIntroClick = () => {
  // 点击时如果未播放则尝试播放，如果正在播放则触发离场
  if (introVideoRef.value && introVideoRef.value.paused) {
    introVideoRef.value.play().catch(e => console.error('Manual play failed:', e))
  } else {
    handleIntroScroll({ type: 'click', deltaY: 100 })
  }
}

const handleIntroScroll = (e) => {
  // 简单的防抖或阈值判断，防止误触
  if (isPlayingOutro.value) return
  
  // 向上滑动 (wheel deltaY > 0) 或 触摸上滑
  // 这里简化判断，只要有动作就触发
  if (e.type === 'wheel' && e.deltaY < 10) return // 忽略微小抖动
  
  triggerOutro()
}

const triggerOutro = () => {
  if (isPlayingOutro.value) return
  isPlayingOutro.value = true
  
  if (process.client) {
    nextTick(() => {
      // 播放前景过渡视频
      if (outroVideoRef.value) {
        outroVideoRef.value.currentTime = 0
        outroVideoRef.value.play().catch(err => {
          console.error('Play outro failed:', err)
          // 兜底：如果播放失败直接结束
          onOutroEnded()
        })
      }
      // 同步播放背景模糊视频
      if (outroBgRef.value) {
        outroBgRef.value.currentTime = 0
        outroBgRef.value.play().catch(() => {}) // 背景播放失败忽略
      }
    })
  }
}

const onOutroEnded = () => {
  showIntro.value = false
  introPlayed.value = true
  if (process.client) {
    try {
      localStorage.setItem(introStorageKey, '1')
    } catch {}
  }
  // 视频结束后初始化内容动画
  // 延迟一点点，让幕布上拉的动画先开始，内容再入场，形成交错感
  setTimeout(() => {
    initScrollReveal()
  }, 300)
}

const initScrollReveal = async () => {
  if (typeof window === 'undefined') return
  const { default: ScrollReveal } = await import('scrollreveal')
  const sr = ScrollReveal({
    distance: '30px',
    duration: 1000,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    interval: 100,
    opacity: 0,
    origin: 'bottom',
    cleanup: true, // 保持干净
  })

  sr.reveal('.hero-figure', { delay: 200, scale: 0.9 })
  sr.reveal('h2', { delay: 300 })
  sr.reveal('p', { delay: 400 })
  sr.reveal('.tab-btn', { interval: 50, delay: 500 })
  sr.reveal('.panel-cartoon', { delay: 600, distance: '50px' })
}

const clouds = ref([])
let cloudTimer
let driftRaf
let lastSpawnAt = 0
const viewport = reactive({ w: 0, h: 0 })

// 可控参数
const cloudConfig = reactive({
  enable: true,            // 是否启用云朵生成与动画
  maxClouds: 4,            // 同屏最多云朵数量
  spawnMs: 4000,           // 生成间隔（毫秒）
  sizeMin: 100,            // 云朵最小尺寸（px）
  sizeMax: 220,            // 云朵最大尺寸（px）
  lifeMin: 12000,          // 云朵最短生命周期（毫秒）
  lifeMax: 24000,          // 云朵最长生命周期（毫秒）
  ampBobMin: 4,            // 上下摆动幅度最小值（px）
  ampBobMax: 14,           // 上下摆动幅度最大值（px）
  ampWiggleMin: 4,         // 左右轻摇幅度最小值（px）
  ampWiggleMax: 14,        // 左右轻摇幅度最大值（px）
  breathMin: 1.02,         // 呼吸缩放最小倍数
  breathMax: 1.08,         // 呼吸缩放最大倍数
  hardCleanup: true,       // 硬清理：超限时先移除最早云朵
  // 避让区域：避免覆盖英雄区（百分比，0-100）
  avoidZones: [ { topMin: 18, topMax: 40, leftMin: 28, leftMax: 72 } ], // top/left 为百分比范围
})

const rand = (min, max) => Math.random() * (max - min) + min
const randi = (min, max) => Math.round(rand(min, max))

const overlaps = (a, b) => {
  const w = viewport.w || window.innerWidth
  const h = viewport.h || window.innerHeight
  const ax = (a.left/100)*w + a.size/2
  const ay = (a.top/100)*h + a.size*0.35
  const bx = (b.left/100)*w + b.size/2
  const by = (b.top/100)*h + b.size*0.35
  const dx = ax - bx
  const dy = ay - by
  const minDist = (a.size + b.size) * 0.45
  return dx*dx + dy*dy < minDist*minDist
}

const inAvoid = (c) => cloudConfig.avoidZones?.some(z => c.top >= z.topMin && c.top <= z.topMax && c.left >= z.leftMin && c.left <= z.leftMax)

const spawnCloud = () => {
  if (!cloudConfig.enable) return
  const now = Date.now()
  if (now - lastSpawnAt < Math.min(600, cloudConfig.spawnMs * 0.5)) return
  lastSpawnAt = now
  for (let tries = 0; tries < 10; tries++) {
    const candidate = {
      id: crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
      top: randi(8, 78),
      left: randi(5, 90),
      size: randi(cloudConfig.sizeMin, cloudConfig.sizeMax),
      opacity: 0.95,
      bob: randi(cloudConfig.ampBobMin, cloudConfig.ampBobMax),
      wiggle: randi(cloudConfig.ampWiggleMin, cloudConfig.ampWiggleMax),
      breath: +rand(cloudConfig.breathMin, cloudConfig.breathMax).toFixed(3),
      rot: +rand(0.8, 1.5).toFixed(2),
      speedX: +rand(0.04, 0.08).toFixed(3),
      speedY: +rand(0.05, 0.09).toFixed(3),
      phaseX: +rand(0, Math.PI*2).toFixed(3),
      phaseY: +rand(0, Math.PI*2).toFixed(3),
      ampX: randi(6, 12),
      ampY: randi(4, 10),
      ox: 0,
      oy: 0,
      image: Math.random() > 0.5 ? '/yunduo.png' : '/mianyangyunduo.png'
    }
    if (inAvoid(candidate)) continue
    if (!clouds.value.some(c => overlaps(candidate, c))) {
      if (cloudConfig.hardCleanup && clouds.value.length >= cloudConfig.maxClouds) {
        clouds.value.shift()
      }
      clouds.value.push(candidate)
      const life = randi(cloudConfig.lifeMin, cloudConfig.lifeMax)
      setTimeout(() => { clouds.value = clouds.value.filter(x => x.id !== candidate.id) }, life)
      break
    }
  }
}

const resetSpawner = () => {
  if (cloudTimer) clearInterval(cloudTimer)
  if (cloudConfig.enable) {
    cloudTimer = setInterval(() => {
      if (!cloudConfig.hardCleanup && clouds.value.length >= cloudConfig.maxClouds) return
      spawnCloud()
    }, cloudConfig.spawnMs)
  }
}

const startDrift = () => {
  const t0 = performance.now()
  const step = (now) => {
    const t = (now - t0) / 1000
    clouds.value.forEach(c => {
      c.ox = +(Math.sin(t * (c.speedX || 0.06) + (c.phaseX || 0)) * (c.ampX || 8)).toFixed(2)
      c.oy = +(Math.cos(t * (c.speedY || 0.07) + (c.phaseY || 0)) * (c.ampY || 6)).toFixed(2)
    })
    driftRaf = requestAnimationFrame(step)
  }
  driftRaf = requestAnimationFrame(step)
}

onMounted(() => {
  fetchTabs()

  viewport.w = window.innerWidth
  viewport.h = window.innerHeight
  if (process.client) {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    
    // 如果已经播放过，直接初始化动画
    if (!showIntro.value) {
      initScrollReveal()
    }

    // 初始位置：右侧，距顶部约 60% (中下位置)
    btnPos.x = windowWidth.value - 60
    btnPos.y = windowHeight.value * 0.6
    
    for (let i = 0; i < Math.min(2, cloudConfig.maxClouds); i++) spawnCloud()
    resetSpawner()
    startDrift()
    window.addEventListener('resize', () => { 
      viewport.w = window.innerWidth; 
      viewport.h = window.innerHeight
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
      // 窗口变化时修正按钮位置，防止出界
      btnPos.x = Math.min(btnPos.x, windowWidth.value - 60)
    })
    nextTick(() => {
      // 强制触发播放（兼容移动端省电策略）
      if (showIntro.value && introVideoRef.value) {
        introVideoRef.value.play().catch(() => {
          // 如果自动播放被拦截，显示一个点击播放的遮罩（或者静默失败）
          console.log('Autoplay blocked')
        })
      }
    })
  }
})

onUnmounted(() => { if (cloudTimer) clearInterval(cloudTimer); if (driftRaf) cancelAnimationFrame(driftRaf) })

watch(() => cloudConfig.spawnMs, resetSpawner)
watch(() => cloudConfig.enable, resetSpawner)
watch(() => cloudConfig.maxClouds, () => { if (clouds.value.length < cloudConfig.maxClouds) spawnCloud() })
watch(clouds, (arr) => {
  while (cloudConfig.hardCleanup && arr.length > cloudConfig.maxClouds) { arr.shift() }
  if (!cloudConfig.hardCleanup && arr.length >= cloudConfig.maxClouds && cloudTimer) { clearInterval(cloudTimer) }
  else if (arr.length < cloudConfig.maxClouds && !cloudTimer && cloudConfig.enable) { resetSpawner() }
}, { deep: true })
</script>

<style scoped>
/* soft ambient blur clouds and random clouds (variable-composed transforms) */
@keyframes cloud-bob { 0%,100% { --ty: 0px; } 50% { --ty: var(--bob-amp, -8px); } }
@keyframes float-slow { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes arrow-up { 0%,100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-6px); opacity: 1; } }
@keyframes cloud-wiggle { 0%,100% { --tx: 0px; } 50% { --tx: var(--wiggle-amp, 6px); } }
@keyframes cloud-breathe { 0%,100% { --scale: 1; } 50% { --scale: var(--breath-scale, 1.06); } }
@keyframes cloud-sway { 0%,100% { --rot: 0deg; } 50% { --rot: var(--rot-amp, 1deg); } }
.animate-cloud-soft { animation: cloud-bob 9s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
.animate-arrow { animation: arrow-up 1.5s ease-in-out infinite; }
.animate-grass-wave { animation: grass-wave 8s ease-in-out infinite alternate; }
.animate-sway { animation: sway 3s ease-in-out infinite; }
.animate-walk-across { animation: walk-across linear infinite; }
.animate-speech-bubble { animation: speech-bubble 5s infinite; }
.cloud-item { --tx:0px; --ty:0px; --rot:0deg; --scale:1; will-change: transform, opacity, filter; transform: translate(calc(var(--tx) + var(--offset-x, 0px)), calc(var(--ty) + var(--offset-y, 0px))) rotate(var(--rot)) scale(var(--scale)); transition: transform .2s linear; animation: cloud-bob 8s ease-in-out infinite, cloud-wiggle 15s ease-in-out infinite, cloud-breathe 13s ease-in-out infinite, cloud-sway 17s ease-in-out infinite; filter: drop-shadow(0 4px 0 rgba(255,255,255,.45)); }
.cloud-item.cloud-fade-enter-active, .cloud-item.cloud-fade-leave-active { animation-play-state: paused; }
.cloud-fade-enter-active, .cloud-fade-leave-active { transition: opacity 1.2s cubic-bezier(.4,0,.2,1), transform 1.2s cubic-bezier(.4,0,.2,1), filter 1.2s ease; }
.cloud-fade-enter-from { opacity: 0; transform: translateY(16px) scale(.94); filter: blur(3px); }
.cloud-fade-enter-to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
.cloud-fade-leave-from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
.cloud-fade-leave-to { opacity: 0; transform: translateY(-12px) scale(.92); filter: blur(3px); }
.cloud-fade-move { transition: transform .6s ease; }


.bg-watercolor {
  background-color: #C7F3FE;
}

/* 英雄图整体融合背景：无边框，仅柔和光晕 */
.hero-figure { position: relative; padding: .75rem; border-radius: 3rem; background: radial-gradient(120% 120% at 50% 40%, rgba(255,255,255,.60) 0%, rgba(255,255,255,.38) 40%, rgba(174,226,249,.25) 70%, transparent 100%); box-shadow: 0 12px 24px rgba(69,166,213,.16); }
.hero-img { filter: drop-shadow(0 8px 0 rgba(249,177,29,.30)) drop-shadow(0 16px 0 rgba(69,166,213,.20)); }

/* 视频容器发光 */
.video-glow {
  box-shadow: 0 0 60px -10px rgba(174,226,249,0.4), 0 20px 40px -10px rgba(69,166,213,0.15);
}

/* 自定义滚动条 */
.custom-scroll { scrollbar-width: thin; scrollbar-color: #AEE2F9 #E6F7FF; }
:deep(.custom-scroll)::-webkit-scrollbar { width: 8px; }
:deep(.custom-scroll)::-webkit-scrollbar-track { background: #E6F7FF; border-radius: 9999px; }
:deep(.custom-scroll)::-webkit-scrollbar-thumb { background: #AEE2F9; border-radius: 9999px; box-shadow: inset 0 0 0 2px #ffffff; }

.tab-btn { padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 900; border-width: 2px; transition: all .2s ease; }

.panel-cartoon { background: rgba(255,255,255,.65); backdrop-filter: blur(8px); border-radius: 2rem; box-shadow: 0 12px 20px rgba(69,166,213,.12); }
.panel-cartoon::after { content: ''; position: absolute; inset: 0; border-radius: 2rem; pointer-events: none; background: radial-gradient(circle at 80% 90%, rgba(174,226,249,.10), transparent 55%); }

.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

/* Pop transition for bird */
.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { transition: all 0.2s ease; }
.pop-leave-to { opacity: 0; transform: scale(0); }

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
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

@keyframes speech-bubble {
  0%, 40%, 60%, 100% { opacity: 0; transform: scale(0.8); }
  45%, 55% { opacity: 1; transform: scale(1); }
}
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
}

/* 移动端列表交错动画 */
.staggered-list-enter-active,
.staggered-list-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: var(--delay);
}
.staggered-list-enter-from,
.staggered-list-leave-to {
  opacity: 0;
  transform: translateX(var(--start-x)) scale(0.8);
}
</style>
