/*
 * @Author: fofo
 * @Date: 2026-02-12 15:25:06
 * @LastEditTime: 2026-09-03 14:24:27
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/plugins/global-feedback.js
 */
import { defineNuxtPlugin } from '#app'
import { reactive } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
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
    },
    toasts: []
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
  const showToast = (content, options = {}) => {
    const {
      type = 'info', // 'success' | 'error' | 'warning' | 'info'
      duration = 3000 // 自动消失时间 (ms)
    } = typeof options === 'string' ? { type: options } : options

    const id = Date.now() + Math.random()

    const toastItem = {
      id,
      content,
      type,
      duration
    }

    feedbackState.toasts.push(toastItem)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = feedbackState.toasts.findIndex(t => t.id === id)
    if (index !== -1) {
      feedbackState.toasts.splice(index, 1)
    }
  }

  // 注入全局方法
  return {
    provide: {
      alert: (title, content) => openDialog('alert', title, content),
      confirm: (title, content) => openDialog('confirm', title, content),

      /*
      const { $toast } = useNuxtApp()

      1. 基础用法
      $toast('操作成功')

      2. 带状态类型的用法
      $toast('保存配置成功！', 'success')
      $toast('网络连接失败，请检查', 'error')
      $toast('密码强度过低', 'warning')

      3. 自定义消失时间（毫秒，设为 0 则不会自动消失）
      $toast('正在同步云端数据...', { type: 'info', duration: 5000 })
      */
      toast: showToast,
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
      feedbackState,
      version: config.public.appVersion
    }
  }
})


