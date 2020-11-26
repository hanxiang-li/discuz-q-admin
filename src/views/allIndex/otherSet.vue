<template>
<el-row v-loading="loading">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>腾讯位置服务帐号</span>
      -
      是否启用:
      <el-switch
          v-model="data.lbs"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
    </div>
    KEY: <el-input style="width: 350px;" v-model="data.qq_lbs_key"/>
    腾讯位置服务帐号 - 控制台 - key与配额 - key管理的key
    <br/><br/>
    <el-button type="primary" style="width: 350px;margin-left: 30px;" @click="save">保存</el-button>
  </el-card>
</el-row>
</template>

<script>
import {queryForum, updateSiteSet} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import {okMsg} from "@/util/msg";

export default {
  name: "otherSet",
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
        this.data = data.lbs
        this.loading = false
      })
    },
    save(){
      this.loading = true
      const {lbs, qq_lbs_key} = this.data
      updateSiteSet({
        data: [
          {
            attributes: {
              key: 'lbs',
              tag: 'lbs',
              value: lbs,
            }
          },
          {
            attributes: {
              key: 'qq_lbs_key',
              tag: 'lbs',
              value: qq_lbs_key,
            }
          }
        ]
      }).then(() => {
        okMsg()
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
