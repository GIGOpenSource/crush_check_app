<template>
   <view class="page">
      <view>{{ t('tarot_input_question_title') }}：{{ details.summary }}</view>
      <view class="cards">
         <view class="left">
            <view class="one" v-if="details.parse_type == 'once_single_card'">
               <image v-for="(item, index) in details.tarot_cards_list" :src="item.image_url" mode="scaleToFill" />
            </view>
            <view class="three" v-if="details.parse_type == 'once_three_card'">
               <image v-for="(item, index) in details.tarot_cards_list" :src="item.image_url" mode="scaleToFill" />
            </view>
            <view class="fire" v-if="details.parse_type == 'once_multi_card'">
               <view class="img1">
                  <image :src="details.tarot_cards_list[0].image_url" mode="scaleToFill" />
               </view>
               <view>
                  <image :src="details.tarot_cards_list[1].image_url" mode="scaleToFill" />
                  <image :src="details.tarot_cards_list[2].image_url" mode="scaleToFill" />
                  <image :src="details.tarot_cards_list[3].image_url" mode="scaleToFill" />
               </view>
               <view class="img1">
                  <image :src="details.tarot_cards_list[4].image_url" mode="scaleToFill" />
               </view>
            </view>
         </view>
         <view class="right">
            <view>{{ t('tarot_result_layout_type') }}{{ type[details.parse_type] }}</view>
            <view>{{ t('tarot_result_layout_desc') }}{{ desc[details.parse_type] }}</view>
         </view>
      </view>
      <view class="tarbar">
         <view :class="current == 0 ? 'current' : ''" @click="current = 0">{{ t('tarot_result_tab_explain') }}</view>
         <view :class="current == 1 ? 'current' : ''" @click="current = 1">{{ t('tarot_result_tab_interpret') }}</view>
      </view>
      <view class="content" v-if="current == 0">
         <view v-for="(item, index) in details.tarot_cards_list" :key="index" class="list">
            <view class="left">
               <view class="num">{{ '0' + (index + 1) }}</view>
               <image :src="item.image_url" mode="scaleToFill" />
               <view class="right">
                  <view class="t2">{{ item.name }} <text
                        :style="item.is_reversed == 0 ? 'color: #00AEFF;' : 'color: #FF0000;'">{{ item.is_reversed == 0
                           ? t('tarot_card_upright') : t('tarot_card_reversed') }}</text> </view>
                  <view>{{ item.description.join(',') || '--' }}</view>
               </view>
            </view>
         </view>
      </view>
      <view class="text" v-if="current == 1">
         <view class="mengceng" v-if="!details.child_list[0]?.content.summary">
            <view class="pay" @click="pay">
               {{ t('tarot_result_pay') }}{{ object.price }}{{ t('tarot_result_pay_unit') }} {{
                  t('tarot_result_ai_interpret') }}
            </view>
         </view>
         <view class="title" v-if="details.child_list[0]?.content.summary">
            <rich-text :nodes="details.child_list[0]?.content.summary"></rich-text>
         </view>
         <view class="title1" v-else>这里是解读这里是解读这里是解读这里是解读这里是解读这里是解读这里是解读这里是解读这里是解读这里是解读这里是解读</view>
      </view>
   </view>
   <view style="height: 130rpx;"></view>
   <view class="btns">
      <view class="border">
         <view @click="share" class="share">{{ t('tarot_result_share') }}</view>
         <view @click="again">{{ t('tarot_result_again') }}</view>
      </view>
   </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref } from 'vue'
import { onShow, onHide, onLoad } from '@dcloudio/uni-app'
import { tarotcardDetails, tarotcardnswer } from '@/api/tarotcards.js'
import {
   getProducts,
   createOrder,
} from '@/api/index.js'
import uma from '@/uma.js'
const current = ref(0)
const id = ref('')
const details = ref({})
const object = ref({})
const type = { 'once_single_card': t('tarot_spread_single_title'), 'once_three_card': t('tarot_spread_three_title'), 'once_multi_card': t('tarot_spread_relation_title') }
const desc = { 'once_single_card': t('tarot_spread_single_desc1') + ',' + t('tarot_spread_single_desc2'), 'once_three_card': t('tarot_spread_three_desc1') + ',' + t('tarot_spread_three_desc2'), 'once_multi_card': t('tarot_spread_relation_desc1') + ',' + t('tarot_spread_relation_desc2') }
onLoad((e) => {
   uni.setNavigationBarTitle({
      title: t('tarot_name')
   });
   id.value = e.id
   getdetails()
})
const getdetails = () => {
   getProducts().then(res => {
      object.value = res.data.results.filter(item => item.product_type == 'tarot_once')[0]
   })
   tarotcardDetails(id.value).then(res => {
      const data = JSON.parse(JSON.stringify(res.data));
      if (data.child_list && data.child_list[0] && data.child_list[0].content && data.child_list[0].content.summary) {
         data.child_list[0].content.summary = data.child_list[0].content.summary.replace(/\/n/g, '<br/>');
      }
      details.value = data;
   })
}
const again = () => {
   uni.removeStorageSync('question')
   uni.reLaunch({ url: '/pagesA/tarotcards/qusetion' })
}
const share = () => {
   uni.showToast({
      title: '暂未开放',
      icon: 'none'
   })
}
const pay = () => {
   createOrder({
      description: object.value.description,
      productId: object.value.id,
      openId: uni.getStorageSync('openId'),
      posterId: details.value.id
   }).then(res => {
      uni.requestPayment({
         "provider": "wxpay",
         ...res.data,
         "signType": "RSA",
         "package": `${res.data.prepayid}`,
         "nonceStr": res.data.noncestr,
         success(res) {
            uni.showToast({
            	title: t('proPoster.paySuccess'),
            	icon: 'success'
            })
            // pay_success()
            tarotcardnswer({ parent_id: id.value }).then(result => {
               getdetails()
            }).catch(res => {
               uni.showToast({
                  title: t('proPoster.payFailed'),
                  icon: 'none'
               })
            })

         },
         fail(e) {
            // pay_fail()
            uni.showToast({
            	title: t('proPoster.payFailed'),
            	icon: 'none'
            })
         }
      })

   })
}
//购买成功
// const pay_success = () => {
// 	params.value.eventTime = formatDateTime()
// 	if (uma && uma.trackEvent) {
// 		uma.trackEvent('pay_success', params.value)
// 	}
// }

//购买失败
// const pay_fail = () => {
// 	params.value.eventTime = formatDateTime()
// 	if (uma && uma.trackEvent) {
// 		uma.trackEvent('pay_fail', params.value)
// 	}
// }
</script>

<style lang="scss" scoped>
.page {
   height: 88vh;
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

         .img1 {
            image {
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
   height: 56vh;
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
   height: 55vh;
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

   .title1 {
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