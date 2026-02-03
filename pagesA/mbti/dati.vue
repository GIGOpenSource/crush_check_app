<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
            <view class="navbar-content">
                <view class="navbar-back" @click="goBack">
                    <up-icon name="arrow-left" color="#ffffff" size="24"></up-icon>
                </view>
                <view class="navbar-title">CrushCheck</view>
            </view>
        </view>

        <view class="page-content" :style="{ marginTop: (statusBarHeight + 88) + 'rpx' }">
            <view class="titlecon">
                <view class="t1">{{ t('mbti.testTitle') }} ({{ t('mbti.version') }}) <text>{{ page }} / {{ total
                }}</text> </view>
                <view class="t2">{{ t('mbti.tip') }}</view>
            </view>
            <scroll-view class="content" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation
                @scroll="onScroll">
               
                <view class="con" v-for="(item, index) in list" :key="index" :id="'question-' + index">
                    <view>{{ 6 * (page - 1) + (index + 1) >= 10 ? 6 * (page - 1) + (index + 1) : '0' + (6 * (page - 1) + (index + 1)) }} {{ item.content }}</view>
                    <view class="borderwrapper">
                        <view class="kong" v-for="(ite) in fen" :key="ite" @click="choosestatus(index, ite)">
                            <view :class="item.question_value == ite ? 'current' : ''"></view>
                        </view>
                    </view>
                    <view class="status">

                        <text>{{ t('mbti.stronglyAgree') }}</text>
                        <text>{{ t('mbti.stronglyDisagree') }}</text>
                    </view>
                </view>
            </scroll-view>
            <view class="btns">
                <view class="btn1" v-if="page == 1" @click="down">{{ t('mbti.nextPage') }}</view>
                <view class="btn1" v-else-if="page == total" @click="down">{{ t('mbti.viewResult') }}</view>
                <view class="btn2" v-else>
                    <view @click="up">{{ t('mbti.prevPage') }}</view>
                    <view @click="down">{{ t('mbti.nextPage') }}</view>
                </view>
            </view>
        </view>
        <up-popup :show="showDelPopup2" mode="center">
            <view class="del-popup-content">
                <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
                <view class="title1">{{ t('mbti.exitConfirmTip') }}</view>
                <view class="del-popup-actions">
                    <view class="del-popup-btn cancel" @click="showDelPopup2 = false">{{ t('common.cancel') }}</view>
                    <view class="del-popup-btn confirm" @click="submit">{{ t('common.confirm') }}</view>
                </view>
                <view class="icon" @click="showDelPopup2 = false">
                    <up-icon name="close-circle" color="#ffffff" size="30"></up-icon>
                </view>
            </view>
        </up-popup>
         <up-popup :show="showDelPopup3" mode="center">
            <view class="del-popup-content">
                <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
                <view class="title1">{{ t('mbti.submitSuccess') }}</view>
                <view class="del-popup-actions">
                    <view class="del-popup-btn confirm" @click="uni.switchTab({ url: '/pages/test/test' })">{{ t('common.confirm') }}</view>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { getList, createPoster, finsh,layout } from '@/api/mbti.js'
import { onLoad ,onUnload} from '@dcloudio/uni-app'
import { url } from 'uview-plus/libs/function/test'
const { t } = useI18n()
const test_type = ref('')
const question_mode = ref('')
const list = ref([])
const page = ref(1)
const fen = [5, 4, 3, 2, 1]
const scrollIntoView = ref('')
const isScrolling = ref(false)
const total = ref('')
const statusBarHeight = ref(0)
const showDelPopup2 = ref(false)
const showDelPopup3 = ref(false)
const poster_id = ref(null)
onLoad((e) => {
    test_type.value = e.test_type
    question_mode.value = e.question_mode
    poster_id.value = e.poster_id || null
})

onMounted(() => {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = systemInfo.windowWidth / 375 * 2 || 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx

    getlistTi()
})
const goBack = () => {
    showDelPopup2.value = true
}
const getlistTi = () => {
    isScrolling.value = false
    getList(page.value, 6, test_type.value, question_mode.value, poster_id.value)
        .then(res => {
            list.value = res.data.results.map(item => ({
                ...item,
                question_value: item.question_value || 0
            }))
            total.value = res.data.pagination.total_pages
            poster_id.value = res.data.poster_id

            // 重置滚动位置到第一条数据
            nextTick(() => {
                scrollIntoView.value = ''
                setTimeout(() => {
                    scrollIntoView.value = 'question-0'
                    setTimeout(() => {
                        scrollIntoView.value = ''
                    }, 300)
                }, 100)
            })
        })
}
const up = async () => {
    await create()
    page.value--
    getlistTi()

}
const down = async () => {
    nextTick(() => {
        setTimeout(async () => {
            const firstUnansweredIndex = list.value.findIndex(item => !item.question_value || item.question_value == 0)
            if (firstUnansweredIndex !== -1) {
                uni.showToast({
                    title: t('mbti.pleaseAnswerAll'),
                    icon: 'none'
                })
                scrollToQuestion(firstUnansweredIndex)
            } else {
                scrollIntoView.value = ''
                await create()
                if (page.value == total.value) {
                    look()
                } else {
                    page.value++
                    getlistTi()
                }


            }
        }, 200)
    })

}
const create = async () => {
    let answer = Object.fromEntries(
        list.value.map(item => [item.id, item.question_value])
    );
    let timestamp = new Date()
    const res = await createPoster(page.value, 4, poster_id.value, answer, timestamp)
    console.log(res, 'rds')
}
const onScroll = (e) => {
    if (!isScrolling.value) {
    }
}
const scrollToQuestion = (index) => {
    if (isScrolling.value) {
        return
    }
    isScrolling.value = true
    scrollIntoView.value = ''
    nextTick(() => {
        setTimeout(() => {
            scrollIntoView.value = `question-${index}`
            setTimeout(() => {
                isScrolling.value = false
                scrollIntoView.value = ''
            }, 300)
        }, 50)
    })
}

//答题
const choosestatus = (index, ite) => {
    const wasAnswered = list.value[index].question_value && list.value[index].question_value !== 0

    list.value[index].question_value = ite
    if (!wasAnswered) {
        const nextIndex = index + 1
        if (nextIndex < list.value.length) {
            scrollToQuestion(nextIndex)
        }
    }
}

//查看结果
const look = () => {
    finsh(poster_id.value).then(res => {
        if (question_mode.value == 'single_mode') {//单人
            uni.redirectTo({ url: `/pagesA/mbti/poster?id=`+poster_id.value + '&type=' + 'single'})
        } else {
            showDelPopup3.value = true
        }
    }).catch(err => {
        console.log(err, 'eee')
    })

}
//确定退出
const submit = () => {
    layout(poster_id.value).then(res => {
       uni.switchTab({
        url:'/pages/index/index'
       })
    })
   
}


</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background: #12111f;
    font-weight: 300;
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
        position: relative;

        .navbar-back {
            position: absolute;
            left: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60rpx;
            height: 60rpx;
        }

        .navbar-title {
            font-size: 32rpx;
            font-weight: 500;
            color: #ffffff;
        }
    }
}

.page-content {
    height: calc(100vh - 200rpx);
    margin: 0 25rpx 20rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    // overflow: hidden;
}

.titlecon {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20rpx 60rpx;

    .t1 {
        margin-top: 40rpx;

        text {
            position: absolute;
            right: 50rpx;
            top: 250rpx;
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
    flex: 1;
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

            .kong {
                width:55rpx;
                text-align: center;
                height: 55rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                view {
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                }
            }
            .current {
                background: #A0FFE7;
            }


        }
    }
}

.borderwrapper .kong:nth-of-type(1),.borderwrapper .kong:nth-of-type(5){
    view{
          width: 50rpx;
    height: 50rpx;
    }
}

.borderwrapper .kong:nth-of-type(2),.borderwrapper .kong:nth-of-type(4) {
  view{
      width: 35rpx;
    height: 35rpx;
  }

}

.borderwrapper .kong:nth-of-type(3){
    view{
        width: 20rpx;
    height: 20rpx;
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

    .btn2 {
        display: flex;
        justify-content: space-between;

        view {
            background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
            width: 45%;
            height: 95rpx;
            text-align: center;
            line-height: 95rpx;
            border-radius: 95rpx;
        }
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
</style>
<style>
.u-popup__content {
    background: transparent !important;
}
</style>