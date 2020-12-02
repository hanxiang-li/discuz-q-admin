import { getLocal } from '@/util/store'

export default () => {
  return {
    align:'center',
    width: 100,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    height: getLocal('height') - 30 ,
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
        label: '头像',
        prop: 'avatarUrl',
        slot: true,
        formslot:true,
      },
      {
        label: '手机号码',
        prop: 'originalMobile',
        overHidden: true,
      },
      {
        label: '主题数',
        prop: 'threadCount',
        editDisplay: false,
      },
      {
        label: '用户组',
        prop: 'groups',
        overHidden: true,
        formslot:true,
        slot: true,
      },
      {
        label: '是否付费',
        prop: 'expiredAt',
        labelslot: true,
        slot: true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
      },
      {
        label: '注册渠道',
        prop: 'registerReason',
      },
      {
        label: '状态',
        prop: 'status',
        type: 'select',
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
        ],
      },
      {
        label: '禁用原因',
        prop: 'banReason',
        formslot:true,
        labelslot: true,
        hide: true,
        span: 24,
      },
      {
        label: '登录时间',
        prop: 'loginAt',
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss',
        editDisplay: false,
      },
    ]
  }
}
