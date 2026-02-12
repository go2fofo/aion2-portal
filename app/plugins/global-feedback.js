import { defineNuxtPlugin } from '#app'
import { reactive } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  // 全局响应式状态
  const feedbackState = reactive({
    dialog: {
      visible: false,
      type: 'alert',
      title: '',
      content: '',
      confirmText: '',
      resolve: null,
      reject: null
    },
    loading: {
      visible: false,
      text: ''
    }
  })

  const openDialog = (type, title, content, confirmText = '确定') => {
    return new Promise((resolve, reject) => {
      feedbackState.dialog.type = type
      feedbackState.dialog.title = title
      feedbackState.dialog.content = content
      feedbackState.dialog.confirmText = confirmText
      feedbackState.dialog.resolve = resolve
      feedbackState.dialog.reject = reject
      feedbackState.dialog.visible = true
    })
  }

  // 注入全局方法
  return {
    provide: {
      alert: (title, content) => openDialog('alert', title, content),
      confirm: (title, content) => openDialog('confirm', title, content),
      loading: {
        show: (text = '加载中') => {
          feedbackState.loading.text = text
          feedbackState.loading.visible = true
        },
        hide: () => {
          feedbackState.loading.visible = false
        }
      },
      // 暴露状态给组件使用
      feedbackState
    }
  }
})