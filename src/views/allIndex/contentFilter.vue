<template>
  <div style="margin: 5px;">
    <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent"
      @selection-change="selectionChange" ref="contentFilter">
      <template slot="menuLeft">
        <el-button @click="addRow" size="small" type="success">添加3条</el-button>
        <el-button @click="delRow" size="small" type="warning" v-if="selectionList.length > 0">删除选中</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {dataFormatter, dataSerialize} from "@/util/tools";
import {deleteContentFilter} from "@/api/site";
import {errorMsg} from "@/util/msg";

export default window.$crudCommon({
  data () {
    return {
      selectionList: []
    }
  },
  methods: {
    listBefore() {
      const {find} = this.params
      this.params = {
        'filter[q]': find,
      }
    },
    addRow(){
      for (let i = 0; i < 3; i++) {
        this.$refs.contentFilter.rowCellAdd({
          name: '',
        });
      }
    },
    updateBefore () {
      if (this.form.id){
        this.form = dataSerialize(this.form, ['stop-words'])
      } else {
        const {ugc, username, find, replacement, signature, dialog} = this.form
        this.form = {
          "data": {
            "type": "stop-words",
            "attributes": {
              "ugc": ugc,
              "username": username,
              "find": find,
              "replacement": replacement,
              "signature": signature,
              "dialog": dialog
            }
          },
          isAdd: true,
        }
      }
    },
    delBefore (row, callback) {
      callback(row.id)
    },
    updateAfter(data, done, loading, index) {
      if (index){
        const value = dataFormatter(data)
        this.data[index]['id'] = value.id
        this.data[index]['updated_at'] = value.updated_at
      }
      done()
      loading()
    },
    selectionChange(val){
      this.selectionList = val
    },
    delRow(){
      if (this.selectionList.length === 0){
        errorMsg('请选择数据')
        return false
      }
      let list = ''
      for (let i = 0; i < this.selectionList.length; i++) {
        list += this.selectionList[i].id + ','
      }
      deleteContentFilter(list.substr(0,list.length-1)).then(() => {
        this.getList()
      })
    }
  }
},{
  name: 'contentFilter',
  apiName: 'site',
  del: 'deleteContentFilter',
  list: 'queryContentFilterList',
  update: 'updateContentFilter',
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
