<template>
<el-drawer :visible.sync="drawer" append-to-body size="60%">
  <template slot="title">
    扩展字段配置
    <el-button @click="addRow" size="small" style="margin-left: 10px;margin-right: 80%;" type="primary">
      增加
    </el-button>
  </template>
  <avue-crud :data="data" :option="option" v-model="obj" ref="crud">
    <template slot="type" slot-scope="{row}">
      <div>
        <el-select v-model="row.type" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <br/>
        <el-input
            v-if="row.type === 2 || row.type === 3"
            type="textarea"
            autosize
            placeholder="输入值，每行一个选项值"
            v-model="row.fields_ext">
        </el-input>
      </div>
    </template>
    <template slot="status" slot-scope="{row}">
      <el-switch
          v-model="row.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="-1"/>
    </template>
    <template slot="required" slot-scope="{row}">
      <el-switch
          v-model="row.required"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"/>
    </template>
    <template slot-scope="{row}" slot="menu">
      <el-button type="text" size="small" @click="save(row)">保存</el-button>
      <el-button type="text" size="small" @click="del(row)">删除</el-button>
    </template>
  </avue-crud>
</el-drawer>
</template>

<script>
import {querySigninfields} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {okMsg} from "@/util/msg";

export default {
  name: "extFields",
  data(){
    return {
      drawer: false,
      obj: {},
      data: [],
      option: {
        page:false,
        header: false,
        addBtn:false,
        editBtn:false,
        addRowBtn:true,
        cellBtn:false,
        cancelBtn:false,
        align:'center',
        menuAlign:'center',
        menuWidth: 130,
        column:[
          {
            label: '字段名称',
            prop: 'name',
            cell: true,
          },
          {
            label: '字段类型',
            prop: 'type',
            cell: true,
            slot: true,
            width: 300,
          },
          {
            label: '字段排序',
            prop: 'sort',
            cell: true,
          },
          {
            label: '字段介绍',
            prop: 'fields_desc',
            cell: true,
          },
          {
            label: '字段介绍',
            prop: 'fields_ext',
            hide: true,
          },
          {
            label: '是否启用',
            prop: 'status',
            type: 'switch',
            slot: true,
            cell: true,
          },
          {
            label: '是否必填',
            prop: 'required',
            type: 'switch',
            slot: true,
            cell: true,
          },
        ]
      },
      options: [
        {
          value: 0,
          label: '单行文本框'
        },
        {
          value: 1,
          label: '多行文本框'
        },
        {
          value: 2,
          label: '单选'
        },
        {
          value: 3,
          label: '复选'
        },
        {
          value: 4,
          label: '图片上传'
        },
        {
          value: 5,
          label: '附件上传'
        }
      ],
    }
  },
  watch: {
    drawer(val){
      if (val){
        this.init()
      }
    }
  },
  methods: {
    init(){
      querySigninfields().then(res => {
        let data = dataFormatter(res)
        for (let i = 0; i < data.length; i++) {
          data[i]['$cellEdit'] = true
          if (data[i].fields_ext){
            let txt = ''
            JSON.parse(data[i].fields_ext).options.forEach(i => {
              txt += i.value + '\n'
            })
            data[i].fields_ext = txt
          }
        }
        this.data = data

      })
    },
    save(row){
      if (row.fields_ext){
        let fields = []
        const data = row.fields_ext.split('\n')
        for (let i = 0; i < data.length; i++) {
          if (data[i]) {
            fields.push({
              value: data[i],
              checked: false
            })
          }
        }
        row.fields_ext = JSON.stringify({
          options: fields
        })
      }
      querySigninfields({data: [{
          attributes: row,
          type: "admin_sign_in"
        }]}).then(() => {
        this.init()
        okMsg()
      })
    },
    del(row){
      this.$confirm('删除后，则此字段及其历史用户信息，将从系统钟彻底删除，且无法恢复，请谨慎操作，点击确认删除，则删除', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        querySigninfields({data: [{
            attributes: {
              id: row.id,
              status: 0,
            },
          }]}).then(() => {
          this.init()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addRow(){
      this.$refs.crud.rowCellAdd({
        name: '',
      });
    }
  }
}
</script>

<style scoped>

</style>
