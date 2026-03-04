<template>
    <view class="page">
        <view class="top">
            <view class="title">
                <view>我的星座：</view>
                <view class="choose"> 选择你的星座 <text>{{ '>' }}</text> </view>
            </view>
            <view class="totay">
                <text>今日心情：</text>
                <text><text class="num">82</text>分</text>
            </view>
            <view class="desc">今天有点不知道自己为何而奋斗，缺少动力.</view>
            <view class="process">
                <view v-for="(item, index) in processlist" class="processlist" :key="index">
                    <view class="jindu" :style="`height:${item.percent * 2}rpx`"></view>
                    <view class="name">{{ item.name }}</view>
                    <view class="percent">{{ item.percent }}</view>
                </view>
            </view>
        </view>
        <view class="tarbarlist">
            <view v-for="(item, index) in tarbarlist" :key="index" class="list">
                <view class="top1">
                    <view>{{ item.title }}</view>
                    <image :src="$getImg('constellation/back')" mode="scaleToFill" />
                </view>
                <view class="desc1">{{ item.desc }}</view>
                <view class="status-badge">
                  <text class="status-badge-text">HOT</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
const processlist = ref([{
    percent: 100,
    name: '爱情'
    ,
}, {
    percent: 78,
    name: '财富'
}, {
    percent: 50
    ,
    name: '事业'
}, {
    percent: 60,
    name: '学习'
}, {
    percent: 40,
    name: '人脉'
}]) //星座

const tarbarlist = ref([
    {
        title: '答案之书',
        desc: '闭眼默念问题，随机翻页得答案'
    }, {
        title: '塔罗牌',
        desc: '78张牌占卜命运、情感与选择'
    }, {
        title: 'MBTI',
        desc: '16型人格测试，剖析你 的内在性格'
    }, {
        title: '恋爱法庭',
        desc: 'AI分析，模拟审判解决恋爱纠纷'
    }, {
        title: '鉴渣',
        desc: '鉴定自己的说话方式和资料，像不像渣男渣女'
    }, {
        title: '其他测试',
        desc: '根据通用测试问题配置模板，配置完成倒序'
    },
])

</script>

<style lang="scss" scoped>
.page {
    width: 100%;
    height: 100vh;
    padding: 20rpx;
    box-sizing: border-box;
}

.top {
    background: linear-gradient(180deg, #534D90 0%, rgba(43, 40, 72, 0) 100%);
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 20rpx 10rpx 60rpx;
    border-radius: 15rpx;

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .choose {
            background: rgba(255, 255, 255, 0.26);
            border: 0.5px solid rgba(255, 255, 255, 0.2);
            font-size: 26rpx;
            padding: 6rpx 22rpx;
            border-radius: 30rpx;

            text {
                margin-left: 5rpx;
            }
        }
    }

    .totay {
        margin: 10rpx 0;

        .num {
            font-size: 40rpx;
            font-weight: bold;
        }
    }

    .desc {
        font-size: 26rpx;
        margin-top: 30rpx;
        margin-bottom: 50rpx;
    }

    .process {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 40rpx;
        height: 330rpx;

        .processlist {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            height: 330rpx;

            .name {
                font-size: 28rpx;
                margin: 15rpx 0;
            }

            .jindu {
                width: 35rpx;
                border-radius: 35rpx;
                background: linear-gradient(180deg, #807f92 0%, rgba(255, 255, 255, 0) 100%);
            }
        }
    }
}

.tarbarlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 30rpx;

    image {
        width: 35rpx;
        height: 35rpx;
        margin-left: 10rpx;
    }

    .list {
        width: 48%;
        display: flex;
        flex-direction: column;
        height: 200rpx;
        border-radius: 20rpx;
        background: #2B2848;
        box-sizing: border-box;
        border: 0.5px solid rgba(255, 255, 255, 0.3);
        justify-content: center;
        padding:0 40rpx;
        margin-bottom: 20rpx;
        position: relative;
         overflow: hidden;
    
        .top1{
            display: flex;
            align-items: center;
            vertical-align: middle;
        }
        .desc1{
            font-size: 26rpx;
            margin-top: 15rpx;
        }
    }
     .status-badge {
            position: absolute;
            top: 30rpx;
            right: 25rpx;
            width: 165rpx;
            padding: 6rpx 0;
            text-align: center;
            // background: #FFBB25; //黄色
           background: #FF4E4E;
            transform: translate(40%, -20%) rotate(45deg);
            transform-origin: center;
            z-index: 3;
            text-align: center;
            overflow: hidden;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);

            &--error {
                background: rgba(255, 77, 77, 0.85);
                cursor: pointer;
            }

            .status-badge-text {
                color: fff;
                font-size: 26rpx;
                font-weight: 500;
                transform: rotate(360deg);
                display: block;
                white-space: nowrap;
                line-height: 1.2;
            }
        }
}
</style>