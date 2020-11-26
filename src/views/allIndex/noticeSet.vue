<template>
<el-card class="box-card" :table-loading="loading">
  <avue-crud :data="dataList" :option="option" @refresh-change="init" v-if="isShow" @row-update="rowUpdate">
    <template slot-scope="{type, size, row}" slot="menu">
      <el-button :size="size" :type="type" @click="updateStatus(row)">
        {{ row.status === 1 ? '关闭' : '开启'}}
      </el-button>
    </template>
    <template slot="menuLeft">
      <el-button type="primary" size="small" @click="updateType(0)">系统通知</el-button>
      <el-button type="primary" size="small" @click="updateType(1)">微信通知</el-button>
    </template>
    <template slot-scope="{value}" slot="tipsForm">
      <div v-html="value"></div>
    </template>
  </avue-crud>
</el-card>
</template>

<script>
import {queryNotice, updateNotice} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import {getLocal} from "@/util/store";
import {okMsg} from "@/util/msg";

export default {
  name: "noticeSet",
  data(){
    return {
      loading: false,
      activeName: '0',
      dataList: [],
      isShow: true,
      option: {
        delBtn: false,
        addBtn: false,
        page:false,
        align:'center',
        menuWidth: 150,
        menuAlign:'center',
        dialogWidth: '30%',
        height: getLocal('height'),
        column:[
          {
            label: '类型名称',
            prop: 'type_name',
            editDisplay: false,
          },
          {
            label: '通知标题',
            prop: 'title',
            span: 24,
            editDisabled: true,
          },
          {
            label: '通知内容',
            prop: 'content',
            type: 'textarea',
            hide: true,
            span: 24,
          },
          {
            label: '模板ID',
            prop: 'template_id',
            editDisplay: false,
            hide: true,
            span: 24,
          },
          {
            label: '提示',
            prop: 'tips',
            formslot:true,
            hide: true,
            span: 24,
            value: '系统统发送的信息内容，标题内容均支持变量替换<br/>可以使用如下变量:<br/>' +
                '{username}：用户名<br/>' +
                '{groupname} ：所属用户组<br/>' +
                '{time}：发送时间<br/>' +
                '{sitename}：网站名称（显示在页面底部的联系方式名称）<br/>' +
                '{content}：内容<br/>' +
                '{reason}：原因'
          },
          {
            label: '状态',
            prop: 'status',
            dicData: [
              {
                label: '开启',
                value: 1
              },
              {
                label: '关闭',
                value: 0
              },
            ],
            editDisplay: false,
          },
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      queryNotice({type: this.activeName}).then(res => {
        this.dataList = dataFormatter(res)
        if (this.activeName === 1){
          for (let i = 0; i < this.dataList.length; i++) {
            const {content, vars} = this.dataList[i]
            let data = JSON.parse(content).data
            let keyword = '{{first.DATA}}<br/>'
            for (const key in data) {
              if (key !== 'first' && key !== 'remark'){
                keyword += `${vars[data[key].value]}: {{${key}.DATA}}<br/>`
              }
            }
            this.dataList[i].tips = keyword + '{{remark.DATA}}<br/>'
          }
        }
        this.loading = false
        this.isShow = true
      })
    },
    updateType(val){
      this.isShow = false
      this.activeName = val
      if (val === 0){
        this.option.column[3] = {
          label: '模板ID',
          prop: 'template_id',
          editDisplay: false,
          hide: true,
          span: 24,
        }
        this.option.column[2].editDisplay = true
      } else {
        this.option.column[3] = {
          label: '模板ID',
          prop: 'template_id',
          span: 24,
        }
        this.option.column[2].editDisplay = false

      }
      this.init()
    },
    rowUpdate(row, index, done, loading){
      updateNotice({
        id: row.id,
        data: {
          attributes: {
            template_id: row.template_id,
            content: row.content,
            title: row.title
          }
        }
      }).then(() => {
        this.init()
        okMsg()
        loading()
        done()
      })
    },
    updateStatus(row){
      this.loading = true
      updateNotice({
        id: row.id,
        data: {
          attributes: {
            status: row.status === 1 ? 0:1,
          }
        }
      }).then(() => {
        this.init()
        okMsg()
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
