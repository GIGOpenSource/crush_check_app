<template>
    <view class="">
        <up-popup :show="show" mode="center" @close="handleClose" @open="show = true"
            :closeOnClickOverlay="closeOnClickOverlay" :customStyle="{'background':['transparent']}">
            <view class="proup">
                <view class="top">
                    <image :src="$getImg('again/b3')" mode="scaleToFill" />
                    <view class="content">
                        <view class="t1">会员限时优惠！</view>
                        <view class="t2">低至<text>29.9元</text>解锁权益</view>
                         <view class="btn">立即订阅</view>
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
    height: 350rpx;
    position: relative;

    image {
        width: 100%;
        height: 100%;
    }

    .content {
        position: absolute;
        left: 40rpx;
        top: 50rpx;
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .t1 {
            margin-left: 90rpx;
            font-size: 50rpx;
            font-weight: bold;
            font-family: Alimama ShuHeiTi;
            margin-top: 45rpx;
            letter-spacing: 3rpx;
            color: #fff;
            // margin-top: -rpx;
            margin-top: 1rpx;

        }
        .t2{
                 font-size: 40rpx;
              margin: 30rpx 0;
               margin-left: 50rpx;
               text{
                   color: #7f25e6;
                   font-weight: bold;
                   text-decoration: underline;
               }

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
    margin-left: 30rpx;
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