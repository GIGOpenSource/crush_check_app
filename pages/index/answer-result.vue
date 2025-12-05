<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
            <view class="navbar-content">
                <view class="navbar-title">答案之书</view>
            </view>
        </view>
        
        <view class="top" :style="{ top: (statusBarHeight + 88 + 40) + 'rpx' }" @click="back()">
            <up-icon name="arrow-left" color="#7F663E" size="24"></up-icon>
            <text>{{ isdetails ? '返回':status == 1 ? '返回修改问题' : '返回' }}</text>
        </view>
        
        <view class="content-wrapper" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }">
            <image :src="status == 1 ? details.image_url:details.deepimages" />
            <view class="btns" v-if="status == 1">
                <view class="btn1">
                    <view @click="save">告诉TA</view>
                    <view @click="again">再次提问</view>
                </view>
                <view class="btn2" @click="aidetails">AI分析</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAnswerbook,getPosterDetails ,getAi} from '@/api/index.js';
const status = ref('1')
const id = ref('')
const details = ref({})
const isdetails = ref(false)
const statusBarHeight = ref(0)

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = systemInfo.windowWidth / 375 * 2 || 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx
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
    getAi({
        answerId:id.value,
        parent_id:details.value.poster_id,
        user_question:uni.getStorageSync('question')
    })
    .then(res => {
        details.value.deepimages = res.data.image_url
        status.value = 2
        
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
</style>