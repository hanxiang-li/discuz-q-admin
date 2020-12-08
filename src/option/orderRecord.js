import { getLocal } from '@/util/store'

export default () => {
	return {
		menu: false,
		addBtn: false,
		align:'center',
		searchMenuSpan: 4,
		height: getLocal('height') - 170,
		column: [
			{
				label: '订单号',
				prop: 'order_sn',
				search: true,
			},
			{
				label: '发起方',
				prop: 'user',
				search: true,
				formatter: 	function(row,value){
					return value ? value.username : ''
				}
			},
			{
				label: '收入方',
				prop: 'payee',
				search: true,
				formatter: 	function(row,value){
					return value ? value.username : ''
				}
			},
			{
				label: '商品名称',
				prop: 'thread',
				width: 200,
				slot: true,
				search: true,
				overHidden: true,
				formatter: 	function(row,value){
					return value ? value.firstPost.content : ''
				}
			},
			{
				label: '类型',
				prop: 'type',
				type: 'select',
				dicData: [
					{
						label: '注册',
						value: 1
					},
					{
						label: '打赏',
						value: 2
					},
					{
						label: '付费主题',
						value: 3
					},
					{
						label: '付费用户组',
						value: 4
					},
					{
						label: '问答提问支付',
						value: 5
					},
					{
						label: '问答围观付费',
						value: 6
					},
					{
						label: '付费附件',
						value: 7
					},
				]
			},
			{
				label: '金额',
				prop: 'amount',
			},
			{
				label: '订单时间',
				prop: 'created_at',
				type: 'time',
				search:true,
				searchRange:true,
				format: 'yyyy-MM-dd HH:mm:ss',
				valueFormat: 'yyyy-MM-dd HH:mm:ss',
			},
			{
				label: '订单状态',
				prop: 'status',
				type: 'select',
				search: true,
				slot:true,
				dicData: [
					{
						label: '待付款',
						value: 0
					},
					{
						label: '已付款',
						value: 1
					},
				]
			},
		]
	}
}
