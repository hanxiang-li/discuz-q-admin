<template>
<el-card style="margin: 5px;">
  <el-row>
    <el-col :span="4">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <br/>
      <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
        <template v-for="role in dataRole" >
          <el-checkbox :label="role" :key="role.id" style="font-size: 23px;">
            <el-input v-model="role.name" size="mini" @focus="roleInputClick(role)"/>
          </el-checkbox>
          <br/>
        </template>
      </el-checkbox-group>
      <div style="margin-top: 5px;">
        <el-button size="mini" type="danger">删除</el-button>
        <el-button size="mini" type="primary">提交修改</el-button>
      </div>
    </el-col>
    <el-col :span="20" v-loading="loading">
      <el-tabs v-model="activeRole">
        <el-tab-pane label="角色信息" name="index">
          <role-index :data="roleClick"/>
        </el-tab-pane>
        <template v-if="roleClick.id && roleClick.id != 1">
          <el-tab-pane label="操作权限" name="permission">
            <role-permission :data="roleInfo" :siteData="siteData"/>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-col>
  </el-row>
</el-card>
</template>

<script>
import {queryUserRoleInfo, queryUserRoleList} from "@/api/role";
import {dataFormatter, analyzingData} from "@/util/tools";
import RoleIndex from "@/views/user/role/roleIndex";
import RolePermission from "@/views/user/role/rolePermission";
import {queryForum} from "@/api/site";

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
      siteData: {},
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
    }
  }
}
</script>

<style scoped>

</style>
