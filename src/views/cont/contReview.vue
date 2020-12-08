<template>
<el-card class="box-card" v-loading="loading">
  <div slot="header" class="clearfix">
    <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
      <el-form-item label="审核类型">
        <el-radio-group v-model="type" @change="init()">
          <el-radio-button :label="0">内容审核</el-radio-button>
          <el-radio-button :label="1">回复审核</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="search['filter[username]']" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="内容包含">
        <el-input v-model="search['filter[q]']" placeholder="关键词"/>
      </el-form-item>
      <el-form-item label="敏感词" v-if="type === 0">
        <el-checkbox v-model="search['filter[highlight]']" />
      </el-form-item>
      <br v-if="type === 0"/>
      <el-form-item label="每页条数">
        <el-select v-model="search['filter[page]']" placeholder="请选择">
          <el-option label="每页10条" :value="10" />
          <el-option label="每页20条" :value="20" />
          <el-option label="每页30条" :value="30" />
          <el-option label="每页50条" :value="50" />
        </el-select>
      </el-form-item>
      <el-form-item label="搜索范围">
        <el-select v-model="search['filter[isApproved]']" placeholder="请选择">
          <el-option label="未审核" value="0" />
          <el-option label="已忽略" value="2" />
        </el-select>
        <el-select v-model="search['filter[categoryId]']" placeholder="请选择搜索分类" v-if="type === 0" style="margin-left: 10px;">
          <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
        </el-select>
        <el-select v-model="search['filter[time]']" placeholder="请选择搜索时间" v-if="type === 0" style="margin-left: 10px;">
          <el-option label="全部" :value="0" />
          <el-option label="最近一周" :value="7" />
          <el-option label="最近一个月" :value="30" />
          <el-option label="最近三个月" :value="90" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围" v-if="type !== 0">
        <el-date-picker
            v-model="search['filter[time]']"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init">搜索</el-button>
        <el-button type="primary" @click="updateList">批量操作</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div :style="{'max-height': height,'overflow-y': 'auto'}">
    <div style="text-align: center;" v-if="data.length === 0">
      暂无数据
    </div>
    <el-card class="box-card" v-for="(i,k) in data" v-else>
      <el-row :key="k" >
        <el-col :span="1" style="border-right: 1px solid darkgrey;">
          <el-radio-group v-model="i.radio">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1" style="margin-top: 15px;">删除</el-radio>
            <el-radio :label="2" style="margin-top: 15px;" v-if="isApproved != 2">忽略</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="23">
          <template v-if="type === 0">
            <div style="border-bottom: 1px solid darkgrey;">
              {{i.user.username}} 发布于 {{ i.category.name }}
              <div style="float: right;">
                <span>回复/查看： {{ i.firstPost.replyCount }}/{{ i.firstPost.likeCount }}</span>
                <span style="margin-left: 30px;">最后回复： {{ i.lastPostedUser.username }} </span>
                <span style="margin-left: 30px;">更新时间： {{ dateFormats(i.firstPost.updatedAt)}}</span>
              </div>
            </div>
            <div style="margin-top: 5px;margin-bottom: 5px;">
              {{ i.title }}
            </div>
            <div style="border-top: 1px solid darkgrey;" v-html="i.firstPost.contentHtml">
            </div>
          </template>
          <template v-else>
            <div style="border-bottom: 1px solid darkgrey;">
              {{i.user.username}} 回复主题  {{ i.thread.title }}
              <div style="float: right;">
                <span style="margin-right: 15px;">IP: {{ i.ip }}</span>
                更新时间： {{ dateFormats(i.updatedAt) }}
              </div>
            </div>
            <div style="border-bottom: 1px solid darkgrey;margin-top: 20px;">
              {{i.summaryText}}
            </div>
          </template>

          <div style="border-top: 1px solid darkgrey;">
            <el-button type="text" @click="updateCont(i, 1)">通过</el-button>
            <el-popover
                placement="top"
                width="160"
                v-model="i.visible">
              <p>确定删除 {{ i.title }} 吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="i.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="updateCont(i, 2)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" style="margin-left: 15px;">删除</el-button>
            </el-popover>
            <el-button type="text" v-if="isApproved != 2" style="margin-left: 15px;" @click="updateCont(i, 3)">忽略</el-button>
            <span style="margin-left: 30px;">
              操作理由：
              <el-input v-model="i.messages" style="width: 200px;" size="mini"/>
              <el-select v-model="i.selectMessage" size="mini" @change="(val) => {updateMsg(val, k)}">
                <el-option v-for="item in reasonForOperation" :key="item.value"
                  :label="item.label" :value="item.value"/>
              </el-select>
            </span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</el-card>
</template>

<script>
import {
  deleteThreads,
  queryCategories,
  queryListPosts,
  queryListThreads, updateListPosts,
  updateListThreads,
  updatePosts
} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {getLocal} from "@/util/store";
import {dateFormat} from "@/util/date";

export default {
  name: "contReview",
  data(){
    return {
      type: 0,
      search: {
        'filter[isApproved]': '0',
        'filter[page]': 10,
        'filter[isDeleted]': 'no',
        'filter[highlight]': false,
        'sort': '-createdAt',
        include: 'user,firstPost,lastPostedUser,category,firstPost.images,firstPost.attachments,threadVideo',
      },
      categoryList: [],
      height: getLocal('height') - 100 + 'px',
      data: [],
      reasonForOperation:[
        {
          value:'广告/SPAM',
          label:'广告/SPAM'
        },
        {
          value:'恶意灌水',
          label:'恶意灌水'
        },
        {
          value:'违规内容',
          label:'违规内容'
        },
        {
          value:'文不对题',
          label:'文不对题'
        },
        {
          value:'重复发帖',
          label:'重复发帖'
        },
        {
          value:'我很赞同',
          label:'我很赞同'
        },
        {
          value:'精品文章',
          label:'精品文章'
        },
        {
          value:'原创内容',
          label:'原创内容'
        },
        {
          value:'其他',
          label:'其他'
        }
      ],
      isApproved: '0',
      loading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  created() {
    queryCategories().then(res => {
      this.categoryList = dataFormatter(res)
    })
    this.init()
  },
  methods: {
    init(){
      this.data = []
      this.loading = true
      this.search['filter[highlight]'] = this.search['filter[highlight]'] ? 'yes':'no'
      if (this.type === 0){
        let time = this.search['filter[time]']
        if (time){
          let date = new Date()
          date.setDate(date.getDate() - 7);
          this.search['filter[createdAtBegin]'] = dateFormat(date)
          this.search['filter[createdAtEnd]'] = dateFormat(new Date())
        }
        this.search.include = 'user,firstPost,lastPostedUser,category,firstPost.images,firstPost.attachments,threadVideo'
        queryListThreads(this.search).then(res => {
          this.data = dataFormatter(res)
          this.isApproved = this.search['filter[isApproved]']
          this.loading = false
        })
      } else {
        this.search.include = 'user,thread,thread.category,thread.firstPost,images'
        let time = this.search['filter[time]']
        if (time){
          this.search['filter[createdAtBegin]'] = dateFormat(time[0])
          this.search['filter[createdAtEnd]'] = dateFormat(time[1])
        }
        queryListPosts(this.search).then(res => {
          this.data = dataFormatter(res)
          this.isApproved = this.search['filter[isApproved]']
          this.loading = false
        })
      }
    },
    dateFormats(val){
      return dateFormat(new Date(val))
    },
    updateMsg(val, k){
      this.$set(this.data[k], 'messages', val)
    },
    updateCont(i, type) {
      i.visible = false
      if (this.type === 0) {
        deleteThreads({
          id: i.id,
          data: {
            attributes: {
              isDeleted: type === 2,
              isApproved: type === 1 ? '1': type === 3 ? '2' : null,
              message: i.messages
            },
            relationships: {
              category: {
                data: {
                  type: "categories",
                  id: i.category.id
                }
              }
            },
            type: "threads",
          }
        }).then(() => {
          this.init()
        })
      } else {
        updatePosts({
          id: i.id,
          data: {
            attributes: {
              isDeleted: type === 2,
              isApproved: type === 1 ? '1': type === 3 ? '2' : null,
              message: i.messages
            },
            type: "posts",
          }
        }).then(() => {
          this.init()
        })
      }
    },
    updateList(){
      let data = []
      this.loading = true
      for (let i = 0; i < this.data.length; i++) {
        const val = this.data[i]
        data.push({
          attributes: {
            isApproved: val.radio === 0 ? '1':val.radio === 2 ? '2': null,
            isDeleted: val.radio === 1,
            message: val.messages
          },
          id: val.id,
          relationships: this.type === 0 ? {category: {data: {type: "categories", id: val.category.id}}} : null,
          type: this.type === 0 ? "threads" : 'posts',
        })
      }
      if (this.type === 0) {
        updateListThreads({
          data: data
        }).then(() => {
          this.init()
        })
      } else {
        updateListPosts({
          data: data
        }).then(() => {
          this.init()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
