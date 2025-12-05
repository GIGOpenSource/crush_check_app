<template>
    <view class="page">
        <view class="top" @click="back()"><up-icon name="arrow-left" color="#ffffff" size="24"></up-icon>返回修改问题</view>
        <view class="title">
            <!-- <view>在这里写下你的困惑或愿望</view> -->
            <view>{{ question }}</view>
        </view>
        <view class="images">
            <image v-for="(item,index) in list" :key="index" :src="$getImg('index/answer')" @click="choose(item.id)"/>
        </view>
    </view>
</template>

<script setup>
import { getBook } from '@/api/index.js';
import { onMounted ,ref} from 'vue';
const list = ref([]);
const question = uni.getStorageSync('question');
const back = () => {
    uni.navigateBack()
}
onMounted(() => {
    getBook().then(res => {
        list.value = res.data;
    })
})
const choose = (id) => {
    console.log(111111)
    uni.navigateTo({
        url: '/pages/index/answer-result?id='+id
    })
}
</script>

<style lang="scss" scoped>
.page {
    height: 96vh;
    margin: 20rpx 25rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 1rpx solid #FFFFFF;
    border-radius: 10rpx;
    font-weight: 100 !important;
    padding: 20rpx;
}

.top {
    display: flex;
    align-items: center;
}

.title {
    width: 450rpx;
    display: flex;
    flex-direction: column;
    margin: 160rpx auto;
    line-height: 50rpx;
    text-align: center;
}
.images{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 150rpx;
    image{
        width: 31%;
        height: 280rpx;
        margin-bottom: 20rpx;
    }

}
</style>