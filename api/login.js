import { postRequest, getRequest, deleteRequest, uploadFile_wpy } from "@/utils/http.js";

/**
 * 微信登录
 * @param {string} code - 微信登录凭证
 * @returns {Promise}
 */
export function wechatLogin(code, inviter_openid) {
  const params = { code };
  if (inviter_openid) {
    params.inviter_openid = inviter_openid;
  }
  return postRequest(
    "/wechat/login",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "登录中...",
    }
  );
}
export function apkLogin(params) {
  if (params.inviter_openid) {
    params.inviter_openid = inviter_openid;
  }
  return postRequest(
    "/wechat/apklogin",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "登录中...",
    }
  );
}


/**
 * 获取用户信息
 * @param {string} openId - 用户openId
 * @returns {Promise}
 */
export function getUserInfo(openId) {
  return getRequest(
    "/wechat/getUserInfo",
    { openId },
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false,
    }
  );
}

/**
 * 获取用户手机号
 * @param {string} code - 手机号授权code
 * @param {string} openId - 用户openId
 * @returns {Promise}
 */
export function getUserPhone(code, openId) {
  return postRequest(
    "/wechat/getUserPhone",
    { code, openId },
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false,
    }
  );
}

/**
 * 上传文件（头像）
 * @param {string} filePath - 要上传的文件路径
 * @returns {Promise}
 */
export function uploadAvatar(filePath) {
  return uploadFile_wpy(
    "/upload/",
    filePath,
    "file",
    {
      type: "img"
    },
    {
      showLoading: true,
      loadingText: "上传头像中...",
      errorOutput: true
    }
  );
}

/**
 * 更新用户信息
 * @param {string} openId - 用户openId
 * @param {string} user_avatar - 用户头像
 * @param {string} username - 用户昵称
 * @param {number} user_gender - 用户性别
 * @returns {Promise}
 */
export function updateUserInfo(openId, user_avatar = "", username = "", user_gender = undefined) {
  const params = {
    openId,
  };
  
  if (user_avatar) {
    params.user_avatar = user_avatar;
  }
  
  if (username) {
    params.username = username;
  }
  
  if (user_gender !== undefined && user_gender !== null) {
    params.user_gender = user_gender;
  }
  
  return postRequest(
    "/wechat/updataUserInfo",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false,
    }
  );
}

/**
 * 获取历史海报列表
 * @param {number} currentPage - 当前页码，默认为1
 * @param {number} pageSize - 每页数量，默认为10
 * @param {string} poster_type - 海报类型：chat, social, physical, consume，空字符串表示全部
 * @param {number} user - 用户ID
 * @returns {Promise}
 */
export function getPosterList(currentPage = 1, pageSize = 10, poster_type, user = "") {
  const params = {
    currentPage,
    pageSize
  };
  
  // 如果指定了海报类型且不是"all"和空字符串，添加到参数中
  if (poster_type && poster_type !== "all" && poster_type !== "") {
    params.poster_type = poster_type;
  }
  
  // 如果指定了用户ID，添加到参数中
  if (user) {
    params.user = user;
  }
  
  return getRequest(
    "/poster/",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false,
    }
  );
}

/**
 * 批量删除海报
 * @param {string} ids - 海报ID列表，逗号分隔的字符串
 * @returns {Promise}
 */
export function deletePosters(params) {
  return deleteRequest(
    `/poster/bulk-delete/`,
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "删除中...",
    }
  );
}

/**
 * 获取充值记录列表
 * @param {number} currentPage - 当前页码，默认为1
 * @param {number} pageSize - 每页数量，默认为20
 * @returns {Promise}
 */
export function getRechargeList(currentPage = 1, pageSize = 20) {
  return getRequest(
    "/wxpayOrder/",
    {
      currentPage,
      pageSize,
      trade_state:'SUCCESS'
    },
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false,
    }
  );
}

/**
 * 获取系统内容（富文本）
 * @param {string} type - 内容类型（如：privacy, agreement, about）
 * @returns {Promise}
 */
export function getSystemContent(type = "") {
  const params = {
      platform:'ios'
  };
  if (type) {
    params.type = type;
  }
  return getRequest(
    "/wx_system/",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "加载中...",
    }
  );
}

/**
 * 获取产品列表
 * @returns {Promise}
 */
export function getProductsList() {
  return getRequest(
    "/products/",
    {},
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "加载中...",
    }
  );
}

/**
 * 获取预支付ID
 * @param {string} description - 商品描述
 * @param {number|string} productId - 产品ID
 * @param {string} openId - 用户openId
 * @returns {Promise}
 */
export function getPrepayId(description, productId, openId) {
  return postRequest(
    "/wechat/getPrepayId",
    {
      description,
      productId,
      openId,
    },
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "处理中...",
    }
  );
}

/**
 * 获取预支付ID
 * @param {string} description - 商品描述
 * @param {number|string} productId - 产品ID
 * @param {string} openId - 用户openId
 * @returns {Promise}
 */
export function mockPrepayId(description, productId, openId) {
  return postRequest(
    "/mock/getPrepayId",
    {
      description,
      productId,
      openId,
    },
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "处理中...",
    }
  );
}


/**
 * 获取邀请记录列表
 * @param {number} currentPage - 当前页码
 * @param {number} pageSize - 每页数量
 * @param {string} openId - 用户openId
 * @returns {Promise}
 */
export function getInviteList(currentPage = 1, pageSize = 10, openId = "") {
  const params = {
    currentPage,
    pageSize,
  };
  
  if (openId) {
    params.openId = openId;
  }
  
  return getRequest(
    "/wechat/inviteList",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false,
    }
  );
}

/**
 * 获取邀请记录（新用户）
 * @param {string} openId - 用户openId
 * @returns {Promise}
 */
export function getAcquireNewUsers(openId) {
  return postRequest(
    "/wechat/getAcquireNewUsers",
    { openId },
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: false, // 改为 false，避免 hideLoading 错误，由页面手动管理 loading
      loadingText: "加载中...",
    }
  );
}

/**
 * 重新生成海报
 * @param {number|string} posterId - 海报ID
 * @param {boolean} showLoading - 是否显示loading，默认为true
 * @returns {Promise}
 */
export function reGeneratePoster(posterId, showLoading = true) {
  return postRequest(
    `/poster/re-generate-poster/?posterId=${posterId}`,
    {},
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: showLoading,
      loadingText: "重新生成中...",
    }
  );
}

export function iosLogin(params, inviter_openid) {
  if (inviter_openid) {
    params.inviter_apple_id = inviter_openid;
  }
  return postRequest(
    "/ios/login",
    params,
    {
      header: {
        "Content-Type": "application/json",
        "is-dev": "true",
      },
      showLoading: true,
      loadingText: "登录中...",
    }
  );
}