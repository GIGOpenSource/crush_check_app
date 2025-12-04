<template>
    <view class="page">
        <view class="top" @click="back()"><up-icon name="arrow-left" color="#7F663E" size="24"></up-icon>{{ status == 1?'返回修改问题':'返回' }}</view>
        <view class="btns" v-if="status == 1">
            <view class="btn1">
                <view>告诉TA</view>
                <view>再次提问</view>
            </view>
            <view class="btn2" @click="status = 2">AI分析</view>
        </view>
    </view>
</template>

<script setup>
import {ref} from 'vue'
const status = ref('1')
const back = () => {
    if(status.value == 1){
       uni.navigateBack()
    }else if(status.value == 2){
        status.value = 1
    }
   
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
    padding: 30rpx 20rpx;
    position: relative;
}

.top {
    display: flex;
    align-items: center;
    color: #7F663E;
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
    .btn2{
        text-align: center;
    }
    .btn1{
        display: flex;
        margin-bottom: 30rpx;
        view{
            width: 50%;
            text-align: center;
        }
        view:nth-of-type(1){
            border-right: 1rpx solid #7F663E;
        }
    }
}
</style>