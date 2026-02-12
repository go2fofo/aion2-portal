<script setup>
import { ref, onMounted } from 'vue'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { $alert, $confirm, $loading } = useNuxtApp()

const form = ref({ title: '', content: '', type: 'news' })
const posts = ref([])
const loading = ref(false)
const submitting = ref(false)

const tabs = [
  { value: 'news', label: '军团伴说' },
  { value: 'fresh', label: '军团鲜哒' },
  { value: 'analysis', label: '战力解析' },
  { value: 'rank', label: '战力排行' }
]

// 获取文章列表
const fetchPosts = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (data) {
    posts.value = data
  }
  loading.value = false
}

// 发布文章
const publishPost = async () => {
  if (!form.value.title || !form.value.content) {
    $alert('校验失败', '标题和内容不能为空')
    return
  }

  submitting.value = true
  $loading.show('正在发布动态...')
  
  try {
    const { error } = await supabase
      .from('posts')
      .insert({
        title: form.value.title,
        content: form.value.content,
        type: form.value.type,
        user_id: user.value.id
      })

    if (error) {
      $alert('发布失败', error.message)
    } else {
      $alert('发布成功', '新动态已推送到首页')
      form.value = { title: '', content: '', type: 'news' }
      fetchPosts()
    }
  } finally {
    submitting.value = false
    $loading.hide()
  }
}

// 删除文章
const deletePost = async (id) => {
  const confirmed = await $confirm('删除动态', '确定删除这条动态吗？')
  if (!confirmed) return

  $loading.show('正在删除...')
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  
  $loading.hide()

  if (error) {
    $alert('删除失败', error.message)
  } else {
    $alert('已删除', '动态已被移除')
    fetchPosts()
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 内容发布表单 -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 class="font-black text-slate-800 mb-4">发布新动态</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-slate-500 mb-1">标题</label>
          <input v-model="form.title" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#45a6d5] outline-none transition-colors" placeholder="输入公告标题..." />
        </div>
        <!-- Tab 类型选择 -->
        <div>
          <label class="block text-sm font-bold text-slate-500 mb-1">所属板块</label>
          <select v-model="form.type" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#45a6d5] outline-none transition-colors appearance-none text-slate-700 font-bold">
            <option v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-500 mb-1">内容</label>
          <textarea v-model="form.content" rows="4" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#45a6d5] outline-none transition-colors" placeholder="输入正文内容..."></textarea>
        </div>
        <div class="flex justify-end">
          <button @click="publishPost" :disabled="submitting" class="px-6 py-2 bg-[#45a6d5] text-white rounded-lg font-bold hover:bg-[#3b95c0] transition-colors disabled:opacity-50">
            {{ submitting ? '发布中...' : '立即发布' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 已发布列表 -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h3 class="font-black text-slate-800">已发布内容</h3>
      </div>
      <div v-if="loading" class="p-8 text-center text-slate-400">加载中...</div>
      <div v-else-if="posts.length === 0" class="p-8 text-center text-slate-400">暂无内容</div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="post in posts" :key="post.id" class="p-4 hover:bg-slate-50 flex justify-between items-center group transition-colors">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-xs font-bold" :class="post.type === 'news' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'">
                {{ tabs.find(t => t.value === post.type)?.label || post.type }}
              </span>
              <span class="font-bold text-slate-700">{{ post.title }}</span>
            </div>
            <div class="text-xs text-slate-400 mt-1">{{ new Date(post.created_at).toLocaleString() }}</div>
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="deletePost(post.id)" class="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>