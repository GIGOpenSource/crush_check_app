<template>
  <view class="poster-page">
    <view class="category-bar">
      <scroll-view
        class="category-scroll"
        scroll-x
        show-scrollbar="false"
        scroll-with-animation
        :scroll-left="categoryScrollLeft"
      >
        <view class="category-track">
          <view
            v-for="(item, index) in categoryList"
            :key="index"
            :id="`category-${index}`"
            class="category-pill"
            :class="{ active: currentCategory === index }"
            @click="handleCategoryClick(item, index)"
          >
            <text class="category-pill-text">{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view
      class="poster-list-wrapper"
      scroll-y
      @scrolltolower="loadMore"
      :lower-threshold="100"
    >
      <view class="poster-grid">
        <view
          v-for="(item, index) in posterList"
          :key="item.id || index"
          class="poster-card"
        >
          <view
            class="poster-thumb"
            @click="
              isType ? handlePosterClick(item, index) : toggleSelect(item)
            "
          >
            <image
              v-if="!isType"
              class="select-icon"
              :src="
                item.isActive
                  ? $getImg('my/xuanzhong')
                  : $getImg('my/weixuan')
              "
              mode="aspectFit"
              @click.stop="toggleSelect(item)"
            ></image>
            <image
              v-if="item.file_url"
              class="poster-image"
              :class="{
                'poster-image--blur':
                  item.status === 'waiting' || item.status === 'error',
              }"
              :src="item.file_url"
              mode=""
            ></image>
            <view v-else class="poster-placeholder">
              <text class="poster-placeholder-text">{{
                getStatusText(item.status)
              }}</text>
            </view>
            <view
              v-if="item.status === 'waiting' || item.status === 'error'"
              class="status-overlay"
            >
              <text class="status-title">{{
                getStatusTitle(item.status)
              }}</text>
            </view>
            <view class="poster-date-overlay">
              <text class="poster-date">{{
                formatDate(item.created_time)
              }}</text>
            </view>
          </view>
          <view class="poster-info">
            <text class="poster-type">{{
              getPosterTypeLabel(item.prompt_template?.template_type)
            }}</text>
          </view>
        </view>
        <view v-if="loading" class="loading-more">{{ $t('poster.loadingMore') }}</view>
        <view v-if="!hasMore && posterList.length > 0" class="no-more"
          >{{ $t('poster.noMore') }}</view
        >
      </view>
    </scroll-view>
  </view>

  <view class="action-bar">
    <button
      v-if="isType"
      class="action-btn primary"
      hover-class="none"
      @click="enterManageMode"
      >
      {{ $t('poster.manage') }}
      </button>
      <view v-else class="action-controls">
        <button
          class="action-btn ghost"
          hover-class="none"
          @click="exitManageMode"
        >
        {{ $t('common.cancel') }}
        </button>
        <button class="action-btn danger" hover-class="none" @click="delItems">
        {{ selectedCount ? `${$t('poster.deleteSelectedPrefix')}${selectedCount}${$t('poster.deleteSelectedSuffix')}` : $t('poster.delete') }}
        </button>
    </view>
  </view>
  <up-popup :show="showDelPopup" mode="center">
    <view class="del-popup-content">
      <image class="del-popup-icon" :src="$getImg('my/shanchu')"></image>
      <view class="del-popup-title">
        {{
          selectedCount > 1
            ? `${$t('poster.confirmDeleteMultiplePrefix')}${selectedCount}${$t('poster.confirmDeleteMultipleSuffix')}`
            : $t('poster.confirmDelete')
        }}
      </view>
      <view class="del-popup-actions">
        <view class="del-popup-btn cancel" @click="showDelPopup = false"
          >{{ $t('common.cancel') }}</view
        >
        <view class="del-popup-btn confirm" @click="confirmDelete">{{ $t('common.confirm') }}</view>
      </view>
    </view>
  </up-popup>

  <up-popup :show="showDelPopup2" mode="center">
    <view class="del-popup-content">
      <image class="del-popup-icon" :src="$getImg('my/gantanhao')"></image>
      <view class="del-popup-title">{{ $t('poster.posterFailed') }}</view>
      <view class="del-popup-actions">
        <view class="del-popup-btn cancel" @click="handleFailCancel">{{ $t('common.cancel') }}</view>
        <view class="del-popup-btn confirm" @click="handleRetryEdit"
          >{{ $t('poster.reAnalyze') }}</view
        >
      </view>
    </view>
  </up-popup>

  <IndexProup :show="showProgress" @close="handleProgressClose" :cha="true" :height="125">
    <template #content>
      <view class="content">
        <view class="num">{{ $t('poster.analyzingPercent') }}{{ progress }}{{ $t('poster.analyzingPercentUnit') }}</view>
        <view class="progress-wrapper">
          <view class="custom-progress">
            <view class="progress-track">
              <view class="progress-fill" :style="{ width: progress + '%' }"></view>
            </view>
          </view>
        </view>
        <view class="tip">{{ $t('poster.exitTip') }}</view>
      </view>
    </template>
  </IndexProup>
</template>

<script>
import { getPosterList, deletePosters, reGeneratePoster, getUserInfo } from "@/api/login.js";
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
      showDelPopup: false,
      showDelPopup2: false,
      selectedCount: 0,
      currentPosterId: null, // 当前点击的海报ID，用于重新生成
      currentCategory: 0,
      categoryScrollLeft: 0, // 分类滚动位置
      isType: true,
      showProgress: false, // 显示进度条弹窗
      progress: 0, // 进度百分比
      progressTimer: null, // 进度条定时器
      categoryList: [],
      posterList: [],
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
    };
  },
  onLoad() {
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.$t('poster.title') || '历史海报'
    });
    
    // 初始化分类列表（使用 i18n）
    this.categoryList = [
      {
        label: t('poster.all'),
        color: "#9B59B6",
        type: "all",
      },
      {
        label: t('poster.socialScreenshot'),
        color: "#5B9BD5",
        type: "social",
      },
      {
        label: t('poster.physicalPhoto'),
  
        color: "#66BB6A",
        type: "physical",
      }
    ];
    this.pageName = t('poster.title');
    this.fetchPosterList();
  },
  onPullDownRefresh() {
    // 下拉刷新
    const openId = uni.getStorageSync('openId')
    
    if (!openId) {
      uni.stopPullDownRefresh()
      return
    }
    
    getUserInfo(openId).then(res => {
      if (res.code === 200 || res.code === 201) {
        const userData = res.data?.data || res.data || {}
        uni.setStorageSync('userInfo', JSON.stringify(userData))
      }
      // 刷新海报列表
      this.fetchPosterList(true).finally(() => {
        // 延迟一下再停止刷新，让动画更流畅
        setTimeout(() => {
          uni.hideLoading()
          uni.stopPullDownRefresh()
        }, 500)
      })
    }).catch(err => {
      console.error('刷新用户信息失败:', err)
      // 即使获取用户信息失败，也刷新海报列表
      this.fetchPosterList(true).finally(() => {
        uni.stopPullDownRefresh()
      })
    })
  },

  methods: {
    // 刷新用户信息
    refreshUserInfo() {
      const openId = uni.getStorageSync('openId')
      
      if (!openId) {
        uni.stopPullDownRefresh()
        return
      }
      
      getUserInfo(openId).then(res => {
        if (res.code === 200 || res.code === 201) {
          const userData = res.data?.data || res.data || {}
          uni.setStorageSync('userInfo', JSON.stringify(userData))
        }
        // 刷新海报列表
        this.fetchPosterList(true).finally(() => {
          // 延迟一下再停止刷新，让动画更流畅
          setTimeout(() => {
            uni.hideLoading()
            uni.stopPullDownRefresh()
          }, 500)
        })
      }).catch(err => {
        console.error('刷新用户信息失败:', err)
        // 即使获取用户信息失败，也刷新海报列表
        this.fetchPosterList(true).finally(() => {
          uni.stopPullDownRefresh()
        })
      })
    },
    // 获取海报列表
    async fetchPosterList(reset = false) {
      if (this.loading) return Promise.resolve();

      if (reset) {
        this.currentPage = 1;
        this.posterList = [];
        this.hasMore = true;
      }

      if (!this.hasMore && !reset) return Promise.resolve();

      this.loading = true;
      try {
        // 获取当前选中的分类类型
        const currentCategoryType =
          this.categoryList[this.currentCategory]?.type || "all";
        const posterType =
          currentCategoryType === "all" ? "" : currentCategoryType;

        // 获取用户ID
        const userInfo = uni.getStorageSync("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).id : "";

        const res = await getPosterList(
          this.currentPage,
          this.pageSize,
          posterType,
          userId
        );

        console.log("获取历史海报列表成功", res);

        if (res.code === 200 || res.code === 201) {
          // 解析返回的数据结构
          const data = res.data || {};
          const results = data.results || [];
          const pagination = data.pagination || {};

          console.log("接口返回数据", {
            resultsLength: results.length,
            pagination: pagination,
          });

          // 为每个项目添加 isActive 属性
          const formattedResults = results.map((item) => ({
            ...item,
            isActive: false,
          }));

          if (reset) {
            this.posterList = formattedResults;
            this.currentPage = 1;
          } else {
            this.posterList = [...this.posterList, ...formattedResults];
          }

          if (!this.isType) {
            this.posterList.forEach((item) => {
              item.isActive = false;
            });
            this.updateSelectedCount();
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
        console.error("获取历史海报列表失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 加载更多
    loadMore() {
      if (!this.loading && this.hasMore) {
        this.fetchPosterList();
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
        return this.$t('poster.justNow');
      }

      // 1 分钟 - 59 分钟：显示 "X 分钟前"
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return `${this.$t('poster.minutesAgo')}${minutes}${this.$t('poster.minutesAgoUnit')}`;
      }

      // 1 小时 - 23 小时：显示 "X 小时前"
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return `${this.$t('poster.hoursAgo')}${hours}${this.$t('poster.hoursAgoUnit')}`;
      }

      // 1 天 - 29 天：显示 "X 天前"
      const days = Math.floor(hours / 24);
      if (days < 30) {
        return `${this.$t('poster.daysAgo')}${days}${this.$t('poster.daysAgoUnit')}`;
      }

      // 1 个月 - 11 个月：显示 "X 个月前"
      const months = Math.floor(days / 30);
      if (months < 12) {
        return `${this.$t('poster.monthsAgo')}${months}${this.$t('poster.monthsAgoUnit')}`;
      }

      // 1 年及以上：显示 "X 年前"
      const years = Math.floor(months / 12);
      return `${this.$t('poster.yearsAgo')}${years}${this.$t('poster.yearsAgoUnit')}`;
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        waiting: this.$t('poster.generating'),
        done: this.$t('poster.done'),
        error: this.$t('common.fail'),
        deleted: this.$t('poster.deleted'),
      };
      return statusMap[status] || "";
    },
    // 获取状态标题文本（用于状态遮罩层）
    getStatusTitle(status) {
      if (status === "waiting") {
        return this.$t('poster.generatingStatus');
      } else if (status === "error") {
        return this.$t('poster.generatingFailed');
      }
      return "";
    },

    // 根据 template_type 获取对应的标签
    getPosterTypeLabel(templateType) {
      if (!templateType) return this.$t('poster.unknownType');
      const typeMap = {
        consume: this.$t('poster.consumeVoucher'),
        chat: this.$t('poster.chatScreenshot'),
        social: this.$t('poster.socialScreenshot'),
        physical: this.$t('poster.physicalPhoto'),
      };
      return typeMap[templateType] || this.$t('poster.unknownType');
    },

    // 根据 template_type 获取对应的颜色
    getCategoryColor(templateType) {
      if (!templateType) return "#666";
      const category = this.categoryList.find(
        (item) => item.type === templateType
      );
      return category?.color || "#666";
    },

    // 处理海报点击
    handlePosterClick(item, index) {
      // 如果状态是已完成，跳转到详情页
      if (item.status === "done") {
        if (item.id) {
          uni.navigateTo({
            url: `/pages/index/proProster?id=${item.id}`,
            fail: (err) => {
              console.error("跳转失败:", err);
              uni.showToast({
                title: this.$t('poster.jumpFailed'),
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
            title: this.$t('poster.previewFailed'),
            icon: "none",
          });
        },
      });
    },
    // 获取微信登录code
    getWeixinCode() {
      // 微信小程序环境，直接使用 uni.login，不需要传 provider
      uni.login({
        success: (res) => {
          console.log("登录成功，code:", res.code);
          if (res.code) {
            // 这里可以将 code 发送到服务器换取 openid 和 session_key
            // this.sendCodeToServer(res.code);
            uni.showToast({
              title: this.$t('common.getCodeSuccess'),
              icon: "success",
            });
          } else {
            console.error("获取code失败:", res);
            uni.showToast({
              title: this.$t('common.getCodeFailed'),
              icon: "none",
            });
          }
        },
        fail: (err) => {
          console.error("登录失败:", err);
          uni.showToast({
            title: "登录失败: " + (err.errMsg || "未知错误"),
            icon: "none",
          });
        },
      });
    },

    handleCategoryClick(item, index) {
      if (this.currentCategory === index) {
        return;
      }
      this.currentCategory = index;
      if (!this.isType) {
        this.exitManageMode();
      }

      // 滚动到中间位置
      this.$nextTick(() => {
        this.scrollCategoryToCenter(index);
      });

      // 根据选择的分类重新加载海报列表
      this.fetchPosterList(true);
    },

    // 滚动分类到中间位置
    scrollCategoryToCenter(index) {
      const query = uni.createSelectorQuery().in(this);

      // 同时获取所有需要的元素信息
      query.select(".category-scroll").boundingClientRect();
      query.select(`#category-${index}`).boundingClientRect();
      query.select(".category-track").boundingClientRect();

      query.exec((res) => {
        if (!res || res.length < 3) return;

        const scrollRect = res[0];
        const itemRect = res[1];
        const trackRect = res[2];

        if (!scrollRect || !itemRect || !trackRect) return;

        const scrollViewWidth = scrollRect.width;

        // 计算 tab 相对于 track 的位置
        const itemLeft = itemRect.left - trackRect.left;
        const itemWidth = itemRect.width;
        const itemCenter = itemLeft + itemWidth / 2;

        // 计算需要滚动的位置，使 tab 居中
        const scrollLeft = itemCenter - scrollViewWidth / 2;

        // 确保滚动位置不为负数
        this.categoryScrollLeft = Math.max(0, scrollLeft);
      });
    },

    toggleSelect(item) {
      item.isActive = !item.isActive;
      this.updateSelectedCount();
    },
    updateSelectedCount() {
      this.selectedCount = this.posterList.filter((p) => p.isActive).length;
    },
    enterManageMode() {
      this.isType = false;
      this.posterList.forEach((item) => {
        item.isActive = false;
      });
      this.selectedCount = 0;
    },
    exitManageMode() {
      this.isType = true;
      this.posterList.forEach((item) => {
        item.isActive = false;
      });
      this.selectedCount = 0;
      this.showDelPopup = false;
    },
    delItems() {
      this.updateSelectedCount();
      // 获取选中的海报列表
      const selectedList = this.posterList.filter((item) => item.isActive);

      if (selectedList.length === 0) {
        uni.showToast({
          title: this.$t('poster.pleaseSelectPoster'),
          icon: "none",
        });
        return;
      }

      // 显示删除确认弹窗
      this.showDelPopup = true;
    },

    // 确认删除
    async confirmDelete() {
      // 获取选中的海报列表
      const selectedList = this.posterList.filter((item) => item.isActive);

      if (selectedList.length === 0) {
        this.showDelPopup = false;
        return;
      }

      // 获取选中的海报ID数组
      const ids = selectedList.map((item) => item.id).filter((id) => id);

      if (ids.length === 0) {
        uni.showToast({
          title: this.$t('poster.cannotGetPosterId'),
          icon: "none",
        });
        this.showDelPopup = false;
        return;
      }

      try {
        // 将ID数组转换为逗号分隔的字符串
        const idsString = ids.join(",");

        // 调用删除接口
        const res = await deletePosters(idsString);
        console.log("删除海报成功", res);

        if (res.code === 200 || res.code === 201) {
          // 删除成功后，从列表中移除选中的项
          this.posterList = this.posterList.filter((item) => !item.isActive);

          // 关闭弹窗
          this.showDelPopup = false;

          // 显示删除成功提示
          uni.showToast({
            title: `${this.$t('common.deletedPosters')}${selectedList.length}${this.$t('common.deletedPostersUnit')}`,
            icon: "success",
          });

          this.exitManageMode();
        } else {
          uni.showToast({
            title: res.msg || res.message || this.$t('common.operationFailed'),
            icon: "none",
          });
        }
      } catch (error) {
        console.error("删除海报失败:", error);
        uni.showToast({
          title: error.msg || error.message || this.$t('common.operationFailed'),
          icon: "none",
        });
      }
    },
    handleFailCancel() {
      this.showDelPopup2 = false;
      this.currentPosterId = null; // 清空保存的海报ID
      if (!this.isType) {
        this.exitManageMode();
      }
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
            this.fetchPosterList(true);
          }, 500);
        } else {
          this.showProgress = false;
          this.currentPosterId = null;
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
       this.fetchPosterList(true)
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
      }
      this.showProgress = false;
      this.progress = 0;
    },
  },
};
</script>

<style></style>

<style scoped lang="scss">
.poster-page {
  min-height: 100vh;
  background: #12111f;
  padding: 0 30rpx 160rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.category-bar {
  margin-bottom: 20rpx;
  position: sticky;
  top: 0rpx;
  z-index: 5;
  padding: 32rpx 0;
  background: #12111f;
}

.category-scroll {
  width: 100%;
  white-space: nowrap;
}

.category-track {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.category-pill {
  padding: 18rpx 32rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
  font-size: 28rpx;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;

  &.active {
    background: #2b2848;
    color: #ffffff;
  }
}

.poster-list-wrapper {
  flex: 1;
}

.poster-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24rpx;
  padding-bottom: 100rpx;
}

.poster-card {
  width: calc((100% - 24rpx) / 2);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.02)
  );
  border-radius: 26rpx;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16rpx 36rpx rgba(0, 0, 0, 0.35);
}

.poster-thumb {
  position: relative;
  border-radius: 22rpx;
  overflow: hidden;
  height: 470rpx;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s;

  &.poster-image--blur {
    filter: blur(8rpx);
  }
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.55);
  font-size: 28rpx;
}

.select-icon {
  position: absolute;
  top: 18rpx;
  right: 18rpx;
  width: 60rpx;
  height: 60rpx;
  z-index: 3;
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

.poster-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.65);
}

.poster-type {
  font-weight: 600;
}

.loading-more,
.no-more {
  width: 100%;
  text-align: center;
  padding: 36rpx 0;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 30rpx 48rpx;
  background: linear-gradient(
    0deg,
    rgba(18, 17, 31, 0.96),
    rgba(18, 17, 31, 0.6)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24rpx;
  z-index: 9999;
}

.action-controls {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  min-width: 220rpx;
  height: 88rpx;
  border-radius: 999rpx;
  border: none;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  color: #ffffff;

  &::after {
    border: none;
  }

  &.primary {
    background: linear-gradient(90deg, #9159e1 0%, #6a3ce1 100%);
    box-shadow: 0 16rpx 32rpx rgba(104, 66, 225, 0.35);
  }

  &.ghost {
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.75);
  }

  &.danger {
    background: linear-gradient(90deg, #ff6bc5 0%, #b658ff 100%);
    box-shadow: 0 16rpx 32rpx rgba(190, 96, 255, 0.35);
  }
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
</style>
