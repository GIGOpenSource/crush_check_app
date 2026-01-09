<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	import {
		t,
		setLocale
	} from '@/i18n/index.js'
	import {
		getSystemContent
	} from "@/api/login.js";
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

	// 获取应用版本
	const getAppVersion = () => {
		let appVersion = '1.0.0'
		return appVersion
	}

	const params = ref({
		userId: uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')).id : '',
		appVersion: getAppVersion(),
		eventTime: formatDateTime(),
		pageName: '首页'
	})
	onShow(() => {
		getSystemContent().then(res => {
			uni.setStorageSync('version', res.data[0].version)
		})
		app_show()
	})
	onHide(() => {
		app_hide()
	})
	onLaunch(() => {
		app_launch()
		// 延迟设置 tabBar，确保国际化已加载
		setTimeout(() => {
			setTabBarI18n()
		}, 300)
	})
	const app_hide = () => {
		params.value.eventTime = formatDateTime()
	}

	const app_launch = () => {
		params.value.eventTime = formatDateTime()
	}

	const app_show = () => {
		params.value.eventTime = formatDateTime()
		let savedLanguage = uni.getStorageSync('currentLanguage');
		let systemInfo = uni.getSystemInfoSync().language
		if (!savedLanguage) {
			if (systemInfo.includes('zh')) {
				savedLanguage = 'zh'
			} else if (systemInfo.includes('en')) {
				savedLanguage = 'en'
			} else if (systemInfo.includes('es')) {
				savedLanguage = 'es'
			} else if (systemInfo.includes('pt')) {
				savedLanguage = 'pt'
			} else if (systemInfo.includes('ja')) {
				savedLanguage = 'ja'
			} else if (systemInfo.includes('ko')) {
				savedLanguage = 'ko'
			} else {
				savedLanguage = 'en'
			}
		} 
		console.log(systemInfo.includes('zh'),'1111')
		console.log(savedLanguage,'savedLanguage')
		setLocale(savedLanguage);
		
		
		// 延迟设置 tabBar，确保国际化已加载
		setTimeout(() => {
			setTabBarI18n()
		}, 300)
	}

	const setTabBarI18n = () => {
		try {
			// index 0: 首页
			const indexText = t('tabBar.index')
			uni.setTabBarItem({
				index: 0,
				text: indexText && indexText !== 'tabBar.index' ? indexText : '首页'
			})
			// index 1: 测试记录
			const testText = t('tabBar.test')
			uni.setTabBarItem({
				index: 1,
				text: testText && testText !== 'tabBar.test' ? testText : '测试记录'
			})
			// index 2: 我的
			const myText = t('tabBar.my')
			uni.setTabBarItem({
				index: 2,
				text: myText && myText !== 'tabBar.my' ? myText : '我的'
			})
		} catch (error) {
			console.error('更新 tabBar 国际化失败:', error)
			// 如果国际化失败，使用默认值
			try {
				uni.setTabBarItem({
					index: 0,
					text: '首页'
				})
				uni.setTabBarItem({
					index: 1,
					text: '测试记录'
				})
				uni.setTabBarItem({
					index: 2,
					text: '我的'
				})
			} catch (e) {
				console.error('设置 tabBar 默认值失败:', e)
			}
		}
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