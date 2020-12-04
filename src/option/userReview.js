import {getLocal} from "@/util/store";

export default () => {
	return {
		tip: false,
		align: 'center',
		width: 100,
		addBtn: false,
		editBtn: false,
		delBtn: false,
		selection: true,
		reserveSelection:true,
		height: getLocal('height') - 80,
		column:[
			{
				label: '编号',
				prop: 'id',
				editDisplay: false,
			},
			{
				label: '用户名',
				prop: 'username',
				overHidden: true,
			},
			{
				label: '注册原因',
				prop: 'registerReason',
				overHidden: true,
			},
			{
				label: '注册时间',
				prop: 'createdAt',
				overHidden: true,
				type: 'datetime',
				format: 'yyyy-MM-dd HH:mm:ss',
			},
		]
	}
}
