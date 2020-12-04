<template>
  <el-row v-loading="loading">
  <label>
    角色名称：<el-tag>{{ data.name || '未选中' }}</el-tag>
    <el-tag style="margin-left: 5px;">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="radio !== 1">
        {{selectText}}
      </el-checkbox>
    </el-tag>
    <el-radio-group v-model="radio" size="small" style="margin-left: 5px;">
      <el-radio-button :label="1">操作权限</el-radio-button>
      <el-radio-button :label="2" :disabled="data.id === '7' || data.id === '10'">价格设置</el-radio-button>
      <el-radio-button :label="3" :disabled="data.id === '7'">其他设置</el-radio-button>
    </el-radio-group>
    <el-button size="small" type="success" style="margin-left: 5px;" @click="save">
      提交修改
    </el-button>
  </label>
  <br/>
  <!-- 权限设置 -->
  <el-checkbox-group v-show="radio === 1" v-model="checked">
    <avue-crud ref="crud" :data="permissionData" :option="permissionOption">
      <template slot="checked" slot-scope="{row}">
        <el-checkbox
        :label="row.value"
        @change="changeChecked($event,row.value)"
        :disabled="(data.id === '7' && !(row.id > 16 && row.id <= 23)) ||
          ((row.id === '3' || row.id === '5') && !siteData.qcloud.qcloud_vod) ||
          (row.id === '35' && !siteData.qcloud.qcloud_captcha) ||
          (row.id === '36' && !siteData.qcloud.qcloud_faceid) ||
          (row.id === '37' && !siteData.qcloud.qcloud_sms)">
          {{row.name}}
        </el-checkbox>
      </template>
      <template slot="range" slot-scope="{row}">
        <div v-if="row.id >= 14 && row.id <= 23 || row.id >= 28 && row.id < 35" style="float: left;">
          <el-select
              v-model="selectList[row.model]"
              multiple
              collapse-tags
              @remove-tag="clearItem($event, row.model)"
              :disabled="(data.id === '7' && !(row.id > 16 && row.id <= 23)) || (checked.indexOf(row.value) === -1)"
              placeholder="请选择">
            <el-option
                v-for="item in categoriesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="changeCategory(row.model, item.id)" />
          </el-select>
        </div>
        <el-tag style="float: left;">{{row.range}}</el-tag>
      </template>
    </avue-crud>
  </el-checkbox-group>
  <!-- 价格设置 -->
  <div v-show="radio === 2">
    <div style="margin-top: 5px;">
      <label>是否允许购买：</label>
      <el-switch v-model="data.isPaid" active-color="#13ce66" inactive-color="#ff4949"/>
      <br/><br/>
      <div v-if="data.isPaid">
        <label>购买价格：</label>
        <el-input-number v-model="data.fee" size="small" :min="1" :max="9999"/>
        <br/><br/>
        <label>有效天数：</label>
        <el-input-number v-model="data.days" size="small" :min="1" :max="365"/>
      </div>
    </div>
  </div>
  <!-- 其他设置 -->
  <div v-show="radio === 3">
    <div style="margin-top: 5px;">
      <label>裂变推广：</label>
      <br/><br/>
      <el-checkbox v-model="data.is_subordinate">裂变推广</el-checkbox>
      <el-checkbox v-model="data.is_commission">提成比例</el-checkbox>
      <br/>
      * 允许用户裂变推广以及通过推广注册进来的用户收入是否能分成
      <br/><br/>
      <div v-if="data.is_subordinate || data.is_commission">
        <label>提成比例：</label>
        <el-input-number size="small" v-model="data.scale" :min="1" :max="10"/>
        <br/>
        * 站点开启付费模式时下线付费加入、主题被打赏、被付费等的分成比例设置，填1表示10%，不填或为0时为不分成
      </div>
    </div>
  </div>
</el-row>
</template>

<script>
import {getLocal} from "@/util/store";
import {queryCategories} from "@/api/cont";
import {dataFormatter} from "@/util/tools";
import {errorMsg, okMsg} from "@/util/msg";
import {deepClone} from "@/util/util";
import {updateUserOneGroups, updateUserRolePermission} from "@/api/role";

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
      checked: [],
      checkAll: false,
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
      categoriesList: [],
      isIndeterminate: false,
      checkAllPermission: [],
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
        {
          id: '35',
          name: '发布内容时启用验证码',
          range: '启用验证码需先在腾讯云设置中开启验证码服务',
          value: 'createThreadWithCaptcha',
        },
        {
          id: '36',
          name: '发布内容需先实名认证',
          range: '实名认证后才可发布内容',
          value: 'publishNeedRealName',
        },
        {
          id: '38',
          name: '发布内容需先绑定手机',
          range: '绑定手机后才可发布内容',
          value: 'publishNeedBindPhone',
        },
      ],
      permissionOption: {
        tip: false,
        page: false,
        header: false,
        menu: false,
        height: getLocal('height') - 100 ,
        column:[
          {
            label:'id',
            prop:'id',
            hide: true,
          },
          {
            label:'选择权限',
            prop:'checked',
            width: 200,
            slot: true,
          },
          {
            label:'权限名称',
            prop:'name',
            hide: true,
          },
          {
            label:'生效范围',
            prop:'range',
            slot:true,
          }
        ]
      },
      selectText: '全选',
      radio: 1,
      loading: false,
    }
  },
  created() {
    this.init()
  },
  watch:{
    data(val){
      if (val.permission) {
        const categoriesList = deepClone(this.categoriesList)
        Object.assign(this.$data, this.$options.data())
        this.categoriesList = categoriesList
        for (let i = 0; i < val.permission.length; i++) {
          this.checked.push(val.permission[i].permission);
        }
        if (this.checked.length > 0) {
          this.isIndeterminate = true
        }
        this.setSelectValue(this.checked);
        if (this.data.id === '7') {
          this.checkAllPermission = [
            "switch.viewThreads", //查看主题列表
            "switch.thread.viewPosts", //查看主题详情
            "switch.thread.freeViewPosts.1", //免费查看付费帖子
            "switch.thread.freeViewPosts.2", //免费查看付费视频
            "switch.thread.freeViewPosts.3", //免费查看付费图片
            "switch.thread.freeViewPosts.4", //免费查看付费语音
            "switch.thread.freeViewPosts.5", //免费查看付费问答
          ];
        } else {
          this.checkAllPermission = [
            "createThread.0", //发布文字帖
            "createThread.1", //发布帖子
            "createThread.2", //发布视频帖
            "createThread.3", //发布图片帖
            "createThread.4", //发布语音帖
            "createThread.5", //发布问答
            "createThread.6", //发布商品帖
            "dialog.create", //发布私信
            "canBeAsked", //允许被提问
            "canBeOnlooker", //设置围观
            "attachment.create.0", //上传附件
            "attachment.create.1", //上传图片
            "createThreadPaid", //发布付费内容
            "switch.createThread", //发布主题
            "switch.thread.reply", //回复主题
            "switch.thread.canBeReward", //允许被打赏
            "switch.viewThreads", //查看主题列表
            "switch.thread.viewPosts", //查看主题详情
            "switch.thread.freeViewPosts.1", //免费查看付费帖子
            "switch.thread.freeViewPosts.2", //免费查看付费视频
            "switch.thread.freeViewPosts.3", //免费查看付费图片
            "switch.thread.freeViewPosts.4", //免费查看付费语音
            "switch.thread.freeViewPosts.5", //免费查看付费问答
            "thread.sticky", //置顶
            "createInvite", //邀请加入
            "user.edit.group", //编辑用户组
            "user.edit.status", //编辑用户状态
            "switch.thread.essence", //加精
            "switch.thread.edit", //编辑主题
            "switch.thread.hide", //删除主题
            "switch.thread.editPosts", //编辑回复
            "switch.thread.hidePosts", //删除回复
            "switch.thread.editOwnThreadOrPost", //编辑自己的主题或回复
            "switch.thread.hideOwnThreadOrPost", //删除自己的主题或回复
            "createThreadWithCaptcha",
            "publishNeedRealName",
            "publishNeedBindPhone",
          ];
        }
      }
    },
    checkAll(val) {
      if(val){
        this.isIndeterminate = false;
        this.selectText = "取消全选";
      } else {
        this.isIndeterminate = true;
        this.selectText = "全选";
      }
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
    handleCheckAllChange(val){
      if (val) {
        this.checkAllPermission.forEach(item => {
          if(this.checked.indexOf(item) === -1){
            this.checked.push(item);
          }
        })
        this.setSelectValue(this.checked);
        this.checkAll = true;
      } else {
        this.checked = []
        this.selectList = {
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
        }
        this.checkAll = false
      }
    },
    setSelectValue(data) {
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
      checkedData.forEach((value, index) => {
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
            checkedData.splice(index, 1);
          }
        }
      });
      for (const valKey in selectList) {
        let list = selectList[valKey]
        selectList[valKey] = Array.from(new Set(list))
      }
      this.selectList = selectList;
      this.checked = checkedData;
    },
    clearItem(value, obj) {
      let item = "";
      if (value) {
        item = `category${value}.${obj}`;
      } else {
        item = obj;
      }
      let checkedData = this.checked;
      checkedData = checkedData.filter(v => v !== item);
      this.checked = checkedData;
    },
    changeCategory(obj, value) {
      let checked = this.checked;
      const item = `category${value}.${obj}`;
      // 是否选的是全局
      if (!value) {
        // 选中全局就去除其他勾选
        for (let i = 0; i < checked.length; i++) {
          if (
              checked[i].indexOf(obj) !== -1 &&
              checked[i].indexOf("category") !== -1
          ) {
            checked.splice(i, 1);
            i = i - 1;
          }
        }
        if (checked.indexOf(obj) === -1) checked.push(obj);
        this.selectList[obj] = [""];
      } else {
        // 在下拉选中数组里面
        if (this.selectList[obj].indexOf(value) !== -1) {
          checked.push(item);
        } else {
          // 不在下拉选中数组中就去除此权限
          checked = checked.filter(v => v !== item);
        }
        // 选中其他的就去除全局的权限
        checked = checked.filter(v => v !== obj);
        this.selectList[obj] = this.selectList[obj].filter(v => !!v);
      }
      this.checked = checked;
    },
    changeChecked(value, obj) {
      if (!value) {
        const checkedData = this.checked;
        this.selectList[obj] = [];
        this.checked = checkedData.filter(v => v.indexOf(obj) === -1);
      }
    },
    save(){
      for (let i = 0; i < this.permissionData.length; i++) {
        const val = this.permissionData[i]
        if (val.model){
           if (this.selectList[val.model].length === 0 && this.checked.includes(val.value)){
             errorMsg('请选择 ' + val.name + ' 的权限范围' )
             return false
           }
         }
      }
      let checked = this.checked;
      const { id, days, fee, is_commission, is_subordinate, name, scale, isPaid } = this.data
      if (is_commission || is_subordinate) {
        if (checked.indexOf("other.canInviteUserScale") === -1) {
          checked.push("other.canInviteUserScale");
        }
      } else {
        checked = checked.filter(v => v !== "other.canInviteUserScale");
      }
      this.loading = true
      updateUserOneGroups({
        id: id,
        data: {
          attributes: {
            days: days,
            fee: fee,
            is_commission: is_commission,
            is_paid: isPaid,
            is_subordinate: is_subordinate,
            name: name,
            scale: scale,
          }
        }
      }).then(() => {
        updateUserRolePermission({
          data: {
            attributes: {
              groupId: id,
              permissions: checked
            }
          }
        }).then(() => {
          okMsg()
          this.loading = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
