<template>
<div style="margin: 5px;">
  <el-card class="box-card">
    <el-row>
      <el-col :span="12">
        欢迎登陆：{{ userInfo.username }}
      </el-col>
      <el-col :span="12">
        上次登录时间：{{ userInfo.loginAt }}
      </el-col>
    </el-row>
  </el-card>
  <el-card class="box-card" style="margin-top: 5px;">
    <avue-form :option="option" v-model="siteInfo">
      <template slot-scope="{value}" slot="unapprovedThreads">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="unapprovedPosts">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="unapprovedMoneys">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="unapprovedUsers">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="version">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="php_version">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="server_software">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="db">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="upload_size">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="db_size">
        <span>{{ value }}</span>
      </template>
      <template slot-scope="{value}" slot="bq">
        <div>
          <span style="color: red;">此后台管理程序目前完全免费使用，请勿用于商业用途！！！</span>
          <br/>
          <span>https://work100.com.cn 提供技术支持，关注微信公众号：work100 获取更多资讯</span>
        </div>
      </template>
    </avue-form>
  </el-card>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import {querySiteinfo} from "@/api/site";
import {dataFormatter} from "@/util/tools";
export default {
  name: "wel",
  data () {
    return {
      siteInfo: {},
      option: {
        emptyBtn: false,
        submitBtn: false,
        labelWidth: 150,
        group: [
          {
            icon:'el-icon-info',
            label: '待处理的事项',
            collapse: true,
            prop: 'group1',
            column: [
              {
                label: '等待审核的主题数',
                prop: 'unapprovedThreads',
                formslot:true,
                span: 6,
              },
              {
                label: '等待审核的回复数',
                prop: 'unapprovedPosts',
                formslot:true,
                span: 6,
              },
              {
                label: '等待审核的提现数',
                prop: 'unapprovedMoneys',
                formslot: true,
                span: 6,
              },

              {
                label: '等待审核的用户数',
                prop: 'unapprovedUsers',
                formslot:true,
                span: 6,
              },
            ]
          },
          {
            icon:'el-icon-info',
            label: '系统信息',
            collapse: true,
            prop: 'group2',
            column: [
              {
                label: 'Discuz!程序版本',
                prop: 'version',
                formslot: true,
                span: 6,
              },
              {
                label: '服务器系统及PHP',
                prop: 'php_version',
                formslot: true,
                span: 6,
              },
              {
                label: '服务器软件',
                prop: 'server_software',
                formslot: true,
                span: 6,
              },
              {
                label: '服务器MySQL版本',
                prop: 'db',
                formslot: true,
                span: 6,
              },
              {
                label: '上传许可',
                prop: 'upload_size',
                formslot: true,
                span: 6,
              },
              {
                label: '当前数据库尺寸',
                prop: 'db_size',
                formslot: true,
                span: 6,
              },
            ]
          },
          {
            icon: 'el-icon-info',
            label: '使用说明',
            collapse: false,
            prop: 'group3',
            column: [
              {
                label: '说明',
                prop: 'sysm',
                formslot: true,
                span: 24,
              },
            ]
          },
          {
            icon: 'el-icon-info',
            label: '版权申明',
            collapse: true,
            prop: 'group4',
            column: [
              {
                label: '申明',
                prop: 'bq',
                formslot: true,
                span: 24,
              },
            ]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created () {
    this.init()
  },
  methods: {
    init(){
      querySiteinfo().then(res => {
        this.siteInfo = dataFormatter(res)
      })
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.wel {
  &__header {
    padding: 25px 40px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__info {
    display: flex;
    align-items: center;
    &-img {
      border-radius: 72px;
      display: block;
      width: 72px;
      height: 72px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    &-content {
      position: relative;
      margin-left: 24px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
    &-title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
    }
    &-subtitle {
      position: relative;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
  }
  &__extra {
    &-item {
      position: relative;
      padding: 0 32px;
      display: inline-block;
      &:last-child {
        &::after {
          display: none;
        }
      }
      &:after {
        background-color: #e8e8e8;
        position: absolute;
        top: 30px;
        right: 0;
        width: 1px;
        height: 40px;
        content: "";
      }
    }
    &-title {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 4px;
    }
    &-subtitle {
      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
      line-height: 38px;
      margin: 0;
      span {
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
      }
    }
  }
}
</style>
