import { getLocal } from '@/util/store'

export default () => {
  return {
    align:'center',
    width: 100,
    searchShow: false,
    addBtn: false,
    height: getLocal('height') - 30 ,
    searchMenuSpan: 6,
    searchIndex: 4,
    column:[
      {
        label: '编号',
        prop: 'id',
        search: true,
        searchSpan: 4,
      },
      {
        label: '头像',
        prop: 'avatarUrl',
        slot: true,
      },
      {
        label: '用户名',
        prop: 'username',
        overHidden: true,
        search:true,
        searchSpan: 4,
      },
      {
        label: '手机号码',
        prop: 'originalMobile',
        overHidden: true,
        search:true,
        searchSpan: 4,
      },
      {
        label: '主题数',
        prop: 'threadCount',
      },
      {
        label: '用户组',
        prop: 'groups',
        overHidden: true,
        formatter: function(row){
          let name = ''
          row.groups.forEach(i => {
            name += i.name + '、'
          })
          return name.slice(0,name.length-1)
        },
      },
      {
        label: '是否付费',
        prop: 'isPaid',
        slot: true,
      },
      {
        label: '状态',
        prop: 'status',
        type: 'select',
        search:true,
        searchSpan: 4,
        dicData: [
          {
            label: '正常',
            value: 0,
          },
          {
            label: '禁用',
            value: 1,
          },
          {
            label: '审核',
            value: 2,
          },
          {
            label: '审核拒绝',
            value: 3,
          },
        ]
      },
      {
        label: '上次登录日期',
        prop: 'loginAt',
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss'
      },
    ]
  }
}
