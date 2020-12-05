import {getLocal} from "@/util/store";

export default () => {
	return {
		tip: false,
		page: false,
		addBtn:false,
		editBtn:false,
		addRowBtn:true,
		delRowBtn:true,
		cellBtn:true,
		selection: true,
		height: getLocal('height') - 30,
		column:[
			{
				label: '分类名称',
				prop: 'name',
				cell: true,
			},
			{
				label: '图标',
				prop: 'icon',
				type: 'icon',
				iconList: [],
				cell: false,
			},
			{
				label: '排序',
				prop: 'sort',
				cell: true,
			},
			{
				label: '分类介绍',
				prop: 'description',
				cell: true,
			},
			{
				label: '创建时间',
				prop: 'created_at',
				type: 'datetime',
				format: 'yyyy-MM-dd HH:mm:ss',
			},
		]
	}
}
