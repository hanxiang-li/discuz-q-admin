import { getLocal } from '@/util/store'

export default () => {
	return {
		tip: false,
		rowKey:'id',
		expand: true,
		menu: false,
		addBtn: false,
		align: 'center',
		selection: true,
		searchShow: false,
		searchMenuSpan: 4,
		reserveSelection:true,
		height: getLocal('height') - 100,
		column:[
			{
				label: '帖子分类',
				prop: 'category',
				overHidden: true,
				formatter: 	function(row,value){
					return value.name
				}
			},
			{
				label: '主题名称',
				prop: 'title',
				overHidden: true,
			},
			{
				label: '作者',
				prop: 'user',
				formatter: 	function(row,value){
					return value.username
				}
			},
			{
				label: '作者',
				prop: 'username',
				search:true,
				searchSpan: 4,
				hide: true,
			},
			{
				label: '包含',
				prop: 'q',
				search:true,
				searchSpan: 20,
				hide: true,
			},
			{
				label: '搜索分类',
				prop: 'categoryId',
				type: 'select',
				search:true,
				searchSpan: 4,
				hide: true,
				props: {
					label: 'name',
					value: 'id',
				}
			},
			{
				label: '主题类型',
				prop: 'topicTypeId',
				type: 'select',
				search:true,
				searchSpan: 4,
				hide: true,
				dicData: [
					{
						name: '全部',
						id: 0
					},
					{
						name: '置顶主题',
						id: 1
					}, {
						name: '精华主题',
						id: 2
					}, {
						name: '置顶并精华主题',
						id: 3
					},
					{
						name: '付费首页主题',
						id: 4
					}
				],
				props: {
					label: 'name',
					value: 'id',
				}
			},
			{
				label: '浏览/回复',
				prop: 'count',
				type: 'select',
				search:true,
				searchSpan: 6,
				hide: true,
				searchslot:true,
			},
			{
				label: '回复',
				prop: 'postCount',
				formatter: 	function(row,value){
					return value - 1
				}
			},
			{
				label: '查看',
				prop: 'viewCount',
			},
			{
				label: '发表时间',
				prop: 'createdAt',
				type: 'datetime',
				search:true,
				searchSpan: 6,
				searchRange:true,
				format: 'yyyy-MM-dd HH:mm:ss',
			},
			{
				label: '修改时间',
				prop: 'updatedAt',
				type: 'datetime',
				format: 'yyyy-MM-dd HH:mm:ss',
			},
		]
	}
}
