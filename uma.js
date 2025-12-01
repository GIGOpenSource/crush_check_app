// #ifdef MP-WEIXIN
import uma from 'umtrack-wx';
uma.init({
  appKey: 'xxxxxx',
  useOpenid: false,
  autoGetOpenid: false,
  debug: true
});
// #endif
// #ifdef MP-ALIPAY
import uma from 'umtrack-alipay';
uma.init({
  appKey: 'xxxxx',
  debug: true
});
// #endif

// #ifdef MP-TOUTIAO
// 抖音小程序使用 npm 包 umtrack-tt
import uma from 'umtrack-tt';
uma.init({
	appKey:'692518ce9a7f376488e65e35',
	autoGetOpenid:true, // 是否需要通过友盟后台获取openid或匿名openid，如若需要，请到友盟后台设置appId及secret,若设置了false,tt比较特殊，需要手动调用setAnonymousid设置这个参数
	debug: true, //是否打开调试模式
	uploadUserInfo: false // 自动上传用户信息，设为false取消上传，默认为false
});
// #endif

// #ifdef MP-BAIDU
import uma from './libs/umtrack-swan/swan/lib/uma.min.js'
uma.init({
	appKey: 'YOUR_UMENG_APPKEY', //由友盟分配的APP_KEY
	// 是否需要通过友盟后台获取openid或匿名openid，如若需要，请到友盟后台设置appId及secret
	autoGetOpenid: false,
	debug: true, //是否打开调试模式
	uploadUserInfo: false // 自动上传用户信息，设为false取消上传，默认为false
})
// #endif
// #ifdef MP-QQ
import uma from './libs/umtrack-qq/qq/lib/uma.min.js';
uma.init({
  appKey: 'xxxxxx',
  useOpenid: false,
  autoGetOpenid: false,
  debug: true
});
// #endif
// #ifdef H5
const uma = {
	init:()=>{},
	_inited:false,
	trackEvent:()=>{},
	setOpenid:()=>{},
	setUserid:()=>{},
	setUnionid:()=>{},
	pause:()=>{},
	resume:()=>{}
}
// #endif
// 适配vue插件如此可通过Vue.use(uma)来安装
uma.install = function (app) {
	// Vue 3: app.config.globalProperties
	if (app && app.config && app.config.globalProperties) {
		app.config.globalProperties.$uma = uma;
	}
	// Vue 2: Vue.prototype
	else if (app && app.prototype) {
		app.prototype.$uma = uma;
	}
}
export default uma;
