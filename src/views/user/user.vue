<template>
<div style="margin: 5px;">
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent" ref="userCrud">
    <template slot="avatarUrl" slot-scope="{row}" >
      <avue-avatar style="color: #f56a00; background-color: rgba(0,0,0,0)" size="large"
                   :src="row.avatarUrl"/>
    </template>
    <template slot="isPaid" slot-scope="{row}" >
      <el-tag>
        {{judgeTime(row.expiredAt) ? '是' : '否'}}
      </el-tag>
    </template>
  </avue-crud>
</div>
</template>

<script>
import {dataFormatter} from "@/util/tools";
import {validatenull} from "@/util/validate";

export default window.$crudCommon({
  data () {
    return {}
  },
  methods: {
    listBefore(){
      const {status, username, id, originalMobile} = this.params
      this.params = {
        'filter[status]': status === 0 ? 'normal' : status === 1 ? 'ban' : status === 2 ? 'mod' : status === 3 ? 'refuse': null,
        'filter[username]': username,
        'filter[id]': id,
        'filter[mobile]': originalMobile,
      }
    },
    judgeTime(time){
      if (validatenull(time)){
        return false
      } else {
        var strtime = time.replace("/-/g", "/");
        var date1=new Date(strtime);
        var date2=new Date();
        return date1 > date2;
      }
    },
    listAfter(){
      if (this.data.length > 0){
        try {
          this.$refs.userCrud.$refs.headerSearch.searchShow = false
        } catch (e){}
      }
    },
  }
},{
  name: 'user',
  list: 'queryUserList',
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
