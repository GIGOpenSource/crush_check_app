<template>
	<view class="page">
		<view class="file-type">
			<view class="title"> <text>{{ $t('index.selectFileType') }}</text>
				<view @click="show = true, flag = false"><up-icon name="error-circle" color="#ffffff"
						size="15"></up-icon>
				</view>
			</view>
			<scroll-view class="category-scroll" scroll-x :scroll-left="scrollLeft" scroll-with-animation
				show-scrollbar="false">
				<view class="category-track">
					<view v-for="(item, index) in list" :key="index" :id="`category-${index}`" class="category-pill"
						:class="{ active: current == item.type }" @click="handleTagClick(item.type, index)">
						<text class="category-pill-text">{{ item.title }}</text>
					</view>
				</view>
			</scroll-view>

		</view>
		<view class="upload">
			<view class="empt" v-if="imagesList.length == 0">
				<view class="images">
					<image :src="$getImg(`index/${current}`)" mode="aspectFit" />
				</view>
				<view>{{ $t('index.uploadScreenshot') }}</view>
				<view class="btn" @click="updateImages">{{ $t('index.upload') }}</view>
				<view style="font-size: 26rpx;">{{ getUploadText() }}</view>
				<view class="radio" style="font-size: 26rpx;">
					<radio value="r1" :checked="choose" style="transform:scale(0.7);" color="#B370FF"
						@click="choose = !choose" />
					{{ $t('common.agreePolicy') }}{{ $t('common.userAgreement') }}{{ $t('common.and') }}{{
						$t('common.privacyPolicy') }}
				</view>
				<view class="bottom">
					<view class="left">
						<image :src="$getImg('index/invite')" mode="scaleToFill" />
						<view>
							<view style="color:#ffffff;font-size: 26rpx;">{{ $t('index.inviteNewFriend') }}</view>
							<view class="rock">{{ $t('index.unlockReport') }} {{ $t('my.inviteProgress') }}{{
								userinfo.share_success_count || 0 }}{{ $t('my.inviteProgressUnit') }}</view>
						</view>
					</view>
					<button class="right" hover-class="none" @click="handleInviteClick">{{ $t('my.invite') }}</button>
				</view>
			</view>
			<view v-else class="no-empt">
				<view class="data">
					<view v-for="(item, index) in imagesList" :key="index" class="images">
						<image :src="item" mode="scaleToFill" />
						<view class="del" @click="editimage(index)">{{ $t('common.delete') }}</view>
					</view>
					<view class="images" @click="updateImages" v-if="imagesList.length < 6">
						<up-icon name="plus" color="#ffffff" size="26"></up-icon>
					</view>
				</view>
				<view class="btn" @click="btn">{{ $t('index.startAnalyze') }}</view>
			</view>
		</view>

		<IndexProup :show="show" @close="show = false" :cha="flag" :height="125">
			<template #content>
				<view class="content" v-if="flag">
					<!-- <image :src="$getImg('index/heart')" /> -->
					<view class="num">{{ $t('index.analyzingPercent') }} {{ progress }}{{
						$t('index.analyzingPercentUnit') }}</view>
					<view class="progress-wrapper">
						<view class="custom-progress">
							<view class="progress-track">
								<view class="progress-fill" :style="{ width: progress + '%' }"></view>
							</view>
						</view>
					</view>
					<view class="tip">{{ $t('index.exitTipTestRecord') }}</view>


				</view>
				<view class="notice" v-if="!flag">
					<view class="title">{{ $t('index.selectCorrectType') }}</view>
					<!-- <view class="con">{{ $t('index.fileTypeTip1') }}</view> -->
					<view class="con">{{ $t('index.fileTypeTip1') }}</view>
					<view class="con">{{ $t('index.fileTypeTip2') }}</view>
					<!-- <view class="con">{{ $t('index.fileTypeTip4') }}</view> -->
					<view class="btn" @click="show = false">{{ $t('index.iKnow') }}</view>
				</view>
			</template>
		</IndexProup>

		<IndexProup :show="tishi" @close="handleAgreementClose">
			<template #content>
				<view class="tishi">
					<view class="title">{{ $t('common.userAgreement') }}</view>
					<scroll-view class="agreement-content" scroll-y>
						<rich-text v-if="userAgreementContent" :nodes="userAgreementContent"
							class="richtext-content"></rich-text>
						<view v-if="loadingAgreement" class="loading">{{ $t('common.loading') }}</view>
						<view v-if="!loadingAgreement && !userAgreementContent" class="empty">{{ $t('common.noContent')
						}}</view>
					</scroll-view>
					<view class="btn" @click="handleAgree">{{ $t('login.agreeUserAgreement') }}</view>
					<view class="disagree-btn" @click="handleDisagree">{{ $t('login.disagree') }}</view>
				</view>

			</template>
		</IndexProup>
		<!-- 欢迎弹窗 -->
		<IndexProup :show="welecome" @close="close" :cha="true" :height="110">
			<template #content>
				<view class="welcome-popup">
					<view class="welcome-swiper">
						<swiper :current="welcomeIndex" circular @change="handleWelcomeChange">
							<swiper-item v-for="(item, index) in welcomeSlides" :key="index">
								<view class="welcome-card">
									<view class="welcome-title">{{ item.title }}</view>

									<view class="welcome-image">
										<image :src="item.image_url" mode="aspectFit"></image>
									</view>
									<view class="welcome-button" @click.stop="handleWelcomeNext">
										{{ item.buttonText }}
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="welcome-dots">
						<view v-for="(item, index) in welcomeSlides" :key="index" class="welcome-dot"
							:class="{ active: index === welcomeIndex }"></view>
					</view>
				</view>
			</template>
		</IndexProup>
		<!-- 会员拦截 -->
		<up-popup :show="vipProup" @close="vipProup = false" mode="bottom" round="25" :closeable="true">
			<view class="vipProup">
				<image :src="$getImg('index/bg')" class="bg" />
				<view class="content">
					<view class="top-title">
						<text class="t1">{{ $t('index.becomeMember') }}</text>
						<text class="t2">{{ $t('index.enjoyPrivileges') }}</text>
					</view>
					<view class="btns">
						<view v-for="(item, index) in viplist" :key="index">
							<image :src="$getImg('index/message')" v-if="index == 0 || index == 1" />
							<text>{{ item }}</text>
						</view>
					</view>
					<view class="bottom" @click="pay">{{ mouth.price }} {{ $t('index.perMonth') }} {{
						$t('index.openNow')
					}}
					</view>
					<view class="radio2">
						<radio value="r1" :checked="choose2" style="transform:scale(0.6);" color="#B370FF"
							@click="choose2 = !choose2" /><text>已阅读并同意<text style="color: #B370FF;font-weight: bold;" @click="vipxiyi">《会员服务协议》</text></text>
					</view>
				</view>
			</view>
		</up-popup>
		<!-- 分享 -->
		 <InvitationFriend :show="friend" @close="friend = false"/>
	</view>
</template>

<script setup>
import {
	ref,
	watch,
	computed,
	nextTick
} from 'vue'
import IndexProup from '@/components/IndexProup/IndexProup.vue'
import InvitationFriend from '@/components/InvitationFriend/InvitationFriend.vue'
import {
	host
} from '@/config/config.js'
import {
	share,
	getGuid,
	getProducts,
	mockOrder,
	iosOrder,
	ios_receipt
} from '@/api/index.js'
import {
	getSystemContent,
	getUserInfo
} from '@/api/login.js'
import {
	onLoad,
	onShow,
	onShareAppMessage
} from '@dcloudio/uni-app'
import {
	usePageStay
} from '@/utils/usePageStay.js'
import {
	useI18n
} from 'vue-i18n'
import {
	getLocale
} from '@/i18n/index.js'
const version = uni.getStorageSync('version')
const choose2 = ref(false)
const {
	t
} = useI18n()
const vipProup = ref(false)
// 页面停留时长统计
usePageStay(t('tabBar.index') || '检测')
const friend = ref(false)
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
   const vipxiyi = () =>{
  uni.navigateTo({
        url: "/pages/my/richtext?label=" + encodeURIComponent('会员服务协议') + "&type=" + encodeURIComponent('about'),
      });
    }
const params = ref({
	userId: uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')).id : '',
	appVersion: "1.0.0",
	eventTime: formatDateTime(),
	pageName: ''
})
// list 改为计算属性，语言切换时自动更新
const list = computed(() => [
	// 	{
	// 	title: t('index.chatScreenshot'),
	// 	icon: 'index/icon1',
	// 	color: '#F681DA',
	// 	type: 'chat'
	// },
	{
		title: t('index.socialScreenshot'),
		icon: 'index/icon2',
		color: '#02BADA',
		type: 'social'
	}, {
		title: t('index.physicalPhoto'),
		icon: 'index/icon3',
		color: '#76D74D',
		type: 'physical'
	},
	// {
	// 	title: t('index.consumeVoucher'),
	// 	icon: 'index/icon4',
	// 	color: '#F2C448',
	// 	type: 'consume'
	// }
])
const show = ref(false)
const imagesList = ref([])
const progress = ref(60)
const current = ref('social')
const flag = ref(false)
const choose = ref(false)
const tishi = ref(false)
const welecome = ref(false)
const userAgreementContent = ref('')
const loadingAgreement = ref(false)
const welcomeSlides = ref([])
const uploading = ref(false)
const uploadProgress = ref(0)
const iconsRef = ref(null)
const scrollLeft = ref(0)
const userinfo = ref({})
const token = ref('')
const mouth = ref({})
const viplist = computed(() => [
	t('index.vipFeature1'),
	t('index.vipFeature2'),
	t('index.vipFeature3'),
	t('index.vipFeature4'),
	t('index.vipFeature5')
])

const welcomeIndex = ref(0)
const handleWelcomeNext = () => {
	if (welcomeIndex.value < welcomeSlides.value.length - 1) {
		welcomeIndex.value += 1
		return
	}
	uni.setStorageSync('first', 'false')
	welecome.value = false

}
// 获取上传提示文本
const getUploadText = () => {
	const typeMap = {
		chat: t('index.uploadChatScreenshot'),
		social: t('index.uploadSocialScreenshot'),
		physical: t('index.uploadPhysicalPhoto'),
		consume: t('index.uploadChatScreenshot') // 消费凭证暂时使用聊天记录的文本
	}
	return typeMap[current.value] || t('index.uploadChatScreenshot')
}

// 处理标签点击事件
const handleTagClick = (type, index) => {
	current.value = type

	// 滚动到中间位置
	nextTick(() => {
		scrollCategoryToCenter(index)
	})

	// 统计事件
	if (index === 0) {
		click_type1_button()
	} else if (index === 1) {
		click_type2_button()
	} else if (index === 2) {
		click_type3_button()
	} else if (index === 3) {
		click_type4_button()
	}
}

// 滚动分类到中间位置
const scrollCategoryToCenter = (index) => {
	const query = uni.createSelectorQuery()

	// 同时获取所有需要的元素信息
	query.select('.category-scroll').boundingClientRect()
	query.select(`#category-${index}`).boundingClientRect()
	query.select('.category-track').boundingClientRect()

	query.exec((res) => {
		if (!res || res.length < 3) return

		const scrollRect = res[0]
		const itemRect = res[1]
		const trackRect = res[2]

		if (!scrollRect || !itemRect || !trackRect) return

		const scrollViewWidth = scrollRect.width

		// 计算 tab 相对于 track 的位置
		const itemLeft = itemRect.left - trackRect.left
		const itemWidth = itemRect.width
		const itemCenter = itemLeft + itemWidth / 2

		// 计算需要滚动的位置，使 tab 居中
		const targetScrollLeft = itemCenter - scrollViewWidth / 2

		// 确保滚动位置不为负数
		scrollLeft.value = Math.max(0, targetScrollLeft)
	})
}

const handleWelcomeChange = (e) => {
	welcomeIndex.value = e.detail.current || 0
}

watch(welecome, (val) => {
	if (!val) {
		welcomeIndex.value = 0
	}
})
onLoad((e) => {
	// 设置导航栏标题
	uni.setNavigationBarTitle({
		title: 'CrushCheck'
	});
	params.value.pageName = t('index.selectFileType')
	getwelecome()
	if (e.scene) {
		uni.setStorageSync("inviter_openid", e.scene);
		if (!uni.getStorageSync('token')) {
			uni.navigateTo({
				url: "/pages/login/login"
			})
			return
		}
		share({
			shareId: e.scene,
		}).then((res) => {
			console.log(res, "share record");
		});
	}

});
onShow(() => {
	vipprice()
	if (!uni.getStorageSync('first')) {
		welecome.value = true
	} else {
		welecome.value = false
	}
	userinfo.value = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : ''
	token.value = uni.getStorageSync('token')
	// 更新 tabBar 国际化
	updateTabBarI18n()
})
const close = () => {
	uni.setStorageSync('first', 'false')
	welecome.value = false
}
const handleInviteClick = () => {
	console.log('handleInviteClick11111')
	if (!token.value) {
		uni.navigateTo({
			url: "/pages/login/login"
		})
		return
	}
	friend.value = true
	console.log('邀请好友')

}
const vipprice = () => {
	getProducts().then(res => {
		mouth.value = res.data.results.filter(item => item.product_type == 'ios_vip')[0]
		console.log('222mouthmouth',mouth.value)
	})
}
const editimage = (index) => {
	imagesList.value.splice(index, 1)
}
//支付
const pay = () => {
	if(!choose2.value) return uni.showToast({
		title:'请阅读会员服务协议',
		icon:'none'
	})
	click_monthpay()
	const systemInfo = uni.getSystemInfoSync();
	if (systemInfo.platform === 'ios') {
		iosOrder({
			description: mouth.value.description,
			openId: uni.getStorageSync('openId'),
			productId: mouth.value.id
		}).then(res => {
			let paymentData = res.data
			plus.payment.getChannels(function (channels) {
				let iapChannel = channels.find(c => c.id === 'appleiap');
				if (!iapChannel) {
					uni.showToast({ title: '未找到苹果支付通道', icon: 'none' });
					return;
				}
				iapChannel.requestProduct([paymentData.productid], function (res) {
					uni.requestPayment({
						provider: 'appleiap',
						orderInfo: {
							productid: res[0].productid,
							quantity: 1,
							username: paymentData.username,
							manualFinishTransaction: false,
							paymentDiscount: '否'
						},
						success: (e) => {
							   e.payment.username = paymentData.username;
							ios_receipt(e).then(res => {
								 const openId = uni.getStorageSync('openId')
								 getUserInfo(openId).then(userRes => {
								 	if (userRes.code === 200 || userRes.code === 201) {
								 		if (userRes.data) {
								 			uni.setStorageSync('userInfo', JSON.stringify(userRes
								 				.data))
								 			console.log('用户信息更新成功', userRes.data)
								 		}
								 	}
								 	vipProup.value = false
									uni.showToast({
									    title: t('proPoster.paySuccess'),
									    icon: 'none'
									});
									pay_success()
							})
							  
						
							}).catch(err => {
								console.log('获取用户信息失败', err)
							})
						},
						fail:(err)=>{
							 uni.showToast({
                                title: t('proPoster.payFailed'),
                                icon: 'none'
                            })
						}
					})

				}, function (err) {
					console.error('IAP 商品信息获取失败:', err);
					uni.showToast({ title: '商品信息获取失败', icon: 'none' });
				});
			}, function (e) {
				console.error('获取支付通道失败:', e);
				uni.showToast({ title: '支付通道获取失败', icon: 'none' });
			});

		})
			.catch(err => {
				pay_fail()
			})
	} else {
		mockOrder({
			description: mouth.value.description,
			openId: uni.getStorageSync('openId'),
			productId: mouth.value.id
		}).then(res => {
			pay_success()
			const openId = uni.getStorageSync('openId')
			getUserInfo(openId).then(userRes => {
				if (userRes.code === 200 || userRes.code === 201) {
					if (userRes.data) {
						uni.setStorageSync('userInfo', JSON.stringify(userRes
							.data))
						console.log('用户信息更新成功', userRes.data)
					}
				}
				vipProup.value = false
			}).catch(err => {
				console.log('获取用户信息失败', err)
			})
		})
			.catch(err => {
				pay_fail()
			})
	}

}
const btn = () => {
	let token = uni.getStorageSync('token')

	if (!token) return uni.navigateTo({
		url: "/pages/login/login"
	})

	if (!imagesList.value.length) {
		uni.showToast({
			title: t('index.pleaseUploadData'),
			icon: 'none'
		})
		return
	}
	let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
	if (!userInfo.is_vip) return vipProup.value = true
	show.value = true
	flag.value = true
	progress.value = 0
	const timer = setInterval(() => {
		if (progress.value >= 99) {
			clearInterval(timer)
			return
		}
		progress.value++
	}, 20)
	let params = {
		poster_type: current.value,
		file_url: imagesList.value
	}
	imagesList.value = []
	click_start()
	uni.request({
		url: host + '/poster/', //仅为示例，并非真实接口地址。
		data: params,
		header: {
			token: uni.getStorageSync('token'),
			"Accept-Language": uni.getStorageSync('currentLanguage') || 'zh'
		},
		method: 'POST',
		timeout: 1500000,
		complete: (data) => {
			console.log(data, 'datat')
			character_start()
			if (data.data.code == 403) {
				imagesList.value = params.file_url
				show.value = false
				uni.navigateTo({
					url: "/pages/login/login"
				})
				return
			}
			if (data.data.code == 200) {
				character_success()
				if (show.value) {
					uni.navigateTo({
						url: `/pages/index/proProster?id=${data.data.data.id}`,
					})
					show.value = false
				}

			} else {
				character_fail()
				show.value = false
				uni.showToast({
					title: t('index.temporarilyUnavailable'),
					icon: 'none'
				})
			}
		}
	});

}

// 获取用户协议内容
const fetchUserAgreement = async () => {
	loadingAgreement.value = true
	try {
		const res = await getSystemContent('agreement')
		console.log("获取用户协议成功", res)

		if (res.code === 200 || res.code === 201) {
			const data = res.data?.[0] || res.data
			if (data && data.user_agreement) {
				userAgreementContent.value = data.user_agreement
			} else {
				userAgreementContent.value = ''
			}
		} else {
			userAgreementContent.value = ''
			uni.showToast({
				title: res.msg || res.message || t('common.getContentFailed'),
				icon: 'none'
			})
		}
	} catch (error) {
		console.error("获取用户协议失败:", error)
		userAgreementContent.value = ''
		uni.showToast({
			title: error.msg || error.message || t('common.getContentFailed'),
			icon: 'none'
		})
	} finally {
		loadingAgreement.value = false
	}
}

// 处理用户协议弹窗关闭
const handleAgreementClose = () => {
	tishi.value = false
}

// 处理同意用户协议
const handleAgree = () => {
	choose.value = true
	tishi.value = false
}

// 处理不同意用户协议
const handleDisagree = () => {
	choose.value = false
	tishi.value = false
}

const updateImages = () => {
	if (!choose.value) {
		tishi.value = true
		fetchUserAgreement()
		return
	}
	if (imagesList.value.length >= 6) {
		uni.showToast({
			title: t('index.maxUploadSix'),
			icon: 'none'
		})
		return
	}
	click_upload_button()
	uni.chooseImage({
		count: 6 - imagesList.value.length,
		type: 'file',
		success: async (res) => {
			uploading.value = true
			uploadProgress.value = 0
			uni.showLoading({
				title: t('index.uploading'),
				mask: true
			});
			if (res.errMsg == 'chooseImage:ok') {
				click_album()
			} else {
				click_camera()
			}
			photo_upload_start()
			// 使用 map 创建 Promise 数组
			const uploadPromises = res.tempFilePaths.map((filePath, index) => {
				let params = {
					type: 'img',
					file_name: filePath,
				}
				const systemInfo = uni.getSystemInfoSync();
				if (systemInfo.platform === 'android') {
					console.log('Android设备');
					params.file = filePath
				} else if (systemInfo.platform === 'ios') {
					console.log('iOS设备');
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: host + '/upload/',
						filePath: filePath,
						name: 'file',
						formData: params,
						header: {
							'content-type': 'multipart/form-data'
						},
						success: (uploadFileRes) => {
							try {
								let images = JSON.parse(uploadFileRes.data)
									.data.url
								imagesList.value.push(images)
								uploadProgress.value = ((index + 1) / res
									.tempFilePaths.length) * 100
								resolve(images)

							} catch (error) {
								console.log(error, 'parse error')
								reject(error)

							}
						},
						fail: (err) => {
							console.log(err, 'upload error')
							reject(err)
						}
					});
				});
			});

			// 等待所有文件上传完成
			try {
				photo_upload_success()
				await Promise.all(uploadPromises)
				uni.hideLoading()
				uni.showToast({
					title: t('index.uploadSuccess'),
					icon: 'success'
				})
			} catch (error) {
				photo_upload_fail()
				uni.hideLoading()
				uni.showToast({
					title: t('index.partUploadFailed'),
					icon: 'none'
				})
			} finally {
				uploading.value = false
				uploadProgress.value = 0
			}
		},
		fail: (err) => {
			upload_cancel()
			uploading.value = false
		}
	});
}
const getwelecome = () => {
	getGuid().then(res => {
		console.log(res.data.results)
		welcomeSlides.value = res.data.results.map(item => {
			return {
				title: item.title,
				image_url: item.image_url,
				buttonText: t('common.next')

			}
		})
		welcomeSlides.value[welcomeSlides.value.length - 1].buttonText = t('common.finish')
	})
}

// 点击 "上传照片" 按钮
const click_upload_button = () => {
	params.value.eventTime = formatDateTime()
}
// 点击 "从相册上传" 按钮
const click_album = () => {
	params.value.eventTime = formatDateTime()
}
//点击拍照上传
const click_camera = () => {
	params.value.eventTime = formatDateTime()
}

//取消上传操作
const upload_cancel = () => {
	params.value.eventTime = formatDateTime()
}

//点击"聊天记录"按钮
const click_type1_button = () => {
	params.value.eventTime = formatDateTime()
}

//点击"社交平台"按钮
const click_type2_button = () => {
	params.value.eventTime = formatDateTime()
}

//点击"实物场景"按钮
const click_type3_button = () => {
	params.value.eventTime = formatDateTime()
}

//点击"消费凭证"按钮
const click_type4_button = () => {
	params.value.eventTime = formatDateTime()
}

//点击"开始分析"按钮
const click_start = () => {
	params.value.eventTime = formatDateTime()
}

//开始上传照片
const photo_upload_start = () => {
	params.value.eventTime = formatDateTime()
}

//照片上传成功
const photo_upload_success = () => {
	params.value.eventTime = formatDateTime()
}

//照片上传失败
const photo_upload_fail = () => {
	params.value.eventTime = formatDateTime()
}

//开始人品分析
const character_start = () => {
	params.value.eventTime = formatDateTime()
}

//人品分析完成
const character_success = () => {
	params.value.eventTime = formatDateTime()
}

//人品分析失败
const character_fail = () => {
	params.value.eventTime = formatDateTime()
}

//点击 "邀请" 按钮
const click_invite = () => {
	params.value.eventTime = formatDateTime()
}

//点击 "取消邀请" 按钮
const click_invitecancel = () => {
	params.value.eventTime = formatDateTime()
}
//点击 "月付" 按钮
const click_monthpay = () => {
	params.value.eventTime = formatDateTime()
}
//购买成功
const pay_success = () => {
	params.value.eventTime = formatDateTime()
}

//购买失败
const pay_fail = () => {
	params.value.eventTime = formatDateTime()
}

// 更新 tabBar 国际化
const updateTabBarI18n = () => {
	try {
		uni.setTabBarItem({
			index: 0,
			text: t('tabBar.index') || '检测'
		})
		uni.setTabBarItem({
			index: 1,
			text: t('tabBar.my') || '我的'
		})
	} catch (error) {
		console.error('更新 tabBar 国际化失败:', error)
	}
}
</script>

<style lang="scss" scoped>
	.radio2{
	margin-top: 30rpx;
	font-size: 24rpx;
	display:flex;
	align-items: center;
	}
.page {
	width: 100vw;
	height: auto;
	// height: 100vh;
	// overflow: hidden;
	// background: linear-gradient(180deg, rgba(255, 87, 215, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%);
	padding: 0;
	box-sizing: border-box;
	position: relative;
	padding-bottom: 40rpx;
}

.vipProup {
	width: 100%;
	height: 90vh;
	position: relative;

	.bg {
		width: 100%;
		height: 100%;
	}

	.content {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		.top-title {
			width: 85%;
			display: flex;
			flex-direction: column;
			margin-top: 160rpx;

			.name {
				margin: 0 10rpx;
			}

			.t1 {
				font-weight: bold;
				font-size: 42rpx;
			}

			.t2 {
				margin-top: 10rpx;
				font-size: 26rpx;
				font-weight: 200;
			}
		}

		.btns {
			width: 85%;
			margin-top: 80rpx;

			view {
				width: 100%;
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 99%);
				font-weight: 100;
				height: 100rpx;
				margin-bottom: 20rpx;
				line-height: 100rpx;
				border-radius: 100rpx;
				padding-left: 45rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;

				image {
					width: 60rpx;
					height: 60rpx;
					vertical-align: middle;
					margin-right: 15rpx;
					margin-left: -10rpx;
				}
			}
		}

		.bottom {
			width: 92%;
			background: linear-gradient(90deg, #6273FD 0%, #EE72FD 100%);
			margin-top: 30rpx;
			height: 95rpx;
			border-radius: 30rpx;
			line-height: 95rpx;
			text-align: center;
		}
	}
}

.radio {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 90%;
}

.bottomtitle {
	position: absolute;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
	font-size: 20rpx;
	color: #bbbaba;
}

.file-type {
	border-radius: 20rpx;
	padding: 30rpx;

	.title {
		display: flex;
		font-size: 26rpx;
		align-items: center;

		text {
			margin-right: 20rpx;
		}
	}
}

.category-scroll {
	width: 100%;
	margin-top: 30rpx;
	white-space: nowrap;
}

.category-track {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.category-pill {
	padding: 18rpx 32rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.06);
	color: rgba(255, 255, 255, 0.6);
	font-size: 28rpx;
	transition: background 0.2s, color 0.2s;
	flex-shrink: 0;

	&.active {
		background: #2b2848;
		color: #ffffff;
	}
}

.category-pill-text {
	font-size: 28rpx;
}

.upload {
	margin-top: 80rpx;

	.empt {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: rgba(255, 255, 255, 0.6);
		font-size: 28rpx;

		.btn {
			width: 400rpx;
			height: 90rpx;
			margin: 40rpx auto;
			text-align: center;
			line-height: 90rpx;
			color: #ffffff;
			background: rgba(255, 255, 255, 0.04);
			border: 0.5px solid rgba(255, 255, 255, 0.17);
			border-radius: 80rpx;
			margin-top: 150rpx;
		}

		.images {
			width: 400rpx;
			height: 400rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 40rpx;

		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
			object-fit: cover;

		}

		.bottom {
			background: rgba(148, 119, 180, 0.1);
			border: 0.5px solid rgba(255, 255, 255, 0.1);
			width: 90%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx;
			border-radius: 10rpx;
			margin-top: 30rpx;

			image {
				width: 70rpx;
				height: 60rpx;
				margin-right: 15rpx;
				vertical-align: middle;
			}

			.left {
				display: flex;
				align-items: center;

				.rock {
					font-size: 20rpx;
					color: rgba(255, 255, 255, 0.6);
				}
			}

			.right {
				background: rgba(179, 112, 255, 0.3);
				margin-right: 10rpx;
				padding: 0rpx 30rpx;
				border-radius: 40rpx;
				font-size: 24rpx;
				color: #FFF !important;
			}
		}
	}

	.no-empt {
		margin-top: -80rpx;

		.data {
			display: flex;
			flex-wrap: wrap;
			height: 700rpx;

			.images {
				width: 28%;
				height: 300rpx;
				margin-left: 30rpx;
				margin-bottom: 20rpx;
				position: relative;
				background: rgba(255, 255, 255, 0.1);
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
			}

			image {
				width: 100%;
				height: 100%;


			}

			.del {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 20rpx;
				background: #B370FF;
				font-size: 24rpx;
				width: 110rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-align: center;
				border-radius: 40rpx;
				font-size: 26rpx;
			}

		}

		.btn {
			// background-image: url('/static/index/btn.png');
			// background-size: 100% 100%;
			width: 400rpx;
			height: 90rpx;
			margin: 40rpx auto;
			text-align: center;
			line-height: 90rpx;
			color: #ffffff;
			background: rgba(255, 255, 255, 0.04);
			border: 0.5px solid rgba(255, 255, 255, 0.17);
			border-radius: 80rpx;
			margin-top: 100rpx;
		}
	}

}


.welcome-popup {
	width: 620rpx;
	height: 900rpx;
	padding: 20rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #000;
	padding-bottom: 0;

	.welcome-swiper {
		width: 100%;
		height: 780rpx;
	}

	swiper {

		width: 100%;
		height: 100%;
	}

	swiper-item {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.welcome-card {
		width: 100%;
		border-radius: 48rpx;
		padding: 60rpx 48rpx 56rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.welcome-title {
		font-size: 34rpx;
		font-weight: 600;
		line-height: 48rpx;
		color: #1F143A;
	}


	.welcome-image {
		width: 100%;
		height: 460rpx;
		margin: 40rpx 0 30rpx;
		border-radius: 36rpx;
		// background: pink;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		margin-bottom: 20rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.welcome-desc {
		font-size: 24rpx;
		color: rgba(31, 20, 58, 0.65);
		line-height: 36rpx;
	}

	.welcome-button {
		width: 360rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 96rpx;
		background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 500;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}

	.welcome-dots {
		display: flex;
		align-items: center;
	}

	.welcome-dot {
		width: 45rpx;
		height: 10rpx;
		border-radius: 14rpx;
		background: #dcdcdc;
		margin: 0 8rpx;
		transition: all 0.3s ease;
	}

	.welcome-dot.active {
		width: 45rpx;
		border-radius: 14rpx;
		background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
	}
}

.content,
.notice {
	width: 420rpx;
	height: 100%;
	// height: 250rpx;
	padding: 40rpx 0;
	// padding-bottom: ;
	display: flex;
	flex-direction: column;
	align-items: center;
	// justify-content: center;

	image {
		width: 120rpx;
		height: 120rpx;
	}

	.num {
		font-size: 26rpx;
		margin: 20rpx 0;
		color: #000;
	}

	.progress-wrapper {
		width: 70%;
		margin: 10rpx auto;
		margin-bottom: 20rpx;
	}

	.custom-progress {
		width: 100%;
	}

	.progress-track {
		position: relative;
		width: 100%;
		height: 40rpx;
		background-color: #ffffff;
		border-radius: 40rpx;
		border: 1px solid #e0e0e0;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #C084FC 0%, #9333EA 100%);
		background-image: repeating-linear-gradient(-45deg,
				#C084FC 0rpx,
				#D4A5F8 3rpx,
				#9333EA 7rpx,
				#9333EA 7rpx,
				#D4A5F8 10rpx,
				#C084FC 10rpx,
				#C084FC 10rpx,
				#D4A5F8 13rpx,
				#9333EA 17rpx,
				#9333EA 17rpx,
				#D4A5F8 20rpx,
				#C084FC 20rpx);
		border-radius: 40rpx;
		transition: width 0.3s ease;
		position: relative;
	}

	.tip {
		font-size: 20rpx;
		color: #a0a0a0;
		margin-top: 15rpx;
		width: 90%;
		text-align: center;
	}
}

.notice {
	width: 450rpx;
	height: 100%;
	position: relative;
	font-size: 24rpx;

	.title {
		font-size: 30rpx;
		font-weight: bold;
		color: #763CD9;
		width: 300rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.con {
		font-size: 20rpx;
		margin: 0 30rpx;
		color: #333333;
		margin-bottom: 15rpx;
		line-height: 30rpx;
	}

	.btn {
		background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
		margin-top: 20rpx;
		width: 90%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 80rpx;

	}

}

.tishi {
	width: 600rpx;
	color: #000;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 45rpx;
	box-sizing: border-box;
	max-height: 80vh;

	.title {
		font-weight: bold;
		font-size: 36rpx;
		margin-bottom: 30rpx;
		text-align: center;
		width: 100%;
	}

	.agreement-content {
		width: 100%;
		max-height: 500rpx;
		margin-bottom: 20rpx;
		flex: 1;
		overflow-y: auto;
	}

	.richtext-content {
		width: 100%;
		font-size: 28rpx;
		line-height: 1.8;
		// color: rgba(0, 0, 0, 0.85);
		word-wrap: break-word;
	}

	.loading,
	.empty {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40rpx 0;
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.55);
	}

	.btn {
		background: #B370FF;
		color: #fff;
		margin-top: 20rpx;
		height: 100rpx;
		line-height: 100rpx;
		width: 100%;
		border-radius: 100rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
	}

	.disagree-btn {
		margin-top: 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		text-align: center;
		color: rgba(0, 0, 0, 0.6);
		font-size: 28rpx;
	}
}
</style>