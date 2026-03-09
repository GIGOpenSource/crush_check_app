<template>
  <!-- 玻璃态 TabBar 容器 -->
  <view class="glass-tabbar-container">
    <up-tabbar 
      v-model="current" 
      :list="tabList" 
      :border="false"  
      :fixed="true"    
      :safeAreaInsetBottom="true" 
      class="glass-tabbar"
    >
    </up-tabbar>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// TabBar 数据（保持你原有配置）
const current = ref(0);
const tabList = ref([
  {
    icon: 'home',
    activeIcon: 'home-fill',
    label: '首页'
  },
  {
    icon: 'cart',
    activeIcon: 'cart-fill',
    label: '购物车'
  },
  {
    icon: 'mine',
    activeIcon: 'mine-fill',
    label: '我的'
  }
]);
</script>

<style scoped lang="scss">
/* 玻璃态 TabBar 外层容器 */
.glass-tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  
  /* 核心玻璃态样式 */
  .glass-tabbar {
    /* 半透明背景（玻璃态底色） */
    background-color: rgba(255, 255, 255, 0.7) !important;
    /* 毛玻璃模糊效果（核心） */
    backdrop-filter: blur(20px) !important;
    /* 兼容老版本 Safari */
    -webkit-backdrop-filter: blur(20px) !important;
    /* 去掉原有阴影和边框 */
    box-shadow: none !important;
    border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
    
    /* 适配 iOS 安全区域 */
    padding-bottom: constant(safe-area-inset-bottom) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
    
    /* 子元素样式重置 */
    ::v-deep .up-tabbar__content {
      background: transparent !important;
    }
    
    ::v-deep .up-tabbar__item {
      /* 选中态文字颜色（可自定义） */
      color: #007AFF !important;
      
      &.active {
        color: #007AFF !important;
      }
    }
    
    /* 图标样式（可自定义） */
    ::v-deep .up-icon {
      font-size: 20px !important;
    }
  }
  
  /* 非iOS设备降级样式（可选） */
  @supports not (-webkit-backdrop-filter: blur(20px)) {
    .glass-tabbar {
      background-color: #FFFFFF !important;
    }
  }
}
</style>