import { getLocal } from '@/util/store'

export default () => {
	return {
		editBtn: false,
		delBtn: false,
		addBtn: false,
		align: 'center',
		searchMenuSpan: 4,
		height: getLocal('height') - 130,
		column: [
			{
				label: '流水号',
				prop: 'cash_sn',
				search: true,
			},
			{
				label: '操作用户',
				prop: 'user',
				search: true,
				searchSpan: 4,
				formatter: 	function(row,value){
					return value ? value.username : ''
				},
			},
			{
				label: '提现方式',
				prop: 'cash_type',
				type: 'select',
				dicData: [
					{
						label: '人工打款',
						value: 0
					},
					{
						label: '微信零钱',
						value: 1
					},
				]
			},
			{
				label: '提现金额(元)',
				prop: 'cash_apply_amount',
			},
			{
				label: '收款账号',
				prop: 'cash_apply_amount',
				overHidden: true,
				formatter: 	function(row, value){
					if (row.cash_type === 1) {
						if (row.wechat) {
							return row.wechat.mp_openid || num.wechat.min_openid;
						} else {
							return '';
						}
					} else {
						return row.cash_mobile;
					}
				},
			},
			{
				label: '申请时间',
				prop: 'created_at',
				type: 'time',
				search:true,
				searchRange:true,
				format: 'yyyy-MM-dd HH:mm:ss',
				valueFormat: 'yyyy-MM-dd HH:mm:ss',
			},
			{
				label: '状态',
				prop: 'cash_status',
				type: 'select',
				slot: true,
				search:true,
				searchValue: 1,
				searchSpan: 4,
				overHidden: true,
				dicData: [
					{
						label: '待审核',
						value: 1
					},
					{
						label: '审核通过',
						value: 2
					},
					{
						label: '审核不通过',
						value: 3
					},
					{
						label: '待打款',
						value: 4
					},
					{
						label: '已打款',
						value: 5
					},
					{
						label: '打款失败',
						value: 6
					},
				]
			},
		]
	}
}
