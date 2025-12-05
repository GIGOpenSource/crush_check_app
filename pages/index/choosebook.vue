<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
            <view class="navbar-content">
                <view class="navbar-title">答案之书</view>
            </view>
        </view>



        <view class="content-wrapper" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }">
            <view class="top" @click="back()">
                <up-icon name="arrow-left" color="#ffffff" size="24"></up-icon>
                <text>返回修改问题</text>
            </view>
            <view class="title">
                <!-- <view>在这里写下你的困惑或愿望</view> -->
                <view>{{ question }}</view>
            </view>
            <view class="images">
                <image v-for="(item, index) in list" :key="index" :src="$getImg('index/answer')"
                    @click="choose(item.id)" />
            </view>
        </view>
    </view>
</template>

<script setup>
import { getBook } from '@/api/index.js';
import { onMounted, ref } from 'vue';
const list = ref([]);
const question = uni.getStorageSync('question');
const statusBarHeight = ref(0)

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = systemInfo.windowWidth / 375 * 2 || 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx

    getBook().then(res => {
        list.value = res.data;
    })
})

const back = () => {
    uni.navigateBack()
}
const choose = (id) => {
    console.log(111111)
    uni.navigateTo({
        url: '/pages/index/answer-result?id=' + id
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

    image {
        width: 31%;
        height: 280rpx;
        margin-bottom: 20rpx;
    }
}
</style>