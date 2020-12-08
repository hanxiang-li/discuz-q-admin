<template>
<basic-container v-loading="loading">
  <el-form :inline="true" :model="form" size="mini" label-width="100px">
    <el-form-item label="作者">
      <el-input v-model="form['filter[username]']"/>
    </el-form-item>
    <el-form-item label="内容包含">
      <el-input v-model="form['filter[q]']"/>
    </el-form-item>
    <el-form-item label="发布时间范围">
      <el-date-picker
          v-model="form.createdAt"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
    </el-form-item>
    <br/>
    <el-form-item label="搜索范围">
      <el-select v-model="form['filter[categoryId]']" placeholder="请选择搜索分类" style="width: 177px">
        <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作人">
      <el-input v-model="form['filter[deletedUsername]']"/>
    </el-form-item>
    <el-form-item label="删除时间范围">
      <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.deletedAt"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="init">搜索</el-button>
      <el-button type="primary" @click="init(true)">清空</el-button>
    </el-form-item>
    <br/>
    <el-form-item label="回收类型">
      <el-radio-group v-model="form.radio" border @change="init">
        <el-radio-button :label="1">主题</el-radio-button>
        <el-radio-button :label="2">回复</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateAll(1)">批量操作</el-button>
      <el-button type="success" @click="updateAll(2)">全部还原</el-button>
      <el-button type="danger" @click="updateAll(3)">全部删除</el-button>
    </el-form-item>
  </el-form>
  <div :style="{'max-height': height,'overflow-y': 'auto'}">
    <table class="tg" v-for="(i, k)  in data" :key="k">
      <tr>
        <th class="tg-2gew" :rowspan="form.radio === 1 ? 4:3">
          <el-radio-group v-model="i.radio">
            <el-radio :label="1" class="radio">还原</el-radio>
            <el-radio :label="2" class="radio" style="float: left;">删除</el-radio>
          </el-radio-group>
        </th>
        <th class="tg-y698" colspan="3">
          <div style="margin: 8px;">
            <template v-if="form.radio === 1 ">
              {{ i.user.username }}
              <span style="color: silver;">发布于</span>
              {{ i.category.name }}
            </template>
            <template v-else>
              {{ i.user.username }}
              <span style="color: silver;">回复主题</span>
              {{ i.thread.title || '主题已被删除' }}
            </template>
            <div style="float: right;color: silver;">
              <span style="margin-right: 20px;">更新时间：{{ dateFormats(i.createdAt) }}</span>
              <span>删除时间：{{ dateFormats(i.updatedAt) }}</span>
            </div>
          </div>
        </th>
      </tr>
      <tr v-if="form.radio === 1">
        <td class="tg-u4qj" colspan="3">
          <div style="margin: 8px;">
            {{ i.title }}
          </div>
        </td>
      </tr>
      <tr>
        <td class="tg-u4qj" colspan="4">
          <div style="margin: 8px;" v-html="i.firstPost ? i.firstPost.contentHtml:i.contentHtml">
          </div>
        </td>
      </tr>
      <tr>
        <td class="tg-u4qj" colspan="3">
          <div style="margin: 8px;">
            操作者：{{ i.deletedUser.username }}
          </div>
        </td>
      </tr>
    </table>
    <div v-if="data.length === 0" style="text-align: center;">
      暂时没有数据
    </div>
  </div>
</basic-container>
</template>

<script>
import {getLocal} from "@/util/store";
import {
  deleteThreads,
  queryCategories,
  queryListPosts,
  queryListThreads,
  updateListPosts,
  updateListThreads
} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {dateFormat} from "@/util/date";
import {errorMsg} from "@/util/msg";

export default {
  name: "recycleBin",
  data(){
    return {
      form: {
        radio: 1,
        include: 'user,firstPost,category,deletedUser,lastDeletedLog,firstPost.images,firstPost.attachments,threadVideo',
        'filter[isDeleted]': 'yes',
        sort: '-deletedAt',
      },
      loading: false,
      height: getLocal('height') - 100 + 'px',
      data: [],
      categoryList: [],
    }
  },
  created() {
    this.init()
    queryCategories().then(res => {
      this.categoryList = dataFormatter(res)
    })
  },
  methods: {
    init(val){
      if (val === true){
        Object.assign(this.$data, this.$options.data())
      }
      this.loading = true
      const {createdAt, deletedAt} = this.form
      if (createdAt){
        this.form['filter[createdAtBegin]'] = createdAt[0]
        this.form['filter[createdAtEnd]'] = createdAt[1]
      }
      if (deletedAt){
        this.form['filter[deletedAtBegin]'] = deletedAt[0]
        this.form['filter[deletedAtEnd]'] = deletedAt[1]
      }
      if (this.form.radio === 1){
        this.form.include = 'user,firstPost,category,deletedUser,lastDeletedLog,firstPost.images,firstPost.attachments,threadVideo'
        queryListThreads(this.form).then(res => {
          this.data = dataFormatter(res)
          this.loading = false
        })
      } else {
        this.form.include = 'user,replyUser,thread,thread.category,thread.firstPost,deletedUser,lastDeletedLog,images'
        queryListPosts(this.form).then(res => {
          this.data = dataFormatter(res)
          this.loading = false
        })
      }
    },
    dateFormats(val){
      return dateFormat(new Date(val))
    },
    updateAll(type){
      this.loading = true
      let data = [],ids = ''
      for (let i = 0; i < this.data.length; i++) {
        const val = this.data[i]
        if (type === 1){
          if (val.radio === 2){
            ids += val.id + ','
          } else if (val.radio === 1){
            data.push({
              attributes: {isDeleted: false},
              hardDelete: false,
              id: val.id,
              radio: "",
              relationships: {category: {data: {type: "categories", id: val.category.id}}},
              type: "threads",
            })
          }
        } else if (type === 2){
          data.push({
            attributes: {isDeleted: false},
            hardDelete: false,
            id: val.id,
            radio: "",
            relationships: this.form.radio === 1 ? {category: {data: {type: "categories", id: val.category.id}}}:null,
            type: "threads",
          })
        } else if (type === 3){
          ids += val.id + ','
        }
      }
      if (type === 1 || type === 2){
        if (data.length > 0) {
          if (this.form.radio === 1){
            updateListThreads({data: data}).then(() => {
              this.init()
            })
          } else {
            updateListPosts({data: data}).then(() => {
              this.init()
            })
          }
        } else {
          this.loading = false
        }
      }
      if (type === 1 || type === 3){
        if (ids) {
          if (this.form.radio === 1){
            updateListThreads({id: ids.substring(0, ids.length - 1), type: 'del'}).then(() => {
              this.init()
            })
          } else {
            updateListPosts({id: ids.substring(0, ids.length - 1), type: 'del'}).then(() => {
              this.init()
            })
          }
        } else {
          this.loading = true
        }
      }
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
.tg .tg-2gew{background-color:#ffffff;border-color:inherit;font-size:16px;text-align:center;vertical-align:top;width:60px;
  border-right: 1px solid #c0c0c0;border-top: 1px solid #c0c0c0;}
.tg .tg-y698{background-color:#ffffff;border-color:inherit;text-align:left;vertical-align:top;border-top: 1px solid #c0c0c0;}
.tg .tg-u4qj{background-color:#ffffff;text-align:left;vertical-align:top;border-top: 1px solid #c0c0c0;}
.radio{
  margin-top: 15px;
}
</style>
