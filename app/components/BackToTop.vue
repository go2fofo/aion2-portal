<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showBtn = ref(false)
let scrollEl = null

const handleScroll = (e) => {
  // 当容器内部向下滚动超过 150 像素时显示按钮
  if (e.target.scrollTop > 150) {
    showBtn.value = true
  } else {
    showBtn.value = false
  }
}

const scrollToTop = () => {
  if (scrollEl) {
    scrollEl.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  // 获取你指定的带有滚动行为的容器
  scrollEl = document.querySelector('.my-scroll-container')
  if (scrollEl) {
    scrollEl.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-10 opacity-0 scale-75"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-10 opacity-0 scale-75"
  >
    <button
      v-show="showBtn"
      @click="scrollToTop"
      class="fixed right-6 bottom-24 md:bottom-12 z-40 p-3.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-[#45a6d5] dark:text-sky-400 shadow-lg border border-sky-100 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-90 transition-all duration-300 flex items-center justify-center group"
      title="回到顶部"
    >
      <!-- 向上箭头 SVG -->
      <svg
        class="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>