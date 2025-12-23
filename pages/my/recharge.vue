<style>
page {
  background: #12111f;
  height: 100vh;
}
</style>

<style scoped lang="scss">
.recharge-page {
  min-height: 100vh;
  background: #12111f;
  padding: 48rpx 30rpx 60rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.recharge-card {
  flex: 1;
  background: #1f1b2e;
  border-radius: 32rpx;
  box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);
  padding: 12rpx 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.recharge-list-wrapper {
  flex: 1;
  height: 100%;
  min-height: 0;
  width: 100%;
}

.recharge-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 40rpx;
}

.recharge-item {
  padding: 28rpx 0;
  border-bottom: 1rpx dashed rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx;
}

.item-left {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item-title {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.item-date {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
}

.item-right .item-amount {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
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
<template>
  <view class="recharge-page">
    <view class="recharge-card">
      <scroll-view
        class="recharge-list-wrapper"
        scroll-y
        @scroll="onScroll"
        @scrolltolower="loadMore"
        :lower-threshold="50"
        :enable-back-to-top="true"
      >
        <view class="recharge-list">
          <view
            class="recharge-item"
            v-for="(item, index) in rechargeList"
            :key="item.id || index"
          >
            <view class="item-content">
              <view class="item-left">
                <text class="item-title">{{ item.product_name }}</text>
                <text class="item-date">{{ formatDate(item.pay_time) }}</text>
              </view>
              <view class="item-right">
                <text class="item-amount">{{
                  formatAmount(item.total_fee)
                }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="loading" class="loading-more">{{ $t('recharge.loading') || $t('common.loading') }}</view>
        <view v-if="!hasMore && rechargeList.length > 0" class="no-more"
          >{{ $t('recharge.noMore') || $t('common.noMore') }}</view
        >
        <view v-if="rechargeList.length === 0 && !loading" class="empty-state">
          <text class="empty-text">{{ $t('recharge.emptyText') }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getRechargeList, getUserInfo } from "@/api/login.js";
import { pageStayMixin } from "@/utils/pageStayMixin.js";

export default {
  mixins: [pageStayMixin],
  data() {
    return {
      pageName: '',
      rechargeList: [],
      currentPage: 1,
      pageSize: 20,
      hasMore: true,
      loading: false,
    };
  },
  onLoad() {
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.$t('recharge.title') || '历史解锁记录'
    });
    this.pageName = this.$t('recharge.title') || '历史解锁记录';
    this.fetchRechargeList();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.fetchRechargeList(true).finally(() => {
      // 停止下拉刷新动画
      uni.stopPullDownRefresh();
    });
    this.refreshUserInfo();
  },
  onReachBottom() {
    // 页面触底事件（作为 scroll-view 的备选方案）
    console.log("========== 页面触底事件 ==========");
    this.loadMore();
  },
  methods: {
    // 刷新用户信息
    refreshUserInfo() {
      const openId = uni.getStorageSync('openId')
      
      getUserInfo(openId).then(res => {
        const userinfo = res.data
        uni.setStorageSync('userInfo', JSON.stringify(userinfo))
        // 刷新充值记录列表
        this.fetchRechargeList(true).finally(() => {
          // 延迟一下再停止刷新，让动画更流畅
          setTimeout(() => {
            uni.hideLoading()
            uni.stopPullDownRefresh()
          }, 500)
        })
      }).catch(err => {
        // 即使获取用户信息失败，也刷新充值记录列表
        this.fetchRechargeList(true).finally(() => {
          uni.stopPullDownRefresh()
        })
      })
    },
    // 获取充值记录列表
    async fetchRechargeList(reset = false) {
      if (this.loading) return Promise.resolve();

      if (reset) {
        this.currentPage = 1;
        this.rechargeList = [];
        this.hasMore = true;
      }

      if (!this.hasMore && !reset) return Promise.resolve();

      this.loading = true;
      try {
        const res = await getRechargeList(this.currentPage, this.pageSize);
        console.log("获取充值记录列表成功", res);

        if (res.code === 200 || res.code === 201) {
          // 解析返回的数据结构
          const data = res.data || {};
          const results = data.results || [];
          const pagination = data.pagination || {};

          console.log("接口返回数据", {
            resultsLength: results.length,
            pagination: pagination,
          });

          if (reset) {
            this.rechargeList = results;
            this.currentPage = 1;
          } else {
            this.rechargeList = [...this.rechargeList, ...results];
          }

          // 根据 pagination 判断是否还有更多数据
          const currentPage = pagination.page || this.currentPage;
          const totalPages = pagination.total_pages || 0;

          console.log("分页信息", {
            currentPage: currentPage,
            totalPages: totalPages,
            hasMore: currentPage < totalPages,
          });

          if (currentPage >= totalPages) {
            // 当前页已经是最后一页，没有更多数据
            this.hasMore = false;
            console.log("已到最后一页，没有更多数据");
          } else {
            // 还有更多数据，更新页码为下一页
            this.currentPage = currentPage + 1;
            this.hasMore = true;
            console.log("还有更多数据，下一页:", this.currentPage);
          }
        }
      } catch (error) {
        console.error("获取充值记录列表失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 滚动事件（用于调试）
    onScroll(e) {
      // 可以在这里添加滚动位置的日志，帮助调试
      // console.log("滚动位置", e.detail);
    },

    // 加载更多
    loadMore(e) {
      console.log("========== 触底加载更多 ==========");
      console.log("事件对象:", e);
      console.log("状态:", {
        loading: this.loading,
        hasMore: this.hasMore,
        currentPage: this.currentPage,
        listLength: this.rechargeList.length,
      });

      if (this.loading) {
        console.log("❌ 正在加载中，跳过");
        return;
      }

      if (!this.hasMore) {
        console.log("❌ 没有更多数据了");
        return;
      }

      console.log("✅ 开始加载更多数据，当前页:", this.currentPage);
      this.fetchRechargeList();
    },

    // 格式化日期（支持国际化）
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 格式化金额
    formatAmount(amount) {
      if (amount === null || amount === undefined || amount === "") {
        return `0.00 ${this.$t('common.currencyUnit') || '元'}`;
      }

      // 处理金额（可能是字符串或数字，可能是以分为单位）
      let amountNum = parseFloat(amount);

      // 如果金额很大（可能是以分为单位），除以100
      if (Math.abs(amountNum) >= 100) {
        amountNum = amountNum / 100;
      }

      // 处理负数
      const isNegative = amountNum < 0;
      const absAmount = Math.abs(amountNum);

      // 格式化为两位小数
      const formatted = absAmount.toFixed(2);
      const currencyUnit = this.$t('common.currencyUnit') || '元';

      return isNegative ? `-${formatted} ${currencyUnit}` : `${formatted} ${currencyUnit}`;
    },
  },
};
</script>
