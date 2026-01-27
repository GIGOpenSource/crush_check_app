<template>
    <view class="page">
        <view class="titlecon">
            <view class="t1">{{ t('mbti.testTitle') }} ({{ t('mbti.version') }}) <text>{{ page }} / {{ total }}</text> </view>
            <view class="t2">{{ t('mbti.tip') }}</view>
        </view>
        <scroll-view class="content" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation
            @scroll="onScroll">
            <view class="con" v-for="(item, index) in list" :key="index" :id="'question-' + index">
                <view>0{{ index + 1 }} {{ item.content }}</view>
                <view class="borderwrapper">
                    <view v-for="(ite) in fen" :key="ite" @click="choosestatus(index, ite)"
                        :class="item.current == ite ? 'current' : ''"></view>
                </view>
                <view class="status">
                    <text>{{ t('mbti.stronglyDisagree') }}</text>
                    <text>{{ t('mbti.stronglyAgree') }}</text>
                </view>
            </view>
        </scroll-view>
        <view class="btns">
            <view class="btn1" v-if="page == 1" @click="down">{{ t('mbti.nextPage') }}</view>
            <view class="btn1" v-else-if="page == total" @click="look">{{ t('mbti.viewResult') }}</view>
            <view class="btn2" v-else>
                <view @click="up">{{ t('mbti.prevPage') }}</view>
                <view @click="down">{{ t('mbti.nextPage') }}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { getList } from '@/api/mbti.js'
import { onLoad } from '@dcloudio/uni-app'
const { t } = useI18n()
const test_type = ref('simple')
const list = ref([])
const page = ref(1)
const fen = [5, 4, 3, 2, 1]
const scrollIntoView = ref('') 
const isScrolling = ref(false)
const total = ref('')
onLoad((e) => {
    // test_type.value = e.test_type
})
onMounted(() => {
    getlistTi()
})
const getlistTi = () => {
    isScrolling.value = false
    getList(page.value, 4, test_type.value)
        .then(res => {
            list.value = res.data.results.map(item => {
                return {
                    ...item,
                    current: -1
                }
            })
            total.value = res.data.pagination.total_pages

        })
}
const up = () => {
    page.value--
    getlistTi()
}
const down = () => {
    nextTick(() => {
        setTimeout(() => {
            const firstUnansweredIndex = list.value.findIndex(item => item.current === -1)
            if (firstUnansweredIndex !== -1) {
                scrollToQuestion(firstUnansweredIndex)
            } else {
                scrollIntoView.value = ''
                page.value++
                getlistTi()
            }
        }, 200)
    })

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
    const wasAnswered = list.value[index].current !== -1

    list.value[index].current = ite
    if (!wasAnswered) {
        const nextIndex = index + 1
        if (nextIndex < list.value.length) {
            scrollToQuestion(nextIndex)
        }
    }
}

//查看结果
const look = () => {
     uni.redirectTo({ url: `/pagesA/mbti/poster` })
}


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

        text {
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

            .current {
                background: #A0FFE7;
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
</style>