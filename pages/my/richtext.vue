<template>
  <view class="richtext-page">
    <view class="richtext-container">
      <rich-text
        v-if="content"
        :nodes="content"
        class="richtext-content"
      ></rich-text>
      <view v-if="loading" class="loading">{{ $t('common.loading') }}</view>
      <view v-if="!loading && !content" class="empty">{{ $t('common.noContent') }}</view>
    </view>
  </view>
</template>

<script>
import { getSystemContent } from "@/api/login.js";
import { pageStayMixin } from "@/utils/pageStayMixin.js";

export default {
  mixins: [pageStayMixin],
  data() {
    return {
      label: "",
      type: "",
      content: "",
      loading: false,
    };
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: decodeURIComponent(options.label),
    });
    this.label = decodeURIComponent(options.label);
    this.type = decodeURIComponent(options.type || "");
    // 设置页面名称用于统计
    this.pageName = decodeURIComponent(options.label) || '富文本';
    this.getRichtext();
  },
  methods: {
    async getRichtext() {
      this.loading = true;
      try {
        // 使用 type 参数，如果没有则根据 label 判断（兼容旧代码）
        let type = this.type;
        // if (!type) {
        //   if (this.label === "隐私政策") {
        //     type = "privacy";
        //   } else if (this.label === "用户协议") {
        //     type = "agreement";
        //   } else if (this.label === "关于我们") {
        //     type = "about";
        //   }
        // }

        const res = await getSystemContent(type);
        console.log("获取系统内容成功", res);

        if (res.code === 200 || res.code === 201) {
          // 接口返回的是数组，取第一个元素
          const data = res.data?.[0] || res.data;

          if (data) {
            // 根据 type 获取对应的字段
            if (type === "privacy") {
              this.content = data.privacy_policy || "";
            } else if (type === "agreement") {
              this.content = data.user_agreement || "";
            } else if (type === "about") {
              this.content = data.about_us || "";
            } else {
              this.content = "";
            }
          } else {
            this.content = "";
          }

          if (!this.content) {
            uni.showToast({
              title: "暂无内容",
              icon: "none",
            });
          }
        } else {
          uni.showToast({
            title: res.msg || res.message || "获取内容失败",
            icon: "none",
          });
        }
      } catch (error) {
        console.error("获取系统内容失败:", error);
        uni.showToast({
          title: error.msg || error.message || "获取内容失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
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
.richtext-page {
  min-height: 100vh;
  background: #12111f;
  padding: 48rpx 30rpx 60rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.richtext-container {
  flex: 1;
  background: #1f1b2e;
  border-radius: 32rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  overflow: hidden;
}

.richtext-content {
  width: 100%;
  font-size: 28rpx;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  word-wrap: break-word;
  flex: 1;
  overflow-y: auto;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.55);
}
</style>
