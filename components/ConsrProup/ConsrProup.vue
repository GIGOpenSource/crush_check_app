<template>
  <view class="wrapper">
    <view class="title" :class="{ 'center': title == t('start.inputHisInfo') }">{{ title || t('start.chooseGender')}}</view>
    <view class="sex">
      <view v-for="(item, index) in sex" :key="index" @click="choosesex(index)"
        :class="{ 'girl': params.user_gender == 'female' && index == 0, 'boy': params.user_gender == 'male' && index == 1 }">
        <image :src="$getImg(params.user_gender == index ? item.current : item.images)" />
        <text>{{ item.name }}</text>
      </view>

    </view>
    <view class="birth" @click="show = true" :class="{ 'jiacu': params.data_of_birth_time }">{{
      params.data_of_birth_time || t('start.chooseBirthday')
      }}</view>
    <!-- <view class="birth">选择出生地</view> -->
    <view class="birth step" :class="{ 'status': status }" @click="submit">{{ btnText || t('start.nextStep')}}</view>
    <up-datetime-picker :show="show" v-model="params.time" mode="datetime" :maxDate="maxDate" @confirm="confirm"
      @cancel="show = false" :minDate="minDate"></up-datetime-picker>
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  title: {
    type: String,
    default: '' // 替换：选择性别：
  },
  btnText: {
    type: String,
     default: '' // 替换：下一步
  },
  data1: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(["submit"])
import { ref, reactive, computed, onMounted,watch } from 'vue'

const sex = ref([{
  name: t('start.female'), // 替换：女生
  images: 'constellation/girl',
  current: 'constellation/girl-current',
  type: 'female'
}, {
  name: t('start.male'), // 替换：男生
  images: 'constellation/boy',
  current: 'constellation/boy-current',
  type: 'male'
}])
const params = reactive(
  {
    user_gender: -1,
    data_of_birth_time: '',
    time: Date.now() //时间戳
  })
const show = ref(false);
const maxDate = ref(Date.now()) //最大时间
const minDate = -315648000000
//选择时间
const confirm = (e) => {
  params.data_of_birth_time = gettime(e.value)
  params.time = e.value
  show.value = false
}
//选择性别
const choosesex = (index) => {
  params.user_gender = sex[index].type
}

//计算属性
const status = computed(() => {
  return params.user_gender && params.data_of_birth_time
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
  const formattedDate = `${year}${t('start.year')}${month}${t('start.month')}${day}${t('start.day')} ${hours}:${minutes}`;
  return formattedDate
}

const submit = () => {
  if (!status) return uni.showToast({
    title: t('start.completeInfo'),
    icon: 'none'
  })
  emits("submit", params);
}

onMounted(() => {
  console.log(222)
  if (props.data1?.user_gender) {
    Object.assign(params, props.data1);
  }
})
watch(
  () => t('start.female'),
  () => {
    sex.value = [{
      name: t('start.female'),
      images: 'constellation/girl',
      current: 'constellation/girl-current',
      type: 'female'
    }, {
      name: t('start.male'),
      images: 'constellation/boy',
      current: 'constellation/boy-current',
      type: 'male'
    }]
  }
)
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  color: #999999;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  // margin-top: 30rpx;
  padding: 40rpx 30rpx;
  padding-bottom: 60rpx;
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

.status {
  background: linear-gradient(270deg, #9452FF 0%, #B370FF 100%);
  color: #fff;

}

.center {
  text-align: center;
}
</style>