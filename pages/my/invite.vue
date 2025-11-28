<template>
  <view class="invite-page">
    <view class="invite-card">
      <scroll-view class="invite-list-wrapper" scroll-y>
        <view class="invite-list">
          <view
            v-for="(item, index) in inviteList"
            :key="index"
            class="invite-item"
          >
            <view class="item-content">
              <view class="item-left">
                <image
                  class="item-avatar"
                  :src="item.user_avatar || '/static/my/user_no.png'"
                  mode="aspectFill"
                ></image>
                <view class="item-info">
                  <text class="item-name">{{
                    item.username || item.nickname || $t('my.userNickname') 
                  }}</text>
                </view>
              </view>
              <view class="item-right">
                <text class="item-date">{{
                  formatDate(item.created_at || item.created_at)
                }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="loading" class="loading-more">{{ $t('invite.loading') || $t('common.loading') }}</view>
        <view v-if="!loading && inviteList.length === 0" class="empty-state">
          <text class="empty-text">{{ $t('invite.emptyText') }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getAcquireNewUsers } from "@/api/login.js";
import { pageStayMixin } from "@/utils/pageStayMixin.js";

export default {
  mixins: [pageStayMixin],
  data() {
    return {
      pageName: '',
      inviteList: [],
      loading: false,
    };
  },
  onLoad() {
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.$t('invite.title') || '邀请记录'
    });
    this.pageName = this.$t('invite.title') || '邀请记录';
    this.fetchInviteList();
  },
  methods: {
    // 获取邀请记录列表
    async fetchInviteList() {
      if (this.loading) return Promise.resolve();

      this.loading = true;
      try {
        const userInfo = uni.getStorageSync("userInfo");
        const openId = userInfo
          ? JSON.parse(userInfo).open_id
          : uni.getStorageSync("openId") || "";

        if (!openId) {
          uni.showToast({
            title: this.$t('invite.userInfoNotExist') || this.$t('common.userInfoNotExist'),
            icon: "none",
          });
          this.inviteList = [];
          return;
        }

        const res = await getAcquireNewUsers(openId);
        console.log("获取邀请记录列表成功", res.data.invitees_list);
        if (res.code == 200 || res.code == 201) {
         this.inviteList = res.data.invitees_list || res.data?.data || res.data || [];
        }
      } catch (error) {
        console.error("获取邀请记录列表失败:", error);
        this.inviteList = [];
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      // 新接口可能不支持分页，保留方法但不执行操作
      // 如果需要分页，需要根据实际接口调整
    },
    // 格式化日期时间
    formatDate(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return dateString;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        console.error("格式化日期失败:", error);
        return dateString;
      }
    },
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
.invite-page {
  min-height: 100vh;
  background: #12111f;
  padding: 48rpx 30rpx 60rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.invite-card {
  flex: 1;
  background: #1f1b2e;
  border-radius: 32rpx;
  box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);
  padding: 12rpx 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.invite-list-wrapper {
  flex: 1;
height: 100%;
}

.invite-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.invite-item {
  padding: 28rpx 0;
  border-bottom: 1rpx dashed rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 24rpx;
}

.item-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item-name {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
}

.item-date {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}

.loading-more,
.no-more {
  width: 100%;
  text-align: center;
  padding: 32rpx 0;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  padding: 40rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.55);
  }
}
</style>
