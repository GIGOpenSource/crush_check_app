<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
            <view class="navbar-content">
                <view class="navbar-title">{{ t('answerBook.title') }}</view>
            </view>
        </view>
        
        <view class="top" :style="{ top: (statusBarHeight + 88 + 40) + 'rpx' }" @click="back()">
            <up-icon name="arrow-left" color="#7F663E" size="24"></up-icon>
            <text>{{ isdetails ? t('answerBook.back') : status == 1 ? t('answerBook.backToModify') : t('answerBook.back') }}</text>
        </view>
        
        <view class="content-wrapper" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }">
            <image :src="status == 1 ? details.image_url:details.deepimages" />
            <view class="btns" v-if="status == 1">
                <view class="btn1">
                    <view @click="save">{{ t('answerBook.tellTA') }}</view>
                    <view @click="again">{{ t('answerBook.askAgain') }}</view>
                </view>
                <view class="btn2" @click="aidetails">{{ t('answerBook.aiAnalysis') }}</view>
            </view>
        </view>
    </view>

    <IndexProup :show="showProgress" @close="handleProgressClose" :cha="true" :height="125">
        <template #content>
            <view class="content">
                <view class="num">{{ t('index.analyzingPercent') }} {{ progress }}{{ t('index.analyzingPercentUnit') }}</view>
                <view class="progress-wrapper">
                    <view class="custom-progress">
                        <view class="progress-track">
                            <view class="progress-fill" :style="{ width: progress + '%' }"></view>
                        </view>
                    </view>
                </view>
                <view class="tip">{{ t('index.exitTipTestRecord') }}</view>
            </view>
        </template>
    </IndexProup>

    <up-popup :show="vipProup" @close="vipProup = false" mode="bottom" round="25" :closeable="true">
        <view class="vipProup">
            <image :src="$getImg('index/bg')" class="bg" />
            <view class="content">
                <view class="top-title">
                    <text class="t1">{{ t('index.becomeMember') }}</text>
                    <text class="t2">{{ t('index.enjoyPrivileges') }}</text>
                </view>
                <view class="btns1">
                    <view v-for="(item, index) in viplist" :key="index">
                        <image :src="$getImg('index/message')" v-if="index == 0 || index == 1" />
                        <text>{{ item }}</text>
                    </view>
                </view>
                <view class="bottom1" @click="pay">{{ mouth.price }}{{ t('index.perMonth') }} {{ t('index.openNow') }}</view>
            </view>
        </view>
    </up-popup>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { getAnswerbook, getPosterDetails, getProducts, createOrder } from '@/api/index.js';
import { getUserInfo } from '@/api/login.js';
import IndexProup from '@/components/IndexProup/IndexProup.vue';
import { host } from '@/config/config.js';

const { t } = useI18n()
const status = ref('1')
const id = ref('')
const details = ref({})
const isdetails = ref(false)
const statusBarHeight = ref(0)
const showProgress = ref(false)
const progress = ref(0)
const progressTimer = ref(null)
const vipProup = ref(false)
const mouth = ref({})
const viplist = computed(() => [
    t('index.vipFeature1'),
    t('index.vipFeature2'),
    t('index.vipFeature3'),
    t('index.vipFeature4'),
    t('index.vipFeature5')
])

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = systemInfo.windowWidth / 375 * 2 || 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx
    
    // 获取会员价格
    getProducts().then(res => {
        mouth.value = res.data.results.filter(item => item.product_type == 'vip')[0]
    })
})

const back = () => {
    if(isdetails.value) return uni.navigateBack()
    if(status.value == 2){
        status.value = 1
    }else{
       uni.reLaunch({ url: '/pages/index/answer' })
    }
    
}
onLoad((op) => {
    console.log(op,'ooo')
    id.value = op.id
    isdetails.value = op.details || false
    if (isdetails.value) {
         getPosterDetails(id.value).then(res => {
            details.value = res.data;
            details.value.image_url = res.data.file_url
            details.value.deepimages = res.data.child_list[0]?.file_url
            details.value.poster_id = res.data.id
         })
    } else {
        details.value.image_url = op.url
        details.value.poster_id = op.parent_id
    }

})
const again = () => {
    uni.removeStorageSync('question')
    uni.reLaunch({ url: '/pages/index/answer' })
}
const save = () => {

    uni.downloadFile({
        url: details.value.image_url,
        success: (res) => {
            if (res.statusCode === 200) {
                wx.showShareImageMenu({
                    path: res.tempFilePath,
                    complete: (res) => {
                        if (res.errMsg == 'showShareImageMenu:fail cancel') {
                            // share_fail()
                        } else {
                            // share_success()
                        }
                    }
                })
            }
        }
    })
}
const aidetails = () => {
    if(details.value.deepimages) return status.value = 2
    
    // 检查会员状态
    let userInfo = JSON.parse(uni.getStorageSync('userInfo') || '{}')
    if (!userInfo.is_vip) {
        vipProup.value = true
        return
    }
    
    // 显示进度条弹窗
    showProgress.value = true
    progress.value = 0
    
    // 清除之前的定时器
    if (progressTimer.value) {
        clearInterval(progressTimer.value)
        progressTimer.value = null
    }
    
    // 启动进度条动画
    progressTimer.value = setInterval(() => {
        if (progress.value >= 99) {
            clearInterval(progressTimer.value)
            progressTimer.value = null
            return
        }
        progress.value++
    }, 20)
    
    let params = {
        answerId: id.value,
        parent_id: details.value.poster_id,
        user_question: uni.getStorageSync('question')
    }
    
    uni.request({
        url: host + '/answerbook/generate_answer_deep_image/',
        data: params,
        header: {
            token: uni.getStorageSync('token'),
            "Accept-Language": uni.getStorageSync('currentLanguage') || 'zh'
        },
        method: 'GET',
        timeout: 1500000,
        complete: (data) => {
            // 清除进度条定时器
            if (progressTimer.value) {
                clearInterval(progressTimer.value)
                progressTimer.value = null
            }
            
            if (data.data.code == 403) {
                showProgress.value = false
                progress.value = 0
                uni.navigateTo({
                    url: "/pages/login/login"
                })
                return
            }
            
            if (data.data.code == 200 || data.data.code == 201) {
                // 设置进度为100%
                progress.value = 100
                
                // 延迟关闭弹窗，让用户看到100%
                setTimeout(() => {
                    showProgress.value = false
                    details.value.deepimages = data.data.data.image_url
                    status.value = 2
                    progress.value = 0
                }, 500)
            } else {
                showProgress.value = false
                progress.value = 0
            }
        }
    })
}

const handleProgressClose = () => {
    // 清除进度条定时器
    if (progressTimer.value) {
        clearInterval(progressTimer.value)
        progressTimer.value = null
    }
    showProgress.value = false
    progress.value = 0
}

// 支付
const pay = () => {
    createOrder({
        description: mouth.value.description,
        openId: uni.getStorageSync('openId'),
        productId: mouth.value.id
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
                const openId = uni.getStorageSync('openId')
                getUserInfo(openId).then(userRes => {
                    if (userRes.code === 200 || userRes.code === 201) {
                        if (userRes.data) {
                            uni.setStorageSync('userInfo', JSON.stringify(userRes.data))
                            console.log('用户信息更新成功', userRes.data)
                        }
                    }
                }).catch(err => {
                    console.log('获取用户信息失败', err)
                })
                vipProup.value = false
            },
            fail(e) {
                uni.showToast({
                    title: t('proPoster.payFailed'),
                    icon: 'none'
                })
            }
        })
    })
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background: #12111f;
    font-weight: 100 !important;
    overflow: hidden;
}

.custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #12111f;
    
    .navbar-content {
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;
        
        .navbar-title {
            font-size: 32rpx;
            font-weight: 500;
            color: #ffffff;
        }
    }
}

.top {
    position: fixed;
    left: 40rpx;
    display: flex;
    align-items: center;
    color: #7F663E;
    font-size: 28rpx;
    z-index: 998;
    
    text {
        margin-left: 10rpx;
    }
}

.content-wrapper {
    margin: 0 25rpx 20rpx;
    height: calc(100vh - 200rpx);
    box-sizing: border-box;
    background: #d1c1a7;
    border-radius: 10rpx;
    position: relative;
    overflow: hidden;
    image {
    width: 100%;
    height: 100%;
}
}



.btns {
    position: absolute;
    left: 0;
    bottom: 30rpx;
    width: 100%;
    padding: 0 50rpx;
    box-sizing: border-box;

    .btn1,
    .btn2 {
        width: 100%;
        height: 90rpx;
        line-height: 90rpx;
        background: #CDB58D;
        border: 1rpx solid #7F663E;
        border-radius: 90rpx;
        color: #7F663E;
    }

    .btn2 {
        text-align: center;
    }

    .btn1 {
        display: flex;
        margin-bottom: 30rpx;

        view {
            width: 50%;
            text-align: center;
        }

        view:nth-of-type(1) {
            border-right: 1rpx solid #7F663E;
        }
    }
}

.content {
    width: 420rpx;
    height: 250rpx;
    padding: 40rpx 0;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
.num {
		font-size: 26rpx;
		margin: 20rpx 0;
		color: #000;
	}

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

.num {
    font-size: 36rpx;
    margin: 20rpx 0;
    color: #000;
    font-weight: 100;
}

.vipProup {
	width: 100%;
	height: 70vh;
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

		.btns1 {
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

		.bottom1 {
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
</style>