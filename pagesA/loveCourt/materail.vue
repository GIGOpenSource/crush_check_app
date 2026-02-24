<template>
  <view class="page">
    <view class="top">
      <text class="back">返回结果</text>
      <text class="title">爱的裁判所附件查看</text>
    </view>
    <view class="content">
      <view class="name">
        <view v-for="(person, index) in people" :key="index" :class="{ 'active': current == index }"
          @click="current = index">{{ person }}</view>
      </view>
      <view class="c1">
        <view class="title">事件描述:</view>
        <view class="descript">{{ event }}</view>
      </view>
      <view class="c1">
        <view class="title">问题描述:</view>
        <view class="descript">{{ question }}</view>
      </view>
      <view class="c1">
        <view>补充材料上传:</view>
        <view class="images">
          <image
            :src="$getImg('index/tarotcards')"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const people = ref(['张三', '李四']) //人物
const event = ref('12345')//事件描述
const question = ref('111')//问题描述
const current = ref(0)
</script>

<style lang="scss" scoped>
.page {
  padding: 20rpx 30rpx;
}

.top {
  display: flex;
  align-items: center;
  margin-top: 20rpx;

  .back {
    color: rgba(255, 255, 255, 0.5);
    font-size: 26rpx;
  }

  .title {
    margin-left: 16%;
  }
}

.content {
  background: rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border: 0.5rpx solid #FFFFFF;
  border-radius: 10rpx;
  min-height: 90vh;
  margin-top: 30rpx;
  padding: 20rpx;
  box-sizing: border-box;

  .name {
    display: flex;
    justify-content: center;
    margin-top: 20rpx;

    view {
      width: 250rpx;
      height: 75rpx;
      line-height: 75rpx;
      border-radius: 75rpx;
      background: rgba(255, 255, 255, 0.04);
      border: 0.5px solid rgba(255, 255, 255, 0.17);
      text-align: center;
      font-size: 28rpx;
      margin-right: 20rpx;
    }

    .active {
      background: rgba(255, 255, 255, 0.5);
      font-weight: bold;
      font-size: 32rpx;
    }
  }

  .c1 {
    margin-top: 40rpx;

    .title {
      margin-bottom: 20rpx;
      margin-left: 20rpx;
      font-size: 28rpx;
    }

    .descript {
      background: rgba(255, 255, 255, 0.04);
      border: 0.5px solid rgba(255, 255, 255, 0.17);
      padding: 20rpx;
      border-radius: 20rpx;
    }
    .images{
      display: flex;
      flex-wrap: wrap;
     
      image{
        width: 30%;
        height: 200rpx;
        object-fit: cover;
        margin-left: 3%;
         margin-top: 20rpx;
      }
    }
  }
}
</style>