import request from "@/router/axios";

// 获取分类
export const queryCategories = () => request({
	url: '/api/categories',
	method: 'get',
})


