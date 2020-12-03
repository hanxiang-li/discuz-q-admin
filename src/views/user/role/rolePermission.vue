<template>
  <el-row>
  <label>
    角色名称：<el-tag>{{ data.name || '未选中' }}</el-tag>
    <el-button size="small" type="success" style="margin-left: 5px;" @click="save">
      提交修改
    </el-button>
  </label>
  <br/>
  <avue-crud ref="crud" :data="permissionData" :option="permissionOption" @selection-change="selectionChange">
    <template slot="range" slot-scope="{row}">
      <div v-if="row.id >= 14 && row.id <= 23 || row.id >= 28" style="float: left;">
        <el-select
            v-model="selectList[row.model]"
            multiple
            collapse-tags
            :disabled="data.id == 7 && (row.id <= 16 || row.id > 23)"
            placeholder="请选择">
          <el-option
              v-for="item in categoriesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-tag style="float: left;">{{row.range}}</el-tag>
    </template>
  </avue-crud>
</el-row>
</template>

<script>
import {getLocal} from "@/util/store";
import {queryCategories} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {errorMsg} from "@/util/msg";

export default {
  name: "rolePermission",
  props: {
    data: {
      type: Object
    },
    siteData: {
      type: Object
    },
  },
  data(){
    return {
      permissionData: [
        {
          id: '1',
          name: '发布文字',
          range: '允许发布文字帖',
          value: 'createThread.0',
        },
        {
          id: '2',
          name: '发布帖子',
          range: '允许发布帖子',
          value: 'createThread.1',
        },
        {
          id: '3',
          name: '发布视频',
          range: '允许发布视频帖，需先开启腾讯云-云点播服务',
          value: 'createThread.2',
        },
        {
          id: '4',
          name: '发布图片帖',
          range: '允许发布图片帖',
          value: 'createThread.3',
        },
        {
          id: '5',
          name: '发布语音',
          range: '允许发布语音帖，需先开启腾讯云-云点播服务',
          value: 'createThread.4',
        },
        {
          id: '6',
          name: '发布问答',
          range: '允许发布问答，只有在开启微信支付且允许发布付费内容时才能设置提问价格',
          value: 'createThread.5',
        },
        {
          id: '7',
          name: '发布商品',
          range: '允许发布商品帖',
          value: 'createThread.6',
        },
        {
          id: '8',
          name: '发布私信',
          range: '允许发布私信',
          value: 'dialog.create',
        },
        {
          id: '9',
          name: '允许被提问',
          range: '允许成为发布问答时的提问对象',
          value: 'canBeAsked',
        },
        {
          id: '10',
          name: '设置围观',
          range: '允许在发布问答时设置围观，需先在全局设置里配置问答围观价格',
          value: 'canBeAsked',
        },
        {
          id: '11',
          name: '上传附件',
          range: '发布主题时上传附件的权限',
          value: 'attachment.create.0',
        },
        {
          id: '12',
          name: '上传图片',
          range: '发布主题时上传图片的权限',
          value: 'attachment.create.1',
        },
        {
          id: '13',
          name: '发布付费内容',
          range: '允许发布付费内容、付费附件',
          value: 'createThreadPaid',
        },
        {
          id: '14',
          name: '发布主题',
          range: '允许在内容分类发布主题的权限',
          value: 'switch.createThread',
          model: 'createThread',
        },
        {
          id: '15',
          name: '回复主题',
          range: '允许在内容分类回复主题的权限',
          value: 'switch.thread.reply',
          model: 'thread.reply',
        },
        {
          id: '16',
          name: '允许被打赏',
          range: '内容分类下内容允许被打赏的权限',
          value: 'switch.thread.canBeReward',
          model: 'thread.canBeReward',
        },
        {
          id: '17',
          name: '查看主题列表',
          range: '查看内容分类主题列表的权限',
          value: 'switch.viewThreads',
          model: 'viewThreads',
        },
        {
          id: '18',
          name: '查看主题详情',
          range: '查看内容分类主题详情的权限',
          value: 'switch.thread.viewPosts',
          model: 'thread.viewPosts',
        },
        {
          id: '19',
          name: '免费查看付费帖子',
          range: '查看内容分类主题详情的权限',
          value: 'switch.thread.freeViewPosts.1',
          model: 'thread.freeViewPosts.1',
        },
        {
          id: '20',
          name: '免费查看付费视频',
          range: '免费查看内容分类下的付费视频',
          value: 'switch.thread.freeViewPosts.2',
          model: 'thread.freeViewPosts.2',
        },
        {
          id: '21',
          name: '免费查看付费图片',
          range: '免费查看内容分类下的付费图片',
          value: 'switch.thread.freeViewPosts.3',
          model: 'thread.freeViewPosts.3',
        },
        {
          id: '22',
          name: '免费查看付费语音',
          range: '免费查看内容分类下的付费语音',
          value: 'switch.thread.freeViewPosts.4',
          model: 'thread.freeViewPosts.4',
        },
        {
          id: '23',
          name: '免费查看付费问答',
          range: '免费查看内容分类下的付费问答',
          value: 'switch.thread.freeViewPosts.5',
          model: 'thread.freeViewPosts.5',
        },
        {
          id: '24',
          name: '置顶',
          range: '前台置顶、取消置顶主题的权限',
          value: 'thread.sticky',
        },
        {
          id: '25',
          name: '邀请加入',
          range: '前台站点管理中按用户组邀请成员的权限',
          value: 'thread.sticky',
        },
        {
          id: '26',
          name: '编辑用户组',
          range: '前台更改成员所属用户组的权限',
          value: 'user.edit.group',
        },
        {
          id: '27',
          name: '编辑用户状态',
          range: '前台更改成员禁用状态的权限',
          value: 'user.edit.status',
        },
        {
          id: '28',
          name: '加精',
          range: '前台精华、取消精华主题的权限',
          value: 'switch.thread.essence',
          model: 'thread.essence',
        },
        {
          id: '29',
          name: '编辑主题',
          range: '前台单个主题的编辑权限',
          value: 'switch.thread.edit',
          model: 'thread.edit',
        },
        {
          id: '30',
          name: '删除主题',
          range: '前台删除单个主题的权限',
          value: 'switch.thread.hide',
          model: 'thread.hide',
        },
        {
          id: '31',
          name: '编辑回复',
          range: '前台删除单个主题的权限',
          value: 'switch.thread.editPosts',
          model: 'thread.editPosts',
        },
        {
          id: '32',
          name: '删除回复',
          range: '前台删除单个回复的权限',
          value: 'switch.thread.hidePosts',
          model: 'thread.hidePosts',
        },
        {
          id: '33',
          name: '编辑自己的主题或回复',
          range: '作者编辑自己的主题或回复的权限',
          value: 'switch.thread.editOwnThreadOrPost',
          model: 'thread.editOwnThreadOrPost',
        },
        {
          id: '34',
          name: '删除自己的主题或回复',
          range: '作者删除自己的主题或回复的权限',
          value: 'switch.thread.hideOwnThreadOrPost',
          model: 'thread.hideOwnThreadOrPost',
        },
      ],
      permissionOption: {
        tip: false,
        page: false,
        header: false,
        menu: false,
        height: getLocal('height') - 100 ,
        selection: true,
        selectable:(row)=>{
          const roleId = this.data.id
          if (roleId == 7){
            return row.id > 16 && row.id <= 23;
          } else {
            const select = ['3', '5']
            if (select.includes(row.id)){
              return this.siteData.qcloud.qcloud_vod
            }
          }
          return true
        },
        column:[
          {
            label:'id',
            prop:'id',
            hide: true,
          },
          {
            label:'权限名称',
            prop:'name',
            width: 200,
          },
          {
            label:'生效范围',
            prop:'range',
            slot:true,
          }
        ]
      },
      categoriesList: [],
      selectList: {
        'viewThreads': [],
        'createThread':[],
        'thread.reply':[],
        'thread.edit':[],
        'thread.hide':[],
        'thread.essence':[],
        'thread.viewPosts':[],
        'thread.editPosts':[],
        'thread.hidePosts':[],
        'thread.canBeReward': [],
        'thread.editOwnThreadOrPost': [],
        'thread.hideOwnThreadOrPost': [],
        'thread.freeViewPosts.1':[],
        'thread.freeViewPosts.2':[],
        'thread.freeViewPosts.3':[],
        'thread.freeViewPosts.4':[],
        'thread.freeViewPosts.5':[],
      },
      selection: [],
    }
  },
  created() {
    this.init()
  },
  watch:{
    data(val){
      this.$refs.crud.toggleSelection(null)
      Object.assign(this.$data.selectList, this.$options.data().selectList)
      this.setSelectValue(val.permission)
    }
  },
  methods: {
    init(){
      queryCategories().then(res => {
        const that = this
        this.categoriesList = [{ id: "", name: "全局" }]
        const data = dataFormatter(res)
        data.forEach(i => {
          that.categoriesList.push({
            id: i.id,
            name: i.name
          })
        })
      })
    },
    setSelectValue(data) {
      const that = this
      const checkedData = data;
      const selectList = this.selectList;
      const selectItem = [
        'viewThreads',
        'createThread',
        'thread.reply',
        'thread.edit',
        'thread.hide',
        'thread.essence',
        'thread.viewPosts',
        'thread.editPosts',
        'thread.hidePosts',
        'thread.canBeReward',
        'thread.editOwnThreadOrPost',
        'thread.hideOwnThreadOrPost',
        'thread.freeViewPosts.1',
        'thread.freeViewPosts.2',
        'thread.freeViewPosts.3',
        'thread.freeViewPosts.4',
        'thread.freeViewPosts.5',
      ];
      const checked = []
      for (let i = 0; i < checkedData.length; i++) {
        const value = checkedData[i].permission
        // 全局的回显
        if (selectItem.indexOf(value) !== -1) {
          selectList[value].push("");
        }
        // 分类的回显
        if (value.indexOf("category") !== -1) {
          const splitIndex = value.indexOf(".");
          const obj = value.substring(splitIndex + 1);
          const id = value.substring(8, splitIndex);
          if (selectList[obj] && checkedData.indexOf(obj) === -1) {
            selectList[obj].push(id);
          }
          if (checkedData.indexOf(obj) !== -1) {
            checkedData.splice(i, 1);
          }
        }
        for (let j = 0; j < that.permissionData.length; j++) {
          if (that.permissionData[j].value === value){
            checked.push(that.permissionData[j])
          }
        }
      }
      this.selectList = selectList;
      this.$refs.crud.toggleSelection(checked);
    },
    selectionChange(list){
      this.selection = list
    },
    save(){
      for (let i = 0; i < this.selection.length; i++) {
        const val = this.selection[i]
        if (val.model){
          if (this.selectList[val.model].length === 0){
            errorMsg('请选择 ' + val.name + ' 的权限范围' )
            return false
          }
        }
      }
      let permissions = []
      for (let i = 0; i < this.selection.length; i++) {
        permissions.push(this.selection[i].value)
      }

      for (const selectKey in this.selectList) {
        const data = this.selectList[selectKey]
        if (data.length > 0){
          console.log(data)
        }
      }
      console.log(permissions)
    }
  }
}
</script>

<style scoped>

</style>
