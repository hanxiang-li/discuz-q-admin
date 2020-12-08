import { getLocal } from '@/util/store'

export default () => {
	const dic = [
		{
			label: '不处理',
			value: '{IGNORE}'
		},
		{
			label: '审核',
			value: '{MOD}'
		},
		{
			label: '禁用',
			value: '{BANNED}'
		},
		{
			label: '替换',
			value: '{REPLACE}'
		},
	]
	return {
		tip: false,
		align: 'center',
		addBtn:false,
		editBtn:false,
		addRowBtn:true,
		delRowBtn:true,
		cellBtn:true,
		selection: true,
		height: getLocal('height') - 30,
		column:[
			{
				label: '过滤词',
				prop: 'find',
				cell: true,
			},
			{
				label: '主题和回复处理方式',
				prop: 'ugc',
				dicData: dic,
				type: 'select',
				cell: true,
				value: '{IGNORE}'
			},
			{
				label: '用户名处理方式',
				prop: 'username',
				dicData: dic,
				type: 'select',
				cell: true,
				value: '{IGNORE}'
			},
			{
				label: '签名处理方式',
				prop: 'signature',
				dicData: dic,
				type: 'select',
				cell: true,
				value: '{IGNORE}'
			},
			{
				label: '短消息处理方式',
				prop: 'dialog',
				dicData: dic,
				type: 'select',
				cell: true,
				value: '{IGNORE}'
			},
			{
				label: '过滤词替换',
				prop: 'replacement',
				cell: true,
				value: '**'
			},
			{
				label: '修改时间',
				prop: 'updated_at',
				type: 'datetime',
				format: 'yyyy-MM-dd HH:mm:ss',
				cell: false,
			},
		]
	}
}
