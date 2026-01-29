<template>
    <view class="page">
        <view class="titlecon">
            <view class="t1">{{ t('mbti.indexTitle') }}</view>
            <view class="t2">{{ t('mbti.indexSubtitle') }}</view>
        </view>
        <view class="con" v-for="(item, index) in choose" :key="index" @click="choosetype(index)">
            <view class="t1">{{ item.title }}</view>
            <view class="text">{{ item.text }}</view>
        </view>
        <view class="con">
            <view class="t2">{{ t('mbti.personalityDetail') }}</view>
            <up-read-more showHeight="100" textIndent="0em" :toggle="true" color="#9A90FF"
                :closeText="t('mbti.viewAll')" :shadowStyle="shadowStyle">
                <rich-text :nodes="content"></rich-text>
            </up-read-more>
            <view v-for="(item, index) in renge" :key="index" class="renge" :style="{ background: borderColor[index] }">
                <text>{{ item.t1 }}</text>
                <text>{{ item.t2 }}</text>
                <text>{{ item.t3 }}</text>
                <text>{{ item.t4 }}</text>
            </view>
        </view>
    </view>
    <!-- 选择测试弹窗 -->
    <IndexProup :show="ceshiproup" @close="ceshiproup = false">
        <template #content>
            <view class="tishi">
                <view class="title">{{ t('mbti.selectTest') }}</view>
                <scroll-view class="agreement-content" scroll-y>
                    <view class="richtext-content">{{ ceshicontent }}</view>
                </scroll-view>
                <view class="btn" v-for="(item, index) in ceshibtns" :key="index" @click="join(item.type)">{{ item.title
                }}</view>
                <view class="layout" @click="layout">{{ t('mbti.exitTest') }}</view>
            </view>

        </template>
    </IndexProup>
    <!-- 匹配 -->
    <IndexProup :show="pipeiproup" @close="pipeiproup = false">
        <template #content>
            <view class="tishi">
                <view class="title">{{ t('mbti.doubleMatch') }}</view>
                <view class="titles">{{ t('mbti.inviteFriend') }}</view>
                <!-- 操作 -->
                <view class="opera">
                    <view class="myma"><input type="text" :placeholder="handleEncrypt()"
                            placeholder-style="color:#9A90FF;" :disabled="true"></view>
                    <view class="copy" @click="copy">{{ t('mbti.clickCopy') }}</view>
                    <view class="and">{{ t('mbti.or') }}</view>
                    <view class="shuru"><input type="text" v-model="inviewma" :placeholder="t('mbti.inputInviteCode')"
                            placeholder-style="color:#9A90FF;"></view>
                </view>
                <view class="titlescon">
                    <view v-for="(item, index) in pipeicontent" :key="index" class="titles">{{ index + 1 }}.{{ item }}
                    </view>
                </view>
                <view class="btn" @click="start">{{ t('mbti.startTest') }}</view>
                <view class="layout" @click="layout">{{ t('mbti.exitTest') }}</view>
            </view>

        </template>
    </IndexProup>
</template>

<script setup>
import { aesEncrypt, md5Encrypt } from '@/utils/crypto.js';
import IndexProup from '@/components/IndexProup/IndexProup.vue'
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { getList } from '@/api/mbti.js'
const { t } = useI18n()
const shadowStyle = reactive({
    shadowStyle: {
        backgroundImage: "none"
    }
})
const choose = ref([{
    title: t('mbti.singleTest'),
    text: t('mbti.singleTestDesc')
}, {
    title: t('mbti.doubleTest'),
    text: t('mbti.doubleTestDesc')
}])
const mode = ref('')
const md5 = ref(uni.getStorageSync('timestamp') || '')

const renge = [{
    t1: 'ENTJ >',
    t2: 'ENTP >',
    t3: 'INTP >',
    t4: 'INTJ >'
}, {
    t1: 'ENFJ >',
    t2: 'INFJ >',
    t3: 'INFP >',
    t4: 'ENTJ >'
}, {
    t1: 'ESTJ >',
    t2: 'ISTJ >',
    t3: 'ISFJ >',
    t4: 'ESFJ >'
}, {
    t1: 'ESTP >',
    t2: 'ISTP >',
    t3: 'ISFP >',
    t4: 'ESFP >'
}]
const borderColor = { 0: '#827DB9', 1: '#7DB983', 2: '#7D9CB9', 3: '#B99C7D' }
const content = ref('')
content.value = t('mbti.personalityDesc')
//选择测试
const ceshiproup = ref(false)
const ceshicontent = ref(t('mbti.testContent'))
const ceshibtns = [{ title: t('mbti.simpleVersion'), type: 'simple' }, { title: t('mbti.majorVersion'), type: 'major' }, { title: t('mbti.advancedVersion'), type: 'devanced' }]

//匹配
const pipeiproup = ref(false)
const pipeicontent = ref([t('mbti.step1'), t('mbti.step2'), t('mbti.step3'), t('mbti.step4')])

//邀请码
const inviewma = ref('')

const test_type = ref('')

//选择模式
const choosetype = (index) => {
    if (index == 0) {
        ceshiproup.value = true
        mode.value = 'single_mode'
    } else if (index == 1) {
        ceshiproup.value = true
        mode.value = 'double_mode'
    }

}

//加密邀请码
const handleEncrypt = () => {
    const encryptedData = uni.getStorageSync('openId') + '@' + md5.value
    const end = aesEncrypt(encryptedData)
    return end
}
const generateTimestampMD5 = () => {
    const timestamp = Date.now();
    const md5Hash = md5Encrypt(String(timestamp));
    md5.value = md5Hash
    uni.setStorageSync('timestamp', md5.value)
}
//复制邀请码
const copy = () => {
    uni.setClipboardData({
        data: handleEncrypt(),
        success: function () {
            uni.showToast({
                title: t('common.copySuccess'),
                icon: 'none'
            });
        }
    });

}
//双人模式开始测试
const start = () => {
    // if (!inviewma.value) return uni.showToast({ title: t('mbti.pleaseInputInviteCode'), icon: 'none' })
    if (!uni.getStorageSync('token')) return uni.navigateTo({url: "/pages/login/login"})
     getList(1, 4, test_type.value, mode.value, null, inviewma.value,md5.value).then(res => {
        uni.redirectTo({
            url: `/pagesA/mbti/dati?test_type=${test_type.value}&question_mode=${mode.value}&poster_id=${res.data.poster_id}`
        })
        uni.removeStorageSync('timestamp')
    }).catch(err => {
        console.log(err, 'eee')
    })
}

//退出测试
const layout = () => {
    ceshiproup.value = false
    pipeiproup.value = false
    inviewma.value = ''
}

//进入答题
const join = (type) => {
    test_type.value = type
    if (mode.value == 'single_mode') {
        if (!uni.getStorageSync('token')) return uni.navigateTo({url: "/pages/login/login"})
        uni.redirectTo({
            url: `/pagesA/mbti/dati?test_type=${type}&question_mode=${mode.value}`
        })
    } else {
        pipeiproup.value = true
         if(!uni.getStorageSync('timestamp')){
            generateTimestampMD5()
        }
    }
}
</script>

<style lang="scss" scoped>
rich-text {
    color: #ffffff !important;
    font-size: 28rpx !important;
}

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
    }

    .t2 {
        font-size: 26rpx;
        text-align: center;
        margin-top: 30rpx;
        line-height: 38rpx;
    }
}

.con {
    background: rgba(255, 255, 255, 0.1);
    padding: 30rpx 35rpx;
    margin: 0 20rpx 20rpx 20rpx;
    border-radius: 20rpx;

    .text,
    .text1 {
        width: 70%;
        font-size: 26rpx;
        line-height: 40rpx;
    }

    .t1 {
        margin-bottom: 10rpx;
    }

    .t2 {
        margin-bottom: 25rpx;
    }

    .text1 {
        width: 100%;
    }
}

.renge {
    margin-top: 20rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    border-radius: 80rpx;
}

.tishi {
    width: 600rpx;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 45rpx;
    box-sizing: border-box;

    .opera {
        display: flex;
        flex-direction: column;
        align-items: center;

        .myma,
        .shuru {
            width: 410rpx;
            padding: 0 20rpx;
            height: 90rpx;
            line-height: 90rpx;
            text-align: center;
            border-radius: 90rpx;
            border: 1px solid #9A90FF;
            background: #F8F4FF;
            color: #9A90FF;
            margin-top: 40rpx;
            margin-bottom: 20rpx;

            input {
                width: 100%;
                height: 100%;
                line-height: 100%;
                color: #D5D1FF;
            }


        }

        .copy {
            color: rgba(61, 61, 61, 0.3);
            font-size: 26rpx;
            margin-bottom: 20rpx;
        }

        .and {
            font-size: 26rpx;
        }

        .shuru {
            margin-top: 20rpx;
        }
    }

    .layout {
        color: #B370FF;
        margin-top: 30rpx;
    }

    .titles {
        font-size: 26rpx;
        line-height: 45rpx;
        color: #3D3D3D;
    }

    .titlescon {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 10rpx;
    }

    .title {
        font-weight: bold;
        font-size: 36rpx;
        margin-bottom: 30rpx;
        text-align: center;
        width: 100%;
    }

    .agreement-content {
        width: 100%;
        max-height: 500rpx;
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
        height: 100rpx;
        line-height: 100rpx;
        width: 100%;
        border-radius: 100rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
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
</style>