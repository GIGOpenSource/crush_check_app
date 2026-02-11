<template>
   <view>
   
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
                <view class="icon" v-for="(item, index) in iconList" :key="index">
                    <image :src="$getImg(item.images)" mode="aspectFill"></image>
                    <view class="title">{{ $t(item.titleKey) }}</view>
                </view>
            </view>
            <view class="btns" v-if="moneyType.includes('single')">
                <view class="btn" @click="handlePay('ios_vip')">{{ $t('mbti.payVipPrefix') }}{{ mouth.price }}{{ $t('mbti.payVipSuffix') }}</view>
                <view class="title" @click="handlePay(moneyType)">{{ $t('mbti.payOnceResultPrefix') }}{{ once.price }}{{ $t('mbti.payOnceResultSuffix') }}</view>
            </view>
            <view class="btns" v-else>
                <view class="btn" @click="handlePay(moneyType)">{{ $t('mbti.payUnlockDoublePrefix') }}{{ once.price }}{{ $t('mbti.payUnlockDoubleSuffix') }}</view>
            </view>

        </view>
    </up-popup>   </view>
</template>


<script setup>
import { ref, watch } from 'vue';
import { getProducts } from '@/api/index.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
        type: String,
        default: 'single_mbti_40'
    }
})
const emits = defineEmits(["update:show", "close","update:moneyType", "pay"])
const iconList = [{
    images: 'add/icon1',
    titleKey: 'mbti.professionalScale'
}, {
    images: 'add/icon2',
    titleKey: 'mbti.costEffective'
}, {
    images: 'add/icon3',
    titleKey: 'mbti.convenient'
}]
const textlist = ref([])
const t1 = ref('')
const t2 = ref('')
const mouth = ref({})
const once = ref({})

// 初始化逻辑
const initData = () => {
    console.log(props.show, 'MbtiProup show状态')
    if (props.moneyType.includes('single')) {
        textlist.value = [t('mbti.singleVipBenefit1'), t('mbti.singleVipBenefit2')]
        t1.value = t('mbti.vipExclusiveTitle')
        t2.value = t('mbti.vipPrivileges')
    } else {
        textlist.value = [t('mbti.doubleBenefit1'), t('mbti.doubleBenefit2'), t('mbti.doubleBenefit3')]
        if(props.moneyType.includes('40')){
             t1.value = t('mbti.doubleSimpleReport')
        }else if(props.moneyType.includes('60')){
            t1.value = t('mbti.doubleMajorReport')
        }else if(props.moneyType.includes('105')){
            t1.value = t('mbti.doubleAdvancedReport')
        }
       
        t2.value = t('mbti.packageIncludes')
    }
    getlist()
}

const handleClose = () => {
    if (!props.canClose) {
        return;
    }
    emits("close");
    emits("update:show", false);
}
const handlePay = (type) => {
    if(type == 'ios_vip'){
         emits("pay", 'ios_vip', mouth.value);
    }else{
         emits("pay", type, once.value);
    }
}

const  getlist = () => {
    //月
    getProducts('ios_vip').then(res => {
        mouth.value = res.data.results[0]
    })
    //次
    getProducts(props.moneyType).then(res => {
        once.value = res.data.results[0]
    })
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        initData()
    }
}, { immediate: true })

watch(() => props.moneyType, () => {
    if (props.show) {
        initData()
    }
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