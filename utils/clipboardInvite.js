import { aesDecrypt } from '@/utils/crypto.js'

const normalizeLoose = (v) => {
  const s = (v == null ? '' : String(v)).trim()
  if (!s) return ''
  const lower = s.toLowerCase()
  if (lower === 'undefined' || lower === 'null' || lower === 'nul') return ''
  return s
}

const DISABLE_UNTIL_KEY = 'clipboard_paste_denied_until'
let lastCheckAt = 0

const getDisabledUntil = () => {
  const v = Number(uni.getStorageSync(DISABLE_UNTIL_KEY) || 0)
  return Number.isFinite(v) ? v : 0
}

const setDisabledForMs = (ms) => {
  const until = Date.now() + ms
  uni.setStorageSync(DISABLE_UNTIL_KEY, until)
  return until
}

const isPasteDeniedError = (err) => {
  const msg = (err && (err.errMsg || err.message)) ? String(err.errMsg || err.message) : String(err || '')
  const m = msg.toLowerCase()
  // 不同端的报错不一致，这里做宽松匹配
  return (
    m.includes('deny') ||
    m.includes('denied') ||
    m.includes('not allow') ||
    m.includes('not authorized') ||
    m.includes('auth') ||
    m.includes('permission')
  )
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
    // 节流：避免 App onShow + 全局页面 onShow 同时触发
    const now = Date.now()
    if (now - lastCheckAt < 1200) return resolve({ hit: false, action: 'throttle' })
    lastCheckAt = now

    // 在 loveCourt 页/登录页不读取剪贴板，避免反复弹“允许粘贴”系统提示
    const currentRoute = getCurrentRoute()
    if (currentRoute === 'pagesA/loveCourt/index' || currentRoute === 'pages/login/login') {
      return resolve({ hit: false, action: 'skip_current_page' })
    }

    // 用户点了“不允许粘贴”后，短时间内不再触发读取，避免反复弹窗
    const disabledUntil = getDisabledUntil()
    if (disabledUntil && now < disabledUntil) {
      return resolve({ hit: false, action: 'cooldown' })
    }

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
      fail: (err) => {
        // iOS 点“不允许粘贴”通常会走 fail，这里进入冷却，避免每次页面显示都弹窗
        if (isPasteDeniedError(err)) {
          setDisabledForMs(10 * 60 * 1000) // 10分钟
          return resolve({ hit: false, action: 'paste_denied' })
        }
        return resolve({ hit: false, action: 'fail' })
      }
    })
  })

