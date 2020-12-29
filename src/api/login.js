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

// 获取微信登录二维码
export const getWxImagesCode = () => request({
	url: `/api/oauth/wechat/pc/qrcode`,
	method: 'get'
})

// 获取用户扫描状态
export const getWxImagesCodeSearch = (data) => request({
	url: `/api/oauth/wechat/pc/login/${data}`,
	method: 'get'
})

// 获取短信登陆验证码
export const getPhoneCode = (data) => request({
	url: `/api/sms/send`,
	method: 'post',
	data
})

// 短信登陆
export const loginByPhoneCode = (data) => request({
	url: `/api/sms/verify`,
	method: 'post',
	data
})


