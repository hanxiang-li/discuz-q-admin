<template>
<el-card class="box-card" style="margin: 5px;" v-loading="loading">
  <div slot="header" class="clearfix">
    <span>水印设置</span>
    <el-switch
        style="margin-left: 20px;"
        v-model="data.watermark"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"/>
  </div>
  <div style="display: flow-root;">
    <label>水印图片:</label>
    <br/>
    <el-upload
        class="avatar-uploader"
        :http-request="uploadImage"
        action="#"
        :show-file-list="false">
      <el-image v-if="data.watermark_image" :src="data.watermark_image" class="avatar" fit="contain" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
  <div style="display: flow-root;">
    <el-button type="text" @click="deleteImage">删除</el-button>
    <br />
    请选择图片（.png格式）进行上传
  </div>
  <br />
  <div>
    <label>水印位置</label>
    <br />
    <el-radio-group v-model="data.position">
      <el-radio-button :label="1" class="radio">左上</el-radio-button>
      <el-radio-button :label="2" class="radio">中上</el-radio-button>
      <el-radio-button :label="3" class="radio">右上</el-radio-button>
      <br />
      <el-radio-button :label="4" class="radio">左中</el-radio-button>
      <el-radio-button :label="5" class="radio">居中</el-radio-button>
      <el-radio-button :label="6" class="radio">右中</el-radio-button>
      <br />
      <el-radio-button :label="7" class="radio">左下</el-radio-button>
      <el-radio-button :label="8" class="radio">中下</el-radio-button>
      <el-radio-button :label="9" class="radio">右下</el-radio-button>
    </el-radio-group>
  </div>
  <br />
  <label>边距</label>
  <br />
  垂直 <el-input-number v-model="data.vertical_spacing"/> PX
  <br />
  水直 <el-input-number v-model="data.horizontal_spacing" style="margin-top: 5px;"/> PX
  <br /> <br />
  <el-button style="width: 260px;" type="primary" @click="onSubmit">提交</el-button>
</el-card>
</template>

<script>
import {cache, deleteLogo, queryForum, setSettingsLogo, updateSiteSet} from "@/api/site";
import {dataFormatter} from "@/util/tools";
import {okMsg} from "@/util/msg";

export default {
  name: "waterMark",
  data(){
    return {
      loading: false,
      data: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      queryForum().then(res => {
        this.data = dataFormatter(res).watermark
        this.loading = false
      })
    },
    uploadImage(request){
      let param = new FormData();
      param.append('logo', request.file)
      param.append("type", 'watermark_image')
      setSettingsLogo(param).then(res => {
        this.data['watermark_image'] = dataFormatter(res).default.logo
      })
    },
    deleteImage(){
      deleteLogo({type: "watermark_image"}).then(() => {
        this.data['watermark_image'] = null
      })
    },
    onSubmit(){
      this.loading = true
      let list = []
      for (let key in this.data) {
        if (key !== 'watermark_image'){
          let val = {
            attributes: {
              key: key,
              tag: "watermark",
              value: this.data[key],
            }
          }
          list.push(val)
        }
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
.radio{
  margin: 10px;
}
</style>
