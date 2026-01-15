import { postRequest, getRequest } from "@/utils/http.js";

//获取20张牌
export const uploadImages = (params) => {
	return postRequest('/tarotcard/random_20/', params)
}
