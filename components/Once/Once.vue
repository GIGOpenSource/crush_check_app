<template>
    <view class="">
        <up-popup :show="show" mode="center" @close="handleClose" @open="show = true"
            :closeOnClickOverlay="closeOnClickOverlay" :customStyle="{'background':['transparent']}">
            <view class="proup">
                <view class="top">
                    <image :src="$getImg('again/b4')" mode="scaleToFill" />
                    <view class="content">
                        <view class="t1">单次付费可享</view>
                        <view class="t3">无需开通会员</view>
                        <view class="t4">{{ title }} <image :src="$getImg('again/gantan')" mode="scaleToFill" /></view>
                        <view class="t2">限时价格<text>{{price.limit_price}}元</text> 
                        <!-- <text>，</text> 原价{{price.price}}元 -->
                        
                        </view>
                         <view class="btn" @click="btn">立即体验</view>
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
        default: false
    },
    title:{
         type: String,
        default: ''
    },
    price:{
        type:Object,
        default: ()=>({})
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
const btn = () => {
     emits("pay");
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
        left:0;
        top: 50rpx;
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
            margin-top: -95rpx;

        }
        .t2{
              margin: 30rpx 0;
               color: #7f25e6;
               margin-top: 90rpx;
               text{
                   color:#6e0090;
                   font-weight: bold;
                   text-decoration: underline;
               }

        }
        .t3{
            color: #505050;
            font-size: 26rpx;
            margin: 20rpx 0;
        }
        .t4{
              font-size: 28rpx;
              display: flex;
              align-items: center;
              image{
                width: 50rpx;
                height: 50rpx;
                margin-left: 15rpx;
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
    margin: 0 auto;
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