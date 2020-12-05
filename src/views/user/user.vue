<template>
<basic-container style="margin: 5px;">
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent" ref="userCrud">
    <template slot="avatarUrl" slot-scope="{row}" >
      <avue-avatar style="color: #f56a00; background-color: rgba(0,0,0,0)" size="large"
       :src="row.avatarUrl"/>
    </template>

    <template slot="groups" slot-scope="{row}" >
      <div>
        <el-tag v-for="(i, k) in row.groups" :key="k" style="margin-left: 2px;">
          {{ i.name }}
        </el-tag>
      </div>
    </template>

    <template slot-scope="{value, row}" slot="avatarUrlForm">
      <div>
        <el-upload style="float: left;" class="avatar-uploader" name="avatar" :action="`${isDev ? '/dzq':''}/api/users/${row.id}/avatar`"
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

    <template slot-scope="{row}" slot="banReasonLabel">
      <span v-if="row.status === 1">禁用原因  </span>
    </template>

    <template slot-scope="{value, row}" slot="banReasonForm">
      <el-input v-if="row.status === 1" v-model="row.banReason" />
    </template>

    <template slot-scope="{value, row}" slot="groupsForm">
      <el-select v-model="userGroups" multiple placeholder="请选择">
        <el-option
            v-for="item in groupsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="item.name === '游客'" />
      </el-select>
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

    <template slot-scope="{type,size, row, index}" slot="menu">
      <el-button :size="size" :type="type" @click="openUserInfo(row, index)">详情</el-button>
      <el-button :size="size" :type="type" @click="openWallet(row)">钱包</el-button>
      <el-button :size="size" :type="type" @click="updateUserPassword(row)">重置密码</el-button>
    </template>

  </avue-crud>

  <el-dialog :title="form.username + '的钱包'" :visible.sync="walletDialog" width="20%" :modal-append-to-body="false" center>
    <div class="wallet">
      <label>钱包可用余额：</label> {{walletData.available_amount}}
    </div>
    <div class="wallet">
      <label>钱包冻结金额：</label> {{walletData.freeze_amount}}
    </div>
    <div class="wallet">
      <label>钱包余额操作：</label> <br/>
      <el-input type="number" placeholder="请输入金额" v-model="walletData.operate_amount" class="input-with-select">
        <el-select v-model="walletData.operate_type" slot="prepend" placeholder="请选择" style="width: 110px;">
          <el-option label="增加余额" :value="1" />
          <el-option label="减少余额" :value="2" />
        </el-select>
      </el-input>
    </div>
    <div class="wallet">
      <label>调整原因：</label> <br/>
      <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入调整原因"
          v-model="walletData.operate_reason" />
    </div>
    <div class="wallet">
      <label>钱包状态：</label> <br/>
      <el-radio v-model="walletData.wallet_status" :label="0">正常</el-radio>
      <el-radio v-model="walletData.wallet_status" :label="1">冻结提现</el-radio>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="walletDialog = false">取 消</el-button>
      <el-button type="primary" @click="updateWallet">提 交</el-button>
    </span>
  </el-dialog>

</basic-container>
</template>

<script>
import {getLocal} from "@/util/store"
import {dataFormatter} from "@/util/tools";
import {validatenull} from "@/util/validate";
import {deleteAvatar, queryUserWallet, updateUser, updateUserWallet} from "@/api/user";
import {errorMsg, okMsg, promptValidator} from "@/util/msg";
import {queryGroups} from "@/api/site";

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
      headers: {},
      groupsList: [],
      userGroups: [],
      walletDialog: false,
      walletData: {},
      isDev: process.env.NODE_ENV === "development",
    }
  },
  created() {
    this.headers = {
      authorization: this.$store.getters.token
    }
    // 获取用户组
    queryGroups().then(res => {
      this.groupsList = dataFormatter(res)
    })
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
      this.data[row.$index].avatarUrl = row.avatarUrl
    },
    deleteUserAvatar(row){
      deleteAvatar(row.id).then(res => {
        row.avatarUrl = null
        this.data[row.$index].avatarUrl = null
        okMsg()
      })
    },
    openUserInfo (row, index) {
      this.userGroups = []
      let id = []
      for (let i = 0; i < row.groups.length; i++) {
        id.push(row.groups[i].id)
      }
      this.userGroups = id
      this.$refs.userCrud.rowEdit(row, index)
    },
    updateBefore () {
      const { id, expiredAt, originalMobile, status, username, banReason } = this.form
      this.form = {
        id: id,
        data: {
          attributes: {
            expired_at: expiredAt,
            groupId: this.userGroups,
            mobile: originalMobile,
            refuse_message: status === 1 ? banReason : '',
            status: status,
            username: username,
          }
        }
      }
    },
    openWallet(row){
      this.loading = true
      this.form = row
      queryUserWallet(row.id).then(res => {
        this.walletData = dataFormatter(res)
        this.walletDialog = true
        this.loading = false
      })
    },
    updateWallet(){
      const { operate_amount, operate_type, operate_reason, wallet_status, user_id } = this.walletData
      const val = {
        operate_amount: operate_amount,
        operate_reason: operate_reason,
        operate_type: operate_type,
        user_id: user_id,
        wallet_status: wallet_status,
      }
      updateUserWallet(val).then(() => {
        okMsg()
        this.walletDialog = false
      })
    },
    updateUserPassword(row){
      if (row.id === getLocal('userInfo').id){
        errorMsg('不能修改自己')
        return false
      }
      this.$prompt('请输入新密码', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => promptValidator(val, '请输入密码'),
      }).then(({ value }) => {
        updateUser({id: row.id, data: {attributes: {newPassword: value}}}).then(() => {
          okMsg()
        })
      })
    }
  }
},{
  name: 'user',
  list: 'queryUserList',
  update: 'updateUser',
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
.wallet{
  margin-top: 5px;
}
</style>
