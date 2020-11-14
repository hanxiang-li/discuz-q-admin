import request from '@/router/axios';
export const loginByUsername = (data) => request({
	url: '/api/login',
	method: 'post',
	meta: {
		isToken: false
	},
	data: data
})

export const getUserInfo = (data) => request({
	url: `/api/users/${data}?include=groups`,
	method: 'get'
})
