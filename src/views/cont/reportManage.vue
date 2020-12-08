<template>
  <basic-container v-loading="loading">
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item label="举报人">
        <el-input v-model="form['filter[username]']"/>
      </el-form-item>
      <el-form-item label="举报类型">
        <el-select v-model="form['filter[type]']" placeholder="请选择">
          <el-option label="主题" value="1"/>
          <el-option label="评论/回复" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="举报时间范围">
        <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="form['filter[status]']" @change="init">
          <el-radio label="0">最新举报</el-radio>
          <el-radio label="1">已处理</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <template v-if="form['filter[status]'] == 0">
          <el-button type="primary" size="mini" @click="allUpdate(1)">批量操作</el-button>
          <el-button type="warning" size="mini" @click="allUpdate(2)">全部标记已处理</el-button>
        </template>
        <el-button type="danger" size="mini" @click="allUpdate(3)">全部删除</el-button>
      </div>
      <div :style="{'max-height': height,'overflow-y': 'auto'}">
        <table class="tg">
          <thead v-for="(i, k)  in data" :key="k">
          <tr>
            <th class="tg-2gew" rowspan="3">
              <el-radio-group v-model="i.radio" v-if="form['filter[status]'] == 0">
                <el-radio :label="1" class="radio" >删除</el-radio>
                <el-radio :label="2" class="radio" style="float: left;">已处理</el-radio>
              </el-radio-group>
              <el-checkbox v-model="i.checked" v-else />
            </th>
            <th class="tg-y698" colspan="3">
              <div style="margin: 8px;">
                {{ i.user.username }}
                <span style="color: silver;">创建于</span>
                {{ dateFormats(i.created_at) }}
                <div style="float: right;color: silver;">
                  类型：{{ i.type === 1 ? '主题':'评论/回复' }}
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <td class="tg-u4qj" colspan="3">
              <div style="margin: 8px;">
                <div>
                  页面地址：
                  <a :href="'../../topic/index?id=' + i.thread_id" target="_blank">
                    点我前往
                  </a>
                </div>
                <div style="margin-top: 10px;">
                  举报时间：
                  {{ dateFormats(i.created_at) }}
                </div>
                <div style="margin-top: 10px;">
                  举报理由：{{ i.reason }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tg-u4qj" colspan="3">
              <div style="margin-left: 8px;">
                <el-button type="text" @click="update(i, 1)">删除</el-button>
                <el-button type="text" @click="update(i, 2)" v-if="form['filter[status]'] == 0">标记已处理</el-button>
              </div>
            </td>
          </tr>
          </thead>
          <div v-if="data.length === 0" style="text-align: center;">
            暂时没有数据
          </div>
        </table>
      </div>
    </el-card>
  </basic-container>
</template>

<script>
import {getLocal} from "@/util/store";
import {reportsList, updateReports} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {dateFormat} from "@/util/date";
import {errorMsg} from "@/util/msg";

export default {
  name: "reportManage",
  data(){
    return {
      form: {
        'filter[status]': '0',
      },
      data: [],
      height: getLocal('height') - 120 + 'px',
      loading: true,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      reportsList(this.form).then(res => {
        this.data = dataFormatter(res)
        this.loading = false
      })
    },
    dateFormats(val){
      return dateFormat(new Date(val))
    },
    update(i, type){
      let data = []
      if (type === 1){
        data = {
          id: i.id,
          type: 'del'
        }
      } else {
        data = {
          data: [{
            attributes: {status: 1},
            id: i.id,
            type: "report",
          }]
        }
      }
      updateReports(data).then(() => {
        this.init()
      })
    },
    allUpdate(val){
      let data = null
      switch (val){
        case 1:
          for (let i = 0; i < this.data.length; i++) {
            const val = this.data[i]
            if (val.radio){
              if (val.radio === 1){
                updateReports({id: val.id, type: 'del'})
              } else if (val.radio === 2) {
                if (!data){
                  data = {data: []}
                }
                data.data.push({
                  attributes: {status: 1},
                  id: val.id,
                  type: "report",
                })
              }
            }
          }
          break;
        case 2:
          data = {data: []}
          for (let i = 0; i < this.data.length; i++) {
            data.data.push({
              attributes: {status: 1},
              id: this.data[i].id,
              type: "report",
            })
          }
          break;
        case 3:
          let ids = ''
          for (let i = 0; i < this.data.length; i++) {
            const val = this.data[i]
            if (this.form['filter[status]'] == 0){
              ids += val.id + ','
            } else {
              if (val.checked){
                ids += val.id + ','
              }
            }
          }
          if (!ids){
            errorMsg('请选择一条数据')
            return false
          }
          ids = ids.substring(0, ids.length - 1)
          data = {
            type: 'del',
            id: ids
          }
          break;
      }
      if (data)
      updateReports(data).then(() => {
        this.init()
      })
    }
  }
}
</script>

<style scoped>
.radio{
  margin-top: 15px;
}
.tg  {border-collapse:collapse;border-color:#bbb;border-spacing:0;width: 100%;}
.tg td{background-color:#E0FFEB;border-color:#bbb;border-style:solid;border-width:0px;color:#594F4F;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#9DE0AD;border-color:#bbb;border-style:solid;border-width:0px;color:#493F3F;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-2gew{background-color:#ffffff;border-color:inherit;font-size:16px;text-align:center;vertical-align:top;width:60px;
  border-right: 1px solid #c0c0c0;border-top: 1px solid #c0c0c0;}
.tg .tg-y698{background-color:#ffffff;border-color:inherit;text-align:left;vertical-align:top;border-top: 1px solid #c0c0c0;}
.tg .tg-u4qj{background-color:#ffffff;text-align:left;vertical-align:top;border-top: 1px solid #c0c0c0;}
</style>

