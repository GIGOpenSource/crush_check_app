<template>
    <view class="page">
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }" v-if="!showAdInPopup && !pageReady">
            <view class="navbar-content">
                <view class="navbar-title">{{ t('answerBook.title') }}</view>
            </view>
        </view>
        <view class="content-wrapper" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }" v-if="!showAdInPopup && !pageReady">
            <view class="top" @click="back()">
                <up-icon name="arrow-left" color="#ffffff" size="24"></up-icon>
                <text>{{ t('answerBook.backToModify') }}</text>
            </view>
            <view class="title">
                <view>{{ question }}</view>
            </view>
            <view class="images">
                <block v-for="(item, index) in list" :key="index">
                    <view class="image-container" :class="{ 'flipping': item.show }">
                        <view class="image-wrapper">
                            <image :src="$getImg('index/answer')" @click="choose(item.id, index)" class="image-front" />
                            <image :src="$getImg('index/change')" class="image-back" />
                        </view>
                    </view>
                </block>
            </view>
        </view>
        <!-- 解锁本次报告 -->
        <up-popup :show="showDelPopup2" mode="center">
            <view class="del-popup-content">
                <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
                <view class="title1">今日免费次数已用完</view>
                <view class="del-popup-actions">
                    <view @click="pay">{{ mouth.price }}{{ t('answerBook.payNow') }}</view>
                    <view @click="watchAdInPopup">看广告免费解锁本次</view>
                </view>
                <view class="icon" @click="showDelPopup2 = false">
                    <up-icon name="close-circle" color="#ffffff" size="30"></up-icon>
                </view>
            </view>
        </up-popup>
        <view v-if="showAdInPopup && pageReady" class="ad-popup-wrapper">
            <ad-rewarded-video adpid="1213639316" :loadnext="true" v-slot:default="{ loading, error }" @load="onadload"
                @close="onadclose" @error="onaderror">
                <button :disabled="loading" :loading="loading" class="ad-button">观看广告</button>
                <view v-if="error" class="ad-error">{{ error }}</view>
            </ad-rewarded-video>
        </view>

    </view>
</template>

<script setup>
import { getBook, getAnswerbook } from '@/api/index.js';
import {
    host
} from '@/config/config.js'
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getProducts, createOrder } from '@/api/index.js';
import { getUserInfo } from '@/api/login.js';
const { t } = useI18n();
const list = ref([]);
const question = uni.getStorageSync('question');
const statusBarHeight = ref(0)
const pageReady = ref(false)
const showAd = ref(false)
const showDelPopup2 = ref(false) // 解锁弹窗
const showAdInPopup = ref(false) // 弹窗内是否显示广告
const pendingChooseParams = ref(null) // 存储待执行的choose参数
const mouth = ref({})
// 获取用户信息，处理可能为空的情况
let userinfo = null
try {
    const userInfoStr = uni.getStorageSync('userInfo')
    if (userInfoStr) {
        userinfo = JSON.parse(userInfoStr)
    }
} catch (e) {
    console.error('解析用户信息失败:', e)
}

// 获取今天的日期字符串
const getTodayKey = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// 获取今天已使用的免费次数
const getTodayFreeCount = () => {
    const todayKey = getTodayKey()
    const countKey = `answerBook_free_count_${todayKey}`
    const count = uni.getStorageSync(countKey) || 0
    return parseInt(count)
}

// 增加今天已使用的免费次数
const incrementTodayFreeCount = () => {
    const todayKey = getTodayKey()
    const countKey = `answerBook_free_count_${todayKey}`
    const currentCount = getTodayFreeCount()
    uni.setStorageSync(countKey, currentCount + 1)
}

// 获取最新的用户信息
const getLatestUserInfo = () => {
    try {
        const userInfoStr = uni.getStorageSync('userInfo')
        if (userInfoStr) {
            return JSON.parse(userInfoStr)
        }
    } catch (e) {
        console.error('解析用户信息失败:', e)
    }
    return null
}

// 检查是否需要看广告
const needWatchAd = () => {
    // 获取最新的用户信息
    const latestUserInfo = getLatestUserInfo()
    // 如果是VIP，不需要看广告
    if (latestUserInfo && latestUserInfo.is_vip) {
        console.log('VIP用户，不需要看广告')
        return false
    }
    // 普通用户每天免费3次，等于或超过3次需要看广告
    const todayCount = getTodayFreeCount()
    const needAd = todayCount >= 3
    console.log('检查是否需要看广告:', { todayCount, needAd })
    return needAd
}

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = systemInfo.windowWidth / 375 * 2 || 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx

    getBook().then(res => {
        list.value = res.data.map(item => {
            return {
                ...item,
                show: false
            }
        })
    })
    getProducts().then(res => {
        mouth.value = res.data.results.filter(item => item.product_type == 'vip')[0]
    })
})

const back = () => {
    uni.navigateBack()
}
const choose = (id, index) => {
    // 获取最新的用户信息
    const latestUserInfo = getLatestUserInfo()
    const todayCount = getTodayFreeCount()

    console.log('choose 被调用:', { id, index, isVip: latestUserInfo?.is_vip, todayCount })

    // 判断是否需要看广告
    // 1. 如果是VIP用户，不需要看广告
    // 2. 如果是普通用户，检查今天已使用的免费次数
    // 3. 普通用户每天免费3次，等于或超过3次需要看广告
    if (needWatchAd()) {
        console.log('需要看广告，显示解锁弹窗')
        // 需要看广告：显示解锁弹窗
        pendingChooseParams.value = { id, index }
        showDelPopup2.value = true
        return
    }

    console.log('不需要看广告，直接执行')
    // 不需要看广告（VIP用户或普通用户免费次数未满），直接执行
    executeChoose(id, index)
}



// 执行选择操作
const executeChoose = (id, index, isFromAd = false) => {
    list.value[index].show = true

    // 获取最新的用户信息
    const latestUserInfo = getLatestUserInfo()
    // 如果是普通用户且不是通过广告使用，增加免费次数
    // 通过广告使用的不计入免费次数
    if ((!latestUserInfo || !latestUserInfo.is_vip) && !isFromAd) {
        incrementTodayFreeCount()
    }

    let params = { answerId: id, user_question: uni.getStorageSync('question') }
    uni.request({
        url: host + '/answerbook/generate_image/',
        data: params,
        header: {
            token: uni.getStorageSync('token'),
            "Accept-Language": uni.getStorageSync('currentLanguage') || 'zh'
        },
        method: 'GET',
        timeout: 1500000,
        complete: (data) => {
            if (data.data.code == 403) {
                uni.navigateTo({
                    url: "/pages/login/login"
                })
                return
            }
            if (data.data.code == 200) {
                uni.redirectTo({ url: '/pages/index/answer-result?id=' + id + '&url=' + data.data.data.image_url + '&parent_id=' + data.data.data.poster_id })
            } else {

            }
        }
    });
}
const onadload = (e) => {
    console.log(e, 'eee')
    console.log('广告数据加载成功')
}
const watchAdInPopup = () => {
    showAdInPopup.value = true
    pageReady.value = true
    showDelPopup2.value = false
    setTimeout(() => {
        showAd.value = true
        console.log('弹窗内广告组件已准备')
    }, 100)
}
const onadclose = (e) => {
    const detail = e.detail
    // 用户点击了【关闭广告】按钮
    if (detail && detail.isEnded) {
        // 正常播放结束，允许继续操作
        console.log("广告播放完成");
        showAd.value = false
        showAdInPopup.value = false
        showDelPopup2.value = false

        // 执行之前保存的choose操作（标记为通过广告使用）
        if (pendingChooseParams.value) {
            const { id, index } = pendingChooseParams.value
            executeChoose(id, index, true) // true 表示通过广告使用
            pendingChooseParams.value = null
        }
    } else {
        // 播放中途退出，不执行操作
        console.log("广告播放中断");
        showAd.value = false
        showAdInPopup.value = false
        pendingChooseParams.value = null
    }
}

const onaderror = (e) => {
    console.log('onaderror:', e.detail)
    // 如果广告加载失败，隐藏广告组件避免持续报错
    if (e.detail && e.detail.errMsg && e.detail.errMsg.includes('parent')) {
        showAd.value = false
    }
}
// 支付
const pay = () => {
    createOrder({
        description: mouth.value.description,
        openId: uni.getStorageSync('openId'),
        productId: mouth.value.id,
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
                    icon: 'none'
                })
                showDelPopup2.value = false
                submit()

            },
            fail(e) {
                uni.showToast({
                    title: t('proPoster.payFailed'),
                    icon: 'none'
                })
                showDelPopup2.value = false
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

.ad-button {
    width: 300rpx;
    height: 80rpx;
    background: #007AFF;
    color: #ffffff;
    border-radius: 10rpx;
    border: none;
    font-size: 32rpx;
}

.ad-error {
    color: #ff3b30;
    font-size: 24rpx;
    margin-top: 20rpx;
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

    .title1 {
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

.ad-popup-wrapper {
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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



.content-wrapper {
    margin: 0 25rpx 20rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 1rpx solid #FFFFFF;
    border-radius: 10rpx;
    padding: 20rpx;
    overflow-y: auto;
    position: relative;

    .top {
        position: absolute;
        left: 20rpx;
        top: 20rpx;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 28rpx;
        z-index: 998;

        text {
            margin-left: 10rpx;
        }
    }
}

.title {
    width: 450rpx;
    height: 200rpx;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-top: 160rpx;
    line-height: 50rpx;
    text-align: center;
}

.images {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 90rpx;

    .image-container {
        width: 31%;
        height: 280rpx;
        margin-bottom: 20rpx;
        perspective: 1000rpx; // 3D透视效果

        .image-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 3s ease-in-out;

            image {
                width: 100%;
                height: 100%;
                position: absolute;
                backface-visibility: hidden;
            }

            .image-front {
                transform: rotateY(0deg);
            }

            .image-back {
                transform: rotateY(180deg);
            }
        }

        &.flipping .image-wrapper {
            transform: rotateY(180deg);
        }
    }
}
</style>