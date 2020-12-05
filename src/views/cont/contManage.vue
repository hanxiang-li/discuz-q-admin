<template>
<basic-container>
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent"
     ref="contManageCrud" @search-reset="searchReset" @selection-change="selectionChange">
    <template slot="expand" slot-scope="{row}">
      <div style="margin-left: 100px;height: 500px!important;overflow-y: auto">
      <a :href="'../topic/index?id=' + row.id" v-html="row.firstPost.contentHtml" target="_blank"></a>
    </div>
    </template>
    <template slot-scope="{size}" slot="countSearch">
     <div>
       <el-select :size="size" style="width: 100px!important;" v-model="search.count">
         <el-option
             label="回复"
             value="1" />
         <el-option
             label="浏览"
             value="2" />
       </el-select>
       <el-input-number v-model="search.gt" controls-position="right" :min="1" :size="size" placeholder="大于"/>
       -
       <el-input-number v-model="search.lt" controls-position="right" :min="1" :size="size" placeholder="小于"/>
     </div>
    </template>
    <template slot="menuLeft">
      <div>
        <el-button type="primary" size="small" :disabled="selectionList.length === 0" @click="selectionDialog = true">批量操作</el-button>
        <el-tag>当前已选择：{{selectionList.length}}条数据</el-tag>
      </div>
    </template>
  </avue-crud>
  <el-dialog title="批量操作" :visible.sync="selectionDialog" width="500px" :modal-append-to-body="false">
    <span>暂无信息，等待完成</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="selectionDialog = false">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </span>
  </el-dialog>
</basic-container>
</template>

<script>

import {dataFormatter} from "@/util/tools";
import {queryCategories} from "@/api/cont";

export default window.$crudCommon({
  data(){
    return {
      search: {},
      selectionList: [],
      selectionDialog: false,
    }
  },
  created() {
    queryCategories().then(res => {
      const data = [
        {id: 0, name: '所有分类'},
          ...dataFormatter(res)
      ]
      this.$refs.contManageCrud.updateDic('categoryId', data)
    })
  },
  methods: {
    listBefore(){
      const { q, username, categoryId, topicTypeId } = this.params
      const { count, gt, lt } = this.search
      const topicType = topicTypeId === 0 ? '' : topicTypeId ===  1 ? 'isSticky' : topicTypeId === 2 ? 'isEssence' :
          topicTypeId === 3 ? 'isSticky' : topicTypeId === 4 ? 'isSite' : null
      let topicTypeObjt = {}
      if (topicTypeId === 3){
        topicTypeObjt['filter[isEssence]'] = 'yes'
        topicTypeObjt['filter[isSticky]'] = 'yes'
      } else if (topicType){
        topicTypeObjt['filter[' + topicType + ']'] = 'yes'
      }
      let typeObjt = {}
      if (count){
        if (count == 1){
          typeObjt['filter[postCountGt]'] = gt
          typeObjt['filter[postCountLt]'] = lt
        } else {
          typeObjt['filter[viewCountGt]'] = gt
          typeObjt['filter[viewCountLt]'] = lt
        }
      }
      this.params = {
        include: 'user,firstPost,lastPostedUser,category,firstPost.images,threadVideo,firstPost.attachments',
        'filter[q]': q,
        'filter[username]': username,
        'filter[categoryId]': categoryId,
        ...topicTypeObjt,
        ...typeObjt
      }
    },
    searchReset(){
      this.search = {}
    },
    selectionChange(list){
      this.selectionList = list
    }
  }
},{
  name: 'cont',
  list: 'queryListThreads',
  columnName: 'contManage',
  pageNumber: 'page[number]',
  pageSize: 'page[limit]',
  res:(data)=>{
    return {
      data: dataFormatter(data)
    }
  },
})
</script>

<style scoped>

</style>
