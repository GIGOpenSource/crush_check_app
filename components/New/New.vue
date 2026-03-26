<template>
    <view class="">
        <up-popup :show="show" mode="center" @close="handleClose" @open="show = true"
            :closeOnClickOverlay="closeOnClickOverlay" :customStyle="{'background':['transparent']}">
            <view class="proup">
                <view class="top">
                    <image :src="$getImg('again/b5')" mode="scaleToFill" />
                    <view class="content">
                        <view class="t1">拉新有礼</view>
                        <view class="t3">邀请1位好友登录注册</view>
                        <view class="t4">解锁单次体验</view>
                        <view class="t2">MBTI专业版</view>
                         <view class="btn">立即分享</view>
                    </view>
                </view>
               
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
</script>

<style lang="scss" scoped>
.proup {
   
    color: #000;
    background: transparent !important;
}

.top {
    width: 75vw;
    margin: 0 auto;
    height: 500rpx;
    position: relative;

    image {
        width: 100%;
        height: 100%;
    }

    .content {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        .t1 {
            font-size: 50rpx;
            font-weight: bold;
            font-family: Alimama ShuHeiTi;
            margin-top: 45rpx;
            letter-spacing: 3rpx;
            color: #fff;
            margin-top: -20rpx;

        }
        .t2{
              margin: 40rpx 0;
               background: #586bd8;
               color: #fff;
               padding: 10rpx 30rpx;
               border-radius: 40rpx;
               font-size: 28rpx;


        }
        .t3{
            color: #505050;
            font-size: 28rpx;
            margin: 20rpx 0;

        }
        .t4{
              font-size: 28rpx;
              display: flex;
              align-items: center;
               text-decoration: underline;
        }

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
    margin: 0 auto;
    margin-top: 50rpx;
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