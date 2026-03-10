<template>
    <view class="invitation-friend">
        <up-popup :show="show" :closeable="true" position="bottom" round="20" @close="handleClose" @open="show = true">
            <view>
                <view class="title t1">{{ t('invitationFriend.title') }}</view>
                <view class="title">{{ t('invitationFriend.desc') }}</view>
                <view class="btn" @click="copy">{{ t('invitationFriend.copyBtn') }}</view>
                <view class="bottom">
                    <view @click="share('WXSceneSession')">
                        <image :src="$getImg('index/wx')" mode="scaleToFill" />
                        <view>{{ t('invitationFriend.wxFriend') }}</view>
                    </view>
                    <view @click="share('WXSceneTimeline')">
                        <image :src="$getImg('index/quan')" mode="scaleToFill" />
                        <view>{{ t('invitationFriend.wxTimeline') }}</view>
                    </view>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { onMounted ,ref} from 'vue'
import {
    host
} from '@/config/config.js'
const { t } = useI18n();
const  newDownloadUrl = ref('')
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String,
        default: '/static/index/yq.png'
    },
    downloadUrl: {
        type: String,
        default: '/static/index/yq.png'
    }
});
const emits = defineEmits(["update:show", "close"])
const handleClose = () => {
    emits("close");
    emits("update:show", false);
}
const share = (type) => {
    const inviterOpenId = uni.getStorageSync("openId") || "";
    const query = `?scene=${inviterOpenId}`
    uni.share({
        provider: "weixin",
        scene: type,
        type: props.imageUrl == '/static/index/yq.png' ? 0 : 2,
        title: "CrushCheck",
        summary: t('invitationFriend.shareSummary'),
        href: `https://crashcheck.net/h5/${query}`,
        imageUrl: props.imageUrl,
        success: function (res) {
            console.log("success:" + JSON.stringify(res));
        },
        fail: function (err) {
            console.log("fail:" + JSON.stringify(err));
        }
    });
}
const copy = async () => {
    
    const inviterOpenId = uni.getStorageSync("openId") || "";
    const query = `?scene=${inviterOpenId}`
    let url = props.imageUrl == '/static/index/yq.png' ? `https://crashcheck.net/h5/${query}` : await uploadFile(props.downloadUrl);
    uni.setClipboardData({
        data: url,
        success: () => {
            uni.showToast({
                title: t('invitationFriend.copySuccess'),
                icon: 'none'
            });
        }
    });

}
const uploadFile = async (filePath) => {
    console.log('filrpsartk',filePath)
    if(filePath.includes('https')) return filePath
    // 空值校验
    if (!filePath) {
        uni.showToast({ title: '文件路径不能为空', icon: 'none' });
        throw new Error('filePath is required');
    }

    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: `${host}/upload/`, // 模板字符串更规范
            filePath, // 简化传参（避免重复使用props）
            name: 'file',
            formData: {
                type: 'img',
                file_name: filePath // 使用入参而非props，提高复用性
            },
            // 移除手动设置的content-type（uni-app会自动处理）
            success: (uploadFileRes) => {
                try {
                    const resData = JSON.parse(uploadFileRes.data);
                    // 多层可选链，防止数据结构异常
                    const imageUrl = resData?.data?.url;
                    
                    if (imageUrl) {
                        resolve(imageUrl); // 异步返回结果
                    } else {
                        const errorMsg = '上传成功但未返回URL';
                        console.error(errorMsg, resData);
                        uni.showToast({ title: errorMsg, icon: 'none' });
                        reject(new Error(errorMsg));
                    }
                } catch (e) {
                    const errorMsg = '解析上传结果失败';
                    console.error(errorMsg, e, uploadFileRes.data);
                    uni.showToast({ title: errorMsg, icon: 'none' });
                    reject(e);
                }
            },
            fail: (err) => {
                const errorMsg = '文件上传失败';
                console.error(errorMsg, err);
                uni.showToast({ title: errorMsg, icon: 'none' });
                reject(err);
            }
        });
    });
};
</script>

<style lang="scss" scoped>
.invitation-friend {
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 26rpx;
}

.title {
    margin-top: 30rpx;
    text-align: center;
}

.t1 {
    font-size: 32rpx;
}

.btn {
    width: 70%;
    background: #B370FF;
    color: #fff;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 32rpx;
    margin: 40rpx auto;
    border-radius: 80rpx;
}

.bottom {
    display: flex;
    justify-content: space-around;
    width: 70%;
    margin: 0 auto;
    margin-top: 20rpx;
    margin-bottom: 20rpx;

    view {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24rpx;
    }

    image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 10rpx;
    }
}
</style>