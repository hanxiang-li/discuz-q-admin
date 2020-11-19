<template>
  <el-form ref="form" :model="data" label-width="120px">
    <el-form-item label="是否开启COS">
      <el-switch
          v-model="data.qcloud_cos"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
    </el-form-item>
    <el-form-item label="名称">
      <el-input
          size="medium"
          placeholder="请输入名称"
          style="width: 30%;"
          v-model="data.qcloud_cos_bucket_name" />
      填写存储桶基本配置中的空间名称，<a href="https://cloud.tencent.com/product/cos" target="_blank">点此申请</a>
    </el-form-item>
    <el-form-item label="地域">
      <el-input
          size="medium"
          placeholder="请输入地域"
          style="width: 30%;"
          v-model="data.qcloud_cos_bucket_area" />
      填写存储桶基本配置中的所属地域，例如：ap-beijing
    </el-form-item>
    <el-form-item label="访问域名">
      <el-input
          size="medium"
          placeholder="请输入访问域名"
          style="width: 30%;"
          v-model="data.qcloud_cos_cdn_url" />
      填写存储桶基本配置中的访问域名
    </el-form-item>
    <el-form-item label="启用签名">
      <el-switch
          v-model="data.qcloud_cos_sign_url"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
      开启后，请将存储桶访问权限改为私有读写，此时附件将使用签名加密方式，每次生成的链接仅一定周期内有效
    </el-form-item>
    <el-form-item label="启用文档预览">
      <el-switch
          v-model="data.qcloud_cos_doc_preview"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
      开启服务前，请先在对象存储中开启文档能力。启用后对于当前对象存储中的文档资源，可实现文档资源预览。
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {cache, updateSiteSet} from "@/api/site";
import {okMsg} from "@/util/msg";

export default {
  name: "tencentCloudCos",
  props: {
    data:{
      type: Object
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit(){
      this.$emit('loading', true)
      let list = []
      for (let key in this.data) {
        if (['qcloud_cos', 'qcloud_cos_bucket_name', 'qcloud_cos_bucket_area', 'qcloud_sms_sign', 'qcloud_cos_doc_preview'].includes(key)){
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
        this.$emit('loading', false)
      })
    }
  }
}
</script>

<style scoped>

</style>
