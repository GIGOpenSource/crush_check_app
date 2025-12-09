import { onShow, onHide } from '@dcloudio/uni-app'

/**
 * 页面停留时长统计组合式函数
 * @param {string} pageName - 页面名称，用于埋点标识
 * @param {object} options - 可选配置
 * @param {function} options.onShowCallback - onShow时的回调函数
 * @param {function} options.onHideCallback - onHide时的回调函数
 */
export function usePageStay(pageName, options = {}) {
  let startTime = null
  let pageStayTimer = null

  // 发送页面停留时长事件
  const trackPageStay = (stayDuration) => {
    // 埋点功能已移除
  }

  // 页面显示时记录开始时间
  onShow(() => {
    startTime = Date.now()
    
    // 清除之前的定时器（防止重复触发）
    if (pageStayTimer) {
      clearTimeout(pageStayTimer)
      pageStayTimer = null
    }

    // 执行自定义回调
    if (options.onShowCallback && typeof options.onShowCallback === 'function') {
      options.onShowCallback()
    }
  })

  // 页面隐藏时计算停留时长并发送统计
  onHide(() => {
    if (startTime) {
      const endTime = Date.now()
      const stayDuration = Math.floor((endTime - startTime) / 1000) // 转换为秒
      
      // 只统计停留时长大于0的情况
      if (stayDuration > 0) {
        trackPageStay(stayDuration)
      }
      
      startTime = null
    }

    // 执行自定义回调
    if (options.onHideCallback && typeof options.onHideCallback === 'function') {
      options.onHideCallback()
    }
  })

  // 返回清理函数，用于手动清理（可选）
  return {
    clear: () => {
      if (pageStayTimer) {
        clearTimeout(pageStayTimer)
        pageStayTimer = null
      }
      startTime = null
    }
  }
}
