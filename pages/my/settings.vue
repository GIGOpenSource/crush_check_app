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
  </view>
</template>

<script>
import { pageStayMixin } from "@/utils/pageStayMixin.js";
import { t } from '@/i18n/index.js';

export default {
  mixins: [pageStayMixin],
  data() {
    return {
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
        label: '注销账号',
        type: "user",
      },
    ];
    this.pageName = this.$t('settings.title');
  },
  methods: {
    handleItemClick(item) {
      if (item.type === 'user') {
        uni.showModal({
          title: '注销账号',
          content: '确定注销账号吗？',
          showCancel: true,
          success: ({ confirm, cancel }) => {
            if (confirm) {
              this.logoutAppleID()
            } else if (cancel) {
              // 用户取消操作
            }
          }
        })
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
      // 1. 平台校验：仅iOS支持Apple ID授权
      if (uni.getSystemInfoSync().platform !== 'ios') {
        uni.showToast({ title: '仅iOS支持该操作', icon: 'none' });
        return;
      }

      try {
        // 2. 获取所有授权服务
        plus.oauth.getServices(
          (services) => {
            if (!services || services.length === 0) {
              uni.showToast({ title: '未获取到授权服务', icon: 'none' });
              return;
            }

            // 3. 查找apple授权服务（兼容不同命名：apple / AppleID）
            let appleService = null;
            for (let service of services) {
              if (service.id.toLowerCase() === 'apple') {
                appleService = service;
                break;
              }
            }

            // 4. 检查是否找到Apple ID授权服务
            if (!appleService) {
              uni.showToast({ title: '未配置Apple ID授权服务', icon: 'none' });
              return;
            }

            // 5. 执行Apple ID注销
            appleService.logout(
              (res) => {
                uni.removeStorageSync("token");
                uni.removeStorageSync("openId");
                uni.removeStorageSync("userInfo");
                uni.removeStorageSync("inviter_openid");
                uni.showToast({ title: '注销成功', icon: 'success' });
                //  注销账号接口调用

              },
              (err) => {
                const errMsg = err.message || err.errorMessage || '注销失败';
                uni.showToast({ title: errMsg, icon: 'none' });
              }
            );
          },
          (err) => {
            uni.showToast({ title: '获取授权服务失败，请重试', icon: 'none' });
          }
        );
      } catch (e) {
        uni.showToast({ title: '注销操作异常，请重试', icon: 'none' });
      }
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
