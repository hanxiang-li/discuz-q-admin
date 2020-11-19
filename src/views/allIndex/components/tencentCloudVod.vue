<template>
  <el-form ref="form" :model="data" label-width="170px" size="mini">
    <el-form-item label="是否开启云点播">
      <el-switch
          v-model="data.qcloud_vod"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
    </el-form-item>
    <el-form-item label="子应用">
      <el-input
          size="medium"
          placeholder="请输入子应用"
          style="width: 30%;"
          v-model="data.qcloud_vod_sub_app_id" />
    </el-form-item>
    <el-form-item label="转码模板">
      <el-input
          size="medium"
          placeholder="请输入转码模板"
          style="width: 30%;"
          v-model="data.qcloud_vod_transcode" />
    </el-form-item>
    <el-form-item label="水印模板">
      <el-input
          size="medium"
          placeholder="请输入水印模板"
          style="width: 30%;"
          v-model="data.qcloud_vod_watermark" />
    </el-form-item>
    <el-form-item label="截图模板">
      <el-input
          size="medium"
          placeholder="请输入截图模板"
          style="width: 30%;"
          v-model="data.qcloud_vod_cover_template" />
    </el-form-item>
    <el-form-item label="动图封面任务流名称">
      <el-input
          size="medium"
          placeholder="请输入动图封面任务流名称"
          style="width: 30%;"
          v-model="data.qcloud_vod_taskflow_gif" />
    </el-form-item>
    <el-form-item label="云点播防盗链 Key">
      <el-input
          size="medium"
          placeholder="请输入云点播防盗链 Key"
          style="width: 30%;"
          v-model="data.qcloud_vod_url_key" />
    </el-form-item>
    <el-form-item label="云点播防盗链签名有效期">
      <el-input
          size="medium"
          placeholder="请输入云点播防盗链签名有效期"
          style="width: 30%;"
          v-model="data.qcloud_vod_url_expire" />
    </el-form-item>
    <el-form-item label="支持的视频扩展名">
      <el-input
          size="medium"
          placeholder="请输入支持的视频扩展名"
          style="width: 30%;"
          v-model="data.qcloud_vod_ext" />
    </el-form-item>
    <el-form-item label="支持的最大尺寸">
      <el-input
          size="medium"
          placeholder="请输入支持的最大尺寸"
          style="width: 30%;"
          v-model="data.qcloud_vod_size" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {cache, updateSiteSet} from "@/api/site";
import {errorMsg, okMsg} from "@/util/msg";
import {getLocal} from "@/util/store";

export default {
  name: "tencentCloudVod",
  props: {
    data:{
      type: Object
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      height: getLocal('height') - 200
    }
  },
  methods: {
    onSubmit(){
      this.$emit('loading', true)
      let list = []
      for (let key in this.data) {
        if (['qcloud_vod', 'qcloud_vod_sub_app_id', 'qcloud_vod_transcode',
          'qcloud_vod_watermark', 'qcloud_vod_cover_template', 'qcloud_vod_taskflow_gif',
          'qcloud_vod_url_key', 'qcloud_vod_url_expire', 'qcloud_vod_size'].includes(key)){
          let val = {
            attributes: {
              key: key,
              tag: "qcloud",
              value: this.data[key],
            }
          }
          list.push(val)
        }
      }
      updateSiteSet({data: list}).then(() => {
        okMsg()
        cache()
        this.$emit('loading', false)
      }).catch(() => {
        errorMsg('腾讯云云点播设置错误')
        this.$emit('loading', false)
      })
    }
  }
}
</script>

<style scoped>

</style>
