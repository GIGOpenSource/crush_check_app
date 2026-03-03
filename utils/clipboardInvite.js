import { aesDecrypt } from '@/utils/crypto.js'

const normalizeLoose = (v) => {
  const s = (v == null ? '' : String(v)).trim()
  if (!s) return ''
  const lower = s.toLowerCase()
  if (lower === 'undefined' || lower === 'null' || lower === 'nul') return ''
  return s
}

const getCurrentRoute = () => {
  try {
    const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
    const current = pages && pages.length ? pages[pages.length - 1] : null
    return current?.route || ''
  } catch (e) {
    return ''
  }
}

/**
 * 全局检查剪贴板是否包含 loveCourt 邀请参数。
 * - 在任意页面 onShow / App onShow 都可调用
 * - 去重 key：last_loveCourt_invite_query（避免同一前台周期内多次跳转）
 * - 建议在 App onHide 清掉该 key，让“切到别的 App 再回来”也会再次触发
 */
export const checkClipboardInvite = () =>
  new Promise((resolve) => {
    uni.getClipboardData({
      success: (res) => {
        let inview = ''
        try {
          inview = aesDecrypt(res.data || '')
        } catch (e) {
          inview = ''
        }

        const query = inview
        // 不对 inview 做任何处理：仅判断是否是邀请参数
        if (!query || !String(query).includes('invitation_code=')) return resolve({ hit: false })

        const currentRoute = getCurrentRoute()
        if (currentRoute === 'pagesA/loveCourt/index') return resolve({ hit: true, action: 'already_on_page' })

        const last = uni.getStorageSync('last_loveCourt_invite_query') || ''
        if (last && last === query) return resolve({ hit: true, action: 'dedup' })
        uni.setStorageSync('last_loveCourt_invite_query', query)

        if (!uni.getStorageSync('token')) {
          uni.setStorageSync('loveCourt_invite_query', query)
          if (currentRoute !== 'pages/login/login') {
            uni.navigateTo({ url: '/pages/login/login' })
          }
          return resolve({ hit: true, action: 'to_login' })
        }

        uni.redirectTo({
          url: `/pagesA/loveCourt/index${query}`
        })
        return resolve({ hit: true, action: 'to_loveCourt' })
      },
      fail: () => resolve({ hit: false, action: 'fail' })
    })
  })

