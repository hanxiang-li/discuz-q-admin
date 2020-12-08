<template>
  <basic-container>
    <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent" ref="orderRecordCrud">
      <template slot="thread" slot-scope="scope">
        <span v-if="scope.row.thread && (scope.row.type === 2 || scope.row.type === 3 || scope.row._data.type === 5 ||
          scope.row.type === 6 || scope.row.type === 7)" @click="openUrl(scope.row.thread ? scope.row.thread.id : '')">
                {{ scope.row.thread.firstPost.content }}
        </span>
        <span v-else-if="scope.row.type === 1" @click="viewClick('')">
          注册付费
        </span>
        <span v-else-if="scope.row.type === 4" @click="viewClick('')">
          {{ scope.row.group ? scope.row.group.name : '' }}用户组
        </span>
      </template>
      <template slot="status" slot-scope="{row}">
        <el-tag v-if="row.status === 0" type="danger">待付款</el-tag>
        <el-tag v-else type="success">已付款</el-tag>
      </template>
      <template slot="menuLeft">
        <el-tag> * 所有数据均为实时从后端获取 </el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>

import {dataFormatter} from "@/util/tools";

export default window.$crudCommon({
  methods: {
    listBefore(){
      const {order_sn, user, thread, payee, status, created_at} = this.params
      this.params['include'] = 'user,thread,thread.firstPost,payee'
      this.params['filter[order_sn]'] = order_sn
      this.params['filter[username]'] = user
      this.params['filter[product]'] = thread
      this.params['filter[payee_username]'] = payee
      this.params['filter[status]'] = status
      if (created_at){
        this.params['filter[start_time]'] = created_at[0]
        this.params['filter[end_time]'] = created_at[1]
      }
    },
    openUrl(id){
      if (id){
        window.open("../../topic/index?id=" + id)
      }
    }
  }
},{
  apiName: 'wallet',
  columnName: 'orderRecord',
  list: 'queryOrderRecord',
  pageNumber: 'page[number]',
  pageSize: 'page[limit]',
  res: (data)=>{
    return {
      data: dataFormatter(data)
    }
  },
})
</script>

<style scoped>

</style>
