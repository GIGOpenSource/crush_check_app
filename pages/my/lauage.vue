<template>
  <view class="language-page">
    <view class="language-list">
      <view
        v-for="(item, index) in languageList"
        :key="index"
        class="language-item"
        :class="{ active: currentLanguage === item.code }"
        @click="handleLanguageSelect(item)"
      >
        <text class="language-name">{{ item.name }}</text>
        <text class="language-name-en">{{ item.nameEn }}</text>
        <!-- <view v-if="currentLanguage === item.code" class="check-icon">
          <text class="check-mark">✓</text>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
import { setLocale, t } from '@/i18n/index.js'

export default {
  data() {
    return {
      currentLanguage: 'zh', // 默认选中中文
      languageList: [
        {
          code: 'es',
          name: '西班牙语',
          nameEn: 'Español'
        },
        {
          code: 'en',
          name: '英语',
          nameEn: 'English'
        },
        {
          code: 'pt',
          name: '葡萄牙语',
          nameEn: 'Português'
        },
        {
          code: 'ja',
          name: '日语',
          nameEn: '日本語'
        },
        {
          code: 'ko',
          name: '韩语',
          nameEn: '한국어'
        },
        {
          code: 'zh',
          name: '中文',
          nameEn: '中文'
        }
      ]
    };
  },
  onLoad() {
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: t('language.title') || '切换语言'
    });
    
    // 从本地存储读取当前语言设置
    const savedLanguage = uni.getStorageSync('currentLanguage');
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
      setLocale(savedLanguage);
    } else {
      this.currentLanguage = 'zh';
      setLocale('zh');
    }
  },
  methods: {
    handleLanguageSelect(item) {
      // 如果点击的是当前已选中的语言，不需要切换
      if (this.currentLanguage === item.code) {
        return;
      }
      
      // 先切换语言
      this.currentLanguage = item.code;
      setLocale(item.code);
      
      // 更新 tabBar 国际化
      // this.updateTabBarI18n();
      
      // 使用 setTimeout 确保 i18n 已完全更新，然后使用新语言更新导航栏标题和显示"切换成功"提示
      setTimeout(() => {
        // 更新导航栏标题
        uni.setNavigationBarTitle({
          title: t('language.title') || '切换语言'
        });
        
        // 使用新语言获取"切换成功"提示消息
        const message = t('language.switchSuccessSimple');
        
        uni.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        });
      }, 50);
    },
    // 更新 tabBar 国际化
    updateTabBarI18n() {
      try {
        const currentLocale = uni.getStorageSync('currentLanguage') || 'zh';
        let tabBarTexts = { index: '检测', my: '我的' };
        
        if (currentLocale === 'en') {
          tabBarTexts = { index: 'Check', my: 'My' };
        } else if (currentLocale === 'es') {
          tabBarTexts = { index: 'Verificar', my: 'Mi' };
        } else if (currentLocale === 'pt') {
          tabBarTexts = { index: 'Verificar', my: 'Meu' };
        } else if (currentLocale === 'ja') {
          tabBarTexts = { index: 'チェック', my: 'マイ' };
        } else if (currentLocale === 'ko') {
          tabBarTexts = { index: '확인', my: '내' };
        }
        
        uni.setTabBarItem({
          index: 0,
          text: tabBarTexts.index
        });
        uni.setTabBarItem({
          index: 1,
          text: tabBarTexts.my
        });
      } catch (error) {
        console.error('更新 tabBar 国际化失败:', error);
      }
    },
    getLanguageKey(code) {
      const keyMap = {
        'zh': 'chinese',
        'en': 'english',
        'es': 'spanish',
        'pt': 'portuguese',
        'ja': 'japanese',
        'ko': 'korean'
      };
      return keyMap[code] || 'chinese';
    }
  }
};
</script>

<style scoped lang="scss">
.language-page {
  min-height: 100vh;
  padding: 48rpx 30rpx 60rpx;
  box-sizing: border-box;
  background: #12111f;
}

.language-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.language-item {
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.02)
  );
  border-radius: 26rpx;
  padding: 32rpx 40rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16rpx 36rpx rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;

  &:active {
    opacity: 0.8;
  }

  &.active {
    background: linear-gradient(
      180deg,
      rgba(179, 112, 255, 0.15),
      rgba(179, 112, 255, 0.05)
    );
    border-color: rgba(179, 112, 255, 0.3);
  }
}

.language-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
}

.language-name-en {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 24rpx;
  flex: 1;
}

.check-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(90deg, #9159e1 0%, #6a3ce1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 24rpx;
  flex-shrink: 0;
  box-shadow: 0 8rpx 16rpx rgba(104, 66, 225, 0.35);
}

.check-mark {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 1;
}
</style>
