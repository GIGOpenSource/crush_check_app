import { onShow, onHide } from '@dcloudio/uni-app'
// import uma from '@/uma.js'

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

  // 格式化时间为 yyyy-MM-dd HH:mm:ss
  const formatDateTime = (date = new Date()) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // 获取用户ID
  const getUserId = () => {
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
  }

  // 获取应用版本
  const getAppVersion = () => {
    let appVersion = '1.0.0'
    // #ifdef MP-WEIXIN
    const accountInfo = uni.getAccountInfoSync()
    appVersion = accountInfo?.miniProgram?.version || '1.0.0'
    // #endif
    return appVersion
  }

  // 发送页面停留时长事件
  const trackPageStay = (stayDuration) => {
    // if (!uma || !uma.trackEvent) {
    //   console.warn('友盟统计未初始化')
    //   return
    // }

    // try {
    //   const params = {
    //     userId: getUserId(),
    //     appVersion: getAppVersion(),
    //     eventTime: formatDateTime(),
    //     pageName: pageName,
    //     stayDuration: stayDuration // 停留时长（秒）
    //   }

    //   uma.trackEvent('page_stay', params)
    //   console.log('页面停留时长统计已发送:', {
    //     pageName: pageName,
    //     stayDuration: stayDuration,
    //     params: params
    //   })
    // } catch (error) {
    //   console.error('页面停留时长统计发送失败:', error)
    // }
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
