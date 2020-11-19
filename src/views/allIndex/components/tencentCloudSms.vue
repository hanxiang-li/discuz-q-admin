<template>
  <el-form ref="form" :model="data" label-width="120px">
    <el-form-item label="是否开启短信">
      <el-switch
          v-model="data.qcloud_sms"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
    </el-form-item>
    <el-form-item label="App ID">
      <el-input
          size="medium"
          placeholder="请输入App ID"
          style="width: 30%;"
          v-model="data.qcloud_sms_app_id" />
    </el-form-item>
    <el-form-item label="App Key">
      <el-input
          size="medium"
          placeholder="请输入App Key"
          style="width: 30%;"
          v-model="data.qcloud_sms_app_key" />
    </el-form-item>
    <el-form-item label="短信模板ID">
      <el-input
          size="medium"
          placeholder="请输入短信模板ID"
          style="width: 30%;"
          v-model="data.qcloud_sms_template_id" />
    </el-form-item>
    <el-form-item label="短信签名">
      <el-input
          size="medium"
          placeholder="请输入短信模板ID"
          style="width: 30%;"
          v-model="data.qcloud_sms_sign" />
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
  name: "tencentCloudSms",
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
        if (['qcloud_sms', 'qcloud_sms_app_id', 'qcloud_sms_app_key', 'qcloud_sms_sign', 'qcloud_sms_sign'].includes(key)){
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
