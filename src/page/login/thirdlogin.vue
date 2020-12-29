<template>
<basic-container class="social-container" v-loading="loading" style="text-align: center;">
  <el-image :src="data.base64_img" style="width: 200px;"/>
</basic-container>
</template>

<script>
import {getUserInfo, getWxImagesCode, getWxImagesCodeSearch} from "@/api/login";
import {dataFormatter} from "@/util/tools";
import {errorMsg} from "@/util/msg";
export default {
  name: "thirdLogin",
  data(){
    return {
      loading: true,
      data: {},
      timer: null
    }
  },
  created() {
    this.getLoginImage()
  },
  methods: {
    getLoginImage(){
      const that = this
      getWxImagesCode().then(res => {
        this.data = dataFormatter(res)
        this.loading = false
        this.timer = setInterval(() => {
          getWxImagesCodeSearch(that.data.session_token).then(token => {
            if (token) {
              clearInterval(this.timer)
              const {token_type, access_token, id} = dataFormatter(token)
              getUserInfo(id).then(res => {
                const userInfo = dataFormatter(res)
                let flag = false
                for (let i = 0; i < userInfo.groups.length; i++) {
                  if (userInfo.groups[i].id === '1') {
                    flag = true
                    break;
                  }
                }
                if (flag) {
                  const token = token_type + ' ' + access_token
                  this.$store.commit('SET_TOKEN', token);
                  this.$store.commit('DEL_ALL_TAG');
                  this.$store.commit('CLEAR_LOCK');
                  this.$store.commit('SET_USERIFNO', userInfo);
                  this.$router.push({ path: '/' });
                } else {
                  errorMsg('没有权限')
                }
              })
            }
          })
        }, 1000)
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.social-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .box {
    cursor: pointer;
  }
  .iconfont {
    color: #fff;
    font-size: 30px;
  }
  .container {
    $height: 50px;
    display: inline-block;
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .title {
    text-align: center;
  }
}
</style>
