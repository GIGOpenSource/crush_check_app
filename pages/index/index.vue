<template>
    <view class="page">
        <view class="top">
            <view class="title">
                <view class="titleleft" @click="tiaozhuan">
                    <text>{{ t('start.myConstellation') }}{{ info.star_sign || '--' }}</text>
                    <image :src="$getImg('constellation/back')" v-if="info.star_sign" />
                </view>
                <view class="choose" @click="choose">
                    {{ info.star_sign == '' ? t('start.chooseYourConstellation') : t('start.chooseHisConstellation') }}
                    <text>{{ '>' }}</text>
                </view>
            </view>
            <view class="totay">
                <text>{{ t('start.todayMood') }}</text>
                <text><text class="num">{{ info.mood_score || '0' }}</text>{{ t('start.score') }}</text>
            </view>
            <view class="desc" v-if="info.encourage_sentence">{{ info.encourage_sentence }}</view>
            <view class="process">
                <view v-for="(item, index) in processlist" class="processlist" :key="index">
                    <view class="jindu" :style="item.percent ? `height:${item.percent * 2}rpx` : `height:200rpx`">
                    </view>
                    <view class="name">{{ item.name }}</view>
                    <view class="percent">{{ item.percent || 0 }}</view>
                </view>
            </view>
        </view>
        <view class="tarbarlist">
            <block v-for="(item, index) in tarbarlist" :key="index">
                <view class="list" @click="path(routeslist[item.english_name])" v-if="item.is_enabled">
                    <view class="top1">
                        <view>{{ item.name }}</view>
                        <image :src="$getImg('constellation/back')" mode="scaleToFill" />
                    </view>
                    <view class="desc1">{{ item.description }}</view>
                    <view class="status-badge hot" :class="{ 'new': item.tag_text == 'NEW' }">
                        <text class="status-badge-text">{{ item.tag_text }}</text>
                    </view>
                </view>
            </block>
        </view>
    </view>
    <up-popup :show="show" mode="bottom" @close="show = false" @open="show = true">
        <ConsrProup :title="t('start.inputHisInfo')" :btnText="t('start.testMatchDegree')" @submit="step"></ConsrProup>
    </up-popup>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { startDaily } from '@/api/constellation.js'
import { onShow, onLoad } from '@dcloudio/uni-app'
import ConsrProup from '@/components/ConsrProup/ConsrProup.vue'
import { timestampToIsoUtc } from '@/utils/utctTime.js'
import { getUserInfo, getSystemContent } from "@/api/login.js";
import { signlist } from '@/api/constellation.js'
import {
    share
} from '@/api/index.js'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const show = ref(false)
const userinfo = ref({})
const version = ref('') //审核开关
const info = ref({
    star_sign: '',
    mood_score: 0,
    encourage_sentence: '',
})
const processlist = ref([
    { percent: 0, name: t('start.love') },    // 爱情 → 国际化
    { percent: 0, name: t('start.wealth') },  // 财富 → 国际化
    { percent: 0, name: t('start.career') },  // 事业 → 国际化
    { percent: 0, name: t('start.study') },   // 学习 → 国际化
    { percent: 0, name: t('start.contacts') } // 人脉 → 国际化
])
const routeslist = {
    crush_check: '/pages/index/opeare',
    answer_book: '/pages/index/answer',
    MBTI: '/pagesA/mbti/index',
    trial_case: '/pagesA/loveCourt/index',
    tarot_card: '/pagesA/tarotcards/qusetion',
    other_test: ''
}
const tarbarlist = ref([])
//每日心情
const getDaily = () => {
    startDaily().then(res => {
        let data = res.data

        processlist.value[0].percent = data.love_score || 0
        processlist.value[1].percent = data.wealth_score || 0
        processlist.value[2].percent = data.career_score || 0
        processlist.value[3].percent = data.study_score || 0
        processlist.value[4].percent = data.contact_score || 0
        info.value.star_sign = data.star_sign || ''
        info.value.mood_score = data.mood_score || ''
        info.value.encourage_sentence = data.encourage_sentence || ''

    })
}

//匹配
const step = (params) => {
    params.other_birth_datetime = timestampToIsoUtc(params.time)
    params.other_gender = params.user_gender
    show.value = false
    delete params.time
    delete params.user_gender
    delete params.data_of_birth_time
    uni.navigateTo({ url: '/pagesA/constellation/poster?params=' + JSON.stringify(params) })
}

//选择
const choose = () => {
    let token = uni.getStorageSync('token')
    // let userinfo = userinfo.value
    if (!token) {
        uni.navigateTo({ url: '/pages/login/login' })
    } else {
        if (userinfo.value.star_sign_info?.id) {
            show.value = true
        } else {
            uni.navigateTo({
                url: '/pagesA/constellation/index'
            })
        }
    }
}

const path = (url) => {
    uni.removeStorageSync('question');
    if (!uni.getStorageSync('token')) {
        if (url == '/pagesA/loveCourt/index') {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        } else {
            if (url == '/pagesA/loveCourt/index') {
                uni.redirectTo({
                    url: '/pagesA/loveCourt/index'
                })
            } else {
                uni.navigateTo({ url })
            }

        }
    } else {
        uni.navigateTo({ url })
    }

}

//获取列表
const getlist = () => {
    signlist().then(res => {
        tarbarlist.value = res.data.results
    })
}

const tiaozhuan = () => {
    if (!uni.getStorageSync('token')) return
    if (!info.value.star_sign) return
    uni.redirectTo({
        url: '/pagesA/constellation/join'
    })
}

onShow(() => {
    processlist.value = [
        { percent: 0, name: t('start.love') },    // 爱情 → 国际化
        { percent: 0, name: t('start.wealth') },  // 财富 → 国际化
        { percent: 0, name: t('start.career') },  // 事业 → 国际化
        { percent: 0, name: t('start.study') },   // 学习 → 国际化
        { percent: 0, name: t('start.contacts') } // 人脉 → 国际化
    ]
    getlist()
    if (!uni.getStorageSync('token')) {
        info.value.star_sign = ''
        info.value.mood_score = ''
        info.value.encourage_sentence = ''
        return
    }
    getDaily()
    getUserInfo(uni.getStorageSync('openId')).then(res => {
        userinfo.value = res.data
        uni.setStorageSync('userInfo', JSON.stringify(res.data))
    })
    //开关
    getSystemContent().then(res => {
        version.value = res.data[0].version
    })
})
onLoad((e) => {
    if (e.scene) {
        uni.setStorageSync("inviter_openid", e.scene);
        if (!uni.getStorageSync('token')) {
            uni.navigateTo({
                url: "/pages/login/login"
            })
            return
        }
        share({
            shareId: e.scene,
        }).then((res) => {
            console.log(res, "share record");
        });
    }
})


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

        .titleleft {
            display: flex;
            align-items: center;
        }
    }

    image {
        width: 35rpx;
        height: 35rpx;
        margin-left: 10rpx;
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
    // justify-content: space-between;
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
        padding: 0 40rpx;
        margin-bottom: 20rpx;
        position: relative;
        overflow: hidden;
        margin-right: 25rpx;

        .top1 {
            display: flex;
            align-items: center;
            vertical-align: middle;
        }

        .desc1 {
            font-size: 26rpx;
            margin-top: 15rpx;
        }
    }

    .list:nth-of-type(2n) {
        margin-right: 0 !important;
    }

    .status-badge {
        position: absolute;
        top: 30rpx;
        right: 25rpx;
        width: 165rpx;
        padding: 6rpx 0;
        text-align: center;
        transform: translate(40%, -20%) rotate(45deg);
        transform-origin: center;
        z-index: 3;
        text-align: center;
        overflow: hidden;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);

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

    .hot {
        background: #FF4E4E;
    }

    .new {
        background: #FFBB25; //黄色
    }
}
</style>