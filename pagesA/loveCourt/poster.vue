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
// 清理旧海报文件，只保留最新的一个（支持小程序和APP）
const cleanupOldTempFiles = async () => {
  try {
    const currentPath = posterImg.value; // 当前最新的文件路径
    
    // #ifdef MP-WEIXIN
    // 小程序端清理
    const fs = uni.getFileSystemManager();
    if (fs) {
      try {
        const fileListRes = await new Promise((resolve, reject) => {
          fs.getSavedFileList({ success: resolve, fail: reject });
        });
        const fileList = fileListRes.fileList || [];
        
        if (fileList.length > 0) {
          // 按创建时间排序，最新的在前
          const sortedFiles = fileList.sort((a, b) => (b.createTime || 0) - (a.createTime || 0));
          
          // 找到当前文件
          const currentFile = sortedFiles.find(file => file.filePath === currentPath);
          
          // 只保留最新的一个文件（当前文件或最新的）
          const fileToKeep = currentFile || sortedFiles[0];
          
          // 删除除了要保留的文件之外的所有文件
          sortedFiles.forEach((file) => {
            if (file.filePath !== fileToKeep.filePath) {
              fs.removeSavedFile({
                filePath: file.filePath,
                success: () => {
                  console.log('已清理旧海报文件:', file.filePath);
                },
                fail: () => {
                  // 忽略删除失败
                }
              });
            }
          });
        }
      } catch (err) {
        console.log('获取文件列表失败（可能无文件）：', err.errMsg || err);
      }
    }
    // #endif
    
    // #ifdef APP-PLUS
    // APP端清理
    if (typeof plus !== 'undefined' && plus.io) {
      const tempDirPath = '_doc/uniapp_temp';
      await new Promise((resolve) => {
        plus.io.resolveLocalFileSystemURL(tempDirPath, (dirEntry) => {
          if (dirEntry.isDirectory) {
            const reader = dirEntry.createReader();
            const allEntries = [];
            
            const readAllEntries = () => {
              reader.readEntries((entries) => {
                if (entries.length > 0) {
                  allEntries.push(...entries);
                  readAllEntries();
                } else {
                  // 读取完成，清理旧文件
                  const imageFiles = allEntries.filter(entry => {
                    const name = entry.name || '';
                    return /\.(jpg|jpeg|png|gif)$/i.test(name);
                  });
                  
                  if (imageFiles.length > 0) {
                    // 按文件名排序（通常包含时间戳），新的在前
                    imageFiles.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                    
                    // 如果当前文件存在，只保留它；否则保留最新的一个
                    const currentFile = imageFiles.find(entry => {
                      const fullPath = `${tempDirPath}/${entry.name}`;
                      return fullPath === currentPath || entry.name === currentPath.split('/').pop();
                    });
                    
                    const fileToKeep = currentFile || imageFiles[0];
                    
                    imageFiles.forEach(fileEntry => {
                      // 如果不是要保留的文件，删除它
                      if (fileEntry.name !== fileToKeep.name) {
                        fileEntry.remove(() => {
                          console.log('已清理旧海报文件:', fileEntry.name);
                        }, () => {
                          // 忽略删除失败
                        });
                      }
                    });
                  }
                  resolve();
                }
              }, () => {
                resolve();
              });
            };
            readAllEntries();
          } else {
            resolve();
          }
        }, () => {
          resolve();
        });
      });
    }
    // #endif
  } catch (err) {
    console.error('文件清理流程异常（不影响页面）：', err);
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