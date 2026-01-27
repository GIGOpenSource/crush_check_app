import { postRequest, getRequest } from "@/utils/http.js";

//获取题库
export const getList = (currentPages,pageSize,test_type) => {
	return getRequest(`/mbtiquestion/`,{currentPages,pageSize,test_type})
}