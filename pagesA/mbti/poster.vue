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
import { onLoad, onUnload } from '@dcloudio/uni-app'
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