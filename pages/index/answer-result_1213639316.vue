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
            <text>{{ isdetails ? t('answerBook.back') : status == 1 ? t('answerBook.backToModify') :
                t('answerBook.back') }}</text>
        </view>

        <view class="content-wrapper" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }">
            <image :src="status == 1 ? details.image_url : details.deepimages" />
            <view class="btns" v-if="status == 1">
                <view class="btn1">
                    <view @click="save">{{ t('answerBook.tellTA') }}</view>
                    <view @click="again">{{ t('answerBook.askAgain') }}</view>
                </view>
                <view style="height: 30rpx;"></view>
                <view class="btn2" :class="{ 'btn-disabled': details.children_status === 'waiting' }"
                    @click="aidetails">
                    {{ details.children_status === 'waiting' ? t('answerBook.aiAnalyzing') : t('answerBook.aiAnalysis')
                    }}
                </view>
            </view>
        </view>
    </view>

    <IndexProup :show="showProgress" @close="handleProgressClose" :cha="true" :height="125">
        <template #content>
            <view class="content">
                <view class="num">{{ t('index.analyzingPercent') }} {{ progress }}{{ t('index.analyzingPercentUnit') }}
                </view>
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

    <!-- 解锁本次报告 -->
    <up-popup :show="showDelPopup2" mode="center">
        <view class="del-popup-content">
            <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
            <view class="title">{{ t('answerBook.unlockAnalysis') }}</view>
            <view class="del-popup-actions">
                <view @click="pay">{{ mouth.price }}{{ t('answerBook.payNow') }}</view>
            </view>
            <view class="icon" @click="showDelPopup2 = false">
                <up-icon name="close-circle" color="#ffffff" size="30"></up-icon>
            </view>
        </view>
    </up-popup>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { getAnswerbook, getPosterDetails, getProducts, mockOrder, freeReport, iosOrder } from '@/api/index.js';
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
const mouth = ref({})
const showDelPopup2 = ref(false)
const userinfo = ref({ allow_count: 0 })
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
    getProducts().then(res => {
        mouth.value = res.data.results.filter(item => item.product_type == 'ios_answer_once')[0]
    })
    // 获取用户信息
    const openId = uni.getStorageSync('openId')
    if (openId) {
        getUserInfo(openId).then(res => {
            if (res.data) {
                userinfo.value = res.data
                uni.setStorageSync('userInfo', JSON.stringify(res.data))
            }
        })
    }
})

const back = () => {
    if (isdetails.value) return uni.navigateBack()
    if (status.value == 2) {
        status.value = 1
    } else {
        uni.reLaunch({ url: '/pages/index/answer' })
    }

}
onLoad((op) => {
    console.log(op, 'ooo')
    id.value = op.id
    isdetails.value = op.details || false

    // 初始化用户信息
    const storedUserInfo = uni.getStorageSync('userInfo')
    if (storedUserInfo) {
        try {
            userinfo.value = JSON.parse(storedUserInfo)
        } catch (e) {
            console.error('解析用户信息失败', e)
        }
    }

    if (isdetails.value) {
        getPosterDetails(id.value).then(res => {
            details.value = res.data;
            details.value.image_url = res.data.file_url
            details.value.deepimages = res.data.child_list[0]?.file_url
            details.value.poster_id = res.data.id
            // 设置 children_status，用于按钮状态判断
            details.value.children_status = res.data.children_status || ''
        })
    } else {
        details.value.image_url = op.url
        details.value.poster_id = op.parent_id
        details.value.children_status = ''
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
                const inviterOpenId = uni.getStorageSync("openId") || "";
                const query = `?scene=${inviterOpenId}`
                uni.share({
                    provider: "weixin",
                    scene: "WXSceneSession",
                    type: 2,
                    href: `https://crashcheck.net/h5/${query}`,
                    imageUrl: res.tempFilePath,
                    success: function (res) {
                        console.log("success:" + JSON.stringify(res));
                    },
                    fail: function (err) {
                        console.log("fail:" + JSON.stringify(err));
                    }
                });
            }
        }
    })

}
const aidetails = () => {
    if (details.value.deepimages) {
        status.value = 2
        showDelPopup2.value = false
        return
    }
    getPosterDetails(details.value.poster_id).then(res => {
        let status = res.data.children_status
        if (status == 'error') {
            submit()
        } else if (status == 'done') {
            details.value = res.data;
            details.value.image_url = res.data.file_url
            details.value.deepimages = res.data.child_list[0]?.file_url
            details.value.poster_id = res.data.id
            // 更新 children_status
            details.value.children_status = 'done'
        } else if (status == 'waiting') {
            details.value.children_status = 'waiting'
            uni.showToast({
                title: t('answerBook.aiAnalyzing'),
                icon: 'none'
            })
        } else if (!status) {
            showDelPopup2.value = true
        }

    })

    return

}
const submit = () => {
    details.value.children_status = 'waiting'
    showProgress.value = true
    progress.value = 0
    if (progressTimer.value) {
        clearInterval(progressTimer.value)
        progressTimer.value = null
    }
    progressTimer.value = setInterval(() => {
        if (progress.value >= 99) {
            clearInterval(progressTimer.value)
            progressTimer.value = null
            return
        }
        progress.value++
    }, 20)
    let params = {
        answerId: isdetails.value ? details.value.prompt_template.id : id.value,
        parent_id: details.value.poster_id,
        user_question: isdetails.value ? details.value.summary : uni.getStorageSync('question')
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
                // 重置等待状态
                details.value.children_status = ''
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
                    // 请求成功，清除等待状态（按钮会隐藏，但清除状态以防万一）
                    details.value.children_status = ''
                }, 500)
            } else {
                showProgress.value = false
                progress.value = 0
                // 请求失败，重置等待状态，允许重试
                details.value.children_status = ''
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
    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.platform === 'ios') {
        iosOrder({
            description: mouth.value.description,
            openId: uni.getStorageSync('openId'),
            productId: mouth.value.id,
            posterId: details.value.poster_id
        })
            .then(res => {
                console.log(res.data, 'eeee')
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
                                uni.showToast({
                                    title: t('proPoster.paySuccess'),
                                    icon: 'none'
                                });
                                showDelPopup2.value = false
                                submit()

                            },
                            fail: (err) => {
                                 uni.showToast({
                                title: t('proPoster.payFailed'),
                                icon: 'none'
                            })
                                showDelPopup2.value = false
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
                showDelPopup2.value = false
            })
    } else {
        mockOrder({
            description: mouth.value.description,
            openId: uni.getStorageSync('openId'),
            productId: mouth.value.id,
            posterId: details.value.poster_id
        })
            .then(res => {
                showDelPopup2.value = false
                submit()
            })
            .catch(err => {
                showDelPopup2.value = false
            })
    }

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

        &.btn-disabled {
            background: rgba(205, 181, 141, 0.5);
            color: rgba(127, 102, 62, 0.5);
            pointer-events: none;
            opacity: 0.6;
        }
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