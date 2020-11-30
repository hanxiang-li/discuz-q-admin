<template>
<div style="margin: 5px;">
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent" ref="userCrud">
    <template slot="avatarUrl" slot-scope="{row}" >
      <avue-avatar style="color: #f56a00; background-color: rgba(0,0,0,0)" size="large"
                   :src="row.avatarUrl"/>
    </template>

    <template slot-scope="{value, row}" slot="avatarUrlForm">
      <div>
        <el-upload style="float: left;" class="avatar-uploader" name="avatar" :action="`/dzq/api/users/${row.id}/avatar`"
          :show-file-list="false" :headers="headers" accept="jpg,png" :on-success="(res) => handleAvatarSuccess(res, row)">
          <img v-if="value" :src="value" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="text" style="float: left;" @click="deleteUserAvatar(row)">删除</el-button>
      </div>
    </template>

    <template slot="expiredAt" slot-scope="{row}" >
      <el-tag type="danger" v-if="judgeTime(row.expiredAt)">
        是
      </el-tag>
      <el-tag v-else>
        否
      </el-tag>
    </template>

    <template slot-scope="{disabled}" slot="expiredAtLabel">
      <span>过期时间  </span>
    </template>

    <template slot="menuLeft">
      <el-input size="small" clearable v-model="searchData.id" placeholder="用户ID" class="input"/>
      <el-input size="small" clearable v-model="searchData.username" placeholder="用户名称" class="input" />
      <el-input size="small" clearable v-model="searchData.originalMobile" placeholder="手机号码" class="input" />
      <el-select v-model="searchData.status" clearable size="small" placeholder="请选择状态" class="input">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button size="small" style="width: 100px;margin-left: 5px;" type="primary" @click="search">搜索</el-button>
      <el-button size="small" style="width: 100px;" type="warning" @click="searchData = {},getList()">清空</el-button>
    </template>
  </avue-crud>
</div>
</template>

<script>
import {dataFormatter} from "@/util/tools";
import {validatenull} from "@/util/validate";
import {deleteAvatar} from "@/api/user";

export default window.$crudCommon({
  data () {
    return {
      searchData: {},
      statusOptions: [
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
      headers: {}
    }
  },
  created() {
    this.headers = {
      authorization: this.$store.getters.token
    }
  },
  methods: {
    search(){
      this.params = this.searchData
      this.getList()
    },
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
    handleAvatarSuccess(res,row){
      row.avatarUrl = dataFormatter(res).avatarUrl
    },
    deleteUserAvatar(row){
      deleteAvatar(row.id).then(res => {
        row.avatarUrl = null
      })
    }
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
.input{
  width: 150px!important;
  margin-left: 5px!important;
}
</style>
