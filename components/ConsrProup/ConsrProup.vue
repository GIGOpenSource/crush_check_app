<template>
  <view class="wrapper">
    <view class="title">选择性别：</view>
    <view class="sex">
      <view v-for="(item, index) in sex" :key="index" @click="choosesex(index)"
        :class="{ 'girl': params.user_gender == 0 && index == 0, 'boy': params.user_gender == 1 && index == 1 }">
        <image :src="$getImg(params.user_gender == index ? item.current : item.images)" />
        <text>{{ item.name }}</text>
      </view>

    </view>
    <view class="birth" @click="show = true" :class="{ 'jiacu': params.data_of_birth_time }">{{
      params.data_of_birth_time
      || '选择生日' }}</view>
    <view class="birth">选择出生地</view>
    <view class="birth step" :class="{'status':status}">下一步</view>
    <up-datetime-picker :show="show" v-model="value1" mode="datetime" :maxDate="maxDate" @confirm="confirm"
      @cancel="show = false"></up-datetime-picker>
  </view>
</template>

<script setup>
const props = defineProps({
})
import { ref, reactive ,computed} from 'vue'
const sex = [{
  name: '女生',
  images: 'constellation/girl',
  current: 'constellation/girl-current',
  type: 0
}, {
  name: '男生',
  images: 'constellation/boy',
  current: 'constellation/boy-current',
  type: 1
}]
const params = reactive(
  {
    user_gender: -1,
    data_of_birth_time: '',
    area: '11'
  })
const show = ref(false);
const value1 = ref(Date.now());
const maxDate = ref(Date.now()) //最大时间
//选择时间
const confirm = (e) => {
  value1.value = e.value
  params.data_of_birth_time = gettime(e.value)
  show.value = false
}
//选择性别
const choosesex = (index) => {
  params.user_gender = index
  console.log(params.user_gender, 'params.user_gender')
}

//计算属性
const status = computed(() => {
    return params.user_gender && params.data_of_birth_time && params.area
})


const gettime = (time) => {
  const timestamp = time
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes}`;
  return formattedDate
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  color: #999999;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  margin-top: 30rpx;
  padding: 60rpx 30rpx;
  box-sizing: border-box;

  .title {
    color: #000;
  }
}

.sex {
  display: flex;
  justify-content: space-between;
  margin: 40rpx 0;

  view {
    width: 45%;
    height: 100rpx;
    display: flex;
    align-items: center;
    background: #EEEEEE;
    border-radius: 100rpx;
  }

  image {
    width: 50rpx;
    height: 50rpx;
    margin-left: 50rpx;

  }

  text {
    margin-left: 80rpx;
  }

  .girl {
    background: linear-gradient(90deg, #FFCBCB 0%, #FA8181 100%);
    color: #fff;
  }

  .boy {
    background: linear-gradient(90deg, #8DBAFD 0%, #828CFF 100%);
    color: #fff;
  }
}

.birth {
  width: 100%;
  height: 120rpx;
  background: #EEEEEE;
  border-radius: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;

  .jiacu {
    color: #000;
    font-weight: bold;
  }
}

.step {
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 90rpx;
  margin-top: 80rpx;
}
.status{
   background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
   color: #fff;
}
</style>