<template>
   <view class="page">
      <view>{{ t('tarot_result_question_label') }}{{ details.summary }}</view>
      <!-- <up-read-more :showHeight="200" :toggle="true" textIndent="0em" :shadowStyle="shadowStyle">
         <rich-text :nodes="t('tarot_result_question_label') + details.summary"></rich-text>
      </up-read-more> -->

      <view class="cards">
         <view class="left">
            <view class="one" v-if="details.parse_type == 'once_single_card'">
               <image v-for="(item, index) in details.tarot_cards_list" :src="item.image_url" mode="scaleToFill" :style="{transform: item.is_reversed == 1 ? 'rotate(180deg)' : ''}"/>
            </view>
            <view class="three" v-if="details.parse_type == 'once_three_card'">
               <image v-for="(item, index) in details.tarot_cards_list" :src="item.image_url" mode="scaleToFill" :style="{transform: item.is_reversed == 1 ? 'rotate(180deg)' : ''}"/>
            </view>
            <view class="fire" v-if="details.parse_type == 'once_multi_card'">
               <view class="img1">
                  <image :src="details.tarot_cards_list[2].image_url" mode="scaleToFill" :style="{transform: details.tarot_cards_list[2].image_url == 1 ? 'rotate(180deg)' : ''}"/>
               </view>
               <view>
                  <image :src="details.tarot_cards_list[0].image_url" mode="scaleToFill" :style="{transform: details.tarot_cards_list[0].image_url == 1 ? 'rotate(180deg)' : ''}"/>
                  <image :src="details.tarot_cards_list[3].image_url" mode="scaleToFill" :style="{transform: details.tarot_cards_list[0].image_url == 1 ? 'rotate(180deg)' : ''}"/>
                  <image :src="details.tarot_cards_list[1].image_url" mode="scaleToFill" :style="{transform: details.tarot_cards_list[0].image_url == 1 ? 'rotate(180deg)' : ''}"/>
               </view>
               <view class="img1">
                  <image :src="details.tarot_cards_list[4].image_url" mode="scaleToFill" :style="{transform: details.tarot_cards_list[0].image_url == 1 ? 'rotate(180deg)' : ''}"/>
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
               <image :src="item.image_url" mode="scaleToFill" :style="{transform: item.is_reversed == 1 ? 'rotate(180deg)' : ''}"/>
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
            <view class="pay" @click="pay" v-if="details.children_status == 'error' || !details.children_status">
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
         <view @click="share1" class="share">{{ t('tarot_result_share') }}</view>
         <view @click="again">{{ t('tarot_result_again') }}</view>
      </view>
   </view>
   <up-popup :show="showDelPopup2" mode="center" @close="showDelPopup2 = false">
      <view class="del-popup-content">
         <scroll-view scroll-y class="gundong">
            <invitationPoster ref="poster" v-if="show" @success="success" :info="details">
            </invitationPoster>
         </scroll-view>
         <view class="gaosuta" @click="share">{{ t('answerBook.tellTA') }}</view>
      </view>
   </up-popup>
   <InvitationFriend :show="friend" @close="friend = false" :imageUrl="shareurl" :downloadUrl="shareurl" />
   <IndexProup :show="showProgress" @close="handleProgressClose" :cha="true" :height="125">
      <template #content>
         <view class="pcontent">
            <view class="num">{{ t('index.analyzingPercent') }} {{ progress }}{{ t('index.analyzingPercentUnit') }}
            </view>
            <view class="progress-wrapper">
               <view class="custom-progress">
                  <view class="progress-track">
                     <view class="progress-fill" :style="{ width: progress + '%' }"></view>
                  </view>
               </view>
            </view>
            <view class="tip">{{ t('index.exitTipTestRecord') }}</view>
         </view>
      </template>
   </IndexProup>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const showProgress = ref(false)
import { ref, reactive } from 'vue'
import { onShow, onHide, onLoad } from '@dcloudio/uni-app'
import { tarotcardDetails, tarotcardnswer } from '@/api/tarotcards.js'
import { ios_receipt, uploadImages,iosOrder } from '@/api/index.js'
import invitationPoster from '@/components/invitationPoster/invitationPoster.vue';
import InvitationFriend from '@/components/InvitationFriend/InvitationFriend.vue'
import {
   getProducts,
   createOrder,
} from '@/api/index.js'
import {
		host
	} from '@/config/config.js';
// import uma from '@/uma.js'
const shadowStyle = reactive({
   backgroundImage: "none",
   paddingTop: "0",
   marginTop: "20rpx",
   maxHeight: '100rpx'
});
const shareurl = ref('')
const current = ref(0)
const id = ref('')
const details = ref({})
const object = ref({})
const posterImg = ref('')
const show = ref(false)
const friend = ref(false)
const progress = ref(0)
const showDelPopup2 = ref(false)
const progressTimer = ref(null)
const type = { 'once_single_card': t('tarot_spread_single_title'), 'once_three_card': t('tarot_spread_three_title'), 'once_multi_card': t('tarot_spread_relation_title') }
const desc = { 'once_single_card': t('tarot_spread_single_desc1') + ',' + t('tarot_spread_single_desc2'), 'once_three_card': t('tarot_spread_three_desc1') + ',' + t('tarot_spread_three_desc2'), 'once_multi_card': t('tarot_spread_relation_desc1') + ',' + t('tarot_spread_relation_desc2') }
onLoad((e) => {
   uni.setNavigationBarTitle({
      title: t('tarot_name')
   });
   id.value = e.id
   getdetails()
})
const success = (e) => {
   posterImg.value = e
}
const getdetails = () => {
   getProducts().then(res => {
      object.value = res.data.results.filter(item => item.product_type == 'ios_tarot_once')[0]
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
   uni.navigateTo({ url: '/pagesA/tarotcards/qusetion' })
}
const share1 = () => {
   show.value = true,
      showDelPopup2.value = true
}
const share = () => {
   shareurl.value = posterImg.value
   friend.value = true
}
const pay = () => {
   const systemInfo = uni.getSystemInfoSync();
   if (systemInfo.platform === 'ios') {
      iosOrder({
         description: object.value.description,
         openId: uni.getStorageSync('openId'),
         productId: object.value.id,
         posterId: details.value.id
      })
         .then(res => {
            let paymentData = res.data
            plus.payment.getChannels(function (channels) {
               let iapChannel = channels.find(c => c.id === 'appleiap');
               if (!iapChannel) {
                  uni.showToast({
                     title: '未找到苹果支付通道',
                     icon: 'none'
                  });
                  return;
               }
               console.log('paymentData', paymentData)
               iapChannel.requestProduct([paymentData.productid], function (res) {
                  uni.requestPayment({
                     provider: 'appleiap',
                     orderInfo: {
                        productid: res[0].productid,
                        quantity: 1,
                        username: paymentData.username,
                        manualFinishTransaction: false,
                        paymentDiscount: '否'
                     },
                     success: (e) => {
                        ios_receipt(e).then(res => {
                            submit()
                        })
                           .catch(err => {
                              console.log('weeee', errr)
                           })


                     },
                     fail: (err) => {
                        uni.showToast({
                           title: t('proPoster.payFailed'),
                           icon: 'none'
                        })
                        // showDelPopup2.value = false
                     }
                  })

               }, function (err) {
                  console.error('IAP 商品信息获取失败:', err);
                  uni.showToast({
                     title: '商品信息获取失败',
                     icon: 'none'
                  });
               });
            }, function (e) {
               console.error('获取支付通道失败:', e);
               uni.showToast({
                  title: '支付通道获取失败',
                  icon: 'none'
               });
            });
         })
         .catch(err => {
            // showDelPopup2.value = false
         })
   } else {
      mockOrder({
         description: mouth.value.description,
         openId: uni.getStorageSync('openId'),
         productId: mouth.value.id,
         posterId: details.value.poster_id
      })
         .then(res => {
            // showDelPopup2.value = false
         })
         .catch(err => {
            // showDelPopup2.value = false
         })
   }
}

	const handleProgressClose = () => {
		// 清除进度条定时器
		if (progressTimer.value) {
			clearInterval(progressTimer.value)
			progressTimer.value = null
		}
		showProgress.value = false
		progress.value = 0
		getdetails()
	}

const submit = () => {
   showProgress.value = true
   progress.value = 0
   if (progressTimer.value) {
      clearInterval(progressTimer.value)
      progressTimer.value = null
   }
   progressTimer.value = setInterval(() => {
      if (progress.value >= 99) {
         clearInterval(progressTimer.value)
         progressTimer.value = null
         return
      }
      progress.value++
   }, 20)
   let params = { parent_id: id.value }
   console.log(params,'oaiajush')
   uni.request({
      url: host + '/tarotcard/generate_tarotcard_deep/',
      data: params,
      header: {
         token: uni.getStorageSync('token'),
         "Accept-Language": uni.getStorageSync('currentLanguage') || 'zh'
      },
      method: 'GET',
      timeout: 1500000,
      complete: (data) => {
         if (progressTimer.value) {
            clearInterval(progressTimer.value)
            progressTimer.value = null
         }
         if (data.data.code == 200 || data.data.code == 201) {
            progress.value = 100
            getdetails()
            setTimeout(() => {
               showProgress.value = false
            }, 500)
         } else {
            showProgress.value = false
            progress.value = 0
         }
      }
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
.del-popup-content {
   width: 100%;
   height: 700rpx;
   border-radius: 10rpx;
   background: #2B2848;
   border: 1rpx solid #fff;
   box-sizing: border-box;
   position: relative;

   .gaosuta {
      background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
      width: 300rpx;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 80rpx;
      margin: 30rpx auto;
      text-align: center;
   }

   .gundong {
      height: 550rpx;
      // overflow-y: scroll;
   }
}

.page {
   height: 88vh;
   margin: 20rpx 25rpx;
   background: rgba(255, 255, 255, 0.1);
   box-sizing: border-box;
   border: 0.5rpx solid #FFFFFF;
   border-radius: 10rpx;
   font-weight: 300;
   padding: 30rpx;
   overflow-y: scroll;
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
   // height: 56vh;
   // overflow-y: scroll;
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

.pcontent {
   width: 420rpx;
   height: 250rpx;
   padding: 40rpx 0;
   padding-bottom: 0;
   display: flex;
   flex-direction: column;
   align-items: center;

   .num {
      font-size: 26rpx;
      margin: 20rpx 0;
      color: #000;
   }

}

.progress-wrapper {
   width: 70%;
   margin: 10rpx auto;
   margin-bottom: 20rpx;
}

.custom-progress {
   width: 100%;
}

.progress-track {
   position: relative;
   width: 100%;
   height: 40rpx;
   background-color: #ffffff;
   border-radius: 40rpx;
   border: 1px solid #e0e0e0;
   box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
   overflow: hidden;
}

.progress-fill {
   height: 100%;
   background: linear-gradient(90deg, #C084FC 0%, #9333EA 100%);
   background-image: repeating-linear-gradient(-45deg,
         #C084FC 0rpx,
         #D4A5F8 3rpx,
         #9333EA 7rpx,
         #9333EA 7rpx,
         #D4A5F8 10rpx,
         #C084FC 10rpx,
         #C084FC 10rpx,
         #D4A5F8 13rpx,
         #9333EA 17rpx,
         #9333EA 17rpx,
         #D4A5F8 20rpx,
         #C084FC 20rpx);
   border-radius: 40rpx;
   transition: width 0.3s ease;
   position: relative;
}

.tip {
   font-size: 20rpx;
   color: #a0a0a0;
   margin-top: 15rpx;
   width: 90%;
   text-align: center;
}

.num {
   font-size: 36rpx;
   margin: 20rpx 0;
   color: #000;
   font-weight: 100;
}
</style>
<style>
.u-safe-bottom {
   height: 0 !important;
}
</style>