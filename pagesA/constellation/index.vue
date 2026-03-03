<template>
  <view class="page">
    <image :src="$getImg('constellation/banner')" class="banner" />
    <view class="conent">
      <image :src="$getImg('constellation/logo')" mode="widthFix" class="logo" />
      <view class="titlecon">
         <view class="t1">输入基本信息</view>
          <view class="t2">开启CrushCheck</view>
         
      </view>
       <!-- 组件 -->
          <ConsrProup @submit="step"/>
    </view>
  </view>
</template>

<script setup>
import ConsrProup from '@/components/ConsrProup/ConsrProup.vue'
//提交 
const step = () => {
  
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
  .titlecon{
    color: #fff !important;
    margin-left: 40rpx;
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