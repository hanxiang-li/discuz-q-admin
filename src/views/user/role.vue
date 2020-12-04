<template>
<el-card style="margin: 5px;">
  <el-row v-loading="loading">
    <el-col :span="8">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin-top: 5px;float: right;">
        <el-button size="mini" type="danger">删除</el-button>
        <el-button size="mini" type="success">增加</el-button>
        <el-button size="mini" type="primary" @click="updateSave">提交修改</el-button>
      </div>
      <br/> <br/>
      <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
      <table class="tg">
        <thead>
        <tr>
          <th class="tg-gmla">选择</th>
          <th class="tg-0pky">级别名称</th>
          <th class="tg-0pky">显示组名</th>
          <th class="tg-0lax">是否默认</th>
          <th class="tg-0lax">设置</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(role, k) in dataRole">
            <td class="tg-0lax" style="text-align: center;width: 20px;">
              <el-checkbox :label="role" style="margin-top: 8px;" v-if="role.id > 10">{{ k + 1 }}</el-checkbox>
            </td>
            <td class="tg-0lax">
              <el-input v-model="role.name" size="small" style="width: 150px;"/>
            </td>
            <td class="tg-0lax">
              <el-switch v-model="role.isDisplay" active-color="#13ce66" inactive-color="#ff4949"
                size="small" :disabled="role.id === '7'" style="margin-top: 8px;"/>
            </td>
            <td class="tg-0lax">
              <el-radio v-model="role.default" :label="true" style="margin-top: 8px;"
                        @change="(val) => change(role, val)" v-if="role.id !== '1' && role.id !== '7'">
                设为加入站点的默认级别
              </el-radio>
            </td>
            <td class="tg-0lax">
              <el-button size="small" type="text" @click="roleInputClick(role)"
                v-if="role.id !== '1' && role.id !== '7'">编辑</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      </el-checkbox-group>
    </el-col>
    <el-col :span="16">
      <role-permission :data="roleInfo" :siteData="siteData"/>
    </el-col>
  </el-row>
</el-card>
</template>

<script>
import {queryUserRoleInfo, queryUserRoleList, updateUserGroups} from "@/api/role";
import {dataFormatter, analyzingData} from "@/util/tools";
import RoleIndex from "@/views/user/role/roleIndex";
import RolePermission from "@/views/user/role/rolePermission";
import {queryForum} from "@/api/site";
import {okMsg} from "@/util/msg";

export default {
  name: "role",
  components: {RolePermission, RoleIndex},
  data(){
    return {
      dataRole: [],
      checkedRole: [],
      checkAll: false,
      isIndeterminate: false,
      roleClick: {},
      activeRole: 'index',
      roleInfo: {},
      siteData: {qcloud:{}},
      loading: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      queryUserRoleList().then(res => {
        this.dataRole = dataFormatter(res)
      })
      queryForum().then(res => {
        this.siteData = dataFormatter(res)
      })
    },
    handleCheckAllChange(val) {
      this.checkedRole = val ? this.dataRole : [];
      this.isIndeterminate = false;
    },
    handleCheckedRoleChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.dataRole.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataRole.length;
    },
    roleInputClick(row){
      this.roleClick = row
      if (row.id != 1) {
        this.loading = true
        queryUserRoleInfo(row.id).then(res => {
          this.roleInfo = dataFormatter(res)
          this.loading = false
        })
      } else {
        this.activeRole = 'index'
      }
    },
    change(role, val){
      if (val){
        this.dataRole.forEach(i => {
          if (i.id !== role.id){
            i.default = false
          }
        })
      }
    },
    updateSave(){
      this.loading = true
      let data = []
      for (let i = 0; i < this.dataRole.length; i++) {
        const val = this.dataRole[i]
        data.push({
          attributes: {
            default: val.default,
            id: val.id,
            isDisplay: val.isDisplay,
            name: val.name,
          }
        })
      }
      updateUserGroups({
        data: data
      }).then(res => {
        this.init()
        okMsg()
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.tg  {border-collapse:collapse;border-color:#bbb;border-spacing:0;width: 100%;}
.tg td{background-color:#E0FFEB;border-color:#bbb;border-style:solid;border-width:0px;color:#594F4F;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#9DE0AD;border-color:#bbb;border-style:solid;border-width:0px;color:#493F3F;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-gmla{border-color:inherit;font-size:16px;text-align:center;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top;}
</style>
