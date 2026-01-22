<template>
    <view class="page">
        <view class="titlecon">
            <view class="t1">AI恋爱法庭</view>
            <view class="del">清空</view>
        </view>
        <view class="content">
            <view class="input"><input type="text" placeholder="输入您的昵称" placeholder-style="color:#ffffff;"></view>
            <view>
                <textarea placeholder="输入事件，如发生了什么事" placeholder-style="color:#ffffff;"></textarea>
            </view>
            <view>
                <textarea placeholder="输入问题，如委屈或不适的问题点" placeholder-style="color:#ffffff;"></textarea>
            </view>
            <view class="title">补充材料上传：</view>
            <!-- 照片 -->
            <view class="images">
                <view class="update">
                    <image src="/static/index/bg.png" mode="scaleToFill" />
                    <view class="close"><up-icon name="close" color="#ffffff" size="26"></up-icon></view>
                </view>
                <view class="update">+</view>
            </view>
        </view>
        <view class="bottom">
            <view class="top"> <up-avatar :src="src" size="36"></up-avatar>
                <text>未邀请对方</text>
                <!-- <text>已加入</text> -->

            </view>
            <view class="btn">
                <image :src="$getImg('add/wx')" mode="widthFix" /> 转发邀请
            </view>
        </view>
    </view>
    <!-- 恋爱裁判所弹框  -->
    <IndexProup :show="tishi" @close="tishi = false">
        <template #content>
            <view class="tishi">
                <view class="title">恋爱裁判所</view>
                <scroll-view class="agreement-content" scroll-y>
                    <rich-text v-if="userAgreementContent" :nodes="userAgreementContent"
                        class="richtext-content"></rich-text>
                </scroll-view>
                <view class="btn" @click="handleAgree">去使用</view>
            </view>

        </template>
    </IndexProup>
    <!-- 邀请弹窗 -->
    <up-popup :show="invite" @close="invite = false" @open="invite = true" mode="center">
        <view class="tishi tishi1">
            <view>顺便给Ta带个话儿</view>
            <textarea placeholder="跟TA说说你的想法..."></textarea>
            <view class="btn">
                <button>复制链接去邀请</button>
            </view>
            <view class="cancel">取消</view>
        </view>
    </up-popup>
    <!-- 接受弹窗 -->
    <up-popup :show="invited" @close="invited = false" @open="invited = true" mode="center">
        <view class="tishi tishi1">
            <view> <text style="color:red;margin-right: 20rpx;">用户昵称</text> <text>邀请你加入小法庭</text></view>
            <view class="content1">{{ content }}</view>
            <view class="btn">
                <button>我愿意和你聊聊</button>
            </view>
            <view class="cancel">取消</view>
        </view>
    </up-popup>
    <!-- 删除 -->
    <up-popup :show="showDelPopup" mode="center">
        <view class="del-popup-content">
            <image class="del-popup-icon" src="/static/my/shanchu.png"></image>
            <view class="del-popup-title"> 确定将清空全部内容吗</view>
            <view class="del-popup-actions">
                <view class="del-popup-btn cancel" @click="showDelPopup = false">取消</view>
                <view class="del-popup-btn confirm" @click="confirmDelete">确认</view>
            </view>
        </view>
    </up-popup>
    <!-- 分析 -->
    <IndexProup :show="showProgress" @close="showProgress = false" :cha="true" :height="125">
        <template #content>
            <view class="pcontent">
                <view style="color:#000">法官团审理中...</view>
                <view class="num">正在仔细分析详情...</view>
                <view class="progress-wrapper">
                    <view class="custom-progress">
                        <view class="progress-track">
                            <view class="progress-fill" :style="{ width: progress + '%' }"></view>
                        </view>
                    </view>
                </view>
                <view class="tip">推出后可在“检测记录”中查看</view>
                <view class="btn">退出</view>
            </view>
        </template>
    </IndexProup>
</template>

<script setup>
import IndexProup from '@/components/IndexProup/IndexProup.vue'
import { ref } from 'vue'
const tishi = ref(false)
const userAgreementContent = ref('2222222')
const invite = ref(false)
const invited = ref(false)
const content = ref('hahahahahah')
const src = ref('222')
const showDelPopup = ref(false)
const showProgress = ref(false)
const progress = ref(0)
</script>

<style lang="scss" scoped>
.page {
    margin: 40rpx 25rpx;
}

.pcontent {
    width: 500rpx;
    height: 350rpx;
    padding: 40rpx 0;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .num {
        font-size: 26rpx;
        margin: 20rpx 0;
        color: #000;
    }
     .btn {
        background: #B370FF;
        color: #fff;
        margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 80%;
        border-radius: 80rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
    }

}

.progress-wrapper {
    width: 70%;
    margin: 10rpx auto;
    margin-bottom: 20rpx;
}

.custom-progress {
    width: 100%;
}

.progress-track {
    position: relative;
    width: 100%;
    height: 60rpx;
    background-color: #ffffff;
    border-radius: 40rpx;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #C084FC 0%, #9333EA 100%);
    background-image: repeating-linear-gradient(-45deg,
            #C084FC 0rpx,
            #D4A5F8 3rpx,
            #9333EA 7rpx,
            #9333EA 7rpx,
            #D4A5F8 10rpx,
            #C084FC 10rpx,
            #C084FC 10rpx,
            #D4A5F8 13rpx,
            #9333EA 17rpx,
            #9333EA 17rpx,
            #D4A5F8 20rpx,
            #C084FC 20rpx);
    border-radius: 40rpx;
    transition: width 0.3s ease;
    position: relative;
}

.tip {
    font-size: 20rpx;
    color: #a0a0a0;
    margin-top: 15rpx;
    width: 90%;
    text-align: center;
}

.num {
    font-size: 36rpx;
    margin: 20rpx 0;
    color: #000;
    font-weight: 100;
}

.titlecon {
    width: 100%;

    .t1 {
        width: 100%;
        text-align: center;
    }

    .del {
        position: absolute;
        right: 20rpx;
        top: 40rpx;
        color: rgba(255, 255, 255, 0.5);
    }
}

.tishi {
    width: 600rpx;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 45rpx;
    box-sizing: border-box;
    max-height: 80vh;

    .title {
        font-weight: bold;
        font-size: 36rpx;
        margin-bottom: 30rpx;
        text-align: center;
        width: 100%;
    }

    .agreement-content {
        width: 100%;
        max-height: 600rpx;
        margin-bottom: 20rpx;
        flex: 1;
        overflow-y: auto;
    }

    .richtext-content {
        width: 100%;
        font-size: 28rpx;
        line-height: 1.8;
        // color: rgba(0, 0, 0, 0.85);
        word-wrap: break-word;
    }

    .loading,
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40rpx 0;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.55);
    }

    .btn {
        background: #B370FF;
        color: #fff;
        margin-top: 20rpx;
        height: 90rpx;
        line-height: 90rpx;
        width: 100%;
        border-radius: 90rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;

        button {
            background: transparent;
            color: #FFF;
        }
    }

    .cancel {
        margin-top: 20rpx;
    }

    .disagree-btn {
        margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 28rpx;
    }
}

.content {
    margin: 30rpx 0;
    height: 75vh;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    font-weight: 300;
    overflow-y: scroll;
    padding: 30rpx;
    box-sizing: border-box;

    input {
        text-align: center;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 20rpx;
        height: 110rpx;
        line-height: 110rpx;
        color: #fff;
    }

    textarea {
        margin-top: 20rpx;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 20rpx;
        color: #fff;
        width: 100%;
        padding: 20rpx;
        box-sizing: border-box;
        height: 200rpx;
    }

    .title {
        margin: 30rpx 0;
    }

    .images {
        display: flex;
        flex-wrap: wrap;

        .update {
            background: rgba(255, 255, 255, 0.1);
            width: 30%;
            height: 330rpx;
            border-radius: 15rpx;
            font-size: 100rpx;
            text-align: center;
            line-height: 330rpx;
            margin-right: 3.33%;
            margin-bottom: 20rpx;
            position: relative;
            overflow: hidden;

            image {
                width: 100%;
                height: 100%;
            }

            .close {
                position: absolute;
                right: 10rpx;
                top: 10rpx;
            }
        }

    }
}

.images .update:nth-of-type(3n) {
    margin-right: 0 !important;
}

.bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .top {
        display: flex;
        align-items: center;

        text {
            margin-left: 20rpx;
            color: rgba(255, 255, 255, 0.5);
        }
    }

    .btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1rpx solid rgba(255, 255, 255, 0.17);
        width: 80%;
        height: 90rpx;
        line-height: 90rpx;
        border-radius: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20rpx;

        image {
            width: 50rpx;
            height: 50rpx;
            margin-right: 20rpx;

        }
    }

}

.tishi1 {
    padding: 40rpx 30rpx;
    padding-bottom: 0;

    textarea,
    .content1 {
        width: 100%;
        background: #F0F0F0;
        margin: 20rpx 0;
        border-radius: 20rpx;
        padding: 20rpx;
        box-sizing: border-box;
    }
}

.del-popup-content {
    position: relative;
    width: 560rpx;
    padding: 160rpx 40rpx 48rpx;
    box-sizing: border-box;
    border-radius: 36rpx;
    background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
    box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
    text-align: center;
}

.del-popup-icon {
    position: absolute;
    top: -90rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
}

.del-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 50rpx;
}

.del-popup-actions {
    display: flex;
    gap: 24rpx;
}

.del-popup-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 600;
}

.del-popup-btn.cancel {
    background: #eeedff;
    color: #b370ff;
}

.del-popup-btn.confirm {
    background: #b370ff;
    color: #ffffff;
}
</style>
<style>
.u-safe-bottom {
    height: 0 !important;
}
</style>