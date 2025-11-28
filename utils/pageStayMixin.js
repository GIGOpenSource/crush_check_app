import uma from '@/uma.js'

/**
 * 页面停留时长统计 Mixin（用于 Options API）
 */
export const pageStayMixin = {
  data() {
    return {
      pageStayStartTime: null
    }
  },
  onShow() {
    this.pageStayStartTime = Date.now()
  },
  onHide() {
    if (this.pageStayStartTime) {
      const endTime = Date.now()
      const stayDuration = Math.floor((endTime - this.pageStayStartTime) / 1000) // 转换为秒
      
      // 只统计停留时长大于0的情况
      if (stayDuration > 0) {
        this.trackPageStay(stayDuration)
      }
      
      this.pageStayStartTime = null
    }
  },
  methods: {
    // 格式化时间为 yyyy-MM-dd HH:mm:ss
    formatDateTime(date = new Date()) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    // 获取用户ID
    getUserId() {
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          const user = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo
          return user.id || ''
        }
      } catch (e) {
        console.warn('获取用户信息失败', e)
      }
      return ''
    },
    // 获取应用版本
    getAppVersion() {
      let appVersion = '1.0.0'
      // #ifdef MP-WEIXIN
      const accountInfo = uni.getAccountInfoSync()
      appVersion = accountInfo?.miniProgram?.version || '1.0.0'
      // #endif
      return appVersion
    },
    // 发送页面停留时长事件
    trackPageStay(stayDuration) {
      if (!uma || !uma.trackEvent) {
        console.warn('友盟统计未初始化')
        return
      }

      try {
        // 获取页面名称，优先使用组件中定义的 pageName，否则使用默认值
        const pageName = this.pageName || '未知页面'

        const params = {
          userId: this.getUserId(),
          appVersion: this.getAppVersion(),
          eventTime: this.formatDateTime(),
          pageName: pageName,
          stayDuration: stayDuration // 停留时长（秒）
        }

        uma.trackEvent('page_stay', params)
        console.log('页面停留时长统计已发送:', {
          pageName: pageName,
          stayDuration: stayDuration,
          params: params
        })
      } catch (error) {
        console.error('页面停留时长统计发送失败:', error)
      }
    }
  }
}
