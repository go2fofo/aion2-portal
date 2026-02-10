<template>
  <div class="min-h-screen w-full relative bg-watercolor font-sans custom-scroll" :class="{ 'h-screen overflow-hidden': showIntro }">
    
    <!-- 视频引导层 -->
    <div v-if="showIntro" class="fixed inset-0 z-[100] bg-sky-50 flex flex-col items-center justify-center h-[100dvh] w-screen overflow-hidden" @wheel.prevent="handleIntroScroll" @touchmove.prevent="handleIntroScroll">
      
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
      <div class="relative z-10 flex-1 w-full flex flex-col items-center justify-center p-8 animate-float-slow">
        <div class="relative w-full max-w-4xl aspect-square flex items-center justify-center">
          <!-- 循环播放的引导视频 -->
          <video
            v-show="!isPlayingOutro"
            ref="introVideoRef"
            src="/bbbssp.mp4"
            class="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-[3rem] video-glow bg-white"
            autoplay
            loop
            muted
            playsinline
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

    <!-- 云朵层：引导结束后才显示，作为背景层 -->
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
        <img v-for="c in clouds" :key="c.id" src="/yunduo.png"
             class="absolute cloud-item"
             :style="{ top: c.top + '%', left: c.left + '%', width: c.size + 'px', opacity: c.opacity, '--bob-amp': `-${c.bob}px`, '--wiggle-amp': `${c.wiggle}px`, '--breath-scale': c.breath, '--rot-amp': `${c.rot}deg`, '--offset-x': `${c.ox}px`, '--offset-y': `${c.oy}px` }" />
      </transition-group>
    </div>

    <nav class="relative z-50 p-6 flex items-center">
      <div class="flex items-center gap-2">
        <div class="w-12 h-12 bg-white rounded-full p-1 shadow-md border-2 border-[#AEE2F9]">
          <img src="/bbbswz.png" class="w-full h-full object-contain" />
        </div>
        <span class="text-[#45a6d5] font-black text-xl tracking-tighter">BBBS</span>
      </div>
      <div class="flex-1 text-center">
        <span class="text-2xl md:text-3xl font-black text-[#45a6d5] tracking-widest">AION2</span>
      </div>
      <div class="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white shadow-sm flex items-center gap-2">
        <img src="/bbbswbj.png" class="w-6 h-6 rounded-full" />
        <span class="text-xs font-bold text-sky-800">@ {{ user?.email?.split('@')[0] || 'guest' }}</span>
      </div>
    </nav>

    <main class="relative z-20 flex flex-col items-center pt-4 h-full">
      
      <div class="relative mb-6 flex flex-col items-center">
        <div class="absolute -top-6 -right-12 text-5xl animate-bounce">☀️</div>
        <div class="absolute top-10 -left-16 text-4xl -rotate-12">🐦</div>
        
        <div class="hero-figure">
          <img 
            src="/bbbswbj.png" 
            class="hero-img h-56 md:h-64 object-contain" 
          />
        </div>
        
        <h2 class="mt-3 text-5xl md:text-6xl font-black text-[#45a6d5] tracking-widest drop-shadow-[0_3px_0_#fff]">
          宝宝巴士 <span class="text-[#f9b11d]">军团</span>
        </h2>
        <p class="mt-2 text-sky-700 font-bold">冲哇</p>
        <div class="mt-1 flex gap-2">
          <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
          <span class="w-2 h-2 rounded-full bg-[#AEE2F9]"></span>
          <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
        </div>
      </div>

      <div class="w-full max-w-5xl px-6 pb-20">
        <div class="flex justify-center gap-3 mb-4">
          <button 
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'tab-btn',
              activeTab === tab.id 
                ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-lg -translate-y-1' 
                : 'bg-white/80 text-[#45a6d5] border-white hover:bg-white shadow-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>

        <div class="panel-cartoon min-h-[360px] p-8 relative overflow-hidden">
          <div class="absolute -bottom-6 -right-6 text-[8rem] opacity-5 pointer-events-none italic font-black">B.B.B.S</div>
          
          <transition name="fade" mode="out-in">
            <div :key="activeTab" class="h-full">
              <div v-if="activeTab === 'news'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-md">
                  <h3 class="text-[#45a6d5] font-black text-xl flex items-center gap-2"><span>🔔</span> MVIF</h3>
                  <div class="mt-3 space-y-3">
                    <div class="p-4 bg-white rounded-2xl border-2 border-white flex justify-between items-center">
                      <span class="font-bold text-sky-900 italic">军团宣言：今晚 8 点发车！</span>
                      <span class="text-xs text-sky-400">2026-02-10</span>
                    </div>
                    <div class="p-4 bg-white rounded-2xl border-2 border-white flex justify-between items-center">
                      <span class="font-bold text-sky-900 italic">乘务员 勇的尖刺勋章</span>
                      <span class="text-xs text-sky-400">2026-02-10</span>
                    </div>
                    <div class="p-4 bg-white rounded-2xl border-2 border-white flex justify-between items-center">
                      <span class="font-bold text-sky-900 italic">起操偏发富豆 #888+87</span>
                      <span class="text-xs text-sky-400">2026-02-10</span>
                    </div>
                  </div>
                </div>
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

              <div v-else-if="activeTab === 'fresh'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="i in 3" :key="i" class="p-4 bg-[#F0F9FF] rounded-2xl border-2 border-white">
                  <div class="text-4xl mb-2">🐼</div>
                  <p class="text-sky-900 font-bold">新鲜速递 #{{ i }}</p>
                </div>
              </div>

              <div v-else-if="activeTab === 'analysis'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-6 bg-white rounded-2xl border-2 border-[#E6F7FF]">
                  <p class="text-sky-900 font-bold">战力解析面板（示例）</p>
                  <div class="mt-3 h-32 bg-[#F0F9FF] rounded-xl"></div>
                </div>
                <div class="p-6 bg-white rounded-2xl border-2 border-[#E6F7FF]">
                  <p class="text-sky-900 font-bold">趋势折线（示例）</p>
                  <div class="mt-3 h-32 bg-[#F0F9FF] rounded-xl"></div>
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

              <div v-else-if="activeTab === 'join'" class="h-full flex flex-col items-center justify-center text-center">
                <div class="text-6xl mb-4">🚌</div>
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

    <div class="absolute bottom-0 w-full h-24 pointer-events-none">
      <div class="absolute bottom-0 w-[110%] left-[-5%] h-full bg-[#B2E455] rounded-t-[100%] shadow-[inset_0_10px_20px_rgba(255,255,255,0.3)]"></div>
      <div class="absolute bottom-4 w-full flex justify-center gap-16 text-3xl">
        <span class="animate-bounce" style="animation-duration: 3s">🌻</span>
        <span class="animate-bounce" style="animation-duration: 4s">🌷</span>
        <span class="animate-pulse">🐑</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const activeTab = ref('news')

// 视频引导相关逻辑
const showIntro = ref(true)
const isPlayingOutro = ref(false)
const introVideoRef = ref(null)
const outroVideoRef = ref(null)
const outroBgRef = ref(null)

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

const onOutroEnded = () => {
  showIntro.value = false
  // 视频结束后初始化内容动画
  initScrollReveal()
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
  viewport.w = window.innerWidth
  viewport.h = window.innerHeight
  for (let i = 0; i < Math.min(2, cloudConfig.maxClouds); i++) spawnCloud()
  resetSpawner()
  startDrift()
  window.addEventListener('resize', () => { viewport.w = window.innerWidth; viewport.h = window.innerHeight })
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

const tabs = [
  { id: 'news', name: '军团伴说' },
  { id: 'fresh', name: '军团鲜哒' },
  { id: 'analysis', name: '战力解析' },
  { id: 'rank', name: '战力排行' },
  { id: 'join', name: '入团手续' }
]
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
</style>