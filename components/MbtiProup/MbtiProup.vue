<template>
    <up-popup :show="show" mode="center" @close="handleClose" @open="show = true"
        :closeOnClickOverlay="closeOnClickOverlay">
        <view class="mbti">
            <view>会员专享开通会员查看结果</view>
            <view class="vip">
                <view class="title">会员特权：</view>
                <view class="view">
                    <view class="border"></view>
                    <view class="text">3种核心题型无次数限制，随时复盘人格状态</view>
                </view>
                <view class="view">
                    <view class="border"></view>
                    <view class="text">其他模块功能畅玩</view>
                </view>
            </view>
            <view class="icons">
                <view class="icon" v-for="(item, index) in icon" :key="index">
                    <image :src="$getImg(item.images)" mode="aspectFill"></image>
                    <view class="title">{{ item.title }}</view>
                </view>
            </view>
            <view class="btns">
                <view class="btn">支付1.00元 开通VIP</view>
                <view class="title">支付1.00元只查看本次结果</view>
            </view>

        </view>
    </up-popup>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    cha: {
        type: Boolean,
        default: false
    },
    closeOnClickOverlay: {
        type: Boolean,
        default: true
    },
    canClose: {
        type: Boolean,
        default: true
    }
})
const icon = [{
    images: 'add/icon1',
    title: '专业量表'
}, {
    images: 'add/icon2',
    title: '性价比高'
}, {
    images: 'add/icon3',
    title: '便捷省心'
}]
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
.mbti {
    width: 580rpx;
    padding: 60rpx 30rpx 50rpx 30rpx;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    color: #000;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;

    .vip {
        background: #EEEEEE;
        margin: 40rpx 0;
        font-size: 28rpx;
        color: #3D3D3D;
        padding: 20rpx 30rpx;
        border-radius: 10rpx;

        .title {
            color: #000;
        }

        .border {
            width: 15rpx;
            height: 15rpx;
            border-radius: 50%;
            background: #9754FF;
            margin-right: 15rpx;
        }

        .view{
            display: flex;
            align-items: center;
            margin-top: 20rpx;
            .text{
                width: 93%;
            }

        }
    }

    .icons {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin: 10rpx 0;

        .icon {
            display: flex;
            flex-direction: column;
            align-items: center;

            image {
                width: 70rpx;
                height: 70rpx;
                margin-bottom: 30rpx;
            }

            .title {
                font-size: 24rpx;
            }
        }
    }
    .btns{
        font-size: 28rpx;
        margin-top: 60rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .btn{
            width: 430rpx;
            height: 90rpx;
            border-radius: 90rpx;
            color: #fff;
            text-align: center;
            line-height: 90rpx;
            background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
        }
        .title{
            color: #9754FF;
            margin-top: 30rpx;
            font-size: 26rpx;
        }
    }
}
</style>