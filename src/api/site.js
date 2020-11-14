import request from '@/router/axios';

// 获取服务器信息
export const querySiteinfo = () => request({
	url: '/api/siteinfo',
	method: 'get',
})

// 获取站点配置
export const queryForum = () => request({
	url: '/api/forum',
	method: 'get',
})

// 上传logo文件
export const setSettingsLogo = (data) => request({
	url: '/api/settings/logo',
	method: 'post',
	headers: { 'Content-Type': 'multipart/form-data' },
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

