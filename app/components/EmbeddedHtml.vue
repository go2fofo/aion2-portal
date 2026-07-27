<!-- components/EmbeddedHtml.vue -->
<template>
  <div class="iframe-wrapper" ref="containerRef">
    <!-- 全屏控制按钮 -->
    <button 
      class="fullscreen-btn" 
      @click="toggleFullscreen" 
      :title="isFullscreen ? '退出全屏' : '全屏显示'"
    >
      <!-- 全屏图标 (方框放大) -->
      <svg v-if="!isFullscreen" class="icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
      </svg>
      <!-- 退出全屏图标 (方框缩小) -->
      <svg v-else class="icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14h6m0 0v6m0-6L3 21m17-11h-6m0 0V4m0 6l7-7"></path>
      </svg>
      
      <span class="btn-text">{{ isFullscreen ? '退出全屏' : '全屏显示' }}</span>
    </button>

    <div class="iframe-container">
      <iframe 
        src="/塔2角色管理S3 6.6.html" 
        class="embedded-iframe"
        title="塔2角色管理"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const isFullscreen = ref(false)

// 切换全屏状态
const toggleFullscreen = () => {
  if (!containerRef.value) return

  if (!document.fullscreenElement) {
    // 进入全屏
    containerRef.value.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}

// 监听全屏状态变化（防止用户按 Esc 键退出时按钮状态不同步）
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.iframe-wrapper {
  position: relative;
  width: 100%;
  background-color: #ffffff; 
}

/* 全屏按钮精美样式 */
.fullscreen-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.fullscreen-btn:hover {
  background-color: #ffffff;
  color: #0f172a;
  border-color: #94a3b8;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.icon {
  flex-shrink: 0;
}

.iframe-container {
  width: 100%;
  height: 800px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* 当处于全屏状态时，让容器自动撑满整个屏幕并去掉圆角和边框 */
.iframe-wrapper:fullscreen .iframe-container {
  height: 100vh;
  border: none;
  border-radius: 0;
}

.iframe-wrapper:-webkit-full-screen .iframe-container {
  height: 100vh;
  border: none;
  border-radius: 0;
}

.embedded-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>