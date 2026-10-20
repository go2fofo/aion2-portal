/*
- @Author: fofo
- @Date: 2026-02-12 15:25:06
 * @LastEditTime: 2026-10-20 11:31:36
 * @LastEditors: fofo
- @Description: 
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
    toasts: [],
    
    // 专门用于右上角持久通知的状态列表
    notifications: []
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
      type = 'info', 
      duration = 3000 
    } = typeof options === 'string' ? { type: options } : options

    const id = Date.now() + Math.random()
    feedbackState.toasts.push({ id, content, type, duration })

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  const removeToast = (id) => {
    const index = feedbackState.toasts.findIndex(t => t.id === id)
    if (index !== -1) feedbackState.toasts.splice(index, 1)
  }

  // 触发右上角持久通知的方法
  const showNotification = (options = {}) => {
    const {
      title = '系统通知',
      message = '',
      type = 'info', // 'success' | 'error' | 'warning' | 'info'
      duration = 0   // 默认 0：代表不自动消失，必须用户手动点关闭！若传 4000 则 4秒后自动消失
    } = options

    const id = Date.now() + Math.random()
    const notificationItem = { id, title, message, type, duration }

    feedbackState.notifications.push(notificationItem)

    if (duration > 0) {
      setTimeout(() => removeNotificationItem(id), duration)
    }

    return id
  }

  // 移除指定持久通知的方法
  const removeNotificationItem = (id) => {
    const index = feedbackState.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      feedbackState.notifications.splice(index, 1)
    }
  }

  // 注入全局方法
  return {
    provide: {
      alert: (title, content) => openDialog('alert', title, content),
      confirm: (title, content) => openDialog('confirm', title, content),
      toast: showToast,
      
      // 把拓展的通知方法挂载到 $notify 和 $removeNotify
      notify: showNotification,
      removeNotify: removeNotificationItem,

      loading: {
        show: (text = '加载中') => {
          feedbackState.loading.text = text
          feedbackState.loading.visible = true
        },
        hide: () => {
          feedbackState.loading.visible = false
        }
      },
      feedbackState,
      version: config.public.appVersion
    }
  }
})