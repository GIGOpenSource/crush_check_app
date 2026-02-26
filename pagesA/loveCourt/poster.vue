<template>
    <view class="page">
    <view class="look" @click="path('look')">查看资料</view>
        <view class="top">
            <text class="title">爱的裁判所</text>
        </view>
        <view class="content">
            <Loveposter @success="handlePosterSuccess" @fail="handlePosterFail" :info="details"/>
        </view>
        <view class="bottom">
            <view class="border">
                <view @click="path('share')">分享结果</view>
                <view @click="path('again')">再来一次</view>
                <view class="back" @click="path('back')">返回首页</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import Loveposter from '@/components/Loveposter/Loveposter.vue';
import { ref } from 'vue';
import { getPosterDetails } from '@/api/index.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
const posterImg = ref('');
const posterError = ref(false);
const details = ref({});
const id = ref('')
onLoad((e) => {
    if (e.id) {
        getPosterDetails(e.id).then(res => {
            details.value = res.data
        })
    }
    id.value = e.id

})

const handlePosterSuccess = (filePath) => {
    if (filePath) {
        posterImg.value = filePath
        posterError.value = false
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
        const inviterOpenId = uni.getStorageSync("openId") || "";
        const query = `?scene=${inviterOpenId}`
        wx.showShareImageMenu({
            path: posterImg.value,
            entrancePath: `/pages/index/index${query}`,
            complete: (res) => {
                if (res.errMsg == 'showShareImageMenu:fail cancel') {
                    // share_fail()

                } else {
                    // share_success()

                }
            }
        })
    } else if (type == 'again') {
        uni.redirectTo({ url: '/pagesA/loveCourt/index' })
    } else if (type == 'back') {
        uni.switchTab({ url: '/pages/index/index' })
    } else if(type == 'look'){
        uni.navigateTo({ url: '/pagesA/loveCourt/materail?id='+id.value })
    }
}
onUnload(() => {
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
.look{
    position: absolute;
    top: 135rpx;
    right: 60rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.5);
}
.content {
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    max-height: 82vh;
    margin-top: 30rpx;
    box-sizing: border-box;
    overflow-y: scroll;
    background: #2a2935;
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