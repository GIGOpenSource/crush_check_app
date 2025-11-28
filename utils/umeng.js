import uma from "@/uma.js";

/**
 * 友盟统计事件（全局函数，不依赖this）
 * @param {string} eventName - 事件名称
 * @param {object} options - 可选参数
 * @param {string} options.userId - 用户ID（可选，如果不传会从存储中获取）
 * @param {string} options.pageName - 页面名称（默认："我的"）
 */
export function trackUmengEvent(eventName, options = {}) {
  console.log("trackUmengEvent", eventName);

  if (!uma || !uma.trackEvent) {
    console.warn("友盟统计未初始化");
    return;
  }

  try {
    // 获取用户ID
    let userId = options.userId || "";

    // 如果没有传入 userId，尝试从存储中获取
    if (!userId) {
      try {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo) {
          const user = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
          userId = user.id || "";
        }
      } catch (e) {
        console.warn("获取用户信息失败", e);
      }
    }

    // 获取应用版本
    let appVersion = "1.0.0";
    // #ifdef MP-WEIXIN
    const accountInfo = uni.getAccountInfoSync();
    appVersion = accountInfo?.miniProgram?.version || "1.0.0";
    // #endif

    // 获取事件时间（格式：yyyy-MM-dd HH:mm:ss）
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const eventTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // 页面名称
    const pageName = options.pageName || "我的";

    // 调用友盟统计事件
    uma.trackEvent(eventName, {
      userId: userId,
      appVersion: appVersion,
      eventTime: eventTime,
      pageName: pageName,
    });

    console.log("友盟统计事件已发送:", eventName, {
      userId: userId,
      appVersion: appVersion,
      eventTime: eventTime,
      pageName: pageName,
    });
  } catch (error) {
    console.error("友盟统计事件发送失败:", error);
  }
}