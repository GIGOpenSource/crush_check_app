import { postRequest, getRequest } from "@/utils/http.js";

//获取20张牌
export const getTarotcard = () => {
	return getRequest('/tarotcard/random_20/', {})
}

//创建
export const createResult = (params) => {
	return getRequest('/tarotcard/generate_tarotcard/', params)
}

//列表
export const tarotcardList = (params) => {
	return getRequest('/poster/', params)
}

//详情
export const tarotcardDetails = (id) => {
	return getRequest(`/poster/${id}/`)
}

//生成答案
export const tarotcardnswer = (params) => {
	return getRequest(`/tarotcard/generate_tarotcard_deep/`,params)
}

//二维码
export const getQroter = () => {
	return getRequest(`/wechat/wx_get_QRcode`,{})
}
