<template>
  <view class="page">
    <view class="top">
      <text class="back" @click="back">{{ t('loveCourt.backToResult') }}</text>
      <text class="title">{{ t('loveCourt.materialTitle') }}</text>
    </view>
    <view class="content">
      <view class="name">
        <view v-for="(person, index) in people" :key="index" :class="{ 'active': current == index }"
          @click="clicks(index)">{{ person }}</view>
      </view>
      <view class="c1">
        <view class="title">{{ t('loveCourt.eventDesc') }}</view>
        <view class="descript">{{ event }}</view>
      </view>
      <view class="c1">
        <view class="title">{{ t('loveCourt.issueDesc') }}</view>
        <view class="descript">{{ question }}</view>
      </view>
      <view class="c1" v-if="imageList.length > 0">
        <view>{{ t('loveCourt.supplementaryUpload') }}</view>
        <view class="images">
          <image mode="scaleToFill" v-for="(img, index) in imageList" :key="index" :src="img" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPosterDetails } from '@/api/index.js'
import { onLoad } from '@dcloudio/uni-app'

const { t } = useI18n()
const people = ref([t('loveCourt.defaultNameA'), t('loveCourt.defaultNameB')])
const event = ref('')//事件描述
const question = ref('')//问题描述
const current = ref(0)
const details = ref({})
const imageList = ref([])
const back = () => {
  uni.navigateBack()
}

onLoad((e) => {
  if (e.id) {
    getPosterDetails(e.id).then(res => {
      details.value = res.data
      people.value[0] = details.value.business_data?.self_data?.nickname || t('loveCourt.defaultNameA')
      people.value[1] = details.value.business_data?.other_data?.nickname || t('loveCourt.defaultNameB')
       event.value = details.value.business_data?.self_data?.event_description || t('loveCourt.materialNoContent')
    question.value = details.value.business_data?.self_data?.issue_description || t('loveCourt.materialNoContent')
    imageList.value = details.value.business_data?.self_data?.supplementary_materials || []
    })
  }

})
const clicks = (index) => {
  current.value = index

  if (index == 0) {
    event.value = details.value.business_data?.self_data?.event_description || t('loveCourt.materialNoContent')
    question.value = details.value.business_data?.self_data?.issue_description || t('loveCourt.materialNoContent')
    imageList.value = details.value.business_data?.self_data?.supplementary_materials || []
  } else if (index == 1) {
    event.value = details.value.business_data?.other_data?.event_description || t('loveCourt.materialNoContent')
    question.value = details.value.business_data?.other_data?.issue_description || t('loveCourt.materialNoContent')
    imageList.value = details.value.business_data?.other_data?.supplementary_materials || []
  }
}
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
      overflow-x: auto;
      white-space: nowrap;
      padding: 0 20rpx;
      box-sizing: border-box;
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

    .images {
      display: flex;
      flex-wrap: wrap;

      image {
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