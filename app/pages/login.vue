<template>
  <div class="min-h-screen flex items-center justify-center bg-[#C7F3FE] p-4 relative overflow-hidden">
    <!-- 背景云朵装饰 -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="n in 3" :key="n" 
        class="absolute bg-white/40 blur-2xl rounded-full animate-pulse"
        :style="{
          width: 200 + 'px',
          height: 100 + 'px',
          top: (20 + n * 20) + '%',
          left: (n % 2 === 0 ? '10%' : '60%'),
          animationDuration: (3 + n) + 's'
        }"
      ></div>
    </div>

    <div class="w-full max-w-md bg-white/80 backdrop-blur-md rounded-[2rem] shadow-xl p-8 relative z-10 border-4 border-white">
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md border-2 border-[#AEE2F9]">
          <img src="/bbbswz.png" class="w-16 h-16 object-contain" />
        </div>
        <h1 class="text-2xl font-black text-[#45a6d5] tracking-widest">登录军团</h1>
        <p class="text-sky-600/60 text-sm font-bold mt-1">加入艾昂大陆的冒险之旅</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sky-800 font-black text-sm mb-2 ml-2">邮箱</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="your@email.com"
            class="w-full px-6 py-4 rounded-full bg-white border-2 border-[#E6F7FF] focus:border-[#45a6d5] outline-none text-sky-900 font-bold transition-colors placeholder:text-sky-200"
            required
          />
        </div>

        <div v-if="!isMagicLink">
          <label class="block text-sky-800 font-black text-sm mb-2 ml-2">密码</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            minlength="6"
            class="w-full px-6 py-4 rounded-full bg-white border-2 border-[#E6F7FF] focus:border-[#45a6d5] outline-none text-sky-900 font-bold transition-colors placeholder:text-sky-200"
            required
          />
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-[#f9b11d] hover:bg-[#fbc02d] text-white py-4 rounded-full font-black text-lg shadow-[0_4px_0_0_#d98a00] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '加载中...' : (isSignUp ? '注册账号' : '立即登录') }}
          </button>
        </div>

        <div class="flex justify-between items-center text-xs font-bold px-2 mt-4">
          <button type="button" @click="isSignUp = !isSignUp" class="text-sky-400 hover:text-sky-600 transition-colors">
            {{ isSignUp ? '已有账号？去登录' : '没有账号？去注册' }}
          </button>
          <button type="button" @click="isMagicLink = !isMagicLink" class="text-sky-400 hover:text-sky-600 transition-colors">
            {{ isMagicLink ? '使用密码登录' : '使用邮箱链接登录' }}
          </button>
        </div>
      </form>

      <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 text-red-500 rounded-xl text-center text-sm font-bold border-2 border-red-100">
        {{ errorMsg }}
      </div>
      
      <div v-if="successMsg" class="mt-4 p-3 bg-green-50 text-green-500 rounded-xl text-center text-sm font-bold border-2 border-green-100">
        {{ successMsg }}
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sky-500 font-bold hover:text-sky-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          返回首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const isSignUp = ref(false)
const isMagicLink = ref(false)

// 如果已登录，跳转首页
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  
  try {
    if (!isMagicLink.value && password.value.length < 6) {
      throw new Error('密码长度至少需要 6 位')
    }

    if (isSignUp.value) {
      // 注册
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      successMsg.value = '注册确认邮件已发送，请查收！'
    } else {
      // 登录
      if (isMagicLink.value) {
        // 魔法链接登录
        const { error } = await supabase.auth.signInWithOtp({ email: email.value })
        if (error) throw error
        successMsg.value = '登录链接已发送到您的邮箱！'
      } else {
        // 密码登录
        const { error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        })
        if (error) throw error
        // 成功会自动跳转
      }
    }
  } catch (error) {
    errorMsg.value = error.message || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
