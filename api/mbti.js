import { postRequest, getRequest } from "@/utils/http.js";

//获取题库
export const getList = (currentPage,pageSize,test_type,question_mode,poster_id) => {
	let params = {
      currentPage,pageSize,test_type,question_mode,poster_id
	}
	if(!poster_id) delete params.poster_id
	return getRequest(`/mbtiquestion/get_questions/`,params)
}

//答题结果
export const createPoster = (currentPage,pageSize,poster_id,answers,timestamp) => {
	return postRequest('/mbtiquestion/record_question/',{currentPage,pageSize,poster_id,answers,timestamp})
}
