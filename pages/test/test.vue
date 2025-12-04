<template>
    <view class="page">
        <view>最近测试</view>
        <view class="type">
            <view v-for="(item, index) in tarbar" :key="index" :class="current == index ? 'current' : ''"
                @click="current = index">{{ item.title }}</view>
        </view>
        <view v-if="false">
            <!-- 海报 -->
            <view class="poster">
                <view class="left">
                    <image src="/static/index/answer.png" mode="scaleToFill" />
                </view>
                <view class="right">
                    <view class="num">含渣量：50%</view>
                    <view class="details"> <text>“TA可能是一个提供情绪价值，但拒绝负责的暧昧体验家” </text> <text class="look">查看海报 {{ '>>'
                            }}</text> </view>
                </view>
            </view>
            <!-- 答案之书 -->
            <view class="poster answer">
                <view class="left">
                    <image src="/static/index/answer.png" mode="scaleToFill" />
                </view>
                <view class="right">
                    <view class="num">答案之书的提问内容，具体用户可能舒服的字段</view>
                    <view class="details"> <text style="font-weight: 100;">回答：</text> "机会就在眼前"</view>
                </view>
            </view>
        </view>
        <view class="no-empt">
            <image :src="$getImg('index/no-empt')" mode="widthFix"/>
            <view class="title">目前什么都没有，快去测试吧</view>
            <view class="btn" @click="path">去测试</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
const tarbar = [{ title: '全部' }, { title: '答案之书' }, { title: '鉴渣' }]
const current = ref(0)
const path = () => {
    uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.page {
    width: 100vw;
    height: 100vh;
    padding: 20rpx 25rpx;
    box-sizing: border-box;
    font-weight: 100;
    font-size: 28rpx;
}

.type {
    display: flex;
    margin-top: 20rpx;
    margin-bottom: 40rpx;

    view {
        margin-right: 20rpx;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        padding: 15rpx 30rpx;
        border-radius: 40rpx;
        color: rgba(255, 255, 255, 0.7);
    }

    .current {
        background: #2B2848;
        border: 0.5px solid rgba(255, 255, 255, 0.17);
    }
}

.poster {
    background: rgba(255, 255, 255, 0.1);
    border: 0.5px solid #FFFFFF;
    display: flex;
    align-items: center;
    padding: 20rpx;
    border-radius: 20rpx;
    height: 290rpx;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 20rpx;

    .left {
        width: 30%;
        height: 250rpx;

        image {
            width: 100%;
            height: 100%;
        }
    }

    .right {
        width: 70%;
        font-size: 36rpx;

        .details {
            margin-top: 50rpx;

            font-weight: bold;

            .look {
                position: absolute;
                right: 20rpx;
                bottom: 20rpx;
                font-weight: 100;
                font-size: 30rpx;
            }
        }

        .num {
            margin-top: 10rpx;
        }
    }
}

.answer {
    .num {
        font-weight: bold;
    }

    .left {
        width: 30%;
        height: 250rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        image {
            width: 70%;
            height: 80%;

        }
    }
}
.no-empt{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 25vh;
    image{
        width: 200rpx;
    }
    .title{
        margin: 50rpx 0;
        font-size: 30rpx;
        color: rgba(255, 255, 255, 0.6);
    }
    .btn{
        width: 400rpx;
			height: 90rpx;
			margin: 40rpx auto;
			text-align: center;
			line-height: 90rpx;
			color: #ffffff;
			background: rgba(255, 255, 255, 0.04);
			border: 0.5px solid rgba(255, 255, 255, 0.17);
			border-radius: 80rpx;
			margin-top: 50rpx;
    }
}
</style>