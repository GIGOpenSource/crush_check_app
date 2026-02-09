<template>
    <view class="page">
        <view class="top">
            <view class="title" v-if="type">{{ t('mbti.posterTitle') }}</view>
            <view class="title" style="font-size:32rpx" v-else>{{ details.personality_type }} {{ details.popular_name }}
            </view>
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
            <view v-if="!posterImg && !posterError" class="poster-loading">
                <view class="loading-spinner"></view>
                <text>{{ t('mbti.posterGenerating') }}</text>
            </view>
            <Mbtiposter @success="handlePosterSuccess" @fail="handlePosterFail" v-if="type == 'single'" :info="details" />
            <Twombtiposter @success="handlePosterSuccess" @fail="handlePosterFail" v-else-if="type == 'double'" :info="details" />
            <Productposter @success="handlePosterSuccess" @fail="handlePosterFail" v-else :info="details" />
        </view>
        <view class="bottom">
            <view class="btns">
                <view class="share" @click="share">{{ t('mbti.shareResult') }}</view>
                <view @click="topath">{{ t('mbti.backToHome') }}</view>
            </view>
        </view>
         <InvitationFriend :show="friend" @close="friend = false" :imageUrl="posterImg" :downloadUrl="posterImg" />
    </view>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Mbtiposter from '@/components/Mbtiposter/Mbtiposter.vue';
import Twombtiposter from '@/components/Twombtiposter/Twombtiposter.vue';
import Productposter from '@/components/Productposter/Productposter.vue';
import { onLoad, onUnload, onShow } from '@dcloudio/uni-app'
import { getPosterDetails } from '@/api/index.js'
import { getTemplate } from '@/api/mbti.js'
import InvitationFriend from '@/components/InvitationFriend/InvitationFriend.vue'
const { t } = useI18n()
const src = ref('')
const type = ref('')
const details = ref({})
const userinfo = JSON.parse(uni.getStorageSync('userInfo'))
const posterImg = ref('')
const posterError = ref(false)
const friend = ref(false)

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
// 页面加载时清理
onMounted(() => {
    cleanupOldTempFiles()
})

// 页面显示时也清理（每次进入页面时）
onShow(() => {
    cleanupOldTempFiles()
})

// 页面卸载时清理
onUnload(() => {
    cleanupOldTempFiles()
})

onLoad((e) => {
    type.value = e.type

    if (e.id) {
        getPosterDetails(e.id).then(res => {
            details.value = res.data
        })
    }
    console.log(e, 'eee')
    if (e.temtype) {
        getTemplate(e.temtype).then(res => {
            details.value = res.data.results[0]
        })
    }

})



const topath = () => {
    uni.switchTab({ url: '/pages/index/index' })
}

const handlePosterSuccess = (filePath) => {
    if (filePath) {
        posterImg.value = filePath
        posterError.value = false
        // 海报生成成功后立即清理旧文件
        cleanupOldTempFiles()
    } else {
        console.error('海报路径为空')
        posterError.value = true
    }
}

const handlePosterFail = (error) => {
    console.error('海报生成失败:', error)
    posterError.value = true
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
    friend.value = true
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