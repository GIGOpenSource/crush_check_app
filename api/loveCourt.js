import { postRequest, getRequest,deleteRequest } from "@/utils/http.js";    


// 判断用户是否已加入案件
export const getUserJoinedStatus = (params) => {
	return getRequest(`/trialcase/check_joined/`, params)
}


//生成恋爱小法庭吧判决结果
export const loveCourtJudgment = (params) => {
	return postRequest('/trialcase/generate_trialcase/',params)
}

//保存恋爱小法庭记录
export const saveLoveCourtRecord = (params) => {
	return postRequest('/trialcase/save_trialcase/',params)
} 