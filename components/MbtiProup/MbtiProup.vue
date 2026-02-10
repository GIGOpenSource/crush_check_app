<template>
    <up-popup :show="show" mode="center" @close="handleClose" @open="show = true"
        :closeOnClickOverlay="closeOnClickOverlay">
        <view class="mbti">
            <view>{{ t1 }}</view>
            <view class="vip">
                <view class="title">{{ t2 }}</view>
                <view class="view" v-for="(item, index) in textlist" :key="index">
                    <view class="border"></view>
                    <view class="text">{{ item }}</view>
                </view>
            </view>
            <view class="icons">
                <view class="icon" v-for="(item, index) in icon" :key="index">
                    <image :src="$getImg(item.images)" mode="aspectFill"></image>
                    <view class="title">{{ item.title }}</view>
                </view>
            </view>
            <view class="btns" v-if="moneyType.includes('single')">
                <view class="btn" @click="handlePay('vip')">支付{{mouth.prices}}元 开通VIP</view>
                <view class="title" @click="handlePay(moneyType)">支付{{once.prices}}元只查看本次结果</view>
            </view>
            <view class="btns" v-else>
                <view class="btn" @click="handlePay(moneyType)">支付{{once.prices}}元 解锁双人版测试</view>
            </view>

        </view>
    </up-popup>
</template>


<script setup>
import { ref ,onMounted} from 'vue';
import { getProducts } from '@/api/index.js'
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
    },
     moneyType: {
        type: Object,
        default: 'single_mbti_40'
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
const textlist = ref(['3种核心题型无次数限制，随时复盘人格状态','其他模块功能畅玩'])
const t1 = ref('')
const t2 = ref('')
const mouth = ref({})
const once = ref({})
const emits = defineEmits(["update:show", "close"])
const handleClose = () => {
    if (!props.canClose) {
        return;
    }
    emits("close");
    emits("update:show", false);
}
const handlePay = (type) => {
    if(type == 'vip'){
         emits("pay", moneyType,mouth.value);
    }else{
         emits("pay", moneyType,once.value);
    }
  
}
onMounted(() => {
    if (props.moneyType.includes('single')) {
        textlist.value = ['3种核心题型无次数限制，随时复盘人格状态', '其他模块功能畅玩']
        t1.value = '会员专享开通会员查看结果'
        t2.value = '会员特权：'
    } else {
        textlist.value = ['多维度适配分析：恋人、家人、朋友三种关系视角', '一人解锁，双方可见，共享深度关系分析', '附加双方个人专属单人解析报告，全面认知自我']
        t1.value = '双人简易版MBTI测试报告'
        t2.value = '套餐包含：'
    }
   getlist()
})
getlist(() => {
    //月
    getProducts('vip').then(res => {
        mouth.value = res.data
    })
    //次
    getProducts(moneyType).then(res => {
        once.value = res.data
    })
})
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