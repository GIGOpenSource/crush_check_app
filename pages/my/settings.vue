<template>
  <view class="settings-page">
    <view class="settings-container">
      <view class="settings-card">
        <view class="settings-item" v-for="(item, index) in settingsList" :key="index" @click="handleItemClick(item)">
          <text class="item-text">{{ item.label }}</text>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <button class="logout-btn" hover-class="none" @click="handleLogout">
        {{ $t('settings.logout') }}
      </button>
    </view>
    <up-popup :show="showDelPopup2" mode="center">
      <view class="del-popup-content">
        <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
        <view class="title1">{{ $t('common.queding') }}</view>
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
</template>

<script>
import { pageStayMixin } from "@/utils/pageStayMixin.js";
import { t } from '@/i18n/index.js';
import { delesuser } from '@/api/login.js'
export default {
  mixins: [pageStayMixin],
  data() {
    return {
      showDelPopup2: false,
      pageName: '',
      settingsList: [],
    };
  },
  onLoad() {
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.$t('settings.title') || '设置'
    });

    // 初始化设置列表（使用 i18n）
    this.settingsList = [
      {
        label: this.$t('settings.privacyPolicy'),
        type: "privacy",
      },
      {
        label: this.$t('settings.userAgreement'),
        type: "agreement",
      },
      {
        label: this.$t('settings.aboutUs'),
        type: "about",
      },
      {
        label: this.$t('common.deleteuser'),
        type: "user",
      },
    ];
    this.pageName = this.$t('settings.title');
  },
  methods: {
    handleItemClick(item) {
      if (item.type === 'user') {
        this.showDelPopup2 = true
        return;
      }
      uni.navigateTo({
        url: "/pages/my/richtext?label=" + encodeURIComponent(item.label) + "&type=" + encodeURIComponent(item.type),
      });
    },
    // 退出登录
    handleLogout() {
      uni.showModal({
        title: this.$t('common.tip'),
        content: this.$t('settings.logoutConfirm'),
        confirmText: this.$t('common.logout'),
        cancelText: this.$t('common.cancel'),
        confirmColor: "#ff4d4f",
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储
            uni.removeStorageSync("token");
            uni.removeStorageSync("openId");
            uni.removeStorageSync("userInfo");
            uni.removeStorageSync("inviter_openid");


            // 显示退出成功提示
            uni.showToast({
              title: this.$t('settings.logoutSuccess'),
              icon: "success",
              duration: 1500,
            });

            // 延迟跳转到登录页面
            setTimeout(() => {
              uni.navigateTo({ url: '/pages/login/login' })
            }, 1500);
          }
        },
      });
    },
    logoutAppleID() {
      delesuser({}).then((result) => {
        this.showDelPopup2 = false
        uni.removeStorageSync("token");
        uni.removeStorageSync("openId");
        uni.removeStorageSync("userInfo");
        uni.removeStorageSync("inviter_openid");
        uni.showToast({ title: result.message, icon: 'none' });
        setTimeout(() => {
          uni.navigateBack()
        }, 1500);
      }).catch((err) => {
        uni.showToast({ title: err.message, icon: 'none' });
      });
    }
  },
};
</script>

<style>
page {
  background: #12111f;
  height: 100vh;
}
</style>

<style scoped lang="scss">
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

.settings-page {
  min-height: 100vh;
  background: #12111f;
  padding: 48rpx 30rpx 80rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  flex: 1;
}

.settings-card {
  background: #1f1b2e;
  border-radius: 32rpx;
  padding: 12rpx;
  box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);

  .settings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36rpx 28rpx;
    border-radius: 24rpx;
    transition: background 0.2s;

    &:not(:last-child) {
      margin-bottom: 8rpx;
    }

    &:active {
      background: rgba(255, 255, 255, 0.08);
    }

    .item-text {
      font-size: 28rpx;
      color: #ffffff;
    }

    .arrow-icon {
      font-size: 40rpx;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1;
    }
  }
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
  border: none;
  background: linear-gradient(90deg, #9159e1 1%, #6341e2 100%);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: normal;
  box-shadow: 0 18rpx 36rpx rgba(104, 66, 225, 0.35);

  &::after {
    border: none;
  }

  &:active {
    opacity: 0.85;
  }
}
</style>