<template>
    <view class="page">
        <view class="top">
            <view class="title">{{ t('mbti.posterTitle') }}</view>
            <!-- <view class="userinfo1"><up-avatar :src="src" size="36"></up-avatar> <text>{{ t('my.userNickname') }}</text></view> -->
            <view class="userinfo2">
                <view><up-avatar :src="src" size="36"></up-avatar> <text>{{ t('my.userNickname') }}</text></view>
                <view> <text>{{ t('my.userNickname') }}</text><up-avatar :src="src" size="36"></up-avatar></view>
            </view>
        </view>
        <view class="center">
            <!-- <Mbtiposter :key="posterKey" /> -->
            <Twombtiposter :key="posterKey" @success="handlePosterSuccess"/>
        </view>
        <view class="bottom">
            <view class="btns">
                <view class="share">{{ t('mbti.shareResult') }}</view>
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
const { t } = useI18n()
const src = ref('')
const posterKey = ref(Date.now()) 
const oldTempFiles = ref([])

// 页面加载时重新生成key，确保每次都是新实例
onMounted(() => {
    posterKey.value = Date.now()
})

const topath = () => {
    uni.switchTab({ url: '/pages/index/index' })
}

const handlePosterSuccess = (filePath) => {
    if (oldTempFiles.value.length > 0) {
        oldTempFiles.value.forEach(oldPath => {
            try {
                // 删除旧的临时文件
                // #ifdef APP-PLUS || H5
                const fs = uni.getFileSystemManager()
                if (fs && fs.unlink) {
                    fs.unlink({
                        filePath: oldPath,
                        success: () => {
                            console.log('已删除旧临时文件:', oldPath)
                        },
                        fail: (err) => {
                            // 文件可能不存在或已被清理，忽略错误
                            console.log('删除文件失败（可能已不存在）:', err)
                        }
                    })
                }
                // #endif
                // #ifdef MP
                // 小程序环境下，临时文件会自动清理，不需要手动删除
                // #endif
            } catch (e) {
                console.log('清理临时文件异常:', e)
            }
        })
        oldTempFiles.value = []
    }
    
    // 记录当前文件路径，下次生成时清理
    if (filePath) {
        oldTempFiles.value.push(filePath)
    }
    
    // 重新生成key，确保下次进入页面时使用新的组件实例
    setTimeout(() => {
        posterKey.value = Date.now()
    }, 2000)
}
onUnmounted(() => {
    // 清理所有临时文件
    oldTempFiles.value.forEach(filePath => {
        try {
            // #ifdef APP-PLUS || H5
            const fs = uni.getFileSystemManager()
            if (fs && fs.unlink) {
                fs.unlink({
                    filePath: filePath,
                    success: () => {
                        console.log('组件卸载时清理临时文件:', filePath)
                    },
                    fail: () => {}
                })
            }
            // #endif
            // #ifdef MP
            // 小程序环境下，临时文件会自动清理
            // #endif
        } catch (e) {
            console.log('清理临时文件异常:', e)
        }
    })
    oldTempFiles.value = []
})
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
                margin:0 20rpx;
            }
        }
    }
    text{
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