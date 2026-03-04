import { postRequest, getRequest } from "@/utils/http.js";

//创建星座
export const create = (params) => {
	return postRequest('/star_info/',params)
}

//星座信息
export const getinfo = () => {
	return getRequest('/star_info/',{})
}

//每日心情
export const startDaily = () => {
	return getRequest('/get_daily_star/',{})
}

//双人匹配
export const doubleMatch = (params) => {
	return postRequest('/query_star_sgin_match/',params)
}

