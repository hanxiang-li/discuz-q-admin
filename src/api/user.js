import request from '@/router/axios';

export const queryUserList = (data) => request({
	url: '/api/users',
	method: 'get',
	data
})

export const deleteAvatar = (id) => request({
	url: `/api/users/${id}/avatar`,
	method: 'delete',
})

export const updateUser = (data) => request({
	url: `/api/users/${data.id}`,
	method: 'PATCH',
	data
})

export const updateUserList = (data) => request({
	url: `/api/users`,
	method: 'PATCH',
	data
})

// 获取用户钱包
export const queryUserWallet = (id) => request({
	url: `/api/wallet/user/${id}`,
	method: 'get',
})

// 获取用户钱包
export const updateUserWallet = (data) => request({
	url: `/api/wallet/user/${data.user_id}`,
	method: 'PATCH',
	data
})

// 查询审核用户
export const queryUserReviewList = (data) => request({
	url: '/api/users',
	method: 'get',
	data
})

