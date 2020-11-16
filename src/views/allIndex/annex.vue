<template>
<el-card class="box-card" v-loading="loading" element-loading-text="信息读取中，时间过长请刷新" style="margin: 5px;">
  <el-form ref="form" :model="data" label-width="150px">
    <el-form-item label="支持的图片扩展名">
      <el-input v-model="data.support_img_ext" class="input"/> 多个请用,隔开，例如 png,gif,jpg,jpeg,heic
    </el-form-item>
    <el-form-item label="支持的文件扩展名">
      <el-input v-model="data.support_file_ext" class="input"/>  多个请用,隔开，例如 doc,docx,pdf,zip
    </el-form-item>
    <el-form-item label="支持的最大尺寸">
      <el-input v-model="data.support_max_size" class="input"/> 单位：MB
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" class="input">提交修改</el-button>
    </el-form-item>
  </el-form>
</el-card>
</template>

<script>
import {cache, queryForum, updateSiteSet} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import {okMsg} from "@/util/msg";

export default {
  name: "annex",
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
    init() {
      this.loading = true
      queryForum().then(res => {
        this.data = dataFormatter(res).set_attach
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
            tag: "default",
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
