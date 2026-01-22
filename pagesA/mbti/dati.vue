<template>
    <view class="page">
        <view class="titlecon">
            <view class="t1">MBTI测试 (版本) <text>1/144</text> </view>
            <view class="t2">提示：请根据您的第一反应选择，无需过度思考。 所有题目均需回答才能生成准确报告。</view>
        </view>
        <view class="content">
            <view class="con" v-for="(item, index) in 6">
                <view>01 这里是一个问题</view>
                <view class="borderwrapper">
                    <view v-for="(item, index) in 5"></view>
                </view>
                <view class="status">
                    <text>非常不同意</text>
                    <text>非常同意</text>
                </view>
            </view>
        </view>
        <view class="btns">
            <!-- <view class="btn1">下一页</view> -->
            <view class="btn2">
                <view>上一页</view>
                <view>下一页</view>
            </view>
        </view>
    </view>
</template>

<script setup>

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
    overflow-y: scroll;
}

.titlecon {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20rpx 60rpx;

    .t1 {
        margin-top: 40rpx;
        text{
           position: absolute;
           right: 50rpx;
           top: 85rpx;
           font-size: 24rpx;
        }
    }

    .t2 {
        font-size: 26rpx;
        text-align: center;
        margin-top: 30rpx;
        line-height: 38rpx;
    }
}

.content {
    width: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
    height: 70%;
    overflow-y: scroll;

    .con {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        padding: 30rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .status {
            font-size: 28rpx;
            display: flex;
            justify-content: space-between;
        }

        .borderwrapper {
            margin: 40rpx 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            view {
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
            }

            view:nth-of-type(1),
            view:nth-of-type(5) {
                width: 50rpx;
                height: 50rpx;

            }

            view:nth-of-type(2),
            view:nth-of-type(4) {
                width: 35rpx;
                height: 35rpx;

            }

            view:nth-of-type(3) {
                width: 20rpx;
                height: 20rpx;

            }
        }
    }
}

.btns {
    width: 90%;
    margin: 40rpx auto;
    .btn1 {
        width: 80%;
        height: 95rpx;
        line-height: 95rpx;
        border-radius: 95rpx;
        background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
        text-align: center;
        margin: 0 auto;
    }
    .btn2{
        display: flex;
        justify-content: space-between;
        view{
            background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
               width: 45%;
        height: 95rpx;
         text-align: center;
         line-height: 95rpx;
         border-radius: 95rpx;
        }
    }
}
</style>