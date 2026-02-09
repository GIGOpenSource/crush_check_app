import { postRequest, getRequest,deleteRequest } from "@/utils/http.js";

//获取题库
export const getList = (currentPage,pageSize,test_type,question_mode,poster_id,inviter,unique_key) => {
	let params = {
      currentPage,pageSize,test_type,question_mode,poster_id,inviter,unique_key
	}
	if(!poster_id) delete params.poster_id
	if(!inviter) delete params.inviter //邀请码
	if(!unique_key) delete params.unique_key //记录号
	return postRequest(`/mbtiquestion/get_questions/`,params)
}

//答题结果
export const createPoster = (currentPage,pageSize,poster_id,answers,timestamp,total_pages) => {
	return postRequest('/mbtiquestion/record_question/',{currentPage,pageSize,poster_id,answers,timestamp,total_pages})
}

//答题完毕
export const finsh = (poster_id) => {
	return getRequest(`/mbtiquestion/generate_report/`,{poster_id})
}

//中途退出
export const layout = (poster_id) => {
	return deleteRequest(`/mbtiquestion/quit_test/`,{poster_id})
}

//重新生成邀请码
export const getcode = (poster_id) => {
	console.log(poster_id,'poster_id')
	return postRequest(`/mbtiquestion/reinvite_report/`,{poster_id})
}

//简介
export const getTemplate = (mbti_type) => {
	return getRequest(`/mbtitemplate/`,{mbti_type})
}

//房间管理
export const getRoom = (enforce,test_type) => {
	return getRequest(`/get_mbti_house_id`,{enforce,test_type})
}



