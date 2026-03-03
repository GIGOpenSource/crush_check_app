<template>
    <view class="page">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
            <view class="navbar-content">
                <view class="navbar-back" @click="goBack">
                    <up-icon name="arrow-left" color="#ffffff" size="24"></up-icon>
                </view>
                <view class="navbar-title">CrushCheck</view>
            </view>
        </view>
        <view class="page-body" :style="{ marginTop: (statusBarHeight + 108) + 'rpx' }">
            <view class="titlecon">
                <view class="t1">
                    <text>{{ t('loveCourt.title') }}</text>
                    <view @click="tishi = true"><up-icon name="error-circle" color="#ffffff" size="15"></up-icon>
                    </view>
                </view>
                <view class="del" @click="showDelPopup = true">{{ t('loveCourt.clear') }}</view>
            </view>
            <view class="content">
                <view class="input"><input type="text" v-model="params.nickname"
                        :placeholder="t('loveCourt.placeholderNickname')" placeholder-style="color:#ffffff;"></view>
                <view>
                    <textarea v-model="params.event_description" :placeholder="t('loveCourt.placeholderEvent')"
                        placeholder-style="color:#ffffff;" auto-height maxlength="1000"></textarea>
                </view>
                <view>
                    <textarea v-model="params.issue_description" :placeholder="t('loveCourt.placeholderIssue')"
                        placeholder-style="color:#ffffff;" auto-height maxlength="1000"></textarea>
                </view>
                <view class="title">{{ t('loveCourt.supplementaryUpload') }}</view>
                <!-- 照片 -->
                <view class="images">
                    <view class="update" v-for="(item, index) in params.supplementary_materials" :key="index">
                        <image :src="item" mode="scaleToFill" />
                        <view class="close" @click="removeImage(index)"><up-icon name="close" color="#ffffff"
                                size="26"></up-icon></view>
                    </view>
                    <view class="update" @click="addImage" v-if="params.supplementary_materials.length < 3">+</view>
                </view>
            </view>
            <view class="bottom">
                <view class="top"> <up-avatar :src="userinfo.other_status == null ? '' : userinfo.avatar"
                        size="36"></up-avatar>
                    <!-- 昵称 -->
                    <text>{{ userinfo.other_status == null ? t('loveCourt.notInvited') : userinfo.nickname ||
                        t('loveCourt.userNickname') }}</text>
                    <!-- 状态 -->
                    <text v-if="userinfo.other_status">{{ statusText[userinfo.other_status] }}</text>

                </view>
                <view class="btn" @click="btnInvite('share')" v-if="!userinfo.other_status">
                    <image :src="$getImg('add/wx')" mode="widthFix" /> {{ t('loveCourt.forwardInvite') }}
                </view>
                <view class="btn" @click="btnInvite('save')" v-if="userinfo.other_status">
                    {{ t('loveCourt.submitContent') }}
                </view>
            </view>
        </view>
    </view>
    <!-- 恋爱裁判所弹框  -->
    <IndexProup :show="tishi" @close="tishi = false">
        <template #content>
            <view class="tishi">
                <view class="title">{{ t('loveCourt.trialTitle') }}</view>
                <scroll-view class="agreement-content" scroll-y>
                    <rich-text v-if="userAgreementContent" :nodes="userAgreementContent"
                        class="richtext-content"></rich-text>
                </scroll-view>
                <view class="btn" @click="tishi = false">{{ t('loveCourt.goUse') }}</view>
                <view style="height: 15rpx;"></view>
            </view>

        </template>
    </IndexProup>
    <!-- 邀请弹窗 -->
    <up-popup :show="invite" @close="invite = false" @open="invite = true" mode="center">
        <view class="tishi tishi1">
            <view>{{ t('loveCourt.inviteMessageTitle') }}</view>
            <textarea :placeholder="t('loveCourt.invitePlaceholder')" v-model="params.send_word"></textarea>
            <view class="btn" @click="copy">
                <button open-type="share" hover-class="none">复制链接去邀请</button>
            </view>
            <view class="cancel" @click="invite = false">{{ t('loveCourt.cancel') }}</view>
        </view>
    </up-popup>
    <!-- 接受弹窗 -->
    <up-popup :show="invited" @close="invited = false" @open="invited = true" mode="center">
        <view class="tishi tishi1">
            <view> <text style="color:red;margin-right: 20rpx;">{{ inviteName || t('loveCourt.userNickname') }}</text>
                <text>{{ t('loveCourt.inviteYouJoin') }}</text>
            </view>
            <view class="content1">{{ t('loveCourt.taSayToYou') }}{{ content || t('loveCourt.defaultSummons') }}</view>
            <view class="btn" @click="agree">
                <button>{{ t('loveCourt.agreeToChat') }}</button>
            </view>
            <view class="cancel" @click="cancelInvite">{{ t('loveCourt.cancel') }}</view>
        </view>
    </up-popup>
    <!-- 删除 -->
    <up-popup :show="showDelPopup" mode="center">
        <view class="del-popup-content">
            <image class="del-popup-icon" :src="$getImg('my/shanchu')"></image>
            <view class="del-popup-title"> {{ t('loveCourt.confirmClearAll') }}</view>
            <view class="del-popup-actions">
                <view class="del-popup-btn cancel" @click="showDelPopup = false">{{ t('loveCourt.cancel') }}</view>
                <view class="del-popup-btn confirm" @click="clearContent">{{ t('loveCourt.confirm') }}</view>
            </view>
        </view>
    </up-popup>
    <!-- 分析 -->
    <IndexProup :show="showProgress" @close="handleExit" :cha="false" :height="125">
        <template #content>
            <view class="pcontent">
                <view style="color:#000">{{ t('loveCourt.judgeProcessing') }}</view>
                <!-- <view class="num">正在仔细分析详情...</view> -->
                <!-- <view class="progress-wrapper">
                    <view class="custom-progress">
                        <view class="progress-track">
                            <view class="progress-fill" :style="{ width: progress + '%' }"></view>
                        </view>
                    </view>
                </view> -->
                <view class="tip">{{ t('loveCourt.exitTipRecord') }}</view>
                <view class="btn" @click="handleExit">{{ t('loveCourt.exit') }}</view>
            </view>
        </template>
    </IndexProup>
    <!-- 是否放弃之前作答 -->
    <up-popup :show="showDelPopup2" mode="center" @close="showDelPopup2 = false">
        <view class="del-popup-content">
            <image class="del-popup-icon" :src="$getImg('my/gantanhao')"></image>
            <view class="title1" style="color:#000;margin-bottom: 20rpx;">{{ t('loveCourt.unfinishedContinue') }}</view>
            <view class="del-popup-actions">
                <view class="del-popup-btn cancel" @click="btn(false)">{{ t('loveCourt.giveUpMediation') }}</view>
                <view class="del-popup-btn confirm" @click="btn(true)">{{ t('loveCourt.continueStatement') }}</view>
            </view>
        </view>
    </up-popup>
    <!-- 是否放弃之前作答 -->
    <up-popup :show="showDelPopup3" mode="center" @close="showDelPopup3 = false">
        <view class="del-popup-content">
            <image class="del-popup-icon" :src="$getImg('my/gantanhao')"></image>
            <view class="title1" style="color:#000;margin-bottom: 40rpx;">{{ t('loveCourt.exitSaveDraft') }}</view>
            <view class="del-popup-actions">
                <view class="del-popup-btn cancel" @click="baocao(false)">{{ t('loveCourt.no') }}</view>
                <view class="del-popup-btn confirm" @click="baocao(true)">{{ t('loveCourt.yes') }}</view>
            </view>
        </view>
    </up-popup>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import IndexProup from '@/components/IndexProup/IndexProup.vue'
import { ref, computed, onMounted } from 'vue'
import {
    host
} from '@/config/config.js'
import { saveLoveCourtRecord, getUserJoinedStatus, getRecords, deleteRecords } from '@/api/loveCourt.js'
import { getSystemContent } from "@/api/login.js";
import {
    onLoad,
    onShow,
    onShareAppMessage,
    onPullDownRefresh,
    onUnload
} from '@dcloudio/uni-app'
import { onUnmounted } from 'vue'
import { aesEncrypt } from '@/utils/crypto.js';
const tishi = ref(false)
const userAgreementContent = ref('2222222')
const invite = ref(false)
const invited = ref(false)
const content = ref('')
const showDelPopup = ref(false)
const showProgress = ref(false)
const progress = ref(0)
const params = ref({
    nickname: '', //昵称
    event_description: '',//事件
    issue_description: '',//问题点
    supplementary_materials: [],//上传图片
    status: "draft",//状态
    poster_id: '',
    invitation_code: '',//被邀请者id
    share_status: '',
    send_word: ""
}) //初始化参数
const invitation_code = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const speak = ref('') //想法
const inviteName = ref('') //邀请人昵称
const userinfo = ref({})
const statusBarHeight = ref(0)
const posterIdFromInvite = ref(false) //轮询
const statusText = computed(() => ({ 'waiting': t('loveCourt.statusInputing'), 'done': t('loveCourt.statusSubmitted') }))
const showDelPopup2 = ref(false)
const showDelPopup3 = ref(false)
const recode = ref({ other_status: null })
/** 关弹窗可能触发 onShow，设为 true 时 onShow 内不启动轮询并会 stopPolling */
const skipNextShowPolling = ref(false)
onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    const pxToRpx = (systemInfo.windowWidth || 375) / 375 * 2
    statusBarHeight.value = (systemInfo.statusBarHeight || 0) * pxToRpx
})
onLoad((e) => {
   inviteName.value = e.nickname == 'null' ? t('loveCourt.userNickname') : e.nickname
    content.value = e.speak  == 'undefined' ? t('loveCourt.defaultSummons') : e.speak
    invitation_code.value = e.invitation_code ? JSON.parse(decodeURIComponent(e.invitation_code)) : ''
    if (e.invitation_code) {
        invited.value = true
        params.value.invitation_code = e.invitation_code ? JSON.parse(decodeURIComponent(e.invitation_code)) : ''
        posterIdFromInvite.value = true
        
    }
    if(!invitation_code.value){
        fetchDrafts()
    }
    getSystemContent('trial_agreement').then(res => {
        console.log(res,'reeeee')
        userAgreementContent.value = res.data[0].trial_agreement
    })
})
onUnload(() => {
    if (!params.value.poster_id && (params.value.nickname !== '' || params.value.event_description !== '' || params.value.issue_description !== '' || params.value.supplementary_materials.length !== 0)) {
        btnInvite('cao')
    }
    params.value.poster_id = ''
    stopPolling()
})
const goBack = () => {
    console.log(recode.value.poster_id, 'recode.value')
    if (recode.value.poster_id) {
        showDelPopup3.value = true
    } else if (!recode.value.poster_id) {
        uni.switchTab({
            url: '/pages/index/index'
        })
    }

}
//上传图片
const addImage = () => {
    if (params.value.supplementary_materials.length >= 3) {
        uni.showToast({
            title: t('index.maxUploadSix'),
            icon: 'none'
        })
        return
    }
    uni.chooseImage({
        count: 3 - params.value.supplementary_materials.length,
        type: 'file',
        success: async (res) => {
            uploading.value = true
            uploadProgress.value = 0
            uni.showLoading({
                title: t('index.uploading'),
                mask: true
            });
            // if (res.errMsg == 'chooseImage:ok') {
            //     click_album()
            // } else {
            //     click_camera()
            // }
            // photo_upload_start()
            const uploadPromises = res.tempFilePaths.map((filePath, index) => {
                return new Promise((resolve, reject) => {
                    uni.uploadFile({
                        url: host + '/upload/',
                        filePath: filePath,
                        name: 'file',
                        formData: {
                            type: 'img',
                            file: filePath,
                            file_name: filePath,
                        },
                        success: (uploadFileRes) => {
                            try {
                                let images = JSON.parse(uploadFileRes.data).data.url
                                params.value.supplementary_materials.push(images)

                                uploadProgress.value = ((index + 1) / res.tempFilePaths.length) * 100
                                resolve(images)

                            } catch (error) {
                                console.log(error, 'parse error')
                                reject(error)

                            }
                        },
                        fail: (err) => {
                            console.log(err, 'upload error')
                            reject(err)
                        }
                    });
                });
            });

            try {
                // photo_upload_success()
                await Promise.all(uploadPromises)
                uni.hideLoading()
                uni.showToast({
                    title: t('index.uploadSuccess'),
                    icon: 'none'
                })
            } catch (error) {
                // photo_upload_fail()
                uni.hideLoading()
                uni.showToast({
                    title: t('index.partUploadFailed'),
                    icon: 'none'
                })
            } finally {
                uploading.value = false
                uploadProgress.value = 0
            }
        },
        fail: (err) => {
            // upload_cancel()
            uploading.value = false
        }
    });
}
//删除图片
const removeImage = (index) => {
    params.value.supplementary_materials.splice(index, 1)
}
//转发邀请
const btnInvite = (type) => {
    if (type == 'save') {
        if (!params.value.nickname) {
            uni.showToast({
                title: t('loveCourt.pleaseInputNickname'),
                icon: 'none'
            })
            return
        }
        if (!params.value.event_description) {
            uni.showToast({
                title: t('loveCourt.pleaseInputEvent'),
                icon: 'none'
            })
            return
        }
        if (!params.value.issue_description) {
            uni.showToast({
                title: t('loveCourt.pleaseInputIssue'),
                icon: 'none'
            })
            return
        }
    }

    if (!uni.getStorageSync('token')) {
        uni.navigateTo({ url: '/pages/login/login' })
        return
    }
    if (!params.value.poster_id) delete params.value.poster_id
    if (!params.value.invitation_code) delete params.value.invitation_code
    if (type == 'save') {
        params.value.status = 'done'
        delete params.value.share_status
        delete params.value.send_word
    } else if (type == 'share') {
        params.value.status = 'draft'
        params.value.share_status = true
    } else if (type == 'cao') {
        params.value.status = 'draft'
        params.value.share_status = ''
    }
    saveLoveCourtRecord(params.value).then(res => {
        if (type == 'share') {
            invite.value = true
            params.value.poster_id = res.data.poster_id
            invitation_code.value = res.data.invitation_code
        } else if (type == 'save') {
            showProgress.value = true
            progress.value = 0
            const timer = setInterval(() => {
                if (progress.value >= 99) {
                    clearInterval(timer)
                    return
                }
                progress.value++
            }, 20)
        }

        startPolling()
    }).catch(err => {
        console.log(err, 'err')
    })
}
//我愿意和你聊聊
const agree = () => {
    if (!uni.getStorageSync('token')) {
        uni.navigateTo({ url: '/pages/login/login' })
        return
    }
    saveLoveCourtRecord(params.value).then(res => {
        invited.value = false
        posterIdFromInvite.value = false
        params.value.poster_id = res.data.poster_id
        getstatus()
        startPolling()
    }).catch(err => {
        cancelInvite()
    })
}
//获取状态
const getstatus = () => {
    if (!params.value.poster_id) return
    getUserJoinedStatus({ poster_id: params.value.poster_id }).then(res => {
        userinfo.value = res.data
    })
}
// 2000ms 轮询 getstatus
let pollTimer = null
const startPolling = () => {
    if (pollTimer) return
    pollTimer = setInterval(() => {
        getstatus()
    }, 2000)
}
const stopPolling = () => {
    console.log(1)
    if (pollTimer) {
        console.log(2)
        clearInterval(pollTimer)
        pollTimer = null
    }
}
onShow(() => {
    // if (params.value.poster_id && !posterIdFromInvite.value) startPolling()
})
onUnmounted(() => {
    stopPolling()
})
// 下拉刷新：走同一接口，刷新后停止下拉动画
onPullDownRefresh(() => {
    getstatus()
    uni.stopPullDownRefresh()
})
//取消邀请
const cancelInvite = () => {
    invited.value = false
    params.value.poster_id = ''
    params.value.invitation_code = ''
    posterIdFromInvite.value = false
    stopPolling()
}
//清空
const clearContent = () => {
    params.value.nickname = ''
    params.value.event_description = ''
    params.value.issue_description = ''
    params.value.supplementary_materials = []
    showDelPopup.value = false
}
//复制链接
const copy = () => {
    btnInvite('share')
    const nickname = JSON.parse(uni.getStorageSync('userInfo')).username
    const code = encodeURIComponent(JSON.stringify(invitation_code.value));
    const query = `?invitation_code=${code}&speak=${params.value.send_word}&nickname=${nickname}`
    const end = aesEncrypt(query)
    //复制邀请码
    uni.setClipboardData({
        data: end,
        success: function () {
            uni.showToast({
                title: t('common.copySuccess'),
                icon: 'none'
            });
        }
    });
    uni.setStorageSync('lastend', end)


}
onShareAppMessage(() => {
    btnInvite('share')
    const nickname = JSON.parse(uni.getStorageSync('userInfo')).username
    const code = encodeURIComponent(JSON.stringify(invitation_code.value));
    const query = `?invitation_code=${code}&speak=${params.value.send_word}&nickname=${nickname}`
    return {
        title: params.value.send_word ? `@${nickname}:` + params.value.send_word : t('loveCourt.defaultSummons'), // 分享标题
        path: `/pagesA/loveCourt/index${query}`, // 分享路径携带个人ID
        imageUrl: "/static/index/yq2.png", // 分享图片，不设置则使用默认截图
    };
})
//退出
const handleExit = () => {
    uni.switchTab({ url: '/pages/test/test' })
    showProgress.value = false
}
//获取草稿
const fetchDrafts = () => {
    getRecords().then(res => {
        let drafts = res.data
        if (drafts.poster_id) {
            showDelPopup2.value = true
        } else {
            showDelPopup2.value = false
        }
        delete drafts.is_draft
        delete drafts.is_host
        recode.value = drafts
    })
        .catch(err => {

        })
}
const btn = (type) => {
    //继续
    if (type) {
        console.log(recode.value, 'recode.value')
        params.value = recode.value
        showDelPopup2.value = false
        console.log(params.value.poster_id)
        getstatus()
        startPolling()
    } else { //放弃

        params.value.poster_id = recode.value.poster_id
        showDelPopup2.value = false
        recode.value = {}
        del()

    }
}
//是否保存草稿
const baocao = (type) => {
    skipNextShowPolling.value = true // 关弹窗可能触发 onShow，避免再次 startPolling
    //保存
    if (type) {
        btnInvite('cao')
        showDelPopup3.value = false
    } else { //不保存
        showDelPopup3.value = false
    }
    pollTimer = '1111'
    stopPolling()
    uni.switchTab({
        url: '/pages/index/index'
    })
}
//中途退出
const del = () => {
    if (!params.value.poster_id) return
    deleteRecords(params.value.poster_id).then(res => {
        params.value.poster_id = ''
        clearContent()
        stopPolling()
    }).catch(err => {

    })
}

</script>

<style lang="scss" scoped>
.page-body {
    margin: 40rpx 25rpx;
}

.custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #12111f;

    .navbar-content {
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;
        position: relative;

        .navbar-back {
            position: absolute;
            left: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60rpx;
            height: 60rpx;
        }

        .navbar-title {
            font-size: 32rpx;
            font-weight: 500;
            color: #ffffff;
        }
    }
}

.pcontent {
    width: 500rpx;
    padding: 40rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .num {
        font-size: 26rpx;
        margin: 20rpx 0;
        color: #000;
        margin-top: 40rpx !important;
    }

    .btn {
        background: #B370FF;
        color: #fff;
        // margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 90%;
        border-radius: 80rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
    }

    .tip {
        font-size: 24rpx;
    }

}

.progress-wrapper {
    width: 70%;
    margin: 0 auto;
    // margin-bottom: 20rpx;
}

.custom-progress {
    width: 100%;
}

.progress-track {
    position: relative;
    width: 100%;
    height: 50rpx;
    background-color: #ffffff;
    border-radius: 40rpx;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #C084FC 0%, #9333EA 100%);
    background-image: repeating-linear-gradient(-45deg,
            #C084FC 0rpx,
            #D4A5F8 3rpx,
            #9333EA 7rpx,
            #9333EA 7rpx,
            #D4A5F8 10rpx,
            #C084FC 10rpx,
            #C084FC 10rpx,
            #D4A5F8 13rpx,
            #9333EA 17rpx,
            #9333EA 17rpx,
            #D4A5F8 20rpx,
            #C084FC 20rpx);
    border-radius: 40rpx;
    transition: width 0.3s ease;
    position: relative;
}

.tip {
    font-size: 20rpx;
    color: #a0a0a0;
    margin-top: 15rpx;
    width: 90%;
    text-align: center;
    padding-bottom: 30rpx;
}

.num {
    font-size: 36rpx;
    margin: 20rpx 0;
    color: #000;
    font-weight: 100;
}

.titlecon {
    width: 100%;

    .t1 {
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        text {
            margin-right: 10rpx;
        }
    }

    .del {
        position: absolute;
        right: 20rpx;
        top: 235rpx;
        color: rgba(255, 255, 255, 0.5);
    }
}

.tishi {
    width: 600rpx;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 45rpx;
    box-sizing: border-box;
    max-height: 80vh;
    padding-bottom: 20rpx;

    .title {
        font-weight: bold;
        font-size: 36rpx;
        margin-bottom: 30rpx;
        text-align: center;
        width: 100%;
    }

    .agreement-content {
        width: 100%;
        max-height: 600rpx;
        margin-bottom: 20rpx;
        flex: 1;
        overflow-y: auto;
    }

    .richtext-content {
        width: 100%;
        font-size: 28rpx;
        line-height: 1.8;
        // color: rgba(0, 0, 0, 0.85);
        word-wrap: break-word;
    }

    .loading,
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40rpx 0;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.55);
    }

    .btn {
        background: #B370FF;
        color: #fff;
        margin-top: 20rpx;
        height: 90rpx;
        line-height: 90rpx;
        width: 100%;
        border-radius: 90rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;

        button {
            background: transparent;
            color: #FFF;
        }
    }

    .cancel {
        margin-top: 20rpx;
    }

    .disagree-btn {
        margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 28rpx;
    }
}

.content {
    margin: 30rpx 0;
    height: 68vh;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    font-weight: 300;
    overflow-y: scroll;
    padding: 30rpx;
    box-sizing: border-box;

    input {
        text-align: center;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 20rpx;
        height: 110rpx;
        line-height: 110rpx;
        color: #fff;
    }

    textarea {
        margin-top: 20rpx;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 20rpx;
        color: #fff;
        width: 100%;
        padding: 20rpx;
        box-sizing: border-box;
        min-height: 200rpx;
    }

    .title {
        margin: 30rpx 0;
    }

    .images {
        display: flex;
        flex-wrap: wrap;

        .update {
            background: rgba(255, 255, 255, 0.1);
            width: 30%;
            height: 330rpx;
            border-radius: 15rpx;
            font-size: 100rpx;
            text-align: center;
            line-height: 330rpx;
            margin-right: 3.33%;
            margin-bottom: 20rpx;
            position: relative;
            overflow: hidden;

            image {
                width: 100%;
                height: 100%;
            }

            .close {
                position: absolute;
                right: 10rpx;
                top: 10rpx;
            }
        }

    }
}

.images .update:nth-of-type(3n) {
    margin-right: 0 !important;
}

.bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .top {
        display: flex;
        align-items: center;

        text {
            margin-left: 20rpx;
            color: rgba(255, 255, 255, 0.5);
        }
    }

    .btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1rpx solid rgba(255, 255, 255, 0.17);
        width: 80%;
        height: 90rpx;
        line-height: 90rpx;
        border-radius: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20rpx;

        image {
            width: 50rpx;
            height: 50rpx;
            margin-right: 20rpx;

        }
    }

}

.tishi1 {
    padding: 40rpx 30rpx;
    // padding-bottom: 0;

    textarea,
    .content1 {
        width: 100%;
        background: #F0F0F0;
        margin: 20rpx 0;
        border-radius: 20rpx;
        padding: 20rpx;
        box-sizing: border-box;
    }
}

.del-popup-content {
    position: relative;
    width: 560rpx;
    padding: 120rpx 40rpx 48rpx;
    box-sizing: border-box;
    border-radius: 36rpx;
    background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
    box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
    text-align: center;
}

.del-popup-icon {
    position: absolute;
    top: -90rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
}

.del-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 30rpx;
}

.del-popup-actions {
    display: flex;
    gap: 24rpx;
}

.del-popup-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 600;
}

.del-popup-btn.cancel {
    background: #eeedff;
    color: #b370ff;
}

.del-popup-btn.confirm {
    background: #b370ff;
    color: #ffffff;
}
</style>
<style>
.u-safe-bottom {
    height: 0 !important;
}
</style>