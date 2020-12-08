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

// 查询帖子回复
export const queryListPosts = (data) => request({
	url: '/api/posts',
	method: 'get',
	data
})

// 查询帖子回复
export const updatePosts = (data) => request({
	url: `/api/posts/${data.id}`,
	method: 'patch',
	data
})
export const updateListPosts = (data) => request({
	url: `/api/posts/batch${data.id ? '/'+data.id : ''}`,
	method:  data.type ? 'delete':'PATCH',
	data
})

// 修改帖子
export const updateListThreads = (data) => request({
	url: `/api/threads/batch${data.id ? '/'+data.id : ''}`,
	method: data.type ? 'delete':'PATCH',
	data
})

// 删除帖子
export const deleteThreads = (data) => request({
	url: `/api/threads/${data.id}`,
	method: 'PATCH',
	data
})

// 话题列表
export const topicsList = (data) => request({
	url: `/api/topics`,
	method: 'get',
	data
})

export const updateTopics = (data) => request({
	url: `/api/topics/${data.id}`,
	method: data.type ? 'delete' : 'PATCH',
	data
})

// 举报列表
export const reportsList = (data) => request({
	url: `/api/reports`,
	method: 'get',
	data
})

export const updateReports = (data) => request({
	url: `/api/reports/batch${data.type ? '/' + data.id:''}`,
	method: data.type ? 'delete':'patch',
	data
})
