import App from './App'
import uviewPlus from 'uview-plus'
import { getImg } from '@/utils/http.js'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
// 将 getImg 挂载到 Vue 原型上，全局可用
Vue.prototype.$getImg = getImg
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import i18n from './i18n/index.js'
import { checkClipboardInvite } from '@/utils/clipboardInvite.js'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus);
  app.use(i18n)
  // 将 getImg 挂载到全局属性上，全局可用
  app.config.globalProperties.$getImg = getImg
  // 任意页面显示时都检查剪贴板（全局）
  app.mixin({
    onShow() {
      checkClipboardInvite()
    }
  })
  return {
    app
  }
}
// #endif