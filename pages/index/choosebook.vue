<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
            <view class="navbar-content">
                <view class="navbar-title">答案之书</view>
            </view>
        </view>



        <view class="content-wrapper" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }">
            <view class="top" @click="back()">
                <up-icon name="arrow-left" color="#ffffff" size="24"></up-icon>
                <text>返回修改问题</text>
            </view>
            <view class="title">
                <!-- <view>在这里写下你的困惑或愿望</view> -->
                <view>{{ question }}</view>
            </view>
            <view class="images">
                <block v-for="(item, index) in list" :key="index">
                    <view class="image-container" :class="{ 'flipping': item.show }">
                        <view class="image-wrapper">
                            <image :src="$getImg('index/answer')" @click="choose(item.id, index)" class="image-front" />
                            <image :src="$getImg('index/change')" class="image-back" />
                        </view>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script setup>
import { getBook, getAnswerbook } from '@/api/index.js';
import {
    host
} from '@/config/config.js'
import { onMounted, ref } from 'vue';
const list = ref([]);
const question = uni.getStorageSync('question');
const statusBarHeight = ref(0)

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = systemInfo.windowWidth / 375 * 2 || 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx

    getBook().then(res => {
        list.value = res.data.map(item => {
            return {
                ...item,
                show: false
            }
        })
    })
})

const back = () => {
    uni.navigateBack()
}
const choose = (id, index) => {
    list.value[index].show = true
    let params = { answerId: id, user_question: uni.getStorageSync('question') }
    uni.request({
        url: host + '/answerbook/generate_image/', //仅为示例，并非真实接口地址。
        data: params,
        header: {
            token: uni.getStorageSync('token'),
            "Accept-Language": uni.getStorageSync('currentLanguage') || 'zh'
        },
        method: 'GET',
        timeout: 1500000,
        complete: (data) => {
            if (data.data.code == 403) {
                uni.navigateTo({
                    url: "/pages/login/login"
                })
                return
            }
            if (data.data.code == 200) {
                  uni.navigateTo({
                        url: '/pages/index/answer-result?id=' + id + '&url=' + data.data.data.image_url + '&parent_id='+ data.data.data.poster_id
                    });
            } else {

            }
        }
    });


}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background: #12111f;
    font-weight: 100 !important;
    overflow: hidden;
}

.custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #12111f;

    .navbar-content {
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;

        .navbar-title {
            font-size: 32rpx;
            font-weight: 500;
            color: #ffffff;
        }
    }
}



.content-wrapper {
    margin: 0 25rpx 20rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 1rpx solid #FFFFFF;
    border-radius: 10rpx;
    padding: 20rpx;
    overflow-y: auto;
    position: relative;

    .top {
        position: absolute;
        left: 20rpx;
        top: 20rpx;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 28rpx;
        z-index: 998;

        text {
            margin-left: 10rpx;
        }
    }
}

.title {
    width: 450rpx;
    height: 200rpx;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-top: 160rpx;
    line-height: 50rpx;
    text-align: center;
}

.images {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 90rpx;

    .image-container {
        width: 31%;
        height: 280rpx;
        margin-bottom: 20rpx;
        perspective: 1000rpx; // 3D透视效果

        .image-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 3s ease-in-out;

            image {
                width: 100%;
                height: 100%;
                position: absolute;
                backface-visibility: hidden;
            }

            .image-front {
                transform: rotateY(0deg);
            }

            .image-back {
                transform: rotateY(180deg);
            }
        }

        &.flipping .image-wrapper {
            transform: rotateY(180deg);
        }
    }
}
</style>