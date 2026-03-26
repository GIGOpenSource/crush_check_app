<template>
    <view class="">
        <up-popup :show="show" mode="center" @close="handleClose" @open="show = true"
            :closeOnClickOverlay="closeOnClickOverlay">
            <view class="proup">
                <view class="top">
                    <image :src="$getImg('again/b2')" mode="scaleToFill" />
                    <view class="content">
                        <view class="t1">限时优惠</view>
                        <view class="t2">享受15项权益</view>
                        <view class="t3">
                             <image :src="$getImg('again/suo')" mode="scaleToFill" />
                             <text>升级会员可解锁本次报告</text>
                        </view>
                        <view class="t3">
                             <image :src="$getImg('again/user')" mode="scaleToFill" />
                             <text>最低价格仅需0.8/天</text>
                        </view>
                    </view>
                </view>
                <image :src="$getImg('again/white')" mode="scaleToFill" class="white" />
                <view class="images">
                    <view v-for="(item, index) in list" :key="index">
                        <image :src="$getImg(`again/icon${index + 1}`)" mode="scaleToFill" />
                        <text>{{ item }}</text>
                    </view>
                </view>
                <view class="btn" @click="path">立即升级</view>
                <view class="title">邀请1人解锁本次</view>
            </view>
            <view class="icon" @click="handleClose"> <up-icon name="close-circle" color="#ffffff" size="30"></up-icon></view>

        </up-popup>

    </view>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(["update:show", "close"])
const handleClose = () => {
    if (!props.canClose) {
        return;
    }
    emits("close");
    emits("update:show", false);
}
const list = ['鉴渣', '爱的裁判所', 'MBTI', '塔罗牌', '答案之书']
const path = () => {
    uni.navigateTo({ url: '/pagesA/vip/index' })
}
</script>

<style lang="scss" scoped>
.proup {
    background: linear-gradient(180deg, #AEA5FE 0%, #E8DDFC 100%);
    color: #000;
    padding: 20rpx;
    border-radius: 20rpx;
    padding-left: 5rpx;
}

.top {
    width: 90%;
    margin: 0 auto;
    height: 350rpx;
    margin-top: -200rpx;
    position: relative;

    image {
        width: 100%;
        height: 100%;
    }

    .content {
        position: absolute;
        left: 0;
        top: 50rpx;
        z-index: 999;

        .t1 {
            margin-left: 100rpx;
            font-size: 50rpx;
            font-weight: bold;
            font-family: Alimama ShuHeiTi;
            margin-top: 45rpx;
            letter-spacing: 3rpx;

        }
        .t2{
              margin-left: 270rpx;
              color: #F9CEAE;
              font-size: 26rpx;
              margin-top: 10rpx;

        }
        .t3{
            display: flex;
            align-items: center;
            font-size: 24rpx;
            color: #3D3D3D;
            margin-left: 50rpx;
            margin-top: 20rpx;
            image{
                width: 30rpx;
                height: 30rpx;
                margin-right: 20rpx;
            }
        }
    }
}

.white {
    width: 100%;
    height: 40rpx;
    margin: 20rpx 0;
}

.images {
    display: flex;

    image {
        width: 100%;
        height: 110rpx;
        margin-bottom: 15rpx;
    }

    view {
        display: flex;
        width: 110rpx;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        margin-left: 15rpx;
    }

    text {
        text-align: center;
    }
}

.btn {
    width: 280rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 80rpx;
    text-align: center;
    background: linear-gradient(269deg, #B370FF 39%, #6273FD 119%);
    color: #fff;
    font-size: 30rpx;
    margin: 30rpx auto;
}

.title {
    text-align: center;
    width: 100%;
    color: #7F25E6;
    font-size: 24rpx;
    text-decoration: underline;
    padding-bottom: 20rpx;
}
.icon {
	position: absolute;
	transform: translateX(-50%);
	left: 50%;
	bottom: -80rpx;
	color: #000;
	cursor: pointer;
	
	&.icon-disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}
</style>