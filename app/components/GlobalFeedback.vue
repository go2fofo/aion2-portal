<template>
  <Teleport to="body">
    <!-- 全局弹窗 (Alert/Confirm) -->
    <Transition name="modal-fade">
      <div
        v-if="dialog.visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <!-- 背景遮罩 -->
        <div
          class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
          @click="handleMaskClick"
        ></div>

        <!-- 弹窗主体 -->
        <div
          class="relative bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] overflow-hidden transform transition-all animate-pop-in border border-slate-100 dark:border-slate-800"
        >
          <!-- 顶部装饰 -->
          <div
            class="h-3 w-full"
            :class="dialog.type === 'confirm' ? 'bg-[#f9b11d]' : 'bg-[#45a6d5]'"
          ></div>

          <div class="p-6 pt-8 text-center">
            <!-- 图标/图片 -->
            <div class="mb-5 relative h-16 w-16 mx-auto">
              <div
                class="absolute inset-0 bg-slate-50 dark:bg-slate-800 rounded-full animate-ping opacity-20"
                :class="dialog.type === 'confirm' ? 'bg-yellow-400' : 'bg-blue-400'"
              ></div>
              <img
                src="/xiaoniao.png"
                class="relative w-full h-full object-contain animate-bounce-short z-10"
              />
            </div>

            <h3 class="font-black text-xl text-slate-800 dark:text-slate-100 mb-3 px-2">
              {{ dialog.title }}
            </h3>
            <!-- <p class="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 px-4 break-words">{{ dialog.content }}</p> -->
            <div
              class="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 px-4 break-words"
              v-html="dialog.content"
            ></div>
            <!-- 按钮组 -->
            <div class="flex gap-3 px-2">
              <button
                v-if="dialog.type === 'confirm'"
                @click="handleCancel"
                class="flex-1 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all active:scale-95"
              >
                取消
              </button>
              <button
                @click="handleConfirm"
                class="flex-1 py-3.5 rounded-2xl text-white font-black text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 active:translate-y-0"
                :class="[
                  dialog.type === 'confirm'
                    ? 'bg-[#f9b11d] shadow-yellow-200 dark:shadow-none hover:shadow-yellow-200'
                    : 'bg-[#45a6d5] shadow-blue-200 dark:shadow-none hover:shadow-blue-200',
                ]"
              >
                {{ dialog.confirmText || "确定" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 全局 Loading -->
    <Transition name="fade">
      <div
        v-if="loading.visible"
        class="fixed inset-0 z-[9999] bg-white/90 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center transition-opacity"
      >
        <div class="flex flex-col items-center gap-6 animate-float">
          <div class="relative w-24 h-24">
            <!-- 外圈光晕 -->
            <div
              class="absolute inset-0 bg-[#45a6d5] rounded-full opacity-10 blur-xl animate-pulse"
            ></div>
            <!-- 旋转圆环 -->
            <div
              class="absolute inset-0 border-[6px] border-slate-100 dark:border-slate-800 rounded-full"
            ></div>
            <div
              class="absolute inset-0 border-[6px] border-[#45a6d5] rounded-full border-t-transparent animate-spin"
              style="animation-duration: 1s"
            ></div>
            <!-- 中心Logo -->
            <img
              src="/xiaoniao.png"
              class="absolute inset-0 m-auto w-12 h-12 object-contain"
            />
          </div>
          <div class="flex flex-col items-center gap-1">
            <span
              class="font-black text-slate-800 dark:text-slate-100 text-lg tracking-wide"
              >{{ loading.text || "加载中" }}</span
            >
            <span
              class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
              >Loading...</span
            >
          </div>
        </div>
      </div>
    </Transition>
    <!-- 全局 Toast 容器 -->
    <div
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-3 pointer-events-none w-full max-w-sm px-4"
    >
      <TransitionGroup name="toast-slide">
        <div
          v-for="item in toasts"
          :key="item.id"
          class="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border transition-all"
          :class="getToastStyles(item.type)"
        >
          <!-- 纯 SVG 图标替换 Emoji -->
          <div class="shrink-0 flex items-center justify-center w-5 h-5">
            <!-- 成功图标 -->
            <svg
              v-if="item.type === 'success'"
              class="w-full h-full text-emerald-400 dark:text-emerald-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <!-- 错误图标 -->
            <svg
              v-else-if="item.type === 'error'"
              class="w-full h-full text-rose-400 dark:text-rose-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <!-- 警告图标 -->
            <svg
              v-else-if="item.type === 'warning'"
              class="w-full h-full text-amber-400 dark:text-amber-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <!-- 默认/Info 图标 -->
            <svg
              v-else
              class="w-full h-full text-[#45a6d5] dark:text-[#45a6d5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div class="text-sm font-bold tracking-wide break-words flex-1">
            {{ item.content }}
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { $feedbackState } = useNuxtApp();

// 直接使用插件中定义的响应式状态
const dialog = $feedbackState.dialog;
const loading = $feedbackState.loading;
const toasts = $feedbackState.toasts;
// 样式分发
const getToastStyles = (type) => {
  switch (type) {
    case "success":
      return "bg-emerald-500/90 dark:bg-emerald-900/90 text-white dark:text-emerald-100 border-emerald-400/30 dark:border-emerald-700/50";
    case "error":
      return "bg-rose-500/90 dark:bg-rose-900/90 text-white dark:text-rose-100 border-rose-400/30 dark:border-rose-700/50";
    case "warning":
      return "bg-amber-500/90 dark:bg-amber-900/90 text-white dark:text-amber-100 border-amber-400/30 dark:border-amber-700/50";
    default:
      return "bg-slate-900/90 dark:bg-slate-800/90 text-white dark:text-slate-100 border-slate-700/50 dark:border-slate-700";
  }
};

const handleConfirm = () => {
  dialog.visible = false;
  if (dialog.resolve) dialog.resolve(true);
};

const handleCancel = () => {
  dialog.visible = false;
  if (dialog.resolve) dialog.resolve(false); // Confirm 返回 false
};

const handleMaskClick = () => {
  if (dialog.type === "alert") {
    handleConfirm();
  }
};
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
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
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 浮动动画 */
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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
