<template>
<el-card class="box-card" style="margin: 5px;" v-loading="loading" element-loading-text="信息读取中，时间过长请刷新">
  <div slot="header" class="clearfix">
    <span>
      请先配置腾讯云API，并确保有对应资源包，否则可能产生额外的费用。
      <a href="https://discuz.com/manual-admin/2.html#_2-7-%E8%85%BE%E8%AE%AF%E4%BA%91%E8%AE%BE%E7%BD%AE" target="_blank"> ->官方文档</a>
    </span>
  </div>
  <el-tabs type="border-card" >
    <el-tab-pane label="云API">
      <tencent-cloud-config :data="data" v-on:loading="(val) => loading = val"/>
    </el-tab-pane>
    <el-tab-pane label="短信设置">
      <tencent-cloud-sms :data="data" v-on:loading="(val) => loading = val" />
    </el-tab-pane>
    <el-tab-pane label="对象存储">
      <tencent-cloud-cos :data="data" v-on:loading="(val) => loading = val" />
    </el-tab-pane>
    <el-tab-pane label="云点播">
      <tencent-cloud-vod :data="data" v-on:loading="(val) => loading = val" />
    </el-tab-pane>
    <el-tab-pane label="验证码">
      <tencent-cloud-captcha :data="data" v-on:loading="(val) => loading = val" />
    </el-tab-pane>
  </el-tabs>
</el-card>
</template>

<script>
import TencentCloudConfig from "@/views/allIndex/components/tencentCloudConfig";
import {queryForum} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import TencentCloudSms from "@/views/allIndex/components/tencentCloudSms";
import TencentCloudCos from "@/views/allIndex/components/tencentCloudCos";
import TencentCloudVod from "@/views/allIndex/components/tencentCloudVod";
import TencentCloudCaptcha from "@/views/allIndex/components/tencentCloudCaptcha";

export default {
  name: "tencentCloud",
  components: {TencentCloudCaptcha, TencentCloudVod, TencentCloudCos, TencentCloudSms, TencentCloudConfig},
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
        this.data = dataFormatter(res).qcloud
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
