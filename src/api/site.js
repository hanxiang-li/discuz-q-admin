import request from '@/router/axios';

// 获取服务器信息
export const querySiteinfo = () => request({
	url: '/api/siteinfo',
	method: 'get',
})

// 获取站点配置
export const queryForum = (data) => request({
	url: '/api/forum' + (data !== undefined ? data : ''),
	method: 'get',
})

// 上传logo文件
export const setSettingsLogo = (data) => request({
	url: '/api/settings/logo',
	method: 'post',
	headers: { 'Content-Type': 'multipart/form-data' },
	data
})

// 删除logo
export const deleteLogo = (data) => request({
	url: '/api/settings/logo',
	method: 'delete',
	data
})

// 修改站点设置
export const updateSiteSet = (data) => request({
	url: '/api/settings',
	method: 'post',
	data
})

// 清理缓存
export const cache = () => request({
	url: '/api/cache',
	method: 'DELETE',
})

// 查询过滤列表
export const queryContentFilterList = (data) => request({
	url: '/api/stop-words',
	method: 'get',
	data
})

// 修改单条过滤记录
export const updateContentFilter = (data) => request({
	url: '/api/stop-words' + (data.isAdd ? '' : '/' + data.data.id),
	method: data.isAdd ? 'post' : 'patch',
	data
})

// 删除过滤记录
export const deleteContentFilter = (data) => request({
	url: '/api/stop-words/' + data,
	method: 'delete'
})

// 获取通知内容
export const queryNotice = (data) => request({
	url: '/api/notification/tpl',
	method: 'get',
	data
})

// 修改通知内容
export const updateNotice = (data) => request({
	url: '/api/notification/tpl/' + data.id,
	method: 'PATCH',
	data
})

