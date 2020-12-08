<template>
  <basic-container>
    <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent"
               ref="contManageCrud" @search-reset="searchReset" @selection-change="selectionChange">
      <template slot="expand" slot-scope="{row}">
        <div style="margin-left: 100px;max-height: 500px;overflow-y: auto">
          <a :href="'../../topic/index?id=' + row.id" v-html="row.firstPost.contentHtml" target="_blank"></a>
        </div>
      </template>
      <template slot-scope="{size}" slot="countSearch">
        <div>
          <el-select :size="size" style="width: 80px!important;" v-model="search.count">
            <el-option
                label="回复"
                value="1" />
            <el-option
                label="浏览"
                value="2" />
          </el-select>
          <el-input-number v-model="search.gt" controls-position="right" :min="1" :size="size" placeholder="大于" style="width: 80px;"/>
          -
          <el-input-number v-model="search.lt" controls-position="right" :min="1" :size="size" placeholder="小于" style="width: 80px;"/>
        </div>
      </template>
      <template slot="menuLeft">
        <div>
          <el-button type="primary" size="small" :disabled="selectionList.length === 0" @click="selectionDialog = true">批量操作</el-button>
          <el-tag>当前已选择：{{selectionList.length}}条数据</el-tag>
        </div>
      </template>
    </avue-crud>
    <el-dialog title="批量操作" :visible.sync="selectionDialog" width="500px" :modal-append-to-body="false" center>
      <el-radio-group v-model="selectionRadio">
        <el-radio :label="0">
          帖子状态　　　　
          <el-select v-model="selection.isApproved" placeholder="请选择" size="small" style="margin-left: 42px;">
            <el-option label="审核" :value="0" />
            <el-option label="忽略" :value="2" />
          </el-select>
        </el-radio>
        <br/>
        <el-radio :label="1" style="margin-top: 20px;">
          批量移动到分类　　　　
          <el-select v-model="selection.category" placeholder="请选择" size="small">
            <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
          </el-select>
        </el-radio>
        <br/>
        <el-radio :label="2" style="margin-top: 20px;">
          批量置顶　　　　　　　
          <el-radio-group v-model="selection.isSticky" style="width: 100%;">
            <el-radio :label="true">置顶</el-radio>
            <el-radio :label="false">解除置顶</el-radio>
          </el-radio-group>
        </el-radio>
        <br/>
        <el-radio :label="3" style="margin-top: 20px;">
          批量删除
        </el-radio>
        <br/>
        <el-radio :label="4" style="margin-top: 20px;">
          批量设置精华　　　　　
          <el-radio-group v-model="selection.isEssence" style="width: 100%;">
            <el-radio :label="true">精华</el-radio>
            <el-radio :label="false">取消精华</el-radio>
          </el-radio-group>
        </el-radio>
        <br/>
        <el-radio :label="5" style="margin-top: 20px;">
          批量推送到付费首页　　
          <el-radio-group v-model="selection.isSite" style="width: 100%;">
            <el-radio :label="true">推送</el-radio>
            <el-radio :label="false">取消推送</el-radio>
          </el-radio-group>
        </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
      <el-button @click="selectionDialog = false">取 消</el-button>
      <el-button type="primary" @click="selectionClick">确 定</el-button>
    </span>
    </el-dialog>
  </basic-container>
</template>

<script>

import {dataFormatter} from "@/util/tools";
import {queryCategories, updateListThreads} from "@/api/cont";
import {errorMsg, okMsg} from "@/util/msg";

export default window.$crudCommon({
  data(){
    return {
      search: {},
      categoryList: [],
      selectionList: [],
      selectionDialog: false,
      selectionRadio: null,
      selection: {
        category: null,
        isSticky: false,
        isEssence: false,
        isSite: false,
      }
    }
  },
  created() {
    queryCategories().then(res => {
      const data = [
        {id: 0, name: '所有分类'},
        ...dataFormatter(res)
      ]
      this.categoryList = dataFormatter(res)
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
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
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
    },
    selectionClick(){
      let data = [], flag = true
      switch (this.selectionRadio){
        case 0:
          for (let i = 0; i < this.selectionList.length; i++) {
            const val = this.selectionList[i]
            data.push({
              attributes: {
                isApproved: this.selection.isApproved
              },
              id: val.id,
              type: "threads",
            })
          }
          break;
        case 1:
          for (let i = 0; i < this.selectionList.length; i++) {
            const val = this.selectionList[i]
            data.push({
              attributes: {},
              id: val.id,
              relationships: {
                category: {
                  data: {
                    id: this.selection.category
                  }
                }
              },
              type: "threads",
            })
          }
          break;
        case 2:
          for (let i = 0; i < this.selectionList.length; i++) {
            const val = this.selectionList[i]
            data.push({
              attributes: {
                isSticky: this.selection.isSticky
              },
              id: val.id,
              type: "threads",
            })
          }
          break;
        case 3:
          for (let i = 0; i < this.selectionList.length; i++) {
            const val = this.selectionList[i]
            data.push({
              attributes: {
                isDeleted: true
              },
              id: val.id,
              type: "threads",
            })
          }
          break;
        case 4:
          for (let i = 0; i < this.selectionList.length; i++) {
            const val = this.selectionList[i]
            data.push({
              attributes: {
                isEssence: this.selection.isEssence
              },
              id: val.id,
              type: "threads",
            })
          }
          break;
        case 5:
          for (let i = 0; i < this.selectionList.length; i++) {
            const val = this.selectionList[i]
            data.push({
              attributes: {
                isSite: this.selection.isSite
              },
              id: val.id,
              type: "threads",
            })
          }
          break;
        default:
          errorMsg('请选择操作类型')
          flag = false
          break;
      }
      if (flag){
        updateListThreads({data: data}).then(() => {
          okMsg()
          this.selectionList = []
          this.selectionDialog = false
          this.$refs.contManageCrud.toggleSelection(null)
          this.getList()
        })
      }
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
