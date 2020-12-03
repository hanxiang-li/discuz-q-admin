<template>
<div style="margin: 5px;">
  <el-form ref="form" :model="data" label-width="150px" v-loading="loading"
           element-loading-text="信息读取中，时间过长请刷新">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>公众号配置</span>
        <span style="font-size: 12px;margin-left: 10px;color: red;">* 用户在微信内使用微信授权登录，需配置服务号</span>
      </div>
      <el-form-item label="公众号APP ID">
        <el-input v-model="data.offiaccount_app_id" class="input"/> appid是微信公众帐号或小程序的唯一标识
      </el-form-item>
      <el-form-item label="公众号App secret">
        <el-input v-model="data.offiaccount_app_secret" class="input"/> appid是微信公众帐号或小程序的唯一标识
      </el-form-item>
      <el-form-item label="是否开启">
        <el-switch
            style="width: 350px;"
            v-model="data.offiaccount_close"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭" />
      </el-form-item>
    </el-card>
    <el-card class="box-card" style="margin-top: 5px;">
      <div slot="header" class="clearfix">
        <span>腾讯QQ设置</span>
      </div>

      <el-form-item label="APP ID">
        <el-input v-model="data.qq_oplatform_app_id" class="input"/>
      </el-form-item>

      <el-form-item label="App Secret">
        <el-input v-model="data.qq_oplatform_app_key" class="input"/>
      </el-form-item>
    </el-card>
    <el-card class="box-card" style="margin-top: 5px;">
      <div slot="header" class="clearfix">
        <span>小程序配置</span>
        <span style="font-size: 12px;margin-left: 10px;color: red;">* 用户在小程序使用微信授权登录</span>
      </div>
      <el-form-item label="小程序APP ID">
        <el-input v-model="data.miniprogram_app_id" class="input"/> appid是微信公众帐号或小程序的唯一标识
      </el-form-item>
      <el-form-item label="小程序App secret">
        <el-input v-model="data.miniprogram_app_secret" class="input"/> appid是微信公众帐号或小程序的唯一标识
      </el-form-item>
      <el-form-item label="开启小程序视频">
        <el-switch
            style="width: 350px;"
            v-model="data.miniprogram_video"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭" />
      </el-form-item>
      <el-form-item label="是否开启">
        <el-switch
            style="width: 350px;"
            v-model="data.miniprogram_close"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭" />
      </el-form-item>
    </el-card>
    <el-card class="box-card" style="margin-top: 5px;">
      <el-form-item label="是否开启PC登录">
        <el-switch
            style="width: 350px;"
            v-model="data.oplatform_close"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="input" @click="onSubmit">保存所有修改</el-button>
      </el-form-item>
    </el-card>
  </el-form>
</div>
</template>

<script>
import {cache, queryForum, updateSiteSet} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import {okMsg} from "@/util/msg";

export default {
  name: "worthMentioning",
  data(){
    return {
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
        const data = dataFormatter(res)
        this.data = data.passport
        this.data['miniprogram_video'] = data.set_site.miniprogram_video
        this.loading = false
      })
    },
    onSubmit(){
      this.loading = true
      let list = []
      for (let key in this.data) {
        let tag = ''
        if (key === 'qq_oplatform_app_id' || key === 'qq_oplatform_app_key'){
          tag = 'qq_oplatform'
        } else if (key.includes('offiaccount')){
          tag = 'wx_offiaccount'
        } else if (key.includes('oplatform')){
          tag = 'wx_oplatform'
        } else if (key.includes('miniprogram')){
          tag = 'wx_miniprogram'
        }
        let val = {
          attributes: {
            key: key,
            tag: tag,
            value: this.data[key],
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
  width: 350px;
}
</style>
