<template>
    <view class="page">
        <view class="title">输入你心中的问题</view>
        <view class="rich">
            <view class="textarea-wrapper">
                <up-textarea v-model="value1" :maxlength="300" :count="true" height="100"  @focus="handleFocus" @blur="handleBlur"></up-textarea>
                    <view v-if="!value1 && !isFocused" class="custom-placeholder">
                    <text>请清晰、具体地描述你的问题，这将有助于获得更准确的解读</text>
                </view>
            </view>
        </view>
        <view class="titlecon">
            <view class="t1">选择排阵</view>
            <view>不同的牌阵适用于不同的类型问题，请</view>
            <view>根据你的问题选择哦～</view>
        </view>
         <view v-for="(item, index) in list" :key="index" :class="item.num == num ? 'list current':'list'" @click="num = item.num">
                <view class="left">
                    <image :src="$getImg('index/tarotcards')" mode="scaleToFill" />
                    <view>
                        <view class="t2">{{ item.t1 }}</view>
                        <view>{{ item.t2 }}</view>
                        <view>{{ item.t3 }}</view>
                    </view>
                </view>
                <view class="right">
                    {{item.num}}张
                </view>
            </view>
        <view class="btn" @click="path">开始抽牌</view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow, onHide, onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const num = ref(-1)
const list = [{
    t1:'单张牌阵',
    t2:'适用于简单问题或每日运势',
    t3:'快速获取答案',
    num:1
},{
    t1:'三张牌阵',
    t2:'基于过去、现在、未来，了解问题',
    t3:'的发展脉络',
    num:3

},{
    t1:'关系牌阵',
    t2:'专门用于人机关系、情感问题',
    t3:'全面分析',
    num:5

}]
const value1 = ref('');
const isFocused = ref(false);
onLoad(() => {
    uni.setNavigationBarTitle({
        title: '塔罗牌'
    });
    value1.value = uni.getStorageSync('question') || '';
})

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
};
const path = () => {
    if (!uni.getStorageSync('token')) {
        uni.navigateTo({
            url: "/pages/login/login"
        })
        return
    }
    if (!value1.value.trim()) {
        uni.showToast({
            title: t('answerBook.pleaseInputQuestion'),
            icon: 'none'
        });
        return;
    }
    uni.setStorageSync('question', value1.value.trim());
    uni.navigateTo({
        url: '/pagesA/tarotcards/choose'
    });
};
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

.rich {
    width: 90%;
    margin-top: 30rpx;
    position: relative;
}

.textarea-wrapper {
    position: relative;
    width: 100%;
}
.custom-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 150rpx;
    padding: 20rpx;
    box-sizing: border-box;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: rgba(255, 255, 255, 0.4);

    font-size: 30rpx;
    // line-height: 1.8;
    z-index: 1;
}

.custom-placeholder text {
    display: block;
}
.titlecon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 40rpx 0;
    font-size: 24rpx;
    font-weight: 100;
    margin-bottom: 10rpx;

    .t1 {
        font-size: 28rpx;
        font-weight: 350;
        margin-bottom: 20rpx;

    }
}
.list{
    display: flex;
    justify-content: space-between;
    align-items: center;
   background: rgba(255, 255, 255, 0.1);
    margin-top: 20rpx;
    padding: 10rpx 0;
    border-radius: 20rpx;
    font-size: 22rpx;
    width: 93%;
    image{
        width: 140rpx;
        height: 120rpx;
    }
    .left{
        display: flex;
        align-items: center;
        .t2{
            font-size: 28rpx;
            font-weight: 350;
        }
    }
    .right{
        margin-right: 20rpx;
    }
}
.current {
      background: #2B2848;
   }
.btn {
    background: rgba(255, 255, 255, 0.04);
    height: 90rpx;
    line-height: 90rpx !important;
    border-radius: 90rpx;
    width: 62%;
    text-align: center;
    margin-top: 20rpx;
    font-weight: 200;
    font-size: 26rpx;

}
</style>
<style>
.u-textarea {
    background: rgba(255, 255, 255, 0.1) !important;
}

.u-textarea__count {
    background: transparent !important;
}

.u-textarea__field {
    color:#fff !important;
}

/* 支持 placeholder 换行 */
.u-textarea__field.data-v-31706dd7::placeholder,
.u-textarea__field::placeholder,
textarea::placeholder {
    white-space: pre-line !important;
    line-height: 1.5 !important;
}
</style>