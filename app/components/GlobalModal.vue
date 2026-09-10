<!-- components/GlobalModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
        @click.self="handleMaskClick"
      >
        <Transition name="modal-scale">
          <div
            v-if="visible"
            :class="[
              'bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden flex flex-col',
              widthClass ? widthClass : 'w-full max-w-md',
              heightClass ? heightClass : 'h-auto max-h-[85vh]'
            ]"
          >
            <!-- 极简通透头部 -->
            <div class="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
              <div class="flex items-center gap-3">
                <slot name="icon">
                  <div class="w-8 h-8 rounded-2xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-500">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </slot>
                <h3 class="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
                  {{ title }}
                </h3>
              </div>
              <button
                @click="close"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-all active:scale-95"
              >
                ✕
              </button>
            </div>

            <!-- 内容区：自适应滚动，行高舒适 -->
            <div class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 overflow-y-auto">
              <slot>
                <p>{{ content }}</p>
              </slot>
            </div>

            <!-- 附加交互区：例如“不再提示” -->
            <div v-if="showDontShowAgain && storageKey" class="px-6 pb-2 shrink-0">
              <label class="inline-flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="dontShow"
                  class="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800"
                />
                今日不再自动弹出提示
              </label>
            </div>

            <!-- 底部操作栏 -->
            <div v-if="showFooter" class="flex items-center justify-end gap-3 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/60 shrink-0">
              <slot name="footer">
                <button
                  @click="close"
                  class="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  取消
                </button>
                <button
                  @click="handleConfirm"
                  class="px-6 py-2.5 rounded-2xl bg-sky-500 text-white font-black text-xs hover:bg-sky-600 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
                >
                  确定
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined,
  },
  title: {
    type: String,
    default: "系统提示",
  },
  content: {
    type: String,
    default: "",
  },
  closeOnClickMask: {
    type: Boolean,
    default: true,
  },
  storageKey: {
    type: String,
    default: "",
  },
  showDontShowAgain: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  // 不传则默认 w-full max-w-md 撑开，传了则使用传入的值
  widthClass: {
    type: String,
    default: "",
  },
  // 不传则默认根据内容自适应高度（带 max-h 避免超长溢出），传了则使用传入的值
  heightClass: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["update:modelValue", "confirm"])

const internalVisible = ref(true)
const dontShow = ref(false)

const visible = computed({
  get: () => {
    if (props.storageKey && typeof window !== 'undefined') {
      const isHidden = localStorage.getItem(props.storageKey) === 'true'
      if (isHidden) return false
    }
    return props.modelValue !== undefined ? props.modelValue : internalVisible.value
  },
  set: (val) => {
    internalVisible.value = val
    emit("update:modelValue", val)
  },
})

const close = () => {
  if (props.storageKey && dontShow.value && typeof window !== 'undefined') {
    localStorage.setItem(props.storageKey, 'true')
  }
  visible.value = false
}

const handleMaskClick = () => {
  if (props.closeOnClickMask) {
    close()
  }
}

const handleConfirm = () => {
  emit("confirm")
  close()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(8px);
}
</style>