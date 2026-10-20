<!-- app/components/GlobalNotificationUI.vue -->
<script setup>
const { $feedbackState, $removeNotify } = useNuxtApp()
</script>

<template>
  <!-- 右上角悬浮容器 -->
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
    <TransitionGroup name="notification-slide">
      <template v-for="item in $feedbackState.notifications" :key="item.id">
        <div
          class="pointer-events-auto flex items-start justify-between gap-3 p-4 bg-white/95 dark:bg-slate-900/95 border rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300"
          :class="[
            item.type === 'success' ? 'border-emerald-500/40 bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200' :
            item.type === 'error'   ? 'border-rose-500/40 bg-rose-50/90 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200' :
            item.type === 'warning' ? 'border-amber-500/40 bg-amber-50/90 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200' :
                                      'border-sky-500/40 bg-sky-50/90 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200'
          ]"
        >
          <!-- 左侧图标与内容区域 -->
          <div class="flex items-start gap-3 min-w-0">
            <!-- 状态小圆点 -->
            <div
              class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
              :class="[
                item.type === 'success' ? 'bg-emerald-500 shadow-sm shadow-emerald-500' :
                item.type === 'error'   ? 'bg-rose-500 shadow-sm shadow-rose-500' :
                item.type === 'warning' ? 'bg-amber-500 shadow-sm shadow-amber-500' : 'bg-[#45a6d5] shadow-sm shadow-[#45a6d5]'
              ]"
            ></div>

            <div class="space-y-1 min-w-0">
              <div class="text-xs font-black tracking-tight text-slate-800 dark:text-slate-100">
                {{ item.title }}
              </div>
              <div class="text-[11px] font-medium text-slate-600 dark:text-slate-300 break-words leading-relaxed">
                {{ item.message }}
              </div>
            </div>
          </div>

          <!-- 右侧手动关闭按钮 -->
          <button
            type="button"
            @click="$removeNotify(item.id)"
            class="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
            title="关闭通知"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.notification-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
</style>