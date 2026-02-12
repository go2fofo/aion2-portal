<template>
  <Teleport to="body">
    <!-- 全局弹窗 (Alert/Confirm) -->
    <Transition name="modal-fade">
      <div v-if="dialog.visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="handleMaskClick"></div>
        
        <!-- 弹窗主体 -->
        <div class="relative bg-white w-full max-w-[320px] rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] overflow-hidden transform transition-all animate-pop-in">
          <!-- 顶部装饰 -->
          <div class="h-3 w-full" :class="dialog.type === 'confirm' ? 'bg-[#f9b11d]' : 'bg-[#45a6d5]'"></div>
          
          <div class="p-6 pt-8 text-center">
            <!-- 图标/图片 -->
            <div class="mb-5 relative h-16 w-16 mx-auto">
               <div class="absolute inset-0 bg-slate-50 rounded-full animate-ping opacity-20" :class="dialog.type === 'confirm' ? 'bg-yellow-400' : 'bg-blue-400'"></div>
               <img src="/xiaoniao.png" class="relative w-full h-full object-contain animate-bounce-short z-10" />
            </div>

            <h3 class="font-black text-xl text-slate-800 mb-3 px-2">{{ dialog.title }}</h3>
            <p class="text-sm text-slate-500 font-bold leading-relaxed mb-8 px-4 break-words">{{ dialog.content }}</p>

            <!-- 按钮组 -->
            <div class="flex gap-3 px-2">
              <button 
                v-if="dialog.type === 'confirm'"
                @click="handleCancel"
                class="flex-1 py-3.5 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-sm hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
              >
                取消
              </button>
              <button 
                @click="handleConfirm"
                class="flex-1 py-3.5 rounded-2xl text-white font-black text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0"
                :class="[
                  dialog.type === 'confirm' 
                    ? 'bg-[#f9b11d] shadow-yellow-200 hover:shadow-yellow-200' 
                    : 'bg-[#45a6d5] shadow-blue-200 hover:shadow-blue-200'
                ]"
              >
                {{ dialog.confirmText || '确定' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 全局 Loading -->
    <Transition name="fade">
      <div v-if="loading.visible" class="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-md flex items-center justify-center transition-opacity">
        <div class="flex flex-col items-center gap-6 animate-float">
          <div class="relative w-24 h-24">
             <!-- 外圈光晕 -->
             <div class="absolute inset-0 bg-[#45a6d5] rounded-full opacity-10 blur-xl animate-pulse"></div>
             <!-- 旋转圆环 -->
             <div class="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
             <div class="absolute inset-0 border-[6px] border-[#45a6d5] rounded-full border-t-transparent animate-spin" style="animation-duration: 1s;"></div>
             <!-- 中心Logo -->
             <img src="/xiaoniao.png" class="absolute inset-0 m-auto w-12 h-12 object-contain" />
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="font-black text-slate-800 text-lg tracking-wide">{{ loading.text || '加载中' }}</span>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading...</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { $feedbackState } = useNuxtApp()

// 直接使用插件中定义的响应式状态
const dialog = $feedbackState.dialog
const loading = $feedbackState.loading

const handleConfirm = () => {
  dialog.visible = false
  if (dialog.resolve) dialog.resolve(true)
}

const handleCancel = () => {
  dialog.visible = false
  if (dialog.resolve) dialog.resolve(false) // Confirm 返回 false
}

const handleMaskClick = () => {
  if (dialog.type === 'alert') {
    handleConfirm()
  }
}
</script>

<style scoped>
/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 内容缩放动画 */
.animate-pop-in {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 小鸟跳动 */
.animate-bounce-short {
  animation: bounceShort 2s infinite;
}
@keyframes bounceShort {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 浮动动画 */
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>