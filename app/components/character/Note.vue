<script setup>
const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
    <h3 class="font-black text-sky-900 text-xl mb-6 flex items-center gap-3">
      <span class="bg-slate-100 p-2 rounded-2xl">📝</span> 档案备注
    </h3>
    <div class="bg-[#F0F9FF] p-8 rounded-[2rem] text-sky-800 font-bold text-lg leading-relaxed border-2 border-white shadow-inner">
      {{ member.note || '暂无详细备注信息。这只宝宝似乎很低调，还没有填写个性签名。' }}
    </div>
  </div>
</template>
