<template>
    <view class="page">
        <view class="top">
            <view class="title">MBTI测试结果</view>
            <view class="userinfo"><up-avatar :src="src" size="36"></up-avatar> <text>用户昵称</text></view>
        </view>
        <view class="center">
          <Mbtiposter/>
        </view>
        <view class="bottom">
            <view class="btns">
                <view class="share">分享结果</view>
                <view @click="topath">返回首页</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import Mbtiposter from '@/components/Mbtiposter/Mbtiposter.vue';
const src = ref('')
const topath = () => {
    uni.switchTab({ url: '/pages/index/index' })
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

    .userinfo {
        display: flex;
        align-items: center;
        font-size: 26rpx;

        text {
            margin-left: 20rpx;
        }
    }
}
.center{
   width: 100%;
   height: 80vh;
   overflow-y: scroll;
   padding:20rpx;
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
        view{
            width: 100%;
            height: 100%;
            text-align: center;
        }
        .share{
             border-right: 1rpx solid #fff;
        }
      
    }
}
</style>