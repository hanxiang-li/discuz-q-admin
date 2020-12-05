<template>
<basic-container>
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent"
     ref="contClassCrud" @selection-change="selectionChange">
    <template slot="menuLeft">
      <el-button type="danger" size="small" :disabled="!(selectionList.length > 0)" @click="delList">删除选中</el-button>
    </template>
  </avue-crud>
</basic-container>
</template>

<script>
import {dataFormatter} from "@/util/tools";
import {deleteListCategories, updateCategories} from "@/api/cont";

export default window.$crudCommon({
  created() {
    this.getList()
  },
  data () {
    return {
      selectionList: []
    }
  },
  methods: {
    updateBefore (){
      this.form = {
        id: this.form.id,
        data: {
          "type": "categories",
          "attributes": this.form
        }
      }
    },
    updateAfter(data, done, loading, index) {
      const val = dataFormatter(data)
      this.data[index] = val
      done()
      loading()
    },
    selectionChange(val){
      this.selectionList = val
    },
    delList(){
      let list = ''
      for (let i = 0; i < this.selectionList.length; i++) {
        list += this.selectionList[i].id + ','
      }
      deleteListCategories(list.substr(0, list.length - 1)).then(() => {
        this.selectionList = []
        this.getList()
      })
    }
  }
},{
  name:'cont',
  delLabel: 'name',
  list: 'queryCategories',
  update: 'updateCategories',
  columnName: 'contClass',
  del: 'deleteCategories',
  res:(data)=>{
    return {
      data: dataFormatter(data)
    }
  },
})
</script>

<style scoped>

</style>
