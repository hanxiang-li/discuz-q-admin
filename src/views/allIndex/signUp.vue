<template>
<div style="margin: 5px;">
  <el-card class="box-card" :style="{height: height + 'px','overflow-y': 'auto'}">
    <el-form ref="form" :model="data" label-width="150px" v-loading="loading"
             element-loading-text="信息读取中，时间过长请刷新" size="mini">
      <el-form-item label="新用户注册">
        <el-checkbox v-model="data.reg.register_close" class="input">允许新用户注册</el-checkbox>  设置是否允许游客注册成为会员
      </el-form-item>
      <el-form-item label="注册于登录模式">
        <el-radio-group v-model="data.reg.register_type" class="input">
          <el-radio :label="0">用户名模式</el-radio>
          <el-radio :label="1" :disabled="qcloud_sms">手机号模式</el-radio>
          <el-radio :label="2" :disabled="qcloud_wx">微信无感模式</el-radio>
        </el-radio-group>
        <el-tag type="info">
          开启用户名模式后，将以用户名密码为核心进行注册和登录。开启手机号模式后，将以手机号为核心进行注册和登录。开启微信无感模式后，微信内将自动注册和登录，且各端的注册和登录，将仅支持微信。
        </el-tag>
      </el-form-item>
      <el-form-item label="扩展信息">
        <el-checkbox v-model="data.site.open_ext_fields" class="input" true-label="1" false-label="0">
          扩展信息
        </el-checkbox>
        注册时需要用户填写的额外信息 
      </el-form-item>
      <el-form-item label="新用户审核">
        <el-checkbox v-model="data.reg.register_validate" class="input">新用户审核</el-checkbox>   设置新注册的用户是否需要审核
      </el-form-item>
      <el-form-item label="启用验证码">
        <el-checkbox v-model="data.reg.register_captcha" class="input">新用户注册启用验证码</el-checkbox>    启用验证码需先在腾讯云设置中开启验证码服务
      </el-form-item>
      <el-form-item label="注册密码最小长度">
        <el-input v-model="data.reg.password_length" class="input" />    新用户注册时密码最小长度，0或不填为不限制
      </el-form-item>
      <el-form-item label="密码字符类型">
        <el-checkbox-group v-model="data.reg.password_strength">
        <el-checkbox label="0">数字</el-checkbox>
        <el-checkbox label="1">小写字母</el-checkbox>
        <el-checkbox label="2">符号</el-checkbox>
        <el-checkbox label="3">大写字母</el-checkbox>
        </el-checkbox-group>
        <el-tag type="info">
          新用户注册时密码中必须存在所选字符类型，不选则为无限制
        </el-tag>
      </el-form-item>
      <el-form-item label="用户协议">
        <el-radio-group v-model="data.agreement.register">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <el-input
            v-if="data.agreement.register"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="data.agreement.register_content">
        </el-input>
      </el-form-item>
      <el-form-item label="隐私政策">
        <el-radio-group v-model="data.agreement.privacy">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <el-input
            v-if="data.agreement.privacy"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="data.agreement.privacy_content">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" class="input">提交修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
import {cache, queryForum, updateSiteSet} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import {getLocal} from "@/util/store";
import {okMsg} from "@/util/msg";

export default {
  name: "signUp",
  data(){
    return {
      data: {
        reg: {
          password_strength: []
        },
        agreement: {}
      },
      loading: false,
      height: getLocal('height') + 50,
      qcloud_sms: false,
      qcloud_wx: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      queryForum('?filter[tag]=agreement').then(res => {
        let data = dataFormatter(res)
        this.data = {
          agreement: data.agreement,
          reg: data.set_reg,
          site: data.set_site
        }
        this.qcloud_sms = data.qcloud.qcloud_sms !== true
        this.qcloud_wx = !(data.passport.offiaccount_close === true || data.passport.miniprogram_close === true);
        this.loading = false
      })
    },
    onSubmit(){
      this.loading = true
      let list = []
      for (let key in this.data.reg) {
        let val = {
          attributes: {
            key: key,
            tag: "default",
            value: this.data.reg[key],
          }
        }
        list.push(val)
      }
      for (let key in this.data.agreement) {
        let val = {
          attributes: {
            key: key,
            tag: "agreement",
            value: this.data.agreement[key],
          }
        }
        list.push(val)
      }
      updateSiteSet({data: list}).then(res => {
        okMsg()
        cache()
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.input{
  width: 380px;
}
</style>
