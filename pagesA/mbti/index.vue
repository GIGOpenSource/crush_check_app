<template>
    <view class="page" :style="{ paddingBottom: '0px', marginBottom: '20rpx' }">
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
                <text @click="clicks(item.t1)">{{ item.t1 }} {{ '>' }}</text>
                <text @click="clicks(item.t2)">{{ item.t2 }} {{ '>' }}</text>
                <text @click="clicks(item.t3)">{{ item.t3 }} {{ '>' }}</text>
                <text @click="clicks(item.t4)">{{ item.t4 }} {{ '>' }}</text>
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
     <up-popup :show="showDelPopup2" mode="center" @close="showDelPopup2 = false">
            <view class="del-popup-content">
                <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
                <view class="title1">{{ t('mbti.incompleteTestMessage') }}</view>
                <view class="del-popup-actions">
                    <view class="del-popup-btn cancel" @click="btn(true)">{{ t('mbti.abandonAnswer') }}</view>
                    <view class="del-popup-btn confirm" @click="btn(false)">{{ t('mbti.continueAnswer') }}</view>
                </view>
            </view>
        </up-popup>
</template>

<script setup>
import { aesEncrypt, md5Encrypt } from '@/utils/crypto.js';
import IndexProup from '@/components/IndexProup/IndexProup.vue'
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { getList ,getRoom} from '@/api/mbti.js'
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
const showDelPopup2 = ref(false)
const renge = [{
    t1: 'ENTJ',
    t2: 'ENTP',
    t3: 'INTP',
    t4: 'INTJ'
}, {
    t1: 'ENFJ',
    t2: 'INFJ',
    t3: 'INFP',
    t4: 'ENFP'
}, {
    t1: 'ESTJ',
    t2: 'ISTJ',
    t3: 'ISFJ',
    t4: 'ESFJ'
}, {
    t1: 'ESTP',
    t2: 'ISTP',
    t3: 'ISFP',
    t4: 'ESFP'
}]
const borderColor = { 0: '#827DB9', 1: '#7DB983', 2: '#7D9CB9', 3: '#B99C7D' }
const content = ref('')
content.value = t('mbti.personalityDesc')
//选择测试
const ceshiproup = ref(false)
const ceshicontent = ref(t('mbti.testContent'))
const ceshibtns = [{ title: t('mbti.simpleVersion'), type: 'simple' }, { title: t('mbti.majorVersion'), type: 'major' }, { title: t('mbti.advancedVersion'), type: 'advanced' }]

//匹配
const pipeiproup = ref(false)
const pipeicontent = ref([t('mbti.step1'), t('mbti.step2'), t('mbti.step3'), t('mbti.step4')])

//邀请码
const inviewma = ref('')

const test_type = ref('')


//人格
const  clicks = (type) => {
     if (!uni.getStorageSync('token')) return uni.navigateTo({url: "/pages/login/login"})
    uni.navigateTo({ url: '/pagesA/mbti/poster?temtype='+type })
}
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
const generateTimestampMD5 = (status) => {
    getRoom(status).then(res => {
        md5.value = res.data.room_key
        uni.setStorageSync('timestamp', md5.value)
         pipeiproup.value = true
    })

}
//加密邀请码
const handleEncrypt = () => {
    const encryptedData = uni.getStorageSync('openId') + '@' + md5.value
    const end = aesEncrypt(encryptedData)
    return end
}

//复制邀请码
const copy = () => {
    uni.setClipboardData({
        data:`快来测超准 MBTI！微信搜「Crush Check」APP，输入我的邀请码：${handleEncrypt()}，一起看看性格匹配度～`,
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
    if (!uni.getStorageSync('token')) return uni.navigateTo({ url: "/pages/login/login" })
    if (mode.value == 'single_mode') {
        uni.reLaunch({
            url: `/pagesA/mbti/dati?test_type=${type}&question_mode=${mode.value}`
        })
    } else {
        //没有房间号
        if (!uni.getStorageSync('timestamp')) {
            generateTimestampMD5(true) //强制请求
        }else{
            //有房间号
            showDelPopup2.value = true
        }
    }
}

const btn = (status) => {
   generateTimestampMD5(status)
   showDelPopup2.value = false
   ceshiproup.value = false
}
</script>

<style lang="scss" scoped>
rich-text {
    color: #ffffff !important;
    font-size: 28rpx !important;
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
  color: #000;

  .del-popup-icon {
    position: absolute;
    top: -90rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
  }

  .title1 {
    color: #000;
    margin-top: -50rpx;
    font-size: 30rpx;
    font-weight: 400;
  }

  .num {
    font-size: 26rpx;
    margin-top: 20rpx;
  }



  .icon {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: -100rpx;
    color: #000;
    cursor: pointer;

    &.icon-disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}

.del-popup-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 20rpx;
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
    /* 移除底部安全区域 */
    padding-bottom: 0 !important;
    margin-bottom: 20rpx !important;
}

/* 移除iOS底部安全区域 */
/* #ifdef APP-PLUS */
page {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
}
/* #endif */

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