<template>
<basic-container>
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent" ref="fundDetailsCrud">
  </avue-crud>
</basic-container>
</template>

<script>
import {dataFormatter} from "@/util/tools";

export default window.$crudCommon({
  methods: {
    listBefore(){
      const {username, created_at, change_desc} = this.params
      this.params['include'] = 'user,userWallet'
      this.params['filter[username]'] = username
      this.params['filter[change_desc]'] = change_desc
      if (created_at){
        this.params['filter[start_time]'] = created_at[0]
        this.params['filter[end_time]'] = created_at[1]
      }
    },
  }
},{
  apiName: 'wallet',
  columnName: 'fundDetails',
  list: 'queryfundDetails',
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
