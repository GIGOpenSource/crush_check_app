<template>
	<view class="page">
		<!-- 海报生成组件（显示海报） -->
		<view class="poster-container" :class="{ 'no-scroll': show }">
			<image :src="images" mode="widthFix" v-if="status == 2"></image>
			<image :src="details.file_url" v-if="status == 1"></image>
			<view class="lookbtn" v-if="status == 1" @click="getDeepReport">{{ $t('proPoster.viewDeepReport') }}</view>
			<view class="bottomtitle" v-if="status == 1">{{ $t('proPoster.aiGeneratedTip') }}</view>
			<!-- 深度报告蒙层 -->
			<view class="mengceng" v-if="show">
				<!-- <view>{{ $t('proPoster.openMember') }}</view>
				<view style="margin-bottom: 30rpx;">{{ $t('proPoster.unlimitedDeepReport') }}</view> -->
				<!-- <view class="btn" @click="pay(1)">{{ mouth.price }}{{ $t('common.currencyUnit') }} {{
					$t('proPoster.openMember') }}</view> -->
				<view class="btn" @click="pay(2)">{{ once.price }}{{ $t('common.currencyUnit') }} {{
					$t('proPoster.queryReport') }}</view>
				<button class="btn" open-type="share" :open-type="userinfo.allow_count ? '' : 'share'"
					hover-class="none" @click="invitefriend">{{
						$t('proPoster.inviteFiveFree') }}</button>
				<view style="height: 60rpx;"></view>
				<view v-for="(item, index) in moretitle" :key="index" class="moretitle">
					<up-icon name="checkmark" color="#B370FF" size="22"></up-icon>
					<text>{{ item }}</text>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="bottomtitle1" v-if="status == 2">{{ $t('proPoster.aiGeneratedTip') }}</view>
		<!-- 操作 -->
		<view class="opera" v-if="status == 1">
			<view class="btn1" @click="savePoster">
				<image :src="$getImg('index/save')" mode="scaleToFill" />
				<view>{{ $t('proPoster.savePoster') }}</view>
			</view>
			<view class="btn1" @click="share">
				<image :src="$getImg('index/share')" mode="scaleToFill" />
				<view>{{ $t('proPoster.sharePoster') }}</view>
			</view>
		</view>
		<view v-if="status == 2" class="lookPoster" @click="viewPoster">
			{{ $t('proPoster.viewPoster') }}
		</view>
		<!-- 咨询查询详细方案弹窗  -->
		<IndexProup :show="detailsProup" @close="detailsProup = false" :cha="true" :height="120">
			<template #content>
				<view class="proup">
					<view class="title">{{ $t('proPoster.consultDetail') }}</view>
					<image :src="$getImg('index/icon')" mode="scaleToFill" />
					<view class="look" @click="look1">{{ $t('proPoster.goToPublic') }}</view>
				</view>
			</template>

		</IndexProup>
		<view class="kong" v-if="status == 2" @click="detailsProup = true"></view>
		<!-- 解锁本次报告 -->
		<up-popup :show="showDelPopup2" mode="center">
			<view class="del-popup-content">
				<image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
				<view class="title">{{ $t('proPoster.unlockThisReport') }}</view>
				<view class="num">{{ $t('proPoster.reportRemainingTimes') }}: {{ userinfo.allow_count }}{{
					$t('proPoster.times')
				}}</view>
				<view class="del-popup-actions">
					<view @click="lock">{{ $t('proPoster.unlockThis') }}</view>
					<!-- <view @click="pay(1)">{{ $t('proPoster.unlockMonthlyUnlimited') }}</view> -->
				</view>
				<view class="icon" @click="showDelPopup2 = false"> <up-icon name="close-circle" color="#ffffff"
						size="30"></up-icon></view>
			</view>
		</up-popup>

	</view>
</template>

<script setup>
import {
	ref,
	computed
} from 'vue'
import {
	getPosterDetails,
	getDeepPoster,
	getProducts,
	createOrder,
	freeReport
} from '@/api/index.js'
import {
	getUserInfo,
	getSystemContent,
} from '@/api/login.js'
import {
	onLoad,
	onShareAppMessage,
	onPullDownRefresh
} from '@dcloudio/uni-app'
import uma from '@/uma.js'
import IndexProup from '@/components/IndexProup/IndexProup.vue'
import { usePageStay } from '@/utils/usePageStay.js'
import { useI18n } from 'vue-i18n'
const showDelPopup2 = ref(false)
// 页面停留时长统计
usePageStay('结果页')
const userinfo = ref({ allow_count: 0 })
const { t } = useI18n()
const posterImg = ref('')
const details = ref({})
const status = ref(1)
const id = ref('')
const once = ref({})
const mouth = ref({})
const show = ref(false)
const images = ref('')
const moretitle = ref([])
const detailsProup = ref(false)
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
	userId: JSON.parse(uni.getStorageSync('userInfo')).id || '',
	appVersion: uni.getAccountInfoSync()?.miniProgram?.version || "1.0.0",
	eventTime: formatDateTime(),
	pageName: ''
})
onLoad((e) => {
	userinfo.value = JSON.parse(uni.getStorageSync('userInfo'))
	// 设置导航栏标题
	uni.setNavigationBarTitle({
		title: 'CrushCheck'
	});

	// 初始化会员权益说明（使用 i18n）
	moretitle.value = [
		t('proPoster.aiAnalysis'),
		t('proPoster.detailedReport'),
		t('proPoster.avoidRisk')
	]
	params.value.pageName = t('proPoster.viewDeepReport')

	id.value = e.id
	getPosterDetails(id.value).then(res => {
		details.value = res.data
	})
	getProducts('once').then(res => {
		once.value = res.data.results.filter(item => item.product_type == 'once')[0]
	})
	getProducts('vip').then(res => {
		mouth.value = res.data.results.filter(item => item.product_type == 'vip')[0]
	})
})
// #ifdef MP-WEIXIN
onShareAppMessage((res) => {
	click_invite()
	const inviterOpenId = uni.getStorageSync("openId") || "";
	const query = `?scene=${inviterOpenId}`
	return {
		title: t('index.shareTitle'), // 分享标题
		path: `/pages/index/index${query}`, // 分享路径携带个人ID
		imageUrl: "/static/index/yq.png", // 分享图片，不设置则使用默认截图
	};
})
// #endif

// 下拉刷新
onPullDownRefresh(() => {
	refreshUserInfo()
})

// 刷新用户信息
const refreshUserInfo = () => {
	const openId = uni.getStorageSync('openId')

	getUserInfo(openId).then(res => {
		userinfo.value = res.data
		uni.setStorageSync('userInfo', JSON.stringify(res.data))
		// 延迟一下再停止刷新，让动画更流畅
		setTimeout(() => {
			uni.hideLoading()
			uni.stopPullDownRefresh()
		}, 500)
	}).catch(err => {

		uni.stopPullDownRefresh()

	})
}

// 获得深度解析报告
const getDeepReport = () => {
	click_report()
	if (details.value.child_list[0]?.file_url) {
		images.value = details.value.child_list[0].file_url
		status.value = 2
		return
	}

	let userinfo = JSON.parse(uni.getStorageSync('userInfo'))
	if (userinfo.allow_count && !userinfo.is_vip && !details.value.child_list[0]?.file_url) {
		showDelPopup2.value = true
		return
	}
	getDeepPoster({
		posterId: details.value.id
	})
		.then(res => {
			images.value = res.data.url
			let userinfo = JSON.parse(uni.getStorageSync('userInfo'))
			status.value = 2
			show.value = true
			if (userinfo.is_vip) {
				getPosterDetails(id.value).then(res => {
					details.value = res.data
				})
			} else {
				show.value = true
			}
		})
		.catch(err => {
			images.value = err.url
			if (err.code == 400) {
				status.value = 2
				show.value = true
			}
		})

}
const savePoster = () => {
	click_save_poster()
	const imageUrl = status.value === 1 ? details.value.file_url : images.value
	uni.downloadFile({
		url: imageUrl,
		success: (res) => {
			if (res.statusCode === 200) {
				// 保存图片到相册
				uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					complete: (res) => {
					},
					success: () => {
						uni.showToast({
							title: t('proPoster.saveSuccess'),
							icon: 'none'
						})
					},
					fail: () => {

					}
				})
			}
		}
	})
}

// 查看海报
const viewPoster = () => {
	status.value = 1

	show.value = false
	click_poster()

}
const look1 = () => {
	click_focus()
	getSystemContent().then(res => {
		let qrCodeUrl = res.data[0].qr_code_url
		uni.previewImage({
			urls: [qrCodeUrl],
			current: qrCodeUrl
		});
	})
}

//支付
const pay = (type) => {
	let object = {}
	if (type == 1) {
		object = mouth.value
		click_monthpay()
	} else if (type == 2) {
		object = once.value
		click_oncepay()
	}
	createOrder({
		description: object.description,
		productId: object.id,
		openId: uni.getStorageSync('openId'),
		posterId: details.value.id
	}).then(res => {
		uni.requestPayment({
			"provider": "wxpay",
			...res.data,
			"signType": "RSA",
			"package": `${res.data.prepayid}`,
			"nonceStr": res.data.noncestr,
			success(res) {
				uni.showToast({
					title: t('proPoster.paySuccess'),
					icon: 'success'
				})
				pay_success()
				status.value = 2
				show.value = false
				showDelPopup2.value = false
				//重新调用一下用户信息接口 还得需要存本地
				if (type == 1) {
					const openId = uni.getStorageSync('openId')
					if (openId) {
						getUserInfo(openId).then(userRes => {
							if (userRes.code === 200 || userRes.code === 201) {
								if (userRes.data) {
									uni.setStorageSync('userInfo', JSON.stringify(userRes
										.data))
									console.log('用户信息更新成功', userRes.data)
								}
							}
						}).catch(err => {
							console.log('获取用户信息失败', err)
						})
					}
				}
				getPosterDetails(id.value).then(res => {
					console.log(res.data, 'rrrrr')
					details.value = res.data
				})
			},
			fail(e) {
				pay_fail()
				uni.showToast({
					title: t('proPoster.payFailed'),
					icon: 'none'
				})
			}
		})

	})
}
const share = () => {
	click_share()
	uni.downloadFile({
		url: details.value.file_url,
		success: (res) => {
			if (res.statusCode === 200) {
				const inviterOpenId = uni.getStorageSync("openId") || "";
				const query = `?scene=${inviterOpenId}`
				wx.showShareImageMenu({
					path: res.tempFilePath,
					entrancePath: `/pages/index/index${query}`,
					complete: (res) => {
						if (res.errMsg == 'showShareImageMenu:fail cancel') {
							share_fail()
						} else {
							share_success()
						}
					}
				})
			}
		}
	})

}
const invitefriend = async () => {
	if (userinfo.value.allow_count) {
		showDelPopup2.value = true
		userinfo.value = res.data
		return
	}

}
//解锁
const lock = () => {
	freeReport({ posterId: details.value.id }).then(res => {
		showDelPopup2.value = false
		show.value = false
		status.value = 2
		images.value = res.data.url
		getPosterDetails(id.value).then(resut => {
			details.value = resut.data
		})
	})

}

//点击 “分享结果” 按钮
const click_share = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('character_fail', params.value)
	}
}

//点击 分享操作成功
const share_success = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('share_success', params.value)
	}
}

//分享操作失败
const share_fail = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('share_fail', params.value)
	}
}
//点击 “保存海报” 按钮
const click_save_poster = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_save_poster', params.value)
	}
}

//点击 “保存报告” 按钮
// const  click_save_report = () => {
// 	params.value.eventTime = formatDateTime()
// 	if (uma && uma.trackEvent) {
// 		uma.trackEvent('click_save_report', params.value)
// 	}
// }

//点击 “获得海报” 按钮
const click_poster = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_poster', params.value)
	}
}

//点击 “查看报告” 按钮
const click_report = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_report', params.value)
	}
}
//点击 “公众号” 按钮
const click_focus = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_focus', params.value)
	}
}

//点击 “月付” 按钮
const click_monthpay = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {

		uma.trackEvent('click_monthpay', params.value)
	}
}

//点击 “次付” 按钮
const click_oncepay = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_oncepay', params.value)
	}
}

//购买成功
const pay_success = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('pay_success', params.value)
	}
}

//购买失败
const pay_fail = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('pay_fail', params.value)
	}
}
//点击 “邀请” 按钮
const click_invite = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_invite', params.value)
	}
}

//点击 “取消邀请” 按钮
const click_invitecancel = () => {
	params.value.eventTime = formatDateTime()
	if (uma && uma.trackEvent) {
		uma.trackEvent('click_invitecancel', params.value)
	}
}


</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	height: 100vh;
	padding: 0 40rpx;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.kong {
	width: 150rpx;
	height: 150rpx;
	position: absolute;
	top: 40rpx;
	right: 60rpx;
}

.proup {
	width: 600rpx;
	height: 370rpx;
	color: #000;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	justify-content: center;

	image {
		width: 250rpx;
		height: 100rpx;
		margin: 30rpx 0;
	}

	.look {
		background: #B370FF;
		color: #fff;
		width: 320rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border-radius: 100rpx;
	}

	.title {
		font-size: 36rpx;

	}
}

.mengceng {
	position: absolute;
	left: 0;
	top: 150rpx;
	color: #000;
	background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1));
	width: 100%;
	min-height: calc(75vh - 150rpx);
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 80rpx;
	border-radius: 0 30rpx 0 0;

	.btn {
		background: #B370FF;
		color: #fff;
		text-align: center;
		width: 550rpx;
		height: 110rpx;
		line-height: 110rpx;
		// padding-left: 50rpx;
		box-sizing: border-box;
	}

	.moretitle {
		width: 550rpx;
		display: flex;
		font-size: 24rpx;
		align-items: center;
		line-height: 60rpx;

		text {
			margin-left: 20rpx;
		}
	}
}

.lookPoster {
	width: 100%;
	border: 0.5px solid rgba(255, 255, 255, 0.17);
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 80rpx;
	text-align: center;
	margin-top: 40rpx;
}

.opera {
	width: 100%;
	justify-content: space-around;
	display: flex;
	margin-top: 40rpx;

	image {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
	}

	.btn1 {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		font-size: 24rpx;
	}
}

.lookbtn {
	background: #B370FF;
	width: 95%;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 80rpx;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 100rpx;
}

.bottomtitle1 {

	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.6);
}

.poster-container {
	width: 95%;
	border-radius: 30rpx;
	// overflow: hidden;
	height: 75vh;
	overflow-y: auto;
	margin-top: 40rpx;
	margin-bottom: 20rpx;
	position: relative;

	&.no-scroll {
		overflow: hidden;
	}

	image {
		width: 100%;
		height: 100%;
	}

	.bottomtitle {
		width: 100%;
		text-align: center;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.6);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 40rpx;
	}

}

.poster {
	background: #fff;
	width: 100%;
	min-height: 600rpx;
	overflow-y: scroll;
	border-radius: 20rpx;
	display: flex;
	align-items: flex-start;
	padding: 20rpx;
	padding-top: 20rpx;
	font-size: 26rpx;
	flex-direction: column;
	position: absolute;
	margin-bottom: 150rpx;

	.title {
		margin-bottom: 20rpx;
		padding-top: 20rpx;
		width: 100%;
		text-align: center;
	}

	.con {
		font-size: 22rpx;
		line-height: 40rpx;
		width: 100%;
		height: 100%;
	}
}

.report {
	position: absolute;
	width: 130rpx;
	height: 130rpx;
	left: -30rpx;
	top: -50rpx;
	z-index: 999;
	pointer-events: none;
}

.btn {
	width: 75%;
	margin: 0 auto;
	margin-top: 30rpx;
	text-align: center;
	height: 85rpx;
	border-radius: 80rpx;
	line-height: 85rpx;
	color: #fff;
	background-size: 100% 100%;
	font-size: 30rpx;
	position: relative;

	image {
		width: 100%;
		height: 100%;
	}

	.title {
		width: 100%;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 0;
	}
}

.share-btn {
	border: none;
	padding: 0;
	background-color: transparent;

	&::after {
		border: none;
	}
}

.content {
	width: 420rpx;
	height: 300rpx;
	padding: 40rpx 0;
	padding-bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 20rpx;

	.title {
		width: 300rpx;
		text-align: center;
		font-size: 20rpx;
	}

	.images {
		width: 230rpx;
		height: 55rpx;
		background-size: 100% 100%;
		font-size: 22rpx;

		text-align: center;
		line-height: 55rpx;
		margin-top: 20rpx;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.title {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			color: #fff;
		}
	}

	.poster-wrapper-mini {
		position: relative;
		width: 250rpx;
		height: 160rpx;
		margin: 20rpx 0;
		margin-top: 60rpx;

	}

	.poster-mini {
		width: 100%;
		height: 160rpx;
		overflow: hidden;
		box-sizing: border-box;
		position: relative;

		.preview-bg-mini {
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-around;

			.left-bg-mini {
				width: 40%;
				height: 100%;
				overflow: hidden;
				background-color: #f0f0f0;
				border-radius: 10rpx;

				.bg-image-mini {
					width: 100%;
					height: 100%;
					opacity: 0.8;
					filter: blur(4rpx);
				}
			}

			.right-bg-mini {
				width: 55%;
				height: 100%;
				background: linear-gradient(#ffdff7, #fff);
				padding: 10rpx;
				box-sizing: border-box;
				margin-left: 10%;
				border-radius: 10rpx;
				color: #7e7e7e;

				image {
					width: 100%;
					height: 100%;
				}

				.report-text-mini {
					width: 100%;
					height: 100%;

					.report-title-mini {
						font-size: 10rpx;
						text-align: center;
						margin-bottom: 7rpx;
					}

					.report-content-mini {
						font-size: 10rpx;
					}
				}
			}
		}

		.blur-mask-mini {
			position: absolute;
			width: 100%;
			height: 100%;
			backdrop-filter: blur(5rpx);
			-webkit-backdrop-filter: blur(5rpx);
		}

		.lock-circle-mini {
			position: absolute;
			left: 28%;
			top: 55%;
			width: 80rpx;
			height: 80rpx;
			z-index: 10;
			transform: translateX(-50%);
			transform: translateY(-50%);

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.report-mini {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		left: 40%;
		top: -10%;
		z-index: 999;
		pointer-events: none;
	}
}

.del-popup-content {
	position: relative;
	width: 560rpx;
	padding: 160rpx 40rpx 48rpx;
	box-sizing: border-box;
	border-radius: 36rpx;
	background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
	box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
	text-align: center;
	color: #000;

	.del-popup-icon {
		position: absolute;
		top: -90rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 200rpx;
		height: 200rpx;
	}

	.title {
		color: #000;
		margin-top: -50rpx;
		font-size: 34rpx;
	}

	.num {
		font-size: 26rpx;
		margin-top: 20rpx;
	}

	.del-popup-actions {
		margin-top: 40rpx;
		color: #fff;

		view {
			background: #b370ff;
			height: 90rpx;
			margin-top: 30rpx;
			line-height: 90rpx;
			border-radius: 90rpx;
		}

	}

	.icon {
		position: absolute;
		transform: translateX(-50%);
		left: 50%;
		bottom: -100rpx;
		color: #000;
		cursor: pointer;

		&.icon-disabled {
			opacity: 0.5;
			pointer-events: none;
		}
	}
}
</style>
<style>
 .u-popup__content{
        background: transparent !important;
    }
</style>