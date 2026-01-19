<template>
    <view class="page">
        <view class="title">问题：{{ question }}</view>
        <view class="clickcon" v-if="num == 5" style="margin-top: 15rpx;">
            <view style="width: 160rpx;"></view>
            <view class="con">
                <view :class="current == 3 ? 'current clicks' : 'clicks'">
                    <block v-if="!imagelist[3].image_url">
                        <view class="number">3</view>
                        <up-icon name="plus" color="#ABAAAF" size="24"></up-icon>
                        <view class="text">{{ title[3] }}</view>
                    </block>
                    <block v-else>
                        <image :src="imagelist[3].image_url" mode="scaleToFill" />
                    </block>
                </view>
            </view>
            <view style="width: 160rpx;" class="wrapper">
                <view class="p1" v-if="imagelist[3].image_url">
                    <view class="t3">3 {{ imagelist[3].name }}</view>
                    <view class="type0" v-if="imagelist[3].is_reversed == 0">正位</view>
                    <view class="type1" v-if="imagelist[3].is_reversed == 1">逆位</view>
                </view>
                <view class="p1" v-if="imagelist[4].image_url">
                    <view class="t3">4 {{ imagelist[4].name }}</view>
                    <view class="type0" v-if="imagelist[4].is_reversed == 0">正位</view>
                    <view class="type1" v-if="imagelist[4].is_reversed == 1">逆位</view>
                </view>
            </view>
        </view>
        <view class="clickcon" :style="num == 1 || num == 3 ? 'margin-top: 200rpx;' : ' margin: 15rpx 0;'">
            <view v-for="(item, index) in num == 5 ? 3 : num" :key="index" class="con">
                <view class="t1" v-if="num == 3">{{ times[index + 1] }}</view>
                <view
                    :class="num == 1 && imagelist[1].image_url ? 'clicks oneclick' : current == index ? 'current clicks' : 'clicks'">
                    <block v-if="!imagelist[num == 5 ? index == 0 ? 1 : index == 1 ? 4 : 2 : index + 1].image_url">
                        <view v-if="num == 5" class="number">{{ index == 0 ? '1' : index == 1 ? '4' : '2' }}</view>
                        <up-icon name="plus" color="#ABAAAF" size="24"></up-icon>
                        <view v-if="num == 5" class="text">{{ index == 0 ? title[1] : index == 1 ? title[4] : title[2]
                            }} </view>
                    </block>
                    <block v-else>
                        <image :src="imagelist[num == 5 ? index == 0 ? 1 : index == 1 ? 4 : 2 : index + 1].image_url"
                            mode="scaleToFill" />
                    </block>
                </view>
                <block v-if="num == 1 || num == 3 || (num == 5 && index !== 1)">
                    <view class="postion"
                        v-if="imagelist[num == 5 ? index == 0 ? 1 : index == 1 ? 4 : 2 : index + 1].image_url">
                        <view class="t3"> <text v-if="num == 5">{{ index == 0 ? '1' : '2' }}</text> {{ imagelist[num ==
                            5 ?
                            index == 0 ? 1 : index == 1 ? 4 : 2 : index + 1].name
                        }}</view>
                        <view class="type1" v-if="imagelist[num == 5 ? index == 0 ? 1 : index == 1 ? 4 : 2 : index +
                            1].is_reversed == 1">逆位</view>
                        <view class="type0" v-if="imagelist[num == 5 ? index == 0 ? 1 : index == 1 ? 4 : 2 : index +
                            1].is_reversed == 0">正位</view>
                    </view>
                </block>
            </view>
        </view>
        <view v-if="num == 5"
            :class="imagelist[1].image_url || imagelist[2].image_url ? 'clickcon clickbottom' : 'clickcon'">
            <view style="width: 160rpx;"></view>
            <view class="con">
                <view :class="current == 5 ? 'current clicks' : 'clicks'">
                    <block v-if="!imagelist[5].image_url">
                        <view class="number">5</view>
                        <up-icon name="plus" color="#ABAAAF" size="24"></up-icon>
                        <view class="text">{{ title[5] }}</view>
                    </block>
                    <block v-else>
                        <image :src="imagelist[5].image_url" mode="scaleToFill" />
                    </block>
                </view>
            </view>
            <view style="width: 160rpx;" class="wrapper2">
                <view class="p2" v-if="imagelist[5].image_url">
                    <view class="t3">5 {{ imagelist[5].name }}</view>
                    <view class="type0" v-if="imagelist[5].is_reversed == 0">正位</view>
                    <view class="type1" v-if="imagelist[5].is_reversed == 1">逆位</view>
                </view>
            </view>
        </view>
        <view class="bottom">
            <view class="t1">请默念您心中的疑惑，凭直觉开始抽牌</view>
            <view class="card-stack-container">
                <view class="card-item" v-for="(item, index) in list" :key="index" :style="cardStyle(index)"
                    @click="choose(index)" :class="{ 'card-hidden': item.isSelected }">
                    <view class="img-box">
                        <image class="card-img" :src="$getImg('index/tarotcards')" mode="aspectFill" />
                    </view>
                </view>
            </view>
        </view>
        <!-- 抽牌预览层 -->
        <view v-if="showPreview"  class="card-preview-overlay" :class="previewAnimate" >
            <view class="preview-card-flip" :class="{ flipping: flipped }">
                <view class="image-wrapper">
                    <image class="image-front" :src="$getImg('index/tarotcards')" mode="aspectFill" />
                    <image class="image-back" :src="currentimg" mode="aspectFill" />
                </view>
            </view>
        </view>

    </view>
</template>


<script setup>
import { computed, ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTarotcard, createResult } from '@/api/tarotcards.js'

const CARD_COUNT = 20
const OVERLAP_RATIO = 0.4
const TOP_INDEX = 10
const showPreview = ref(false) // 控制预览层显示/隐藏
const previewAnimate = ref('') // 预览动画类名
const flipped = ref(false)  // 只负责卡片翻转

const num = ref(0) //牌数
const times = { 1: '过去', 2: '现在', 3: '未来' }
const title = { 1: '你的想法', 2: 'Ta的想法', 3: '', 4: '双方状态', 5: '未来发展' }
const current = ref(0)
const question = uni.getStorageSync('question')
const currentimg = ref('')
const imagelist = ref([{}, {}, {}, {}, {}, {}])
const list = ref([{}])
onLoad((e) => {
       num.value = Number(e.num)
})
onMounted(() => {
    getTarotcard().then(res => {
        list.value = res.data.map(item => {
            return {
                ...item,
                isSelected: false
            }
        })
    })
})
//选择抽牌
const choose = (index) => {
    const item = list.value[index]
    if (item.isSelected || showPreview.value) return
    showPreview.value = true
    previewAnimate.value = 'preview-enter'
    currentimg.value = list.value[index].image_url
    setTimeout(() => {
        flipped.value = true
    }, 1100)
    
    setTimeout(() => {
        previewAnimate.value = 'fade-out'   // 遮罩淡出
        setTimeout(() => {
            showPreview.value = false
            item.isSelected = true
             flipped.value = false
             opear(index)
        }, 1000)
    },4000)
   
   
}
const opear = (index) => {
   if (num.value == 5) {
      console.log(current.value)
        if (current.value == 1) {
            if (imagelist.value[4].image_url) return
            imagelist.value.splice(4, 1, list.value[index])
             current.value = 5
        } else if (current.value == 2) {
            if (imagelist.value[2].image_url) return
            imagelist.value.splice(2, 1, list.value[index])
             current.value = 3
        } else if (current.value == 0) {
            if (imagelist.value[current.value + 1].image_url) return
            imagelist.value.splice(current.value + 1, 1, list.value[index])
            current.value = 2
        } else {
            if (imagelist.value[current.value].image_url) return
            imagelist.value.splice(current.value, 1, list.value[index])
            if(current.value == 3){
                  current.value = 1
            }else{
                 current.value = current.value + 1
            }
            
        }
    } else {
        if (imagelist.value[current.value + 1].image_url) return
        imagelist.value.splice(current.value + 1, 1, list.value[index])
        current.value = current.value + 1
    }
   
     let arr = imagelist.value.filter(item => Object.keys(item).length !== 0)
    if (arr.length == num.value) {
            path(arr)
     }  
     
}
const path = (arr) => {
    let choose = arr.map(item => [item.id, item.is_reversed])
    let params = {
        tarotCardIds: choose,
        user_question: question
    }
    createResult(params).then(res => {
       setTimeout(() => {
         uni.redirectTo({
            url: '/pagesA/tarotcards/result?id=' + res.data.poster_id
        })
       },1000)
    })
}
// 计算卡牌尺寸和重叠距离
const cardRect = computed(() => {
    const maxWidth = 750
    const cardWidth = maxWidth / (CARD_COUNT - (CARD_COUNT - 1) * OVERLAP_RATIO)
    const overlap = cardWidth * OVERLAP_RATIO
    return { cardWidth, overlap }
})

// 计算卡牌样式
function cardStyle(index) {
    const { cardWidth, overlap } = cardRect.value
    const dist = Math.abs(index - TOP_INDEX)
    const scaleY = 1 - dist * 0.04
    const isDown = index > TOP_INDEX
    const yOffset = isDown ? (index - TOP_INDEX) * 10 : 0
    const x = index == 0 ? 0 : index * (cardWidth - overlap)

    return {
        width: `${cardWidth}rpx`,
        left: `${x}rpx`,
        top: isDown ? `${yOffset}rpx` : '0',
        bottom: isDown ? 'auto' : '0',
        transform: `scaleY(${scaleY})`,
        transformOrigin: isDown ? 'top center' : 'bottom center',
        zIndex: index
    }
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
}

.title {
    margin-top: 50rpx;
    font-size: 30rpx;
}

.clickbottom {
    margin-top: -90rpx;
}

.clickcon {
    width: 85%;
    display: flex;
    justify-content: space-around;

    .wrapper {
        font-size: 24rpx !important;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;

        .p1 {
            .type1 {
                color: #FF0000;
            }

            .type0 {
                color: #00AEFF;

            }
        }

    }

    .wrapper2 {
        font-size: 24rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;

        .p2 {

            .type1 {
                color: #FF0000;
            }

            .type0 {
                color: #00AEFF;

            }
        }

    }

    .con {
        display: flex;
        flex-direction: column;
        align-items: center;

        .t1 {
            margin-bottom: 10rpx;
            color: rgba(255, 255, 255, 0.52);
            font-size: 26rpx;
        }
    }

    .clicks {
        background: rgba(255, 255, 255, 0.1);
        width: 160rpx;
        height: 260rpx;

        border: 1px solid rgba(255, 255, 255, 0.56);
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.52);

        image {
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }

        .number {
            margin-bottom: 20rpx;
        }

        .text {
            margin-top: 20rpx;
        }

    }

    .current {
        background: rgba(255, 255, 255, 0.4);
    }

    .oneclick {
        width: 250rpx;
        height: 400rpx;
    }

    .postion {
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .t3 {
            margin: 10rpx 0;
        }

        .type1 {
            color: #FF0000;
        }

        .type0 {
            color: #00AEFF;

        }
    }


}


.bottom {
    position: fixed;
    left: -10rpx;
    bottom: -240rpx;
    width: 100%;
    height: 550rpx;
    font-size: 22rpx;
    .t1 {
        text-align: center;
        width: 100%;
        margin-top: 20rpx;
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.52);
    }

    .card-stack-container {
        position: relative;
        width: 750rpx;
        height: 100%; 
        margin: 50rpx auto;

        .card-item {
            position: absolute;
            top: 0;
            height: 235rpx;
            border-radius: 6rpx;

            .img-box {
                width: 150rpx;
                height: 100%;

                .card-img {
                    width: 110%;
                    height: 100%;
                }
            }

        }
    }
}

.card-hidden {
    opacity: 0;
    pointer-events: none;
}
.card-preview-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    justify-content: center;
     z-index: 9999;
}
.preview-enter {
    opacity: 1 !important;
  animation: fadeIn 1s ease forwards;
}
.fade-out {
   animation: fadeOut 1s linear forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
/* 3D 容器 */                  
.preview-card-flip {
    width: 240px;
    height: 384px;
    perspective: 1000px;

    /* 包裹层：真正翻转的元素 */
    .image-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 3s ease-in-out;

        image {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
        }

        .image-front {
            transform: rotateY(0deg);
        }

        .image-back {
            transform: rotateY(180deg);
        }

        &.flipping .image-wrapper {
            transform: rotateY(180deg);
        }
    }
}
.preview-card-flip.flipping .image-wrapper {
    transform: rotateY(180deg);
}
</style>