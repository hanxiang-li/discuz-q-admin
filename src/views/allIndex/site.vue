<template>
<div>
  <avue-form ref="form" v-model="obj" :option="option" @submit="submit" style="margin: 5px;"  v-loading="loading"
             element-loading-text="信息读取中，时间过长请刷新">
    <template slot-scope="scope" slot="logo">
      <div>
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="(file) => {beforeAvatarUpload(file, 'logo')}">
          <el-image v-if="obj.site_logo" :src="obj.site_logo" class="avatar" />
          <div v-else >
            <i class="el-icon-plus avatar-uploader-icon" style="margin-top: -30px;"/>
            <br/>
            <span style="margin-top: -30px">站点logo,438 * 88</span>
          </div>
        </el-upload>
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            fit="contain"
            :before-upload="(file) => {beforeAvatarUpload(file, 'header_logo')}">
          <el-image v-if="obj.site_header_logo" :src="obj.site_header_logo" class="avatar" />
          <div v-else >
            <i class="el-icon-plus avatar-uploader-icon" style="margin-top: -30px;"/>
            <br/>
            <span style="margin-top: -30px">首页头部logo,438 * 88</span>
          </div>
        </el-upload>
        <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="(file) => {beforeAvatarUpload(file, 'background_image')}">
          <el-image v-if="obj.site_background_image" :src="obj.site_background_image" class="avatar" />
          <div v-else >
            <i class="el-icon-plus avatar-uploader-icon" style="margin-top: -30px;"/>
            <br/>
            <span style="margin-top: -30px">首页头部背景,750 * 400</span>
          </div>
        </el-upload>
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :http-request="(file) => {beforeAvatarUpload(file, 'favicon')}">
          <el-image v-if="obj.site_favicon" :src="obj.site_favicon" class="avatar" />
          <div v-else >
            <i class="el-icon-plus avatar-uploader-icon" style="margin-top: -30px;"/>
            <br/>
            <span style="margin-top: -30px">站点icon,120 * 120</span>
          </div>
        </el-upload>
      </div>
    </template>
    <template slot-scope="{value}" slot="site_manage">
      <div>
        <el-checkbox v-model="i.value" v-for="i in value" @change="closeSite">{{ i.desc }}</el-checkbox>
      </div>
    </template>
  </avue-form>
  <el-dialog :modal-append-to-body="false" title="付费模式设置" :visible.sync="dialogMode" width="20%" center>
    加入价格：<el-input-number v-model="obj.site_price"/> 元<br/><br/>
    有效期限：<el-input-number v-model="obj.site_expire"/> 天
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogMode = false, obj.site_mode = 'public'">取 消</el-button>
      <el-button type="primary" @click="dialogMode = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {queryForum, setSettingsLogo, updateSiteSet} from "@/api/site";
import {dataFormatter, dataSerialize} from "@/util/tools";
import {errorMsg, okMsg} from "@/util/msg";
export default {
  name: "site",
  data(){
    return {
      obj: {},
      option: {
        emptyBtn: false,
        column: [
          {
            label: "站点名称",
            prop: "site_name",
            span: 12,
            rules: [{
              required: true,
              message: "请输入Discuz! Q 站点的名称",
              trigger: "blur"
            }],
          },
          {
            label: "站点标题",
            prop: "site_title",
            span: 12,
            rules: [{
              required: true,
              message: "请输入Discuz! Q 站点标题",
              trigger: "blur"
            }],
          },
          {
            label: "站点介绍",
            prop: "site_introduction",
            span: 12,
            type: 'textarea',
            minRows: 5,
            maxRows: 5,
          },
          {
            label: "站点logo",
            prop: "logo",
            span: 12,
            formslot:true,
          },
          {
            label: "keywords",
            prop: "site_keywords",
            span: 12,
          },
          {
            label: "站长ID",
            prop: "site_author",
            span: 12,
          },
          {
            label: "站点模式",
            prop: "site_mode",
            type: 'radio',
            dicData: [
              {
                label: '公开模式',
                value: 'public'
              },
              {
                label: '付费模式',
                value: 'pay'
              },
            ],
            span: 6,
            change: ({value}) => {
              if (value === 'pay' && this.flag !== 0){
                this.dialogMode = true
              } else if (value){
                ++this.flag
              }
            },
          },
          {
            label: "围观价格",
            prop: "site_onlooker_price",
            type: 'number',
            span: 6,
          },
          {
            label: "作者分成",
            prop: "site_author_scale",
            type: 'number',
            span: 6,
            minRows: 0,
            maxRows: 10,
            change: ({value}) => {
              if (value <= 10){
                this.obj.site_master_scale = 10 - value
              }
            }
          },
          {
            label: "平台分成",
            prop: "site_master_scale",
            type: 'number',
            span: 6,
            minRows: 0,
            maxRows: 10,
            disabled: true,
          },
          {
            label: "权限购买",
            prop: "site_pay_group_close",
            type: 'switch',
            span: 6,
            dicData: [
              {
                label: '关闭',
                value: '0'
              },
              {
                label: '开启',
                value: '1'
              },
            ]
          },
          {
            label: "网站备案",
            prop: "site_record",
            span: 6,
          },
          {
            label: "公安备案",
            prop: "site_record_code",
            span: 6,
          },
          {
            label: "站点开关",
            prop: "site_manage",
            type: 'checkbox',
            span: 6,
            formslot: true,
          },
          {
            label: "第三方统计",
            prop: "site_stat",
            span: 24,
            type: 'textarea',
            minRows: 5,
            maxRows: 5,
          },
        ]
      },
      dialogMode: false,
      flag: 0,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      queryForum().then(res => {
        let data = dataFormatter(res).set_site
        data['site_author'] = data['site_author'].id
        this.obj = data
        this.loading = false
      })
    },
    beforeAvatarUpload(data, type){
      let param = new FormData();
      param.append('logo', data.file)
      param.append("type", type)
      setSettingsLogo(param).then(res => {
        this.obj['site_' + type] = dataFormatter(res).default.logo
      })
      return false
    },
    closeSite(val){
      let data = this.obj.site_manage
      if (!val && (!data[0].value || !data[1].value || !data[2].value)){
        this.$prompt('请输入关闭站点提示', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.obj.site_close_msg = value
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }
    },
    submit(data,done){
      let list = []
      for (let key in data) {
        let val = {
          attributes: {
            key: key,
            tag: "default",
            value: data[key],
          }
        }
        if (key === 'site_pay_group_close'){
          val.attributes.value = data[key] === '1'
        }
        list.push(val)
      }
      updateSiteSet({data: list}).then(() => {
        okMsg('修改成功')
        done()
      }).catch(() => {
        errorMsg('系统异常')
        done()
      })
    }
  }
}
</script>

<style >
.avue-form__group{
  margin-top: 15px;
}
</style>
<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  float: left;
  margin-left: 1px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
