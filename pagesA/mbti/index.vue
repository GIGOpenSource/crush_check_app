<template>
    <view class="page">
        <view class="titlecon">
            <view class="t1">MBTI测试</view>
            <view class="t2">探索你的性格特征，发现更好的自己，了解你与他人 的匹配关系</view>
        </view>
        <view class="con" v-for="(item, index) in choose" :key="index">
            <view class="t1">{{ item.title }}</view>
            <view class="text">{{ item.text }}</view>
        </view>
        <view class="con">
            <view class="t2">16人格详解</view>
            <!-- <view class="text1"> -->
                <up-read-more showHeight="100" textIndent="0em" :toggle="true" color="#9A90FF" closeText="查看全部" :shadowStyle="shadowStyle">
                    <rich-text :nodes="content"></rich-text>
                </up-read-more>
            <!-- </view> -->
            <view v-for="(item, index) in renge" :key="index" class="renge" :style="{ background: borderColor[index] }">
                <text>{{ item.t1 }}</text>
                <text>{{ item.t2 }}</text>
                <text>{{ item.t3 }}</text>
                <text>{{ item.t4 }}</text>
            </view>
        </view>
    </view>
</template>

<script setup>
    import { reactive } from 'vue';  
const shadowStyle = reactive({   
  shadowStyle: {  
  backgroundImage: "none"
  }  
})
const choose = [{
    title: '单人MBTI测试',
    text: '过一系列精心设计的问题，探索你的 性格类型，了解个人优势、弱点和潜在 特征'
}, {
    title: '双人匹配MBTI测试',
    text: '邀请你的伙伴一起测试，生成专属 的MBTI联系匹配报告，探索你们的 相处模式'
}]
const renge = [{
    t1: 'ENTJ >',
    t2: 'ENTP >',
    t3: 'INTP >',
    t4: 'INTJ >'
}, {
    t1: 'ENFJ >',
    t2: 'INFJ >',
    t3: 'INFP >',
    t4: 'ENTJ >'
}, {
    t1: 'ESTJ >',
    t2: 'ISTJ >',
    t3: 'ISFJ >',
    t4: 'ESFJ >'
}, {
    t1: 'ESTP >',
    t2: 'ISTP >',
    t3: 'ISFP >',
    t4: 'ESFP >'
}]
const borderColor = { 0: '#827DB9', 1: '#7DB983', 2: '#7D9CB9', 3: '#B99C7D' }
const content = '16型人格（MBTI）是基于荣格理论发展的人格分类 系统，通过四个维度（外向/内向、实感/直觉、思 考/情感、判断/感知）组合出16种性格类型，旨在 帮助人们了解自我、理解他人，并在职业发展、人 际关系中提供参考，每种类型有其独特的优缺点和 偏好。 '
</script>

<style lang="scss" scoped>
rich-text{
    color: #ffffff !important;
    font-size: 28rpx !important;
}
.page {
    height: 96vh;
    margin: 20rpx 25rpx;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 300;
    overflow-y: scroll;
}

.titlecon {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20rpx 60rpx;

    .t1 {
        margin-top: 40rpx;
    }

    .t2 {
        font-size: 26rpx;
        text-align: center;
        margin-top: 30rpx;
        line-height: 38rpx;
    }
}

.con {
    background: rgba(255, 255, 255, 0.1);
    padding: 30rpx 35rpx;
    margin: 0 20rpx 20rpx 20rpx;
    border-radius: 20rpx;
    .text,
    .text1 {
        width: 70%;
        font-size: 26rpx;
        line-height: 40rpx;
    }

    .t1 {
        margin-bottom: 10rpx;
    }

    .t2 {
        margin-bottom: 25rpx;
    }

    .text1 {
        width: 100%;
    }
}

.renge {
    margin-top: 20rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    border-radius: 80rpx;
}
</style>