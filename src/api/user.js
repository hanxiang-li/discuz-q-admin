import request from '@/router/axios';

export const queryUserList = (data) => request({
	url: '/api/users',
	method: 'get',
	data
})
