<script setup>
import {
	onLaunch,
	onShow,
	onHide
} from '@dcloudio/uni-app'
import uma from '@/uma.js'
import { ref } from 'vue'
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

const params = ref({
	userId: uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')).id : '',
	appVersion: uni.getAccountInfoSync()?.miniProgram?.version || "1.0.0",
	eventTime: formatDateTime(),
	pageName: '检测'
})
onShow(() => {
	app_show()
})
onHide(() => {
	app_hide()
})
onLaunch(() => {
	app_launch()
	setTimeout(() => {
		setTabBarI18n()
	}, 100)
})
const app_hide = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('app_hide', params.value)
	}
}

const app_launch = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('app_launch', params.value)
	}
}

const app_show = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('app_show', params.value)
	}
	setTimeout(() => {
		setTabBarI18n()
	}, 100)
}

const setTabBarI18n = () => {
	const currentLocale = uni.getStorageSync('currentLanguage') || 'zh'
		let tabBarTexts = { index: '检测', my: '我的' }
		if (currentLocale === 'en') {
			tabBarTexts = { index: 'Check', my: 'My' }
		} else if (currentLocale === 'es') {
			tabBarTexts = { index: 'Verificar', my: 'Mi' }
		} else if (currentLocale === 'pt') {
			tabBarTexts = { index: 'Verificar', my: 'Meu' }
		} else if (currentLocale === 'ja') {
			tabBarTexts = { index: 'チェック', my: 'マイ' }
		} else if (currentLocale === 'ko') {
			tabBarTexts = { index: '확인', my: '내' }
		}
		uni.setTabBarItem({
			index: 0,
			text: tabBarTexts.index
		})
		uni.setTabBarItem({
			index: 1,
			text: tabBarTexts.my
		})
}

</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-plus/index.scss";

page {
	background: #12111F !important;
	color: #FFF;
}
</style>
