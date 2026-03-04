<template>
    <view class="page">
        <view class="look" @click="path('look')">{{ t('loveCourt.viewMaterials') }}</view>
        <view class="top">
            <text class="title">{{ t('loveCourt.title') }}</text>
        </view>
        <view class="content">
            <view v-if="!posterImg && !posterError" class="poster-loading">
                <view class="loading-spinner"></view>
                <text>{{ t('loveCourt.posterGenerating') }}</text>
            </view>
            <Loveposter @success="handlePosterSuccess" @fail="handlePosterFail" :info="details" />
        </view>
        <view class="bottom">
            <view class="border">
                <view @click="path('share')">{{ t('loveCourt.shareResult') }}</view>
                <view @click="path('again')">{{ t('loveCourt.tryAgain') }}</view>
                <view class="back" @click="path('back')">{{ t('loveCourt.backHome') }}</view>
            </view>
        </view>
         <InvitationFriend :show="friend" @close="friend = false" :imageUrl="posterImg" :downloadUrl="posterImg" />
    </view>
</template>

<script setup>
import Loveposter from '@/components/Loveposter/Loveposter.vue';
import { ref ,onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import { getPosterDetails } from '@/api/index.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import InvitationFriend from '@/components/InvitationFriend/InvitationFriend.vue'
const { t } = useI18n()
const posterImg = ref('');
const posterError = ref(false);
const details = ref({});
const id = ref('')
const friend = ref(false)
onLoad((e) => {
    if (e.id) {
        getPosterDetails(e.id).then(res => {
            details.value = res.data
            const c = details.value.content || {}
            // 问题原因分析、最终判决、和解方案、法官建议：把 /n 或 \n 转为实际换行，供 Loveposter 按行渲染
            const toLineBreak = (s) => (s || '').replace(/\/n/g, '\n').replace(/\\n/g, '\n')
            if (c.analysis !== undefined) c.analysis = toLineBreak(c.analysis)
            if (c.verdict !== undefined) c.verdict = toLineBreak(c.verdict)
            if (c.resolution !== undefined) c.resolution = toLineBreak(c.resolution)
            if (c.judge_advice !== undefined) c.judge_advice = toLineBreak(c.judge_advice)
        })
    }
    id.value = e.id

})

const handlePosterSuccess = (filePath) => {
    if (filePath) {
        posterImg.value = filePath
        posterError.value = false
        cleanupOldTempFiles()
    } else {
        console.error('海报路径为空')
        posterError.value = true
    }
}
// 仅保留：页面卸载时全量清理文件（兼容目录不存在/无文件的情况）
const cleanupOldTempFiles = async () => {
    try {
        const fs = wx.getFileSystemManager();

        // 核心容错：获取文件列表失败时直接返回，不中断流程
        let fileList = [];
        try {
            const fileListRes = await new Promise((resolve, reject) => {
                fs.getSavedFileList({ success: resolve, fail: reject });
            });
            fileList = fileListRes.fileList || [];
        } catch (err) {
            // 目录不存在/无文件时，打印提示并跳过删除步骤
            console.log('无已保存文件，无需清理：', err.errMsg);
            return;
        }

        // 遍历删除所有文件（有文件才执行）
        if (fileList.length > 0) {
            for (const file of fileList) {
                try {
                    await new Promise((resolve, reject) => {
                        fs.unlink({ filePath: file.filePath, success: resolve, fail: reject });
                    });
                    console.log(`清理文件成功：${file.filePath}`);
                } catch (err) {
                    console.warn(`清理单个文件失败（忽略）：${file.filePath}`);
                }
            }
            console.log('所有文件清理完成');
        }
    } catch (err) {
        console.error('文件清理流程异常（不影响页面）：', err.errMsg);
    }
};

const handlePosterFail = (error) => {
    console.error('海报生成失败:', error)
    posterError.value = true
}
const path = (type) => {
    if (type == 'share') {
        if (!posterImg.value) {
            uni.showToast({
                title: t('mbti.posterNotReady'),
                icon: 'none',
                duration: 2000
            })
            return
        }
       friend.value = true
    } else if (type == 'again') {
        uni.redirectTo({ url: '/pagesA/loveCourt/index' })
    } else if (type == 'back') {
        uni.switchTab({ url: '/pages/index/index' })
    } else if (type == 'look') {
        uni.navigateTo({ url: '/pagesA/loveCourt/materail?id=' + id.value })
    }
}
onUnload(() => {
    cleanupOldTempFiles()
})
// 页面加载时清理
onMounted(() => {
    cleanupOldTempFiles()
})
</script>

<style lang="scss" scoped>
.page {
    padding: 20rpx 30rpx;
}

.top {
    width: 100%;
    text-align: center;
}

.look {
    position: absolute;
    top: 135rpx;
    right: 60rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.5);
    z-index: 999;
}

.content {
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    width: 100%;
    height: 82vh;
    margin-top: 30rpx;
    box-sizing: border-box;
    overflow-y: scroll;
    background: #2a2935;
    position: relative;

    .poster-loading {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        background: #12111F !important;
        z-index: 10;
        border-radius: 10rpx;

        .loading-spinner {
            width: 60rpx;
            height: 60rpx;
            border: 4rpx solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20rpx;
        }

        text {
            color: #fff;
            font-size: 32rpx;
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #3F3E49;
    padding: 30rpx 60rpx;
    box-sizing: border-box;
    font-weight: 300;
    font-size: 28rpx;

    .border {
        border: 1px solid rgba(255, 255, 255, 0.3);
        width: 100%;
        display: flex;
        height: 90rpx;
        border-radius: 90rpx;

        view {
            width: 33.33%;
            text-align: center;
            line-height: 90rpx;
            border-right: 0.5rpx solid rgba(255, 255, 255, 0.3);
        }

        .back {
            border: none;
        }
    }
}
</style>