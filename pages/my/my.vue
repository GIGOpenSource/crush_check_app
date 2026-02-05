<template>
  <view class="my-page">
    <!-- 个人资料 -->
    <view class="profile-card">
      <view class="profile-content" @click="handleProfileClick">
        <template v-if="!isLoggedIn">
          <image class="avatar" src="/static/my/user_no.png" mode="aspectFill"></image>
          <view class="profile-info">
            <text class="login-tip">{{ $t('my.login') }}</text>
          </view>
        </template>
        <template v-else>
          <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="avatar-btn logged-in"
            hover-class="none">
            <image class="avatar-image" :src="userInfo.user_avatar || '/static/my/user_no.png'" mode="aspectFill">
            </image>
          </button>
          <view class="profile-info">
            <input class="nickname-input" type="nickname" :value="userInfo.username || ''"
              :placeholder="$t('my.nickname')" @blur="onNicknameBlur" @confirm="onNicknameConfirm" />
            <view class="gender-section">
              <picker mode="selector" :range="genderOptions" range-key="label" :value="genderIndex"
                :cancel-text="$t('common.cancel')" :confirm-text="$t('common.confirm')"
                @change="handleGenderChange" @tap.stop @click.stop>
                <view class="gender-picker">
                  <text class="gender-text">{{
                    userInfo.user_gender !== null &&
                      userInfo.user_gender !== undefined
                      ? getGenderText(userInfo.user_gender)
                      : $t('my.selectGender')
                  }}</text>
                </view>
              </picker>
            </view>
            <view>
              <text class="profile-id" v-if="isLoggedIn && userInfo.id">ID: {{ userInfo.id }}</text>
            </view>
          </view>
        </template>
      </view>
    </view>

    <!-- 高级报告模块 -->
    <view class="vip-module">
      <view class="vip-content">
        <text class="vip-tag">CrashCheck· VIP · {{ $t('my.monthlyCard') }}</text>
        <view v-if="userInfo.is_vip" class="vip-header vip-header--member">
          <text class="vip-title">{{ $t('my.vip') }}</text>
          <text class="vip-expire">{{ vipExpireText }}{{ $t('my.vipExpire') }}</text>
        </view>
        <view v-else class="vip-header">
          <text class="vip-title vip-title--guest">{{ $t('my.unlockVip') }}</text>
          <image class="vip-title-icon" src="/static/my/baogao.png" mode="widthFix"></image>
        </view>
        <view class="vip-subtitle">
          <text class="vip-subtitle-text">{{ $t('my.reportRemaining') }}</text>
          <text class="vip-count" :class="{ infinity: reportRemainingText === $t('my.unlimited') }">
            {{ reportRemainingText }}
          </text>
        </view>
      </view>
      <button class="vip-action" hover-class="none" @click.stop="handleUnlockCardClick">
        {{ vipActionText }}
      </button>
    </view>

    <!-- 邀请新伙伴 -->
    <view class="invite-module">
      <image class="invite-icon" src="/static/my/yaoqing.png" mode="aspectFit"></image>
      <view class="invite-info">
        <text class="invite-title">{{ $t('my.inviteTitle') }}</text>
        <text class="invite-subtitle">{{ inviteProgressText }}</text>
      </view>
      <button class="invite-action" hover-class="none" :open-type="isLoggedIn ? 'share' : ''" @click="handleInviteClick">
        {{ $t('my.invite') }}
      </button>
    </view>

    <!-- 历史海报模块 -->
    <!-- <view class="history-card">
      <view class="card-header" @click="handleHistoryClick">
        <text class="card-title">{{ $t('my.historyPoster') }}</text>
        <text class="arrow-icon">›</text>
      </view>
      
      <view class="poster-list" v-if="posterList.length > 0">
        <view class="poster-item" v-for="(item, index) in posterList" :key="item.id || index"
          @click="handlePosterClick(item)">
          <view class="poster-image-wrapper">
            <image v-if="item.file_url" class="poster-image" :class="{
              'poster-image--blur':
                item.status === 'waiting' || item.status === 'error',
            }" :src="item.file_url" @click.stop="handlePosterImageClick(item, index)"></image>
            <view v-else class="poster-placeholder">
              <text v-if="item.status === 'waiting'" class="poster-status-text">{{ $t('my.generating') }}</text>
            </view>
            <view v-if="item.status === 'waiting' || item.status === 'error'" class="status-overlay">
              <text class="status-title">{{
                item.status === "waiting" ? $t('my.generatingStatus') : $t('my.generatingFailed')
              }}</text>
            </view>
            <view class="poster-date-overlay">
              <text class="poster-date">
                {{
                  formatDate(item.created_time)
                }}
              </text>
            </view>
          </view>
          <text class="poster-label">{{
            getPosterTypeLabel(item.prompt_template?.template_type)
          }}</text>
        </view>
      </view>
    </view> -->

    <!-- 常用功能 -->
    <view class="functions-section">
      <text class="section-title">{{ $t('my.commonFunctions') }}</text>
      <view class="functions-card">
        <view class="function-list">
          <template v-for="(item, index) in functionList" :key="index">
            <button v-if="item.type === 'share'" class="function-item share-button" :open-type="isLoggedIn ? 'share' : ''" hover-class="none"
              @click="ensureShare">
              <text class="function-text">{{ item.label }}</text>
              <text class="arrow-icon">›</text>
            </button>
            <view v-else class="function-item" @click="handleFunctionClick(item)">
              <text class="function-text">{{ item.label }}</text>
              <text class="arrow-icon">›</text>
            </view>
          </template>
        </view>
      </view>
    </view>

    <!-- 关注公众号 -->
    <view class="public-card">
      <image class="public-icon" src="/static/my/guanzhu.png" mode="aspectFit"></image>
      <view class="public-info">
        <text class="public-title">{{ $t('my.followMore') }}</text>
        <text class="public-action" @click="handlePublicFollow">{{ $t('my.clickFollow') }}</text>
      </view>
    </view>
  </view>

  <up-popup class="reward-popup-wrapper" :show="rewardPopupVisible" mode="center" @close="closeRewardPopup"
    border-radius="60rpx">
    <view class="reward-popup">
      <image class="reward-popup-icon" src="/static/my/gongxi.png"></image>
      <view class="reward-popup-main">
        <text v-for="(line, idx) in rewardPopupMainText" :key="idx" class="reward-popup-main-line">{{ line }}</text>
      </view>
      <view class="reward-popup-sub">
        {{ $t('my.rewardSubtitle') }}
      </view>
      <view class="reward-popup-actions">
        <view class="reward-popup-btn confirm" @click="handleGoUse">{{ $t('my.goUse') }}</view>
      </view>
    </view>
  </up-popup>

  <up-popup :show="showDelPopup2" mode="center">
    <view class="del-popup-content">
      <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
      <view class="del-popup-title">{{ $t('my.posterFailed') }}</view>
      <view class="del-popup-actions">
        <view class="del-popup-btn cancel" @click="handleFailCancel">{{ $t('common.cancel') }}</view>
        <view class="del-popup-btn confirm" @click="handleRetryEdit">{{ $t('my.reAnalyze') }}</view>
      </view>
    </view>
  </up-popup>

  <IndexProup :show="showProgress" @close="handleProgressClose" :cha="true" :height="125">
    <template #content>
      <view class="content">
        <view class="num">{{ $t('my.analyzingPercent') }}{{ progress }}{{ $t('my.analyzingPercentUnit') }}</view>
        <view class="progress-wrapper">
          <view class="custom-progress">
            <view class="progress-track">
              <view class="progress-fill" :style="{ width: progress + '%' }"></view>
            </view>
          </view>
        </view>
        <view class="tip">{{ $t('my.exitTip') }}</view>
      </view>
    </template>
  </IndexProup>

  <up-popup :show="showQrCodePopup" mode="center" @close="showQrCodePopup = false">
    <view class="qr-code-popup">
      <view class="qr-code-popup-title">{{ $t('my.followPublic') }}</view>
      <image v-if="qrCodeUrl" class="qr-code-image" :src="qrCodeUrl" mode="aspectFit"></image>
      <view v-else class="qr-code-loading">{{ $t('common.loading') }}</view>
      <view class="qr-code-popup-close" @click="saveQrCodeToAlbum">{{ $t('my.saveToAlbum') }}</view>
    </view>
  </up-popup>
</template>

<script>
import {
  updateUserInfo,
  uploadAvatar,
  getPosterList,
  getProductsList,
  getPrepayId,
  getUserInfo,
  reGeneratePoster,
  getSystemContent,
} from "@/api/login.js";
import { trackUmengEvent } from "@/utils/umeng.js";
import { pageStayMixin } from "@/utils/pageStayMixin.js";
import IndexProup from '@/components/IndexProup/IndexProup.vue';
import { t } from '@/i18n/index.js';

export default {
  components: {
    IndexProup
  },
  mixins: [pageStayMixin],
  data() {
    return {
      pageName: '',
      isLoggedIn: false,
      userInfo: {
        id: "",
        open_id: "",
        username: "",
        user_avatar: "",
        is_vip: false,
        vip_type: null,
        vip_expire_date: null,
        user_gender: null,
        user_telphone: null,
        allow_count: 0,
        share_success_count: 0,
        success_count: 0,
        fail_count: 0,
      },
      posterList: [],
      functionList: [],
      // 性别选项（已改为计算属性，移除此处）
      lastAllowCount: 0,
      rewardPopupVisible: false,
      rewardPopupDiff: 0,
      rewardPopupRemaining: 0,
      showDelPopup2: false,
      currentPosterId: null, // 当前点击的海报ID，用于重新生成
      showQrCodePopup: false, // 显示二维码弹窗
      qrCodeUrl: "", // 二维码图片URL
      showProgress: false, // 显示进度条弹窗
      progress: 0, // 进度百分比
      progressTimer: null, // 进度条定时器
    };
  },
  onLoad() {
   
  },
  onShow() {
     this.functionList = [
      { label: this.$t('my.rechargeHistory'), type: "recharge", url: "/pages/my/recharge" },
      { label: this.$t('my.share'), type: "share" },
      { label: this.$t('my.settings'), type: "settings" },
      { label: this.$t('my.inviteRecord'), type: "invite", url: "/pages/my/invite" },
      { label: this.$t('language.title'), type: "language", url: "/pages/my/lauage" },
    ]
    this.pageName = this.$t('my.title');
    this.checkLoginStatus();
    if (uni.getStorageSync("token")) {
      this.refreshUserInfo();
    }
    // 更新 tabBar 国际化
    this.updateTabBarI18n();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.refreshUserInfoForPullDown();
  },
  computed: {
    // 性别选项（使用计算属性，语言切换时自动更新）
    genderOptions() {
      return [
        { label: this.$t('my.male'), value: 1 },
        { label: this.$t('my.female'), value: 2 },
        { label: this.$t('my.unknown'), value: 0 },
      ];
    },
    // 计算当前性别在选项中的索引
    genderIndex() {
      if (
        this.userInfo.user_gender === null ||
        this.userInfo.user_gender === undefined
      ) {
        return 0; // 默认选中第一个（男）
      }
      const index = this.genderOptions.findIndex(
        (option) => option.value === this.userInfo.user_gender
      );
      return index >= 0 ? index : 0;
    },
    reportRemainingText() {
      const { allow_count: count, is_vip: isVip } = this.userInfo;
      if (isVip) {
        return this.$t('my.unlimited');
      }
      const parsed = Number(count);
      const timesUnit = this.$t('my.times');
      if (count === 0 || parsed === 0) {
        return `0${timesUnit}`;
      }
      if (!count && count !== 0) {
        return `0${timesUnit}`;
      }
      return Number.isNaN(parsed) ? `0${timesUnit}` : `${parsed}${timesUnit}`;
    },
    vipActionText() {
      const allowCount = Number(this.userInfo.allow_count || 0);
      if (this.userInfo.is_vip) {
        return this.$t('my.renew');
      }
      // return allowCount > 0 ? this.$t('my.goUse') : this.$t('my.unlock');
      return this.$t('my.unlock');
    },
    inviteProgressText() {
      const invited = Number(this.userInfo.share_success_count || 0);
      const safeInvited = Number.isNaN(invited) ? 0 : invited;
      return `${this.$t('my.inviteProgress')}${safeInvited}${this.$t('my.inviteProgressUnit')}`;
    },
    rewardPopupMainText() {
      const count = Math.max(Number(this.userInfo.allow_count) || 0, 0);
      return [
        this.$t('my.congratulations'),
        `${this.$t('my.rewardMessagePrefix')}${count}${this.$t('my.rewardMessageSuffix')}`,
      ];
    },
    vipExpireText() {
      const expire = this.formatVipExpireDate(this.userInfo.vip_expire_date);
      return expire || this.$t('my.noExpire');
    },
  },
  // 分享给好友
  // #ifdef MP-WEIXIN
  onShareAppMessage(res) {
    const inviterOpenId =
      this.userInfo.open_id || uni.getStorageSync("openId") || "";
      const query = `?scene=${inviterOpenId}`
   return {
		title: t('index.shareTitle'), // 分享标题
		path: `/pages/index/index${query}`, // 分享路径携带个人ID
		imageUrl: "/static/index/yq.png", // 分享图片，不设置则使用默认截图
	};
  },
  // #endif
  methods: {
    checkLoginStatus() {
      // 检查是否有token来判断登录状态
      const token = uni.getStorageSync("token");
      this.isLoggedIn = !!token;

      if (this.isLoggedIn) {
        // 如果有登录信息，可以从缓存中获取用户信息
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo) {
          this.userInfo = JSON.parse(userInfo);
          this.lastAllowCount = Number(this.userInfo.allow_count || 0);
        }
        // 获取历史海报列表
        this.fetchPosterList();
      } else {
        // 未登录时初始化所有数据
        this.posterList = [];
        this.lastAllowCount = 0;
        // 重置用户信息为初始值
        this.userInfo = {
          id: "",
          open_id: "",
          username: "",
          user_avatar: "",
          is_vip: false,
          vip_type: null,
          vip_expire_date: null,
          user_gender: null,
          user_telphone: null,
          allow_count: 0,
          share_success_count: 0,
          success_count: 0,
          fail_count: 0,
        };
        // 重置其他相关状态
        this.rewardPopupVisible = false;
        this.rewardPopupDiff = 0;
        this.rewardPopupRemaining = 0;
      }
    },
    async fetchPosterList() {
      // 获取历史海报列表
      if (!this.isLoggedIn) {
        return;
      }
      try {
        const userId = this.userInfo.id || "";
        const res = await getPosterList(1, 3, "", userId);
        console.log("获取历史海报列表成功", res);
        if (res.code === 200 || res.code === 201) {
          // 根据接口返回的数据结构更新 posterList
          this.posterList =
            res.data?.results || res.data?.data || res.data || [];
        }
      } catch (error) {
        console.error("获取历史海报列表失败:", error);
        // 失败时保持空数组或使用默认值
        this.posterList = [];
      }
    },
    // 格式化日期为相对时间
    formatDate(dateString) {
      if (!dateString) return "";

      const now = new Date();
      const date = new Date(dateString);
      const diff = now - date; // 时间差（毫秒）

      // 小于 1 分钟：显示 "刚刚"
      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) {
        return this.$t('my.justNow');
      }

      // 1 分钟 - 59 分钟：显示 "X 分钟前"
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return `${this.$t('my.minutesAgo')}${minutes}${this.$t('my.minutesAgoUnit')}`;
      }

      // 1 小时 - 23 小时：显示 "X 小时前"
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return `${this.$t('my.hoursAgo')}${hours}${this.$t('my.hoursAgoUnit')}`;
      }

      // 1 天 - 29 天：显示 "X 天前"
      const days = Math.floor(hours / 24);
      if (days < 30) {
        return `${this.$t('my.daysAgo')}${days}${this.$t('my.daysAgoUnit')}`;
      }

      // 1 个月 - 11 个月：显示 "X 个月前"
      const months = Math.floor(days / 30);
      if (months < 12) {
        return `${this.$t('my.monthsAgo')}${months}${this.$t('my.monthsAgoUnit')}`;
      }

      // 1 年及以上：显示 "X 年前"
      const years = Math.floor(months / 12);
      return `${this.$t('my.yearsAgo')}${years}${this.$t('my.yearsAgoUnit')}`;
    },
    // 格式化VIP到期日期
    formatVipExpireDate(dateString) {
      if (!dateString) return "";

      try {
        // 处理 ISO 格式日期时间字符串，如：2025-12-05T23:42:23
        const date = new Date(dateString);

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          // 如果日期无效，尝试直接返回原字符串（可能是已格式化的日期）
          return dateString;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error("格式化VIP到期日期失败:", error);
        // 如果格式化失败，返回原字符串
        return dateString;
      }
    },
    // 根据 poster_type 获取对应的标签
    getPosterTypeLabel(posterType) {
      const typeMap = {
        consume: this.$t('poster.consumeVoucher'),
        chat: this.$t('poster.chatScreenshot'),
        social: this.$t('poster.socialScreenshot'),
        physical: this.$t('poster.physicalPhoto'),
      };
      return typeMap[posterType] || this.$t('poster.unknownType');
    },
    // 获取性别文本
    getGenderText(gender) {
      // 性别可能是数字或字符串
      const genderMap = {
        0: this.$t('my.unknown'),
        1: this.$t('my.male'),
        2: this.$t('my.female'),
        male: this.$t('my.male'),
        female: this.$t('my.female'),
        unknown: this.$t('my.unknown'),
      };
      return genderMap[gender] || genderMap[String(gender)] || this.$t('my.unknown');
    },
    handleProfileClick(e) {
      // 如果点击的是性别选择器，不处理
      if (
        e.target &&
        e.target.classList &&
        (e.target.classList.contains("gender-picker") ||
          e.target.classList.contains("gender-text") ||
          e.target.classList.contains("picker-arrow"))
      ) {
        return;
      }

      if (!this.isLoggedIn) {
        // 跳转到登录页面
       uni.navigateTo({
					url: "/pages/login/login"
				})
      } else {
        // 可以跳转到个人资料编辑页面
        // uni.navigateTo({
        // 	url: '/pages/profile/profile'
        // });
      }
    },
    async handleUnlockClick() {
      // 处理解锁按钮点击
      if (!this.isLoggedIn) {
        // 未登录，跳转到登录页面
       uni.navigateTo({
					url: "/pages/login/login"
				})
        return;
      }

      try {
        // 获取产品列表
        const res = await getProductsList('vip');
        console.log("获取产品列表成功", res);

        if (res.code === 200 || res.code === 201) {
          // 从results数组中找到product_type是vip的对象
          const results = res.data?.results || res.data?.data || res.data || [];
          const vipProduct = results.find(
            (product) => product.product_type === "vip"
          );
          console.log(vipProduct,'vipProductvipProduct')

          if (vipProduct) {
            console.log("找到VIP产品:", vipProduct);

            // 获取openId
            const openId =
              this.userInfo.open_id || uni.getStorageSync("openId");

            if (!openId) {
              uni.showToast({
                title: this.$t('common.userInfoNotExistRelogin'),
                icon: "none",
              });
              return;
            }

            // 获取产品ID和描述
            const productId = vipProduct.id || vipProduct.product_id;
            const description =
              vipProduct.description ||
              vipProduct.name ||
              vipProduct.product_name ||
              this.$t('my.unlockVip');

            if (!productId) {
              uni.showToast({
                title: this.$t('common.vipProductNotFound'),
                icon: "none",
              });
              return;
            }

            // 调用获取预支付ID接口
            try {
              const prepayRes = await getPrepayId(
                description,
                productId,
                openId
              );
              console.log("获取预支付ID成功", prepayRes);

              if (prepayRes.code === 200 || prepayRes.code === 201) {
                // 获取支付参数
                const paymentData =
                  prepayRes.data?.data || prepayRes.data || prepayRes;

                const {
                  appId,
                  noncestr,
                  partnerid,
                  prepayid,
                  paySign,
                  timeStamp,
                } = paymentData;

                // 检查必要的支付参数
                if (
                  !appId ||
                  !noncestr ||
                  !prepayid ||
                  !paySign ||
                  !timeStamp
                ) {
                  uni.showToast({
                    title: this.$t('common.payParamsIncomplete'),
                    icon: "none",
                  });
                  return;
                }

                // 调起微信支付（V3版本）
                // #ifdef MP-WEIXIN
                // 保存 this 引用，避免回调中 this 丢失
                const _this = this;
                uni.requestPayment({
                  provider: "wxpay",
                  appId: appId,
                  timeStamp: String(timeStamp),
                  nonceStr: noncestr,
                  package: prepayid,
                  signType: "RSA", // V3版本使用RSA签名
                  paySign: paySign,
                  success: async (payRes) => {
                    console.log("支付成功", payRes);
                    // 获取用户ID
                    const userId = _this.userInfo?.id || "";
                    trackUmengEvent("pay_success", {
                      userId: userId,
                      pageName: "我的",
                    });
                    uni.showToast({
                      title: this.$t('common.paySuccess'),
                      icon: "success",
                    });
                    // 支付成功后刷新用户信息，更新VIP状态
                    console.log("开始刷新用户信息...");
                    await _this.refreshUserInfo();
                  },
                  fail: async (payErr) => {
                    console.error("支付失败", payErr);
                    // 如果不是用户取消，则调用友盟统计事件
                    if (!payErr.errMsg || !payErr.errMsg.includes("cancel")) {
                      // 获取用户ID
                      const userId = _this.userInfo?.id || "";
                      trackUmengEvent("pay_fail", {
                        userId: userId,
                        pageName: "我的",
                      });
                    }
                    if (payErr.errMsg && payErr.errMsg.includes("cancel")) {
                      uni.showToast({
                        title: this.$t('common.payCanceled'),
                        icon: "none",
                      });
                    } else {
                      uni.showToast({
                        title: payErr.errMsg || this.$t('common.payFailed'),
                        icon: "none",
                      });
                    }
                  },
                });
                // #endif

                // #ifndef MP-WEIXIN
                uni.showToast({
                  title: this.$t('common.wechatPayNotSupported'),
                  icon: "none",
                });
                // #endif
              } else {
                uni.showToast({
                  title:
                    prepayRes.msg || prepayRes.message || this.$t('common.operationFailed'),
                  icon: "none",
                });
              }
            } catch (prepayError) {
              console.error("获取预支付ID失败:", prepayError);
              uni.showToast({
                title:
                  prepayError.msg || prepayError.message || this.$t('common.operationFailed'),
                icon: "none",
              });
            }
          } else {
            uni.showToast({
              title: this.$t('common.vipProductNotFound'),
              icon: "none",
            });
          }
        } else {
          uni.showToast({
            title: res.msg || res.message || this.$t('common.getProductListFailed'),
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取产品列表失败:", error);
        uni.showToast({
          title: error.msg || error.message || this.$t('common.getProductListFailed'),
          icon: "none",
        });
      }
    },
    handleHistoryClick() {
      // 处理历史海报点击
      console.log("查看历史海报");
      
      // 检查登录状态，如果未登录则跳转到登录页面
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      
      uni.navigateTo({
        url: "/pages/my/poster",
      });
    },
    handlePosterClick(item) {
      // 处理单个海报点击
      console.log("点击海报:", item);

      // 检查登录状态，如果未登录则跳转到登录页面
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }

      // 如果状态是生成失败，显示失败弹窗
      if (item.status === "error") {
        this.currentPosterId = item.id; // 保存当前海报ID
        this.showDelPopup2 = true;
        return;
      }
    },
    // 处理海报图片点击
    handlePosterImageClick(item, index) {
      // 检查登录状态，如果未登录则跳转到登录页面
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      
      // 如果状态是已完成，跳转到详情页
      if (item.status === "done") {
        if (item.id) {
          uni.navigateTo({
            url: `/pages/index/proProster?id=${item.id}`,
            fail: (err) => {
              console.error("跳转失败:", err);
              uni.showToast({
                title: this.$t('common.jumpFailed'),
                icon: "none",
              });
            },
          });
        } else {
          uni.showToast({
            title: this.$t('poster.posterIdNotExist'),
            icon: "none",
          });
        }
        return;
      }

      // 如果状态是生成失败，显示失败弹窗
      if (item.status === "error") {
        this.currentPosterId = item.id; // 保存当前海报ID
        this.showDelPopup2 = true;
        return;
      }

      // 其他状态，预览图片
      this.previewImage(item, index);
    },
    // 预览图片
    previewImage(item, index) {
      // 如果状态是生成中、失败或已删除，不允许预览
      if (
        item.status === "waiting" ||
        item.status === "error" ||
        item.status === "deleted" ||
        !item.file_url
      ) {
        return;
      }

      // 收集所有可预览的图片URL（已完成状态的图片）
      const urls = this.posterList
        .filter((poster) => poster.file_url && poster.status === "done")
        .map((poster) => poster.file_url);

      // 找到当前图片在列表中的索引
      const currentIndex = urls.findIndex((url) => url === item.file_url);

      uni.previewImage({
        urls: urls,
        current: currentIndex >= 0 ? currentIndex : 0,
        fail: (err) => {
          console.error("预览图片失败:", err);
          uni.showToast({
            title: this.$t('common.previewFailed'),
            icon: "none",
          });
        },
      });
    },
    handleFunctionClick(item) {
      // 处理功能项点击
      console.log("点击功能:", item);
      
      switch (item.type) {
        case "language":
          // 跳转到语言设置页面（不需要登录）
          uni.navigateTo({
            url: item.url,
          });
          break;
        case "recharge":
          // 检查登录状态，如果未登录则跳转到登录页面
          if (!this.isLoggedIn) {
            uni.navigateTo({
              url: "/pages/login/login"
            });
            return;
          }
          // 跳转到充值记录页面
          uni.navigateTo({
            url: item.url,
          });
          break;
        case "share":
          // 分享功能已通过 button 的 open-type="share" 直接触发
          break;
        case "settings":
          // 检查登录状态，如果未登录则跳转到登录页面
          if (!this.isLoggedIn) {
            uni.navigateTo({
              url: "/pages/login/login"
            });
            return;
          }
          // 跳转到设置页面
          uni.navigateTo({
            url: "/pages/my/settings",
          });
          break;
        case "invite":
          // 检查登录状态，如果未登录则跳转到登录页面
          if (!this.isLoggedIn) {
            uni.navigateTo({
              url: "/pages/login/login"
            });
            return;
          }
          // 跳转到邀请记录页面
          uni.navigateTo({
            url: item.url,
          });
          break;
      }
    },
    handleInviteClick() {
      // 检查登录状态，如果未登录则跳转到登录页面
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      
      // 调用友盟统计事件
      trackUmengEvent("click_invite", {
        userId: this.userInfo?.id || "",
        pageName: "我的",
      });
    },
    handleUnlockCardClick() {
      // 调用友盟统计事件
      trackUmengEvent("click_monthpay", {
        userId: this.userInfo?.id || "",
        pageName: "我的",
      });

      if (!this.isLoggedIn) {
        this.handleUnlockClick();
        return;
      }
      if (this.userInfo.is_vip) {
        this.handleUnlockClick();
        return;
      }
      // const allowCount = Number(this.userInfo.allow_count || 0);
      // if (allowCount > 0) {
      //   uni.navigateTo({
      //     url: "/pages/my/poster",
      //   });
      //   return;
      // }
      this.handleUnlockClick();
    },
    ensureShare() {
      // 调用友盟统计事件
      trackUmengEvent("click_invite", {
        userId: this.userInfo?.id || "",
        pageName: "我的",
      });

      if (!this.isLoggedIn) {
      uni.navigateTo({
					url: "/pages/login/login"
				})
        return;
      }
      // #ifdef MP-WEIXIN
      uni.showShareMenu({
        withShareTicket: true,
      });
      // #endif
    },
    async handlePublicFollow() {
      // 调用友盟统计事件
      trackUmengEvent("click_focus", {
        userId: this.userInfo?.id || "",
        pageName: "我的",
      });

      try {
        // 调用接口获取二维码
        const res = await getSystemContent();
        console.log("获取系统内容成功", res);

        if (res.code === 200 || res.code === 201) {
          const data = res.data?.data || res.data || {};
          // 获取 qr_code_url 字段
          const qrCodeUrl = data[0]?.qr_code_url || data.qr_code_url || "";

          if (qrCodeUrl) {
            // 直接预览二维码
            uni.previewImage({
              urls: [qrCodeUrl],
              current: qrCodeUrl,
              fail: (err) => {
                console.error("预览图片失败:", err);
                uni.showToast({
                  title: "预览失败",
                  icon: "none",
                });
              },
            });
          } else {
            uni.showToast({
              title: "二维码获取失败",
              icon: "none",
            });
          }
        } else {
          uni.showToast({
            title: res.msg || res.message || this.$t('common.qrCodeGetFailed'),
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取二维码失败:", error);
        uni.showToast({
          title: error.msg || error.message || this.$t('common.qrCodeGetFailed'),
          icon: "none",
        });
      }
    },
    async saveQrCodeToAlbum() {
      if (!this.qrCodeUrl) {
        uni.showToast({
          title: this.$t('common.qrCodeNotLoaded'),
          icon: "none",
        });
        return;
      }

      try {
        // 先下载图片到本地
        const downloadRes = await uni.downloadFile({
          url: this.qrCodeUrl,
        });

        if (downloadRes.statusCode === 200) {
          // 保存图片到相册
          await uni.saveImageToPhotosAlbum({
            filePath: downloadRes.tempFilePath,
            success: () => {
              uni.showToast({
                title: this.$t('common.saveSuccess'),
                icon: "success",
              });
              // 保存成功后关闭弹窗
              this.showQrCodePopup = false;
            },
            fail: (err) => {
              console.error("保存图片失败:", err);
              if (err.errMsg && err.errMsg.includes("auth deny")) {
                uni.showModal({
                  title: this.$t('common.tip'),
                  content: this.$t('common.needAlbumAuth'),
                  showCancel: false,
                });
              } else {
                uni.showToast({
                  title: this.$t('common.saveFailed'),
                  icon: "none",
                });
              }
            },
          });
        } else {
          uni.showToast({
            title: this.$t('common.downloadFailed'),
            icon: "none",
          });
        }
      } catch (error) {
        console.error("保存二维码失败:", error);
        uni.showToast({
          title: this.$t('common.saveFailed'),
          icon: "none",
        });
      }
    },
    async onChooseAvatar(e) {
      console.log("选择头像", e);
      const avatarUrl = e.detail.avatarUrl;

      // 先显示本地选择的头像
      this.userInfo.user_avatar = avatarUrl;
      uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));

      try {
        // 上传头像到服务器
        const uploadRes = await uploadAvatar(avatarUrl);
        console.log("上传头像成功", uploadRes);

        // 获取服务器返回的头像URL
        const serverAvatarUrl =
          uploadRes.data?.url ||
          uploadRes.data?.fileUrl ||
          uploadRes.data?.avatar ||
          uploadRes.data;

        if (serverAvatarUrl) {
          // 更新本地头像为服务器返回的URL
          this.userInfo.user_avatar = serverAvatarUrl;
          uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));

          // 调用更新用户信息接口，使用服务器返回的URL
          await this.updateUserInfoToServer({ user_avatar: serverAvatarUrl });

          uni.showToast({
            title: this.$t('common.avatarUploadSuccess'),
            icon: "success",
          });
        } else {
          console.warn("服务器未返回头像URL", uploadRes);
          uni.showToast({
            title: this.$t('common.avatarUploadSuccessButNoUrl'),
            icon: "none",
          });
        }
      } catch (error) {
        console.error("上传头像失败:", error);
        uni.showToast({
          title: error.msg || error.message || this.$t('common.avatarUploadFailed'),
          icon: "none",
        });
        // 上传失败，恢复默认头像
        this.userInfo.user_avatar = "/static/my/user_no.png";
        uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));
      }
    },
    async onNicknameBlur(e) {
      const nickname = e.detail.value.trim();
      if (nickname && nickname !== this.userInfo.username) {
        this.userInfo.username = nickname;
        uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));
        // 调用更新用户信息接口
        await this.updateUserInfoToServer({ username: nickname });
      }
    },
    async onNicknameConfirm(e) {
      const nickname = e.detail.value.trim();
      if (nickname && nickname !== this.userInfo.username) {
        this.userInfo.username = nickname;
        uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));
        // 调用更新用户信息接口
        await this.updateUserInfoToServer({ username: nickname });
      }
    },
    // 处理性别选择变化
    handleGenderChange(e) {
      console.log("性别选择变化", e);
      const selectedIndex = e.detail.value;
      const selectedGender = this.genderOptions[selectedIndex];

      if (selectedGender) {
        // 更新本地用户信息
        this.userInfo.user_gender = selectedGender.value;
        uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));

        // 调用更新用户信息接口，更新性别到服务器
        this.updateUserInfoToServer({ user_gender: selectedGender.value });

        uni.showToast({
          title: this.$t('common.genderUpdated'),
          icon: "success",
        });
      }
    },
    async updateUserInfoToServer(params = {}) {
      // 获取openId，优先从userInfo中获取，如果没有则从存储中获取
      const openId = this.userInfo.open_id || uni.getStorageSync("openId");
      if (!openId) {
        console.warn("openId不存在，无法更新用户信息");
        return;
      }

      try {
        const updateParams = {};

        // 如果有头像，添加头像参数
        if (params.user_avatar) {
          updateParams.user_avatar = params.user_avatar;
        }

        // 如果有昵称，添加昵称参数
        if (params.username) {
          updateParams.username = params.username;
        }

        // 如果有性别，添加性别参数（转换为字符串：0->unknown, 1->male, 2->female）
        if (params.user_gender !== undefined && params.user_gender !== null) {
          const genderMap = {
            0: "unknown",
            1: "male",
            2: "female",
          };
          updateParams.user_gender =
            genderMap[params.user_gender] ||
            genderMap[String(params.user_gender)] ||
            "unknown";
        }

        const res = await updateUserInfo(
          openId,
          updateParams.user_avatar || "",
          updateParams.username || "",
          updateParams.user_gender
        );

        if (res.code === 200 || res.code === 201) {
          console.log("更新用户信息成功", res);
        }
      } catch (error) {
        console.error("更新用户信息失败:", error);
      }
    },
    // 下拉刷新用户信息（从服务器获取最新信息）
    async refreshUserInfoForPullDown() {
      try {
        await this.refreshUserInfo()
        // 刷新海报列表
        await this.fetchPosterList()
        // 延迟一下再停止刷新，让动画更流畅
        setTimeout(() => {
          uni.hideLoading()
          uni.stopPullDownRefresh()
        }, 500)
      } catch (err) {
        // 即使获取用户信息失败，也刷新海报列表
        await this.fetchPosterList()
        uni.stopPullDownRefresh()
      }
    },
    // 刷新用户信息（从服务器获取最新信息）
    async refreshUserInfo() {
      console.log("refreshUserInfo 方法被调用");
      try {
        // 获取openId
        const openId = this.userInfo.open_id || uni.getStorageSync("openId");
        console.log("获取到的openId:", openId);

        if (!openId) {
          console.warn("openId不存在，无法刷新用户信息");
          uni.showToast({
            title: this.$t('common.userInfoNotExistRelogin'),
            icon: "none",
          });
          return;
        }

        console.log("开始调用 getUserInfo 接口，openId:", openId);
        // 调用接口获取最新用户信息
        const res = await getUserInfo(openId);
        console.log("getUserInfo 接口返回:", res);

        if (res.code === 200 || res.code === 201) {
          const userData = res.data?.data || res.data || {};
          console.log("解析后的用户数据:", userData);

          const previousAllow = Number(this.userInfo.allow_count || 0);
          // 更新本地用户信息
          this.userInfo = {
            ...this.userInfo,
            ...userData,
          };

          // 保存到本地存储
          uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));

          console.log("用户信息已更新", this.userInfo);

          const currentAllow = Number(this.userInfo.allow_count || 0);
          if (
            currentAllow > previousAllow &&
            this.isLoggedIn &&
            !Number.isNaN(currentAllow)
          ) {
            this.rewardPopupDiff = currentAllow - previousAllow;
            this.rewardPopupRemaining = currentAllow;
            this.rewardPopupVisible = true;
          }
          this.lastAllowCount = currentAllow;

          // 显示更新成功提示
          // uni.showToast({
          //   title: "用户信息已更新",
          //   icon: "success",
          //   duration: 1500,
          // });
        } else {
          console.warn("获取用户信息失败，返回码:", res.code);
        }
      } catch (error) {
        console.error("刷新用户信息失败:", error);
        uni.showToast({
          title: this.$t('common.refreshUserInfoFailed'),
          icon: "none",
        });
      }
    },
    closeRewardPopup() {
      this.rewardPopupVisible = false;
    },
    handleGoUse() {
      this.rewardPopupVisible = false;
      uni.navigateTo({
        url: "/pages/my/poster",
      });
    },
    handleShare() {
      // 调用微信的分享接口
      uni.shareAppMessage({
        title: this.$t('common.inviteFriends'),
        path: `/pages/index/index?referrerId=${this.userInfo.id}`,
        imageUrl: "", // 分享图片，不设置则使用默认截图
      });
    },
    handleFailCancel() {
      this.showDelPopup2 = false;
      this.currentPosterId = null; // 清空保存的海报ID
    },
    async handleRetryEdit() {
      if (!this.currentPosterId) {
        uni.showToast({
          title: this.$t('poster.posterIdNotExist'),
          icon: "none",
        });
        this.showDelPopup2 = false;
        return;
      }

      // 关闭失败弹窗
      this.showDelPopup2 = false;

      // 显示进度条弹窗
      this.showProgress = true;
      this.progress = 0;
      // 清除之前的定时器
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
      }

      // 启动进度条动画
      this.progressTimer = setInterval(() => {
        if (this.progress >= 99) {
          clearInterval(this.progressTimer);
          this.progressTimer = null;
          return;
        }
        this.progress++;
      }, 20);

      try {
        // 调用重新生成海报接口，不显示loading（因为已经有进度条了）
        const res = await reGeneratePoster(this.currentPosterId, false);
        console.log("重新生成海报成功", res);

        // 清除进度条定时器
        if (this.progressTimer) {
          clearInterval(this.progressTimer);
          this.progressTimer = null;
        }

        if (res.code === 200 || res.code === 201) {
          // 设置进度为100%
          this.progress = 100;


          // 延迟关闭弹窗，让用户看到100%
          setTimeout(() => {
            this.showProgress = false;
            this.currentPosterId = null;

            // 重新获取海报列表
            this.fetchPosterList();
          }, 500);
        } else {
          this.showProgress = false;
          this.currentPosterId = null;
          // uni.showToast({
          //   title: res.msg || res.message || "重新生成失败",
          //   icon: "none",
          // });
        }
      } catch (error) {
        console.error("重新生成海报失败:", error);

        // 清除进度条定时器
        if (this.progressTimer) {
          clearInterval(this.progressTimer);
          this.progressTimer = null;
        }


        // 关闭进度条弹窗
        this.showProgress = false;
        this.currentPosterId = null;


        uni.showToast({
          title: error.msg || error.message || this.$t('common.operationFailed'),
          icon: "none",
        });
      }
    },
    handleProgressClose() {
      this.fetchPosterList();
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
      }
      this.showProgress = false;
      this.progress = 0;
    },
    // 更新 tabBar 国际化
    updateTabBarI18n() {
      try {
        // index 0: 首页
        const indexText = this.$t('tabBar.index');
        uni.setTabBarItem({
          index: 0,
          text: indexText && indexText !== 'tabBar.index' ? indexText : '首页'
        });
        // index 1: 测试记录
        const testText = this.$t('tabBar.test');
        uni.setTabBarItem({
          index: 1,
          text: testText && testText !== 'tabBar.test' ? testText : '测试记录'
        });
        // index 2: 我的
        const myText = this.$t('tabBar.my');
        uni.setTabBarItem({
          index: 2,
          text: myText && myText !== 'tabBar.my' ? myText : '我的'
        });
      } catch (error) {
        console.error('更新 tabBar 国际化失败:', error);
        // 如果国际化失败，使用默认值
        try {
          uni.setTabBarItem({ index: 0, text: '首页' });
          uni.setTabBarItem({ index: 1, text: '测试记录' });
          uni.setTabBarItem({ index: 2, text: '我的' });
        } catch (e) {
          console.error('设置 tabBar 默认值失败:', e);
        }
      }
    },
  },
};
</script>

<style>
page {
  background: #12111f !important;
}
.u-safe-bottom{
		height: 0 !important;
	}
</style>

<style scoped lang="scss">
.my-page {
  min-height: 100vh;
  padding: 48rpx 30rpx 60rpx;
  box-sizing: border-box;
  background: #12111f;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  color: #ffffff;
}

.profile-card {
  // background: #1f1b2e;
  // border-radius: 32rpx;
  // padding: 40rpx 32rpx;
  // box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.profile-content {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 64rpx;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.18);
}

.avatar-btn {
  width: 128rpx;
  height: 128rpx;
  border-radius: 64rpx;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2rpx solid rgba(255, 255, 255, 0.18);
  line-height: normal;

  &::after {
    border: none;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 64rpx;
  }
}

.profile-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 12rpx;
}

.nickname,
.nickname-input {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

.nickname-input {
  padding: 0;
  border: none;
  background: transparent;
  width: 100%;
}

.login-tip {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.gender-section {
  display: flex;
  align-items: center;
}

.gender-picker {
  display: inline-flex;
  align-items: center;
}

.gender-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.profile-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
}

.vip-module {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  // height: 180rpx;
  border-radius: 24rpx;
  padding: 32rpx;
  box-sizing: border-box;
  background: linear-gradient(99deg,
      #39345d 1%,
      #33253e 26%,
      #24202f 61%,
      #39345d 99%);
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.vip-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  z-index: 1;
  width: 75%;
}

.vip-header {
  display: flex;
  align-items: center;
}

.vip-header--member {
  align-items: center;
  gap: 12rpx;
}

.vip-tag {
  font-size: 20rpx;
  font-weight: 500;
  background: linear-gradient(180deg, #c5b2ed 0%, #a08ed4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 16rpx;
}

.vip-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #e7d5c5;
}

.vip-title--guest {
  color: #f5dbf4;
}

.vip-expire {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4rpx;
}

.vip-title-icon {
width: 44rpx;
  height: 36rpx;
  margin-left: 20rpx;
}

.vip-subtitle {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4rpx;
}

.vip-subtitle-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.75);
}

.vip-count {
  font-size: 26rpx;
  font-weight: 600;
  color: #ffffff;

  &.infinity {
    color: #ff3d3d;
  }
}

.vip-action {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  // width: 100rpx;
  // min-height: 70rpx;
  width: 130rpx;
  border-radius: 46rpx;
  border: none;
  background: linear-gradient(90deg, #9159e1 1%, #6341e2 100%);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  line-height: normal;
  word-break: break-word;
  padding: 10rpx 8rpx;
  box-sizing: border-box;

  &::after {
    border: none;
  }
}

.invite-module {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-radius: 24rpx;
  background: rgba(148, 119, 180, 0.1);
  box-shadow: 0 14rpx 44rpx rgba(0, 0, 0, 0.28);
}

.invite-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.invite-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8rpx;
}

.invite-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
}

.invite-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.65);
}

.invite-action {
  min-width: 132rpx;
  height: 64rpx;
  border-radius: 36rpx;
  border: none;
  background: linear-gradient(90deg, #9159e1 1%, #6341e2 100%);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28rpx;
  line-height: normal;

  &::after {
    border: none;
  }
}

.history-card {
  background: #1f1b2e;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  width: 100%;
}

.functions-card,
.public-card {
  background: #1f1b2e;
  border-radius: 32rpx;
  padding: 10rpx 32rpx;
  box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  width: 100%;
}

.public-card {
  display: flex;
  align-items: center;
  height: 144rpx;
  padding: 0 32rpx;
  gap: 20rpx;
}

.public-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.functions-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #ffffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 28rpx;
  color: #ffffff;
}

.arrow-icon {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1;
}

.date-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
  margin: 24rpx 0;
}

.poster-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 20rpx;
}

.poster-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc((100% - 40rpx) / 3);
  flex-shrink: 0;
}

.poster-image-wrapper {
  width: 100%;
  height: 330rpx;
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.poster-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  transition: filter 0.3s;

  &.poster-image--blur {
    filter: blur(8rpx);
  }
}

.poster-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
}

.poster-status-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.status-overlay {
  position: absolute;
  inset: 0;
  background: rgba(18, 17, 31, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28rpx;
  backdrop-filter: blur(12rpx);
  z-index: 1;
}

.status-title {
  font-size: 28rpx;
  color: #ffffff;
}

.poster-date-overlay {
  position: absolute;
  bottom: 0rpx;
  right: 0rpx;
  z-index: 2;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  backdrop-filter: blur(4rpx);
}

.poster-date {
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 500;
}

.poster-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.68);
  text-align: center;
  margin-top: 12rpx;
}

.function-list {
  display: flex;
  flex-direction: column;
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.08);
  background: transparent;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
}

.share-button {
  width: 100%;
  padding: 28rpx 0;
  line-height: normal;

  &::after {
    border: none;
  }
}

.function-text {
  font-size: 28rpx;
  color: #ffffff;
}

.public-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.public-title {
  font-size: 28rpx;
  color: #ffffff;
}

.public-action {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.reward-popup {
  position: relative;
  width: 560rpx;
  padding: 160rpx 36rpx 50rpx;
  box-sizing: border-box;
  border-radius: 40rpx;
  background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
  box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
  text-align: center;
  color: #333333;
}

.reward-popup-icon {
  position: absolute;
  top: -90rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 146rpx;
  height: 202rpx;
}

.reward-popup-main {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  color: #2b1747;
}

.reward-popup-main-line {
  display: block;
}

.reward-popup-sub {
  font-size: 26rpx;
  color: rgba(51, 51, 51, 0.6);
  line-height: 1.6;
  margin-bottom: 56rpx;
  padding: 0 12rpx;
}

.reward-popup-actions {
  display: flex;
  gap: 24rpx;
  justify-content: center;
}

.reward-popup-btn {
  min-width: 220rpx;
  height: 86rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
}

.reward-popup-btn.cancel {
  background: #eeedff;
  color: #b370ff;
}

.reward-popup-btn.confirm {
  background: #b370ff;
  color: #ffffff;
}

.reward-popup-wrapper ::v-deep .u-popup__content {
  background: transparent;
  border-radius: 60rpx;
  box-shadow: none;
  padding: 0;
}

.reward-popup-close {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin: 36rpx auto 0;
  border: 2rpx solid rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  background: rgba(0, 0, 0, 0.25);
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
  margin-bottom: 50rpx;
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

.content {
  width: 420rpx;
  height: 250rpx;
  padding: 40rpx 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.num {
  font-size: 26rpx;
  margin: 20rpx 0;
  color: #000;
}

.progress-wrapper {
  width: 70%;
  margin: 10rpx auto;
  margin-bottom: 20rpx;
}

.custom-progress {
  width: 100%;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 40rpx;
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
}

.qr-code-popup {
  position: relative;
  width: 560rpx;
  padding: 60rpx 40rpx 48rpx;
  box-sizing: border-box;
  border-radius: 36rpx;
  background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
  box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

.qr-code-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.qr-code-image {
  width: 400rpx;
  height: 400rpx;
  border-radius: 16rpx;
  background: #ffffff;
  padding: 20rpx;
  box-sizing: border-box;
}

.qr-code-loading {
  width: 400rpx;
  height: 400rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: rgba(51, 51, 51, 0.6);
}

.qr-code-popup-close {
  width: 200rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #b370ff;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}
</style>
