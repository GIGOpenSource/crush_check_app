<template>
   <view class="page">
      <view>问题：明天会拉屎吗？</view>
      <view class="cards">
         <view class="left">
            <!-- <view class="one">
                 <image :src="$getImg('del/one')" mode="scaleToFill" />
             </view> -->
            <!-- <view class="three">
                 <image :src="$getImg('del/one')" mode="scaleToFill" />
                 <image :src="$getImg('del/one')" mode="scaleToFill" />
                 <image :src="$getImg('del/one')" mode="scaleToFill" />
             </view> -->
            <view class="fire">
               <view class="img1">
                  <image :src="$getImg('del/one')" mode="scaleToFill" />
               </view>
               <view>
                  <image :src="$getImg('del/one')" mode="scaleToFill" />
                  <image :src="$getImg('del/one')" mode="scaleToFill" />
                  <image :src="$getImg('del/one')" mode="scaleToFill" />
               </view>
               <view class="img1">
                  <image :src="$getImg('del/one')" mode="scaleToFill" />
               </view>
            </view>
         </view>
         <view class="right">
            <view>阵位类型：关系牌阵</view>
            <view>阵位说明：用于深入剖析两人关系 如：恋爱、友情、合作、婚姻等</view>
         </view>
      </view>
      <view class="tarbar">
         <view :class="current == 0 ? 'current' : ''" @click="current = 0">结果说明</view>
         <view :class="current == 1 ? 'current' : ''" @click="current = 1">系统解读</view>
      </view>
      <view class="content" v-if="current == 0">
         <view v-for="(item, index) in list" :key="index" class="list">
            <view class="left">
               <view class="num">{{ '0' + (index + 1) }}</view>
               <image :src="$getImg('del/one')" mode="scaleToFill" />
               <view class="right">
                  <view class="t2">{{ item.t1 }} <text>逆位</text> </view>
                  <view>{{ item.t2 }}{{ item.t3 }}</view>
               </view>
            </view>
         </view>
      </view>
      <view class="text" v-if="current == 1">
         <view class="mengceng">
            <view class="pay">支付10.00元 AI解读</view>
         </view>
         <view class="title"> 这里是AI解读这里是AI解读这里是AI解 这里是AI解读这里是AI解读这里是AI解 这里是AI解读这里</view>
      </view>
   </view>
   <view style="height: 130rpx;"></view>
   <view class="btns">
      <view class="border">
         <view class="share">分享结果</view>
         <view>再来一次</view>
      </view>
   </view>
</template>

<script setup>
import { ref } from 'vue'
const current = ref(0)
const list = [{
   t1: '单张牌阵',
   t2: '适用于简单问题或每日运势',
   t3: '快速获取答案',
   num: 1
}, {
   t1: '三张牌阵',
   t2: '基于过去、现在、未来，了解问题',
   t3: '的发展脉络',
   num: 3

}, {
   t1: '关系牌阵',
   t2: '专门用于人机关系、情感问题',
   t3: '全面分析',
   num: 5

}, {
   t1: '关系牌阵',
   t2: '专门用于人机关系、情感问题',
   t3: '全面分析',
   num: 5

}]
</script>

<style lang="scss" scoped>
.page {
   height: 86vh;
   margin: 20rpx 25rpx;
   background: rgba(255, 255, 255, 0.1);
   box-sizing: border-box;
   border: 0.5rpx solid #FFFFFF;
   border-radius: 10rpx;
   font-weight: 300;
   padding: 30rpx;
}

.cards {
   display: flex;
   align-items: center;
   margin: 30rpx 0;
   height: 200rpx;
   margin-top: 40rpx;

   .left {
      width: 24%;
      height: 100%;
      margin-right: 6%;

      .one {
         width: 100%;
         height: 100%;

         image {
            width: 100%;
            height: 100%;
         }
      }

      .three {
         width: 100%;
         height: 100%;
         display: flex;
         align-items: center;
         justify-content: center;

         image {
            width: 30%;
            height: 50%;
         }
      }

      .fire {
         width: 100%;
         height: 100%;

         view {
            width: 100%;
            height: 33%;

            image {
               width: 30%;
               height: 100%;
            }
         }
         .img1{
           image{
            margin-left: 30%;
           }
         }

      }
   }

   .right {
      // width: 65%;
      width: 60%;
      font-size: 24rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90%;
   }
}

.tarbar {
   display: flex;
   justify-content: space-between;
   margin-top: 40rpx;
   font-size: 28rpx;
   // margin-bottom: 20rpx;

   view {
      width: 47%;
      height: 75rpx;
      line-height: 75rpx;
      background: rgba(255, 255, 255, 0.04);
      border: 0.5px solid rgba(255, 255, 255, 0.17);
      text-align: center;
      border-radius: 75rpx;
   }

   .current {
      background: #2B2848;
   }
}

.content {
   height: 600rpx;
   overflow-y: scroll;
}

.list {
   display: flex;
   justify-content: space-between;
   align-items: center;
   background: rgba(255, 255, 255, 0.1);
   margin-top: 20rpx;
   padding: 10rpx 0;
   border-radius: 10rpx;
   font-size: 22rpx;
   width: 100%;
   padding: 20rpx;
   box-sizing: border-box;


   image {
      width: 80rpx;
      height: 120rpx;
      margin: 0 20rpx;
   }

   .left {
      width: 100%;
      display: flex;
      align-items: center;

      .t2 {
         font-size: 28rpx;
         font-weight: 350;
         margin-bottom: 20rpx;

         text {
            margin-left: 10rpx;
            font-size: 24rpx;
            color: red;
         }
      }

      .num {
         font-weight: bold;
      }

      .right {
         width: 65%;
         display: flex;
         flex-direction: column;

         view {
            width: 100%;
         }
      }
   }

}

.text {
   background: rgba(255, 255, 255, 0.1);
   padding: 20rpx;
   border-radius: 10rpx;
   width: 100%;
   height: 560rpx;
   overflow-y: scroll;
   margin-top: 20rpx;
   box-sizing: border-box;
   position: relative;
   color: #fff;

   .mengceng {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      font-weight: 100;
      background-color: rgba(255, 255, 255, .3);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .pay {
         background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
         color: #fff;
         display: flex;
         align-items: center;
         justify-content: center;
         width: 80%;
         line-height: 90rpx;
         height: 90rpx;
         border-radius: 90rpx;
         font-size: 28rpx;
      }
   }

   .title {
      filter: blur(2px);
      /* 内容模糊（可选） */
      opacity: 0.5;
      /* 内容半透明（可选） */
   }
}

.btns {
   position: fixed;
   left: 0;
   bottom: 0;
   background: #3F3E49;
   width: 100%;
   height: 130rpx;
   padding: 20rpx 60rpx;
   box-sizing: border-box;
   font-size: 28rpx;

   .border {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 90rpx;

      view {
         width: 50%;
         line-height: 90rpx;
         text-align: center;
      }

      .share {
         border-right: 1px solid rgba(255, 255, 255, 0.3);
      }
   }
}
</style>