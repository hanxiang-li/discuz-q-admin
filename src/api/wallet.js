import request from "@/router/axios";

export const queryfundDetails = (data) => request({
	url: '/api/wallet/log',
	method: 'get',
	data
})

export const queryOrderRecord = (data) => request({
	url: '/api/orders',
	method: 'get',
	data
})

export const queryWalletCash = (data) => request({
	url: '/api/wallet/cash',
	method: 'get',
	data
})

export const updateWalletCashReview = (data) => request({
	url: 'api/wallet/cash/review',
	method: 'POST',
	data
})

export const queryFinanceList = () => request({
	url: '/api/statistic/finance',
	method: 'get',
})
