import request from "@/router/axios";

// 获取分类
export const queryCategories = () => request({
	url: '/api/categories',
	method: 'get',
})

// 修改分类
export const updateCategories = (data) => request({
	url: `/api/categories${data.id ? '/' + data.id: ''}`,
	method: `${data.id ? 'patch' : 'post'}`,
	data
})

// 删除分类
export const deleteCategories = (data) => request({
	url: `/api/categories/${data.id}`,
	method: `delete`,
	data
})

// 删除分类 - 批量
export const deleteListCategories = (data) => request({
	url: `/api/categories/batch/${data}`,
	method: `delete`
})

// 查询帖子列表
export const queryListThreads = (data) => request({
	url: '/api/threads',
	method: 'get',
	data
})



