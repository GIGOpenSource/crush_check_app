<template>
  <view class="login-page">
    <view class="login-content">
      <!-- Logo 和应用名称 -->
      <view class="logo-section">
        <image class="logo-icon" src="/static/my/logo.png" mode="aspectFit"></image>
        <text class="app-name">{{ $t('login.appName') }}</text>
      </view>

      <view class="app-desc">{{ $t('login.appDesc') }}</view>

      <!-- 一键登录按钮 -->
      <view class="login-button-wrapper" v-if="!isAgreed" @click.stop="checkDisabled">
        <view class="login-button" :class="{ disabled: true }">
          <text class="login-button-text">{{ $t('login.wechatLogin') }}</text>
        </view>
      </view>

      <button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber" class="login-button-wrapper" v-if="isAgreed"
        hover-class="none">
        <view class="login-button">
          <text class="login-button-text">{{ $t('login.wechatLogin') }}</text>
        </view>
      </button>

      <!-- 协议同意区域 -->
      <view class="agreement-section">
        <view class="agreement-checkbox" @click="toggleAgreement">
          <view class="checkbox-icon" :class="{ checked: isAgreed }">
            <text v-if="isAgreed" class="check-mark">✓</text>
          </view>
          <text class="agreement-text">
            {{ $t('common.agreePolicy') }}
            <text class="link-text" @click.stop="handlePrivacyClick">《{{ $t('common.privacyPolicy') }}》</text>
            <text class="link-text" @click.stop="handleAgreementClick">《{{ $t('common.userAgreement') }}》</text>
          </text>
        </view>
      </view>

      <!-- 暂不登录 -->
      <view class="skip-login" @click="handleSkipLogin">
        <text class="skip-text">{{ $t('common.skipLogin') }}</text>
      </view>
      <up-popup :show="showDelPopup2" mode="center">
        <view class="del-popup-content">
          <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
          <view class="title1">{{ $t('common.zhuxiao') }}</view>
          <view class="del-popup-actions">
            <view class="del-popup-btn cancel" @click="showDelPopup2 = false">{{ $t('common.cancel') }}</view>
            <view class="del-popup-btn confirm" @click="logoutAppleID">{{ $t('common.confirm') }}</view>
          </view>
          <view class="icon" @click="showDelPopup2 = false">
            <up-icon name="close-circle" color="#ffffff" size="30"></up-icon>
          </view>
        </view>
      </up-popup>
    </view>
  </view>
</template>

<script>
import { wechatLogin, getUserInfo, getUserPhone, delecheck } from "@/api/login.js";
import { pageStayMixin } from "@/utils/pageStayMixin.js";
import {
  share
} from '@/api/index.js'

export default {
  mixins: [pageStayMixin],
  data() {
    return {
      showDelPopup2: false,
      pageName: '',
      isAgreed: false,
      phoneCode: "", // 保存手机号授权的code
    };
  },
  onLoad() {
    this.pageName = this.$t('login.title');
  },
  methods: {
    toggleAgreement() {
      this.isAgreed = !this.isAgreed;
    },
    handlePrivacyClick() {
      uni.navigateTo({
        url: "/pages/my/richtext?label=" + encodeURIComponent(this.$t('common.privacyPolicy')) + "&type=" + encodeURIComponent("privacy"),
      });
    },
    handleAgreementClick() {
      uni.navigateTo({
        url: "/pages/my/richtext?label=" + encodeURIComponent(this.$t('common.userAgreement')) + "&type=" + encodeURIComponent("agreement"),
      });
    },
    checkDisabled() {
      uni.showToast({
        title: this.$t('common.pleaseAgreePolicy'),
        icon: "none",
      });
    },
    onGetPhoneNumber(e) {
      console.log("获取手机号授权", e);

      if (e.detail.errMsg == "getPhoneNumber:ok" && e.detail.code) {
        // 保存手机号授权的code
        this.phoneCode = e.detail.code;
        this.clickLogin();
      } else if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
        uni.showToast({
          title: this.$t('common.needPhoneAuth'),
          icon: "none",
        });
      } else {
        console.log(e);
        uni.showToast({
          title: this.$t('common.authFailed'),
          icon: "none",
        });
      }
    },
    //检查一下登录状态
    async loginStatus(code) {
      let res = await delecheck({ code })
      uni.setStorageSync("token", res.data.token);
      return res.data.in_deletion_process
    },
    logoutAppleID() {
      this.loginWithCode();
    },
    async clickLogin() {
      uni.login({
        success: async (res) => {
          if (res.code) {
            let status = await this.loginStatus(res.code)
            console.log("登录状态:", status);
            if (status) {
              this.showDelPopup2 = true
            } else {
              this.loginWithCode();
            }

          } else {
            uni.showToast({
              title: this.$t('common.getLoginCodeFailed'),
              icon: "none",
            });
          }
        },
        fail: (err) => {
          console.error("获取code失败:", err);
          uni.showToast({
            title: this.$t('common.getLoginCodeFailedRetry'),
            icon: "none",
          });
        },
      });
    },

    async loginWithCode() {
      try {
        const inviterOpenId = uni.getStorageSync("inviter_openid");
        // 第一步：调用登录接口，必须等待完成
        const res = await wechatLogin(inviterOpenId);
        // 检查登录是否成功
        if (res.code !== 200 && res.code !== 201) {
          uni.showToast({
            title: res.msg || res.message || this.$t('common.loginFailed'),
            icon: "none",
          });
          return;
        }

        // 第二步：登录成功，保存token和openId
        const openId = res.data?.openId || res.data?.openid;
        let tokenSaved = false;

        if (res.data && res.data.token) {
          uni.setStorageSync("token", res.data.token);
          // 验证token是否真正保存成功
          const savedToken = uni.getStorageSync("token");
          tokenSaved = savedToken === res.data.token;
        }

        if (openId) {
          uni.setStorageSync("openId", openId);
        }
        if (inviterOpenId) {
          const result = await share({ shareId: inviterOpenId })
        }

        // 第三步：确保token保存成功后，才进行其他接口请求
        if (!tokenSaved) {
          uni.showToast({
            title: this.$t('common.loginStateSaveFailed'),
            icon: "none",
          });
          return;
        }

        // 等待一小段时间，确保存储操作完成
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (inviterOpenId) {
          uni.removeStorageSync("inviter_openid");
        }

        // 第四步：如果有手机号授权code，调用获取手机号接口
        if (this.phoneCode && openId) {
          try {
            const phoneRes = await getUserPhone(this.phoneCode, openId);


            if (phoneRes.code === 200 || phoneRes.code === 201) {
              console.log("获取手机号成功");
            }
          } catch (phoneError) {
            console.error("获取手机号失败:", phoneError);
            // 获取手机号失败不影响后续流程
          }
        }

        // 第五步：获取用户信息接口
        if (openId) {
          try {
            const userInfoRes = await getUserInfo(openId);
            if (userInfoRes.code === 200 || userInfoRes.code === 201) {
              if (userInfoRes.data) {
                uni.setStorageSync(
                  "userInfo",
                  JSON.stringify(userInfoRes.data)
                );
              }
            }
          } catch (userInfoError) {
            console.error("获取用户信息失败:", userInfoError);
            // 如果登录接口返回了用户信息，使用登录接口返回的
            if (res.data && res.data.userInfo) {
              uni.setStorageSync("userInfo", JSON.stringify(res.data.userInfo));
            }
          }
        } else if (res.data && res.data.userInfo) {
          // 如果没有openId但有userInfo，直接保存
          uni.setStorageSync("userInfo", JSON.stringify(res.data.userInfo));
        }

        // 所有接口调用完成，显示成功提示
        uni.showToast({
          title: this.$t('common.loginSuccess'),
          icon: "success",
        });

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          uni.navigateBack({
            fail: () => {
              // uni.switchTab({
              //   url: "/pages/my/my",
              // });
              uni.navigateBack()
            },
          });
        }, 1000);
      } catch (error) {
        console.error("登录流程失败:", error);
        uni.showToast({
          title: error.msg || error.message || this.$t('login.loginFailedRetry'),
          icon: "none",
        });
      }
    },
    handleSkipLogin() {
      // 暂不登录，返回上一页或跳转到首页
      uni.navigateBack({
        fail: () => {
          uni.switchTab({
            url: "/pages/index/index",
          });
        },
      });
    },
  },
};
</script>
<style>
   .u-popup__content{
        background: transparent !important;
    }
</style>
<style lang="scss">
page {
  background: #1d182e;
  height: 100vh;
}

.del-popup-content {
  position: relative;
  width: 560rpx;
  padding: 160rpx 40rpx 48rpx;
  box-sizing: border-box;
  border-radius: 36rpx;
  background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
  box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
  text-align: center;
  color: #000;

  .del-popup-icon {
    position: absolute;
    top: -90rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
  }

  .title1 {
    color: #000;
    margin-top: -50rpx;
    font-size: 30rpx;
    font-weight: 400;
  }

  .num {
    font-size: 26rpx;
    margin-top: 20rpx;
  }



  .icon {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: -100rpx;
    color: #000;
    cursor: pointer;

    &.icon-disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}

.del-popup-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 20rpx;
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

/* 核心：去除默认样式 */
button {
  /* 重置背景和边框 */
  background: transparent;
  /* 透明背景 */
  border: none;
  /* 去掉边框 */
  padding: 0;
  /* 去掉内边距 */
  margin: 0;
  /* 去掉外边距 */

  /* 重置文字样式 */
  color: #333;
  /* 自定义文字颜色 */
  font-size: 14px;
  /* 自定义文字大小 */

  /* 去掉点击态（可选） */
  /* 微信按钮默认点击有灰色背景，通过以下样式去除 */
  tap-highlight-color: transparent;
  -webkit-tap-highlight-color: transparent;
}

/* 去除按钮内置的::after伪元素（微信默认的边框可能通过伪元素实现） */
button::after {
  content: none;
  /* 清除伪元素 */
}
</style>

<style scoped lang="scss">
.login-page {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 30rpx 0;
  box-sizing: border-box;
}

.login-content {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 450rpx;

  .logo-icon {
    width: 172rpx;
    height: 114rpx;
    margin-bottom: 30rpx;
  }

  .app-name {
    font-family: PingFang SC;
    font-size: 40rpx;
    color: #ffffff;
  }
}

.app-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 80rpx;
}

.agreement-section {
  width: 100%;
  margin-bottom: 60rpx;

  .agreement-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;

    .checkbox-icon {
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      border: 2rpx solid #ddd;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2rpx;
      transition: all 0.2s;

      &.checked {
        background: #b370ff;
        border-color: #b370ff;

        .check-mark {
          color: #fff;
          font-size: 24rpx;
          font-weight: bold;
          line-height: 1;
        }
      }
    }

    .agreement-text {
      font-size: 28rpx;
      color: #666666;
      line-height: 1.6;
      flex: 1;

      .link-text {
        color: #b370ff;
      }
    }
  }
}

.login-button-wrapper {
  width: 100%;
  margin-bottom: 40rpx;

  .login-button {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(270deg, #9452ff 0%, #b370ff 100%);
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
    }

    &.disabled {
      opacity: 0.5;
      box-shadow: none;
    }

    .login-button-text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 500;
    }
  }
}

.skip-login {
  .skip-text {
    font-size: 28rpx;
    color: #333333;
  }
}
</style>

