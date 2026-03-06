<template>
  <view class="page">
    <image :src="$getImg('constellation/banner')" class="banner" />
    <view class="conent">
      <image :src="$getImg('constellation/logo')" mode="widthFix" class="logo" />
      <view class="titlecon">
        <view class="t1">{{ t('start.baseInfo') }}</view>
          <view class="t2">{{ t('start.openCrushCheck') }}</view>
         
      </view>
       <!-- 组件 -->
          <ConsrProup @submit="step"/>
    </view>
  </view>
</template>

<script setup>
import ConsrProup from '@/components/ConsrProup/ConsrProup.vue'
import { timestampToIsoUtc } from '@/utils/utctTime.js'
import { create } from '@/api/constellation.js'
import {
	onLoad
} from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const latitude = ref('39.90667')
const longitude = ref('116.39750')
onLoad(() => {
  getLocationFn();
});

const getLocationFn = () =>{
  // uni.getLocation({
  //   type: 'wgs84',
  //   altitude: false,
  //   success:  (res) =>{
  //     latitude.value = res.latitude
  //     longitude.value = res.longitude
  //   },
  //   fail: function (err) {
  //     uni.showToast({
  //      title: t('start.getLocationFail'),
  //       icon: 'none'
  //     });
  //   }
  // });
}
//提交 
const step = (params) => {
   console.log(params,'parabgsb')
    params.latitude = latitude.value
    params.longitude = longitude.value
    params.data_of_birth_time = timestampToIsoUtc(params.time)
   delete params.time
    if(!uni.getStorageSync('token')) return uni.navigateTo({ url: '/pages/login/login' }) 
    create(params).then(res => {
       uni.redirectTo({
        url:'/pagesA/constellation/join'
       })
    })
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
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
    margin-bottom: 16vh;
  }
  .titlecon{
    color: #fff !important;
    margin-left: 40rpx;
    margin-bottom: 60rpx;

    .t1{
       font-size: 38rpx;
       margin-bottom: 10rpx;
       font-weight: 700;
    }
    .t2{
        font-size: 28rpx;
        font-weight: 100;
    }
  }
}
</style>