<template>
    <view class="page">
        <view class="title">{{ t('tarot_input_question_title') }}</view>
        <view class="rich">
            <view class="textarea-wrapper">
                <up-textarea v-model="value1" :maxlength="300" :count="true" height="100" @focus="handleFocus"
                    @blur="handleBlur"></up-textarea>
                <view v-if="!value1 && !isFocused" class="custom-placeholder">
                     <text>{{ t('tarot_input_question_placeholder') }}</text>
                </view>
            </view>
        </view>
        <view class="titlecon">
             <view class="t1">{{ t('tarot_spread_select_title') }}</view>
            <view>{{ t('tarot_spread_select_tip1') }}</view>
            <view>{{ t('tarot_spread_select_tip2') }}</view>
        </view>
        <view v-for="(item, index) in list" :key="index" :class="item.num == num ? 'list current' : 'list'"
            @click="num = item.num">
            <view class="left">
                <image :src="$getImg(item.img)" />
                <view>
                    <view class="t2">{{ item.t1 }}</view>
                    <view>{{ item.t2 }}</view>
                    <view>{{ item.t3 }}</view>
                </view>
            </view>
            <view class="right">
                 {{ item.num }}{{ t('tarot_card_unit') }}
            </view>
        </view>
        <view class="btn" @click="path">{{ t('tarot_draw_card_btn') }}</view>
    </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { onShow, onHide, onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const num = ref(-1)
import { getUserInfo } from '@/api/login.js'
const list = [{
    t1: t('tarot_spread_single_title'),
    t2: t('tarot_spread_single_desc1'),
    t3: t('tarot_spread_single_desc2'),
    img: 'index/tarotcards',
    num: 1
}, {
    t1: t('tarot_spread_three_title'),
    t2: t('tarot_spread_three_desc1'),
    t3: t('tarot_spread_three_desc2'),
    img: 'index/three',
    num: 3

}, {
    t1: t('tarot_spread_relation_title'),
    t2: t('tarot_spread_relation_desc1'),
    t3: t('tarot_spread_relation_desc2'),
    img: 'index/fire',
    num: 5

}]
const value1 = ref('');
const isFocused = ref(false);
onLoad(() => {
    uni.setNavigationBarTitle({
        title: t('tarot_name')
    });
    const storedValue = uni.getStorageSync('question') || '';
    // 确保从存储读取的值也不超过300字符
    value1.value = storedValue.length > 300 ? storedValue.substring(0, 300) : storedValue;
})

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
};

// 使用 watch 监听值变化，手动限制输入长度
// 解决安卓微信小程序中 up-textarea 组件的 maxlength 属性不生效的问题
watch(value1, (newVal) => {
    const maxLength = 300;
    if (newVal && newVal.length > maxLength) {
        value1.value = newVal.substring(0, maxLength);
    }
});
const path = async () => {
    if (!uni.getStorageSync('token')) {
        uni.navigateTo({
            url: "/pages/login/login"
        })
        return
    }
    let openid = uni.getStorageSync('openId')
     let res = await getUserInfo(openid)
     if(res.code !== 200) return
    if (!value1.value.trim()) {
        uni.showToast({
            title: t('answerBook.pleaseInputQuestion'),
            icon: 'none'
        });
        return;
    }
    if (num.value == -1) {
        uni.showToast({
            title: t('tarot_please_select_spread'),
            icon: 'none'
        });
        return;
    }
   
    uni.setStorageSync('question', value1.value.trim());
    uni.navigateTo({
        url: '/pagesA/tarotcards/choose?num=' + num.value
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
    margin-top: 50rpx;
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
    margin: 50rpx 0;
    font-size: 24rpx;
    font-weight: 100;
    margin-bottom: 30rpx;

    .t1 {
        font-size: 28rpx;
        font-weight: 350;
        margin-bottom: 20rpx;

    }
}

.list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    margin-top: 20rpx;
    padding: 20rpx 0;
    border-radius: 20rpx;
    font-size: 22rpx;
    width: 93%;

    image {
        width: 140rpx;
        height: 120rpx;
        margin: 0 15rpx;
    }

    .left {
        display: flex;
        align-items: center;

        .t2 {
            font-size: 28rpx;
            font-weight: 350;
        }

    }

    .right {
        margin-right: 20rpx;
    }
}



.current {
    background: #2B2848;
}

.btn {
    background: rgba(255, 255, 255, 0.04);
    height: 95rpx;
    line-height: 95rpx !important;
    border-radius: 95rpx;
    width: 62%;
    text-align: center;
    margin-top: 40rpx;
    font-weight: 200;
    border: 0.5px solid rgba(255, 255, 255, 0.17);
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
    color: #fff !important;
}

/* 支持 placeholder 换行 */
.u-textarea__field.data-v-31706dd7::placeholder,
.u-textarea__field::placeholder,
textarea::placeholder {
    white-space: pre-line !important;
    line-height: 1.5 !important;
}
</style>