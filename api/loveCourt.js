import { postRequest, getRequest,deleteRequest } from "@/utils/http.js";    


// 判断用户是否已加入案件
export const getUserJoinedStatus = (params) => {
	return getRequest(`/trialcase/check_joined/`, params)
}
//保存恋爱小法庭记录
export const saveLoveCourtRecord = (params) => {
	return postRequest('/trialcase/save_trialcase/',params)
} 

//获取用户最近的草稿记录
export const getRecords = () => {
	return getRequest(`/trialcase/get_latest_draft/`, {})
}

//删除记录
export const deleteRecords = (poster_id) => {
	return deleteRequest(`/trialcase/delete_trialcase/`,{poster_id})
}

//深度
export const loveCourtJudgment = (params) => {
	return postRequest('/trialcase/generate_trialcase/',params)
}

