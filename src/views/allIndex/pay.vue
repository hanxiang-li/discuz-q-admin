<template>
<div style="margin: 5px;">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span><i class="icon-wechat-fill" /> 微信支付配置</span>
      <el-switch
          style="float: right; padding: 3px 0"
          v-model="data.wxpay_close"
          active-text="开启"
          inactive-text="关闭" />
    </div>
    <el-form ref="form" :model="data" label-width="150px" v-loading="loading"
             element-loading-text="信息读取中，时间过长请刷新">
      <el-form-item label="APPID">
        <el-input v-model="data.app_id" class="input"/> appid是微信公众帐号或小程序的唯一标识
      </el-form-item>
      <el-form-item label="商户号">
        <el-input v-model="data.mch_id" class="input" /> 商户申请微信支付后，由微信支付分配的商户收款帐号
      </el-form-item>
      <el-form-item label="API密匙">
        <el-input v-model="data.api_key" class="input" />  交易过程生成签名的密钥
      </el-form-item>
      <el-form-item label="企业付款到零钱">
        <el-switch
            style="width: 350px;"
            v-model="data.wxpay_mchpay_close"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭" />
        开通后才可使用企业向个人付款，付款资金将直接进入用户零钱的功能。否则将采用提交手机号，人工打款到微信手机账号的方式。
      </el-form-item>
      <el-form-item label="IOS付款">
        <el-switch
            style="width: 350px;"
            v-model="data.wxpay_ios"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭" />
        是否启用IOS付款，虚拟物品请勿开启，否则可能导致封号，修改后请清除缓存
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
import {okMsg} from "@/util/msg";

export default {
  name: "pay",
  data(){
    return {
      activeName: 'wechat',
      data: {},
      loading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      queryForum().then(res => {
        this.data = dataFormatter(res).paycenter
        this.loading = false
      })
    },
    onSubmit(){
      this.loading = true
      let list = []
      for (let key in this.data) {
        let val = {
          attributes: {
            key: key,
            tag: "wxpay",
            value: this.data[key],
          }
        }
        if (key === 'wxpay_ios'){
          val.attributes.value = (this.data[key] === false ? '': true)
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
  width: 350px;
}
</style>
