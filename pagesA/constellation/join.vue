<template>
  <view class="page">
    <image :src="$getImg('constellation/banner')" class="banner" />
    <view class="conent">
      <image :src="$getImg('constellation/logo')" mode="widthFix" class="logo" />
      <view class="titlecon">
         <view class="t1">{{ t('start.t1') }}</view>
         <view class="list" v-for="(item,index) in list" :key="index">{{ item }}</view>
      </view>
   <view class="btn" @click="btn">{{ t('start.btnText') }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref,onMounted } from 'vue'
const list = ref(['太阳双鱼','月亮水瓶','上升双子'])
import { getinfo } from '@/api/constellation.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
onMounted(() => {
  getinfo().then(res =>{
    let data = res.data.results[0]
     list.value[0] =t('start.sun') +  data.sun_sign.slice(0,2)
     list.value[1] = t('start.moon') +  data.moon_sign.slice(0,2)
     list.value[2] = t('start.asc') + data.asc_sign.slice(0,2)
  })
})
const btn = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
}

.banner {
  width: 100vw;
  height: 100vh;
}

.conent {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  .logo{
    width: 150rpx;
    margin: 20vh auto;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-bottom: 13vh;
  }

}
.titlecon{
     margin-left: 100rpx;
     margin-top: 50rpx;
    .t1{
        font-size: 30rpx;
        margin-bottom: 60rpx;
    }
    .list{
        width: 420rpx;
        height: 100rpx;
        border-radius: 100rpx;
        line-height: 100rpx;
        text-align: center;
        background: rgba(255, 255, 255, 0.26);
        color: #fff;
        margin-bottom: 20rpx;
    }
    view:nth-of-type(3){
        margin-left: 140rpx;
    }
}
.btn{
    background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
    color: #fff;
    margin: 80rpx 40rpx;
    text-align: center;
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 100rpx;
     margin-top: 160rpx;
}
</style>