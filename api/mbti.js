import { postRequest, getRequest,deleteRequest } from "@/utils/http.js";

//获取题库
export const getList = (currentPage,pageSize,test_type,question_mode,poster_id,inviter,unique_key) => {
	let params = {
      currentPage,pageSize,test_type,question_mode,poster_id,inviter,unique_key
	}
	if(!poster_id) delete params.poster_id
	if(!inviter) delete params.inviter //邀请码
	if(!unique_key) delete params.unique_key //记录号
	return getRequest(`/mbtiquestion/get_questions/`,params)
}

//答题结果
export const createPoster = (currentPage,pageSize,poster_id,answers,timestamp) => {
	return postRequest('/mbtiquestion/record_question/',{currentPage,pageSize,poster_id,answers,timestamp})
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
export const code = (poster_id) => {
	return deleteRequest(`/mbtiquestion/reinvite_report/`,{poster_id})
}



