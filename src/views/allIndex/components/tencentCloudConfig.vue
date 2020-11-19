<template>
<el-form ref="form" :model="data" label-width="120px">
  <el-form-item label="是否开启全局API">
    <el-switch
        v-model="data.qcloud_close"
        active-color="#13ce66"
        inactive-color="#ff4949" />
  </el-form-item>
  <el-form-item label="全局API秘钥">
    <el-input
        size="medium"
        placeholder="请输入APP ID"
        style="width: 30%;"
        v-model="data.qcloud_secret_id">
    </el-input>
    <el-input
        size="medium"
        style="width: 30%;margin-left: 5px;"
        placeholder="请输入APP KEY"
        v-model="data.qcloud_secret_key">
    </el-input>
  </el-form-item>
  <el-form-item label="图片内容安全">
    <el-switch
        v-model="data.qcloud_cms_image"
        active-color="#13ce66"
        inactive-color="#ff4949" />
  </el-form-item>
  <el-form-item label="文本内容安全">
    <el-switch
        v-model="data.qcloud_cms_text"
        active-color="#13ce66"
        inactive-color="#ff4949" />
  </el-form-item>
  <el-form-item label="实名认证">
    <el-switch
        v-model="data.qcloud_faceid"
        active-color="#13ce66"
        inactive-color="#ff4949" />
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
  name: "tencentCloudConfig",
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
        if (['qcloud_close', 'qcloud_secret_id', 'qcloud_secret_key', 'qcloud_cms_image',
         'qcloud_cms_text', 'qcloud_faceid'].includes(key)){
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
