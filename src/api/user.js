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
