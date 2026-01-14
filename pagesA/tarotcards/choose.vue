<template>
    <view class="page">
        <view class="title">问题：明天会拉屎吗？</view>
         <view class="clickcon" v-if="num == 5" style="margin-top: 15rpx;">
            <view  class="con">
                <view class="clicks">
                    <view  class="number">3</view>
                    <up-icon name="plus" color="#ABAAAF" size="24"></up-icon>
                    <view  class="text">{{ title[1] }}</view>
                </view>
            </view>
        </view>
        <view class="clickcon" :style="num == 1 || num == 3 ?'margin-top: 200rpx;':' margin: 15rpx 0;'">
            <view v-for="(item,index) in num == 5 ? 3:num" :key="index" class="con">
                <view class="t1" v-if="num == 3">{{ times[index + 1] }}</view>
                <view class="clicks">
                    <view v-if="num == 5" class="number">{{ index == 0 ? '1':index == 2 ?'4':'2' }}</view>
                    <up-icon name="plus" color="#ABAAAF" size="24"></up-icon>
                    <view v-if="num == 5" class="text">{{ index == 0 ?title[1]:index == 1 ?title[4]:title[2] }}</view>
                </view>
            </view>
        </view>
         <view class="clickcon" v-if="num == 5">
            <view  class="con">
                <view class="clicks">
                    <view class="number">5</view>
                    <up-icon name="plus" color="#ABAAAF" size="24"></up-icon>
                    <view class="text">{{ title[5] }}</view>
                </view>
            </view>
        </view>
        <view class="bottom">
            <view class="t1">请默念您心中的疑惑，凭直觉开始抽牌</view>
            <view class="card-stack-container">
                <view class="card-item" v-for="(_, index) in 20" :key="index" :style="cardStyle(index)">
                    <view class="img-box">
                        <image class="card-img" src="/static/index/tarotcards.png" mode="aspectFill" />
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed } from 'vue'
const CARD_COUNT = 20
const OVERLAP_RATIO = 0.4
const TOP_INDEX = 10
const num = 5 //牌数
const times = {1:'过去',2:'现在',3:'未来'}
const title = {1:'你的想法',2:'Ta的想法',3:'',4:'双方状态',5:'未来发展'}
const cardRect = computed(() => {
    const maxWidth = 750
    const cardWidth = maxWidth / (CARD_COUNT - (CARD_COUNT - 1) * OVERLAP_RATIO)
    const overlap = cardWidth * OVERLAP_RATIO
    return { cardWidth, overlap }
})
function cardStyle(index) {
    const { cardWidth, overlap } = cardRect.value
    const dist = Math.abs(index - TOP_INDEX)
    const scaleY = 1 - dist * 0.04
    const isDown = index > TOP_INDEX
    const yOffset = isDown ? (index - TOP_INDEX) * 10 : 0
    const x = index == 0 ? 0 : index * (cardWidth - overlap)
    return {
        width: `${cardWidth}rpx`,
        left: `${x}rpx`,
        top: isDown ? `${yOffset}rpx` : '0',
        bottom: isDown ? 'auto' : '0',
        transform: `scaleY(${scaleY})`,
        transformOrigin: isDown ? 'top center' : 'bottom center',
        zIndex: index
    }
}
</script>

<style lang="scss" scoped>
.page {
    height: 96vh;
    margin: 20rpx 25rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 300;
}

.title {
    margin-top: 50rpx;
    font-size: 30rpx;
}

.clickcon {
    width: 85%;
    display: flex;
    justify-content: space-around;
    

    .con {
        display: flex;
        flex-direction: column;
        align-items: center;
        .t1{
            margin-bottom: 10rpx;
            color: rgba(255, 255, 255, 0.52);
            font-size: 26rpx;
        }
    }

    .clicks {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.56);
        width: 160rpx;
        height: 260rpx;
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.52);
        .number{
           margin-bottom: 20rpx;
        }
        .text{
            margin-top: 20rpx;
        }
    }
}


.bottom {
    position: fixed;
    left: -10rpx;
    bottom: -40rpx;
    width: 100%;
    height: 300rpx;
    font-size: 22rpx;

    .t1 {
        text-align: center;
        width: 100%;
        margin-top: 20rpx;
        color: rgba(255, 255, 255, 0.52);
    }

    .card-stack-container {
        position: relative;
        width: 750rpx;
        margin: 50rpx auto;

        .card-item {
            position: absolute;
            top: 0;
            height: 235rpx;
            border-radius: 6rpx;

            .img-box {
                width: 150rpx;
                height: 100%;

                .card-img {
                    width: 110%;
                    height: 100%;
                }
            }

        }
    }
}
</style>