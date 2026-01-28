<template>
    <view class="page">
        <view class="top">
            <view class="title">{{ t('mbti.posterTitle') }}</view>
            <!-- <view class="userinfo1"><up-avatar :src="src" size="36"></up-avatar> <text>{{ t('my.userNickname') }}</text></view> -->
            <view class="userinfo2">
                <view><up-avatar :src="src" size="36"></up-avatar> <text>{{ t('my.userNickname') }}</text></view>
                <view> <text>{{ t('my.userNickname') }}</text><up-avatar :src="src" size="36"></up-avatar></view>
            </view>
        </view>
        <view class="center">
            <!-- <Mbtiposter /> -->
            <Twombtiposter  @success="handlePosterSuccess"/>
        </view>
        <view class="bottom">
            <view class="btns">
                <view class="share">{{ t('mbti.shareResult') }}</view>
                <view @click="topath">{{ t('mbti.backToHome') }}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Mbtiposter from '@/components/Mbtiposter/Mbtiposter.vue';
import Twombtiposter from '@/components/Twombtiposter/Twombtiposter.vue';
const { t } = useI18n()
const src = ref('')


const topath = () => {
    uni.switchTab({ url: '/pages/index/index' })
}

const handlePosterSuccess = (filePath) => {
    console.log(filePath,'eeee')   
}

</script>

<style lang="scss" scoped>
.page {
    width: 100%;
}

.top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .title {
        margin: 30rpx 0;
    }

    .userinfo1 {
        display: flex;
        align-items: center;
        

        text {
            margin-left: 20rpx;
        }
    }

    .userinfo2 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 30rpx;
        box-sizing: border-box;

        view {
            display: flex;
            align-items: center;

            text {
                margin:0 20rpx;
            }
        }
    }
    text{
        font-size: 26rpx;
    }
}

.center {
    width: 100%;
    height: 80vh;
    overflow-y: scroll;
    padding: 20rpx;
    box-sizing: border-box;
}

.bottom {
    display: flex;
    background: #3F3E49;
    color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 30rpx 60rpx;
    box-sizing: border-box;
    height: 150rpx;

    .btns {
        border: 1rpx solid #fff;
        width: 100%;
        height: 90rpx;
        border-radius: 90rpx;
        display: flex;
        align-items: center;
        line-height: 90rpx;

        view {
            width: 100%;
            height: 100%;
            text-align: center;
        }

        .share {
            border-right: 1rpx solid #fff;
        }

    }
}
</style>