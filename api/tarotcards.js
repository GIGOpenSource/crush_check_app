import { postRequest, getRequest } from "@/utils/http.js";

//获取20张牌
export const getTarotcard = () => {
	return getRequest('/tarotcard/random_20/', {})
}

//创建
export const createResult = (params) => {
	return getRequest('/tarotcard/generate_tarotcard/', params)
}
