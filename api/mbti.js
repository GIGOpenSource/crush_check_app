import { postRequest, getRequest } from "@/utils/http.js";

//获取题库
export const getList = (currentPage,pageSize,test_type,question_mode,poster_id,inviter) => {
	let params = {
      currentPage,pageSize,test_type,question_mode,poster_id,inviter
	}
	if(!poster_id) delete params.poster_id
	if(!inviter) delete params.inviter //邀请码
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

