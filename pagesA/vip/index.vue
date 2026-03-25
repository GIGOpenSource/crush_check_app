<template>
     <view class="top">
          <text v-for="(item, index) in viptype" :key="index" :class="current == index ? 'current' : ''"
               @click="current = index">{{ item }}</text>
     </view>
     <view class="content">
          <view class="vipcart">
               <image :src="$getImg('again/vipbanner')" mode="scaleToFill" />
               <view class="con">
                    <view class="t1">
                         <view class="viptitle">
                              <text class="vip">{{ current ?'SVIP':'VIP' }}</text>
                              <text class="name">{{ current ? '黄金会员':'白银会员' }}</text>
                         </view>
                         <view class="desc">{{ current ?'可享15项权益':'可享12项权益＋3次体验/月' }}</view>
                    </view>
                    <view class="t2">{{ current?'原价黄金月会员99元，会员有效期内续订79.9元':'原价白银月会员39.9，会员有效期内续订29.9元' }}</view>
               </view>
          </view>
          <view class="moneyType">
               <view class="mouth">
                    <view class="m1">
                         <view class="title">月付</view>
                         <view class="xian">
                              <text class="fu">￥</text>
                              <text>29.9/月</text>
                         </view>
                         <view class="origin">￥39.9/月</view>
                    </view>
                    <view class="m2">限时优惠</view>
               </view>
               <view class="year">
                    <view class="m1">
                         <view class="title">年付</view>
                         <view class="xian">
                              <text class="fu">￥</text>
                              <text>299.9/年</text>
                         </view>
                         <view class="origin">节省￥39.9</view>
                    </view>
                    <view class="m2">免费试用1周</view>
               </view>
          </view>
          <view class="share">
              <view v-for="(item,index) in list" :key="index" class="list" >
                 <view class="title" :style="item.bg">{{ item.title }}</view>
                 <view>{{ item.t1 }}</view>
                 <view class="t4"><up-icon name="checkbox-mark" color="#13B108" size="20"></up-icon> <text>{{ item.t2 }}</text></view>
                 <view>{{ item.t3 || ''}}</view>
                 <view class="t4" v-if="item.t4"><up-icon name="checkbox-mark" color="#13B108" size="20"></up-icon><text>{{ item.t4 || ''}}</text></view>
              </view> 
          </view>
          <view class="btn">订阅</view>
          <view class="btntile">除非在当前订阅结束前至少24小时内取消，否则订阅将自动续订。</view>
     </view>
</template>

<script setup>
import { ref ,watch} from 'vue'
const viptype = ['白银会员', '黄金会员']
const current = ref(0)
const list = ref([{
     title:'MBTI',
     t1:'单人简易版',
     t2:'无限次',
     t3:'双人简易版',
     t4:'无限次',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(110, 0, 144, 0.3) 60%);'
},{
     title:'MBTI',
     t1:'单人专业版',
     t2:'无限次',
     t3:'双人简易版',
     t4:'无限次',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(110, 0, 144, 0.3) 60%);'
},{
     title:'MBTI',
     t1:'单人进阶版',
     t2:'无限次',
     t3:'双人简易版',
     t4:'无限次',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(110, 0, 144, 0.3) 60%);'
},{
     title:`答案\n之书`,
     t1:'翻书提问',
     t2:'无限次',
     t3:'AI帮助分析',
     t4:'无限次',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(245, 157, 220, 0.3) 60%)'
},{
     title:'塔罗牌',
     t1:'三种牌阵抽牌',
     t2:'无限次',
     t3:'双人版3种测试',
     t4:'无限次',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.5) 0%, rgba(148, 105, 207, 0.5) 60%);'
},{
     title:'星座',
     t1:'运势分析',
     t2:'每日更新',
     t3:'星座配对',
     t4:'无限次',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(131, 185, 255, 0.3) 60%);'
},{
     title:'鉴渣',
     t1:'分析海报',
     t2:'1次/月',
     t3:'分析报告',
     t4:'1次/月',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(120, 233, 250, 0.3) 60%);'
},{
     title:'爱的裁判所',
     t1:'分析报告',
     t2:'1次/月',
     bg:'background: linear-gradient(0deg, rgba(230, 230, 230, 0.3) 0%, rgba(149, 141, 154, 0.3) 60%);'
}])
watch(() => {
     if(current.value == 1){
          list.value[6].t2 = '无限次'
          list.value[6].t4 = '无限次'
     }
})
</script>

<style lang="scss" scoped>
.top {
     display: flex;
     justify-content: space-around;
     margin: 20rpx 0;

     text {
          position: relative;
          font-size: 30rpx;
          padding: 10rpx 0;
     }

     .current::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 70rpx;
          height: 5rpx;
          background: #D5BDFF;
          border-radius: 2rpx;
     }
}

.content {
     margin: 0 20rpx;

     .vipcart {
          width: 100%;
          height: 300rpx;
          position: relative;

          image {
               width: 100%;
               height: 100%;
          }

          .con {
               position: absolute;
               left: 0;
               top: 0;
               width: 100%;
               height: 100%;

               .t1 {
                    margin-left: 40rpx;
                    margin-top: 40rpx;
                    margin-bottom: 80rpx;

                    .viptitle {
                         .vip {
                              font-size: 50rpx;
                              margin-right: 10rpx;
                              color: #b591ef;
                              font-weight: bold;
                         }

                         .name {
                              color: #c5b2e9;
                         }
                    }

                    .desc {
                         font-size: 24rpx;
                         margin-top: 10rpx;
                    }
               }

               .t2 {
                    text-align: center;
                    color: #CEB2FF;
                    font-size: 28rpx;
               }
          }
     }

     .moneyType {
          display: flex;
          justify-content: space-between;
          margin: 20rpx 0;

          .mouth,
          .year {
               width: 47%;
               border-radius: 20rpx;
               overflow: hidden;
               border: 1px solid #9755FF;

               box-sizing: border-box;
               .m1 {
                    width: 100%;
                    background: linear-gradient(182deg, #AEA5FE 1%, #FFFFFF 66%);
                    color: #333333;
                    padding: 30rpx 0 20rpx 30rpx;

                    .xian {
                         color: #3242F5;
                         margin: 40rpx 0 20rpx 0;
                         font-weight: bold;
                         font-size: 50rpx;
                         .fu{
                              font-size: 40rpx;
                         }
                    }
                    .origin{
                         font-size: 24rpx;
                         text-decoration: line-through;
                    }

               }

               .m2 {
                    background: #aea5fe;
                    padding: 20rpx;
                    color: #333333;
                    font-size: 26rpx;
               }
          }
          .year{
               border: 1px solid #8D8D8F;
               .m1{
                     background: linear-gradient(182deg, #8D8D8F 1%, #FFFFFF 66%);
                     
                     .xian{
                         color: #53505B;
                     }
                     .origin{
                         margin-left: 50% !important;
                     }

               }
               .m2{
                   background: #8D8D8F;
               }
          }
     }
     .share{
         border: 1px solid #958D9A;
          border-radius: 20rpx;
          background: rgba(249, 237, 254, 0.1);
          display: flex;
          flex-wrap: wrap;
          // padding: 50rpx 0;
          font-size: 28rpx;
          padding-bottom: 50rpx;
          line-height: 45rpx;
          .list{
             width: 33%;
             display: flex;
             flex-direction: column;
             align-items: center;
             margin-top: 50rpx;
             .title{
                white-space: pre-line;
                 width: 100rpx;
                 height: 100rpx;
                 border-radius: 50%;
                 border:1rpx solid #fff ;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  margin-bottom: 30rpx;
             }
             .t4{
               display: flex;
               text{
                    margin-left: 10rpx;
               }
             }
          }
     }
     .btn{
          color: #fff;
          background: #9755FF;
          width: 100%;
          height: 80rpx;
          line-height: 80rpx;
          border-radius: 80rpx;
          text-align: center;
          margin-top: 40rpx;
     }
     .btntile{
          color: #fff;
          text-align: center;
          margin-top: 20rpx;
          padding-bottom: 40rpx;
          font-size: 24rpx;
     }
}
</style>