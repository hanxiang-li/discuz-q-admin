<template>
  <el-form ref="form" :model="data" label-width="120px">
    <el-form-item label="是否开启短信">
      <el-switch
          v-model="data.qcloud_captcha"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
    </el-form-item>
    <el-form-item label="APP ID">
      <el-input
          size="medium"
          placeholder="请输入APP ID"
          style="width: 30%;"
          v-model="data.qcloud_captcha_app_id" />
    </el-form-item>
    <el-form-item label="APP KEY">
      <el-input
          size="medium"
          placeholder="请输入APP KEY"
          style="width: 30%;"
          v-model="data.qcloud_captcha_secret_key" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {cache, updateSiteSet} from "@/api/site";
import {errorMsg, okMsg} from "@/util/msg";

export default {
  name: "tencentCloudCaptcha",
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
        if (['qcloud_captcha', 'qcloud_captcha_app_id', 'qcloud_captcha_secret_key'].includes(key)){
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
      const captcha = new TencentCaptcha(this.data['qcloud_captcha_app_id'], res => {
        if (res.ret === 0) {
          list.push({
            attributes: {
              key: "qcloud_captcha_randstr",
              value: res.randstr,
              tag: "qcloud"}
          })
          list.push({
            attributes: {
              key: "qcloud_captcha_ticket",
              value: res.ticket,
              tag: "qcloud"}
          })
          updateSiteSet({data: list}).then(() => {
            okMsg()
            cache()
            this.$emit('loading', false)
          }).catch(() => {
            this.$emit('loading', false)
          })
        } else {
          errorMsg('设置失败')
        }
      })
      captcha.show()
    }
  }
}
</script>

<style scoped>

</style>
