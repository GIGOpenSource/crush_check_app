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
    // 发送页面停留时长事件
    trackPageStay(stayDuration) {
      // 埋点功能已移除
    }
  }
}
