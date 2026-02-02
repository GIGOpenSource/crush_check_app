<template>
    <view class="page">
        <view class="top">
            <view class="title" v-if="type">{{ t('mbti.posterTitle') }}</view>
            <view class="title" v-else>{{ details.personality_type }}  {{ details.popular_name }}</view>
            <view class="userinfo1" v-if="type == 'single'"><up-avatar :src="userinfo.user_avatar"
                    size="36"></up-avatar> <text>{{ userinfo.username || t('my.userNickname') }}</text></view>
            <view class="userinfo2" v-if="type == 'double'">
                <view><up-avatar :src="details.mbti_list[0].owner_avatar" size="36"></up-avatar> <text>{{
                    details.mbti_list[0].owner_name || t('my.userNickname') }}</text></view>
                <view> <text>{{ details.mbti_list[0].other_username || t('my.userNickname') }}</text><up-avatar
                        :src="details.mbti_list[0].other_avatar" size="36"></up-avatar></view>
            </view>
        </view>
        <view class="center">
            <Mbtiposter @success="handlePosterSuccess" v-if="type == 'single'" :info="details" />
            <Twombtiposter @success="handlePosterSuccess" v-else-if="type == 'double'" :info="details" />
            <Productposter @success="handlePosterSuccess" v-else :info="details" />
        </view>
        <view class="bottom">
            <view class="btns">
                <view class="share" @click="share">{{ t('mbti.shareResult') }}</view>
                <view @click="topath">{{ t('mbti.backToHome') }}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Mbtiposter from '@/components/Mbtiposter/Mbtiposter.vue';
import Twombtiposter from '@/components/Twombtiposter/Twombtiposter.vue';
import Productposter from '@/components/Productposter/Productposter.vue';
import { onLoad } from '@dcloudio/uni-app'
import { getPosterDetails } from '@/api/index.js'
import { getTemplate } from '@/api/mbti.js'
const { t } = useI18n()
const src = ref('')
const type = ref('')
const details = ref({})
const userinfo = JSON.parse(uni.getStorageSync('userInfo'))
const posterImg = ref('')

// 清理临时文件的函数
const cleanupOldTempFiles = () => {
    try {
        // #ifdef MP-WEIXIN
        const fs = uni.getFileSystemManager()
        if (fs) {
            try {
                let userDataPath = ''
                if (wx && wx.getWindowInfo) {
                    userDataPath = wx.getWindowInfo().pixelRatio ? wx.env.USER_DATA_PATH : ''
                }
                if (!userDataPath && wx && wx.env) {
                    userDataPath = wx.env.USER_DATA_PATH
                }
                if (!userDataPath) {
                    const systemInfo = uni.getSystemInfoSync()
                    userDataPath = systemInfo.USER_DATA_PATH || ''
                }

                if (userDataPath) {
                    fs.readdir({
                        dirPath: userDataPath,
                        success: (res) => {
                            const imageFiles = res.files
                                .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
                                .sort()
                                .slice(0, 30) // 清理更多文件

                            imageFiles.forEach(file => {
                                fs.unlink({
                                    filePath: `${userDataPath}/${file}`,
                                    success: () => { },
                                    fail: () => { }
                                })
                            })
                        },
                        fail: () => { }
                    })
                }
            } catch (e) {
                console.log('清理临时文件异常:', e)
            }
        }
        // #endif
    } catch (e) {
        console.log('清理临时文件失败:', e)
    }
}

onLoad((e) => {
    type.value = e.type
    cleanupOldTempFiles()
    if (e.id) {
        getPosterDetails(e.id).then(res => {
            details.value = res.data
        })
    }
    console.log(e,'eee')
    if(e.temtype){
        getTemplate(e.temtype).then(res => {
            details.value = res.data.results[0]
        })
    }

})

onMounted(() => {
    cleanupOldTempFiles()
})

const topath = () => {
    uni.switchTab({ url: '/pages/index/index' })
}

const handlePosterSuccess = (filePath) => {
    console.log('收到海报路径:', filePath, '类型:', typeof filePath)
    console.log('路径详情:', {
        path: filePath,
        startsWithHttpTmp: filePath?.startsWith('http://tmp/'),
        startsWithFile: filePath?.startsWith('file://'),
        startsWithSlash: filePath?.startsWith('/'),
        isNetworkUrl: filePath?.startsWith('http://') || filePath?.startsWith('https://')
    })
    if (filePath) {
        posterImg.value = filePath
        setTimeout(() => {
            cleanupOldTempFiles()
        }, 2000)
    } else {
        console.error('海报路径为空')
    }
}
//分享
const share = () => {
    if (!posterImg.value) {
        uni.showToast({
            title: t('mbti.posterNotReady'),
            icon: 'none',
            duration: 2000
        })
        return
    }
    
    // #ifdef MP-WEIXIN
    // 判断路径类型：如果是本地临时文件路径（http://tmp/ 或 file:// 开头），直接使用；否则需要下载
    const isLocalTempPath = posterImg.value.startsWith('http://tmp/') || 
                            posterImg.value.startsWith('file://') ||
                            posterImg.value.startsWith('/') ||
                            !posterImg.value.startsWith('http')
    
    console.log('分享路径:', posterImg.value, '是否为本地路径:', isLocalTempPath)
    
    if (isLocalTempPath) {
        // 本地临时文件，直接使用
        const inviterOpenId = uni.getStorageSync("openId") || "";
        const query = `?scene=${inviterOpenId}`
        wx.showShareImageMenu({
            path: posterImg.value,
            entrancePath: `/pages/index/index${query}`,
            complete: (result) => {
                console.log('分享完成:', result)
                if (result.errMsg == 'showShareImageMenu:fail cancel') {
                    // 用户取消分享
                }
            }
        })
    } else {
        // 网络图片，需要先下载
        uni.downloadFile({
            url: posterImg.value,
            success: (res) => {
                console.log('下载成功:', res)
                if (res.statusCode === 200) {
                    const inviterOpenId = uni.getStorageSync("openId") || "";
                    const query = `?scene=${inviterOpenId}`
                    wx.showShareImageMenu({
                        path: res.tempFilePath,
                        entrancePath: `/pages/index/index${query}`,
                        complete: (result) => {
                            console.log('分享完成:', result)
                            if (result.errMsg == 'showShareImageMenu:fail cancel') {
                                // 用户取消分享
                            }
                        }
                    })
                } else {
                    uni.showToast({
                        title: '下载图片失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: (err) => {
                console.error('下载图片失败:', err)
                uni.showToast({
                    title: '下载图片失败，请重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
    // #endif
    
    // #ifdef APP-PLUS
    // APP 环境使用 uni.share
    uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 2,
        imageUrl: posterImg.value,
        success: (res) => {
            console.log('分享成功:', res)
        },
        fail: (err) => {
            console.error('分享失败:', err)
            uni.showToast({
                title: '分享失败，请重试',
                icon: 'none',
                duration: 2000
            })
        }
    })
    // #endif
}

</script>

<style lang="scss" scoped>
.page {
    width: 100%;
}

.top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .title {
        margin: 30rpx 0;
    }

    .userinfo1 {
        display: flex;
        align-items: center;


        text {
            margin-left: 20rpx;
        }
    }

    .userinfo2 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 30rpx;
        box-sizing: border-box;

        view {
            display: flex;
            align-items: center;

            text {
                margin: 0 20rpx;
            }
        }
    }

    text {
        font-size: 26rpx;
    }
}

.center {
    width: 100%;
    height: 80vh;
    overflow-y: scroll;
    padding: 20rpx;
    box-sizing: border-box;
}

.bottom {
    display: flex;
    background: #3F3E49;
    color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 30rpx 60rpx;
    box-sizing: border-box;
    height: 150rpx;

    .btns {
        border: 1rpx solid #fff;
        width: 100%;
        height: 90rpx;
        border-radius: 90rpx;
        display: flex;
        align-items: center;
        line-height: 90rpx;

        view {
            width: 100%;
            height: 100%;
            text-align: center;
        }

        .share {
            border-right: 1rpx solid #fff;
        }

    }
}
</style>