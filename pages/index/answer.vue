<template>
    <view class="page">
        <view class="title">{{ t('answerBook.thinkQuestion') }}</view>
        <view>{{ t('answerBook.clickBook') }}</view>
        <view>{{ t('answerBook.getAnswer') }}</view>
        <view class="rich">
            <view class="textarea-wrapper">
                <up-textarea v-model="value1" :maxlength="30" height="150" :count="true" 
                    @focus="handleFocus" @blur="handleBlur"></up-textarea>
                <view v-if="!value1 && !isFocused" class="custom-placeholder">
                    <text>{{ t('answerBook.placeholder') }}</text>
                    <text>{{ t('answerBook.example') }}</text>
                </view>
            </view>
        </view>
        <view class="btn" @click="path">{{ t('answerBook.startBook') }}</view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow , onHide} from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const value1 = ref('');
const isFocused = ref(false);

onShow(() => {
    value1.value =  uni.getStorageSync('question') || '';
});

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
    if(!value1.value.trim()){
        uni.showToast({
            title: t('answerBook.pleaseInputQuestion'),
            icon: 'none'
        });
        return;
    }
    uni.setStorageSync('question', value1.value.trim());
    uni.reLaunch({
        url: '/pages/index/choosebook'
    });
};
</script>

<style lang="scss" scoped>
.page {
    height: 96vh;
    margin: 20rpx 25rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 1rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 100;

    view {
        line-height: 50rpx;
    }

    // justify-content: center;
}

.title {
    margin-top: 200rpx;
}

.rich {
    width: 90%;
    margin-top: 80rpx;
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
    color: #fff;
    font-size: 30rpx;
    line-height: 1.8;
    z-index: 1;
}

.custom-placeholder text {
    display: block;
}

.btn {
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid rgba(255, 255, 255, 0.17);
    height: 100rpx;
    line-height: 100rpx !important;
    border-radius: 100rpx;
    width: 75%;
    text-align: center;
    margin-top: 80rpx;
    font-weight: 100;

}
</style>
<style>
.u-textarea {
    background: rgba(255, 255, 255, 0.1) !important;
}

.u-textarea__count.data-v-31706dd7 {
    background: transparent !important;
}

.u-textarea__field.data-v-31706dd7 {
    color: #FFF !important;
}

/* 支持 placeholder 换行 */
.u-textarea__field.data-v-31706dd7::placeholder,
.u-textarea__field::placeholder,
textarea::placeholder {
    white-space: pre-line !important;
    line-height: 1.5 !important;
}
</style>