import { getLocal } from '@/util/store'

export default () => {
	return {
		menu: false,
		addBtn: false,
		searchMenuSpan: 4,
		height: getLocal('height') - 120,
		column:[
			{
				label: '用户名',
				prop: 'user',
				search:true,
				formatter: 	function(row,value){
					return value.username
				}
			},
			{
				label:'变动时间',
				prop:'created_at',
				type: 'daterange',
				search:true,
				searchRange:true,
				format: 'yyyy-MM-dd HH:mm:ss',
				valueFormat: 'yyyy-MM-dd HH:mm:ss',
			},
			{
				label: '可用金额',
				prop: 'change_available_amount',
			},
			{
				label: '冻结金额',
				prop: 'change_freeze_amount',
			},
			{
				label: '变动描述',
				prop: 'change_desc',
				search:true,
			},
		]
	}
}
