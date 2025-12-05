<template>
    <view class="page">
        <view class="top" @click="back()"><up-icon name="arrow-left" color="#7F663E" size="24"></up-icon>{{ status ==
            1 ?'返回修改问题':'返回' }}</view>
        <image :src="details.image_url" />
        <view class="btns" v-if="status == 1">
            <view class="btn1">
                <view @click="save">告诉TA</view>
                <view @click="again">再次提问</view>
            </view>
            <view class="btn2" @click="status = 2">AI分析</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAnswerbook } from '@/api/index.js';
const status = ref('1')
const id = ref('')
const details = ref({})
const back = () => {
     uni.reLaunch({ url: '/pages/index/answer' })
}
onLoad((op) => {
    id.value = op.id
    getAnswerbook({ answerId: id.value, user_question: uni.getStorageSync('question') }).then(res => {
        details.value = res.data;
    })
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
</script>

<style lang="scss" scoped>
.page {
    height: 96vh;
    margin: 20rpx 25rpx;
    box-sizing: border-box;
    background: #d1c1a7;
    border-radius: 10rpx;
    font-weight: 100 !important;
    // padding: 30rpx 20rpx;
    position: relative;
}

.top {
    display: flex;
    align-items: center;
    color: #7F663E;
    position: absolute;
    left: 20rpx;
    top: 20rpx;
}

image {
    width: 100%;
    height: 100%;
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