<template>
  <basic-container>
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item label="作者">
        <el-input v-model="form['filter[username]']"/>
      </el-form-item>
      <el-form-item label="话题">
        <el-input v-model="form['filter[content]']"/>
      </el-form-item>
      <el-form-item label="主题数介于">
        <el-input-number v-model="form['filter[threadCountBegin]']" style="width: 100px;"
                         controls-position="right" :min="1" /> -
        <el-input-number v-model="form['filter[threadCountEnd]']" style="width: 100px;"
                         controls-position="right" :min="1" />
      </el-form-item>
      <el-form-item label="热度介于">
        <el-input-number v-model="form['filter[viewCountBegin]']" style="width: 100px;"
                         controls-position="right" :min="1" /> -
        <el-input-number v-model="form['filter[viewCountEnd]']" style="width: 100px;"
                         controls-position="right" :min="1" />
      </el-form-item>
      <el-form-item label="推荐">
        <el-select v-model="form['filter[recommended]']" placeholder="请选择">
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init">搜索</el-button>
        <el-button type="warning" @click="init(true)">清空</el-button>
        <el-button type="primary" @click="allUpdate(0)">批量操作</el-button>
        <el-button type="success" @click="allUpdate(1)">全部推荐</el-button>
        <el-button type="warning" @click="allUpdate(2)">全部取消推荐</el-button>
        <el-button type="danger" @click="allUpdate(3)">全部删除</el-button>
      </el-form-item>
    </el-form>
    <div :style="{'max-height': height,'overflow-y': 'auto'}">
      <table class="tg">
        <thead v-for="(i, k)  in data" :key="k">
          <tr>
            <th class="tg-2gew" rowspan="3">
              <el-radio-group v-model="i.radio">
                <el-radio :label="1" class="radio">推荐</el-radio>
                <el-radio :label="2" class="radio">取消</el-radio>
                <el-radio :label="3" class="radio" style="float: left;">删除</el-radio>
              </el-radio-group>
            </th>
            <th class="tg-y698" colspan="3">
              <div style="margin: 8px;">
                {{ i.user.username }}
                <span style="color: silver;">创建于</span>
                {{ dateFormats(i.created_at) }}
                <div style="float: right;color: silver;">
                  主题数：{{ i.thread_count }}
                  热度数：{{ i.view_count }}
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <td class="tg-u4qj" colspan="3">
              <div style="margin: 8px;">
                #{{ i.content }}#
              </div>
            </td>
          </tr>
          <tr>
            <td class="tg-u4qj" colspan="3">
              <div style="margin-left: 8px;">
                <el-button type="text" @click="updateTopics(i, 1)">{{ i.recommended === 1 ? '取消推荐' : '推荐' }}</el-button>
                <el-button type="text" @click="updateTopics(i, 2)">删除</el-button>
              </div>
            </td>
          </tr>
        </thead>
        <div v-if="data.length === 0" style="text-align: center;">
           暂时没有数据
        </div>
      </table>
    </div>
  </basic-container>
</template>

<script>
import {topicsList, updateTopics} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {dateFormat} from "@/util/date";
import {getLocal} from "@/util/store";
import {errorMsg, okMsg} from "@/util/msg";

export default {
  name: "topics",
  data(){
    return {
      form: {
        include: 'user',
        sort: '-createdAt',
      },
      data: [],
      height: getLocal('height') - 100 + 'px',
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(val){
      if (val === true){
        Object.assign(this.$data, this.$options.data())
      }
      if (this.form.time){
        this.form['filter[createdAtBegin]'] = dateFormat(this.form.time[0])
        this.form['filter[createdAtEnd]'] = dateFormat(this.form.time[1])
      }
      topicsList(this.form).then(res => {
        this.data = dataFormatter(res)
      })
    },
    dateFormats(val){
      return dateFormat(new Date(val))
    },
    updateTopics(val, type){
      if (type === 1){
        updateTopics({
          id: val.id,
          data: {
            attributes: {
              recommended: val.recommended === 1 ? '0' : '1',
            },
            type: "topics"
          }
        }).then(() => {
          this.init()
        })
      } else {
        updateTopics({id: val.id,type: 'del'}).then(() => {
          this.init()
        })
      }
    },
    allUpdate(val){
      let ids = ''
      if (val !== 0){
        for (let i = 0; i < this.data.length; i++) {
          ids += this.data[i].id + ','
        }
        ids = ids.substring(0, ids.length - 1)
      }
      let data = null
      switch (val){
        case 0:
          data = []
          for (let i = 0; i < this.data.length; i++) {
            const val = this.data[i]
            if (val.radio){
              switch (val.radio){
                case 1:
                  data.push({
                    id: 'batch/' + val.id,
                    data: {
                      attributes: {recommended: 1},
                      ids: val.id,
                      type: "topics",
                    }
                  })
                  break;
                case 2:
                  data.push({
                    id: 'batch/' + val.id,
                    data: {
                      attributes: {recommended: 0},
                      ids: val.id,
                      type: "topics",
                    }
                  })
                  break;
                case 3:
                  data.push({
                    id: 'batch/' + val.id,
                    type: 'del',
                  })
                  break;
              }
            }
          }
          break;
        case 1:
          data = {
            id: 'batch/' + ids,
            data: {
              attributes: {recommended: 1},
              ids: ids,
              type: "topics",
            }
          }
          break;
        case 2:
          data = {
            id: 'batch/' + ids,
            data: {
              attributes: {recommended: 0},
              ids: ids,
              type: "topics",
            }
          }
          break;
        case 3:
          data = {
            id: 'batch/' + ids,
            type: 'del',
            data: {
              attributes: {recommended: 0},
              ids: ids,
              type: "topics",
            }
          }
          break;
      }
      if (data instanceof Array){
        if (data.length === 0){
          errorMsg('请选择一条数据')
          return false
        }
        data.forEach((i,k) => {
          updateTopics(i).then(() => {
            if (k+1 === data.length){
              okMsg()
              this.init()
            }
          })
        })
      } else {
        updateTopics(data).then(() => {
          okMsg()
          this.init()
        })
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
