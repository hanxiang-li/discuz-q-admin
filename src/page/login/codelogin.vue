<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           v-loading="loading"
           label-width="0">
    <el-form-item prop="phone">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.phone"
                auto-complete="off"
                :placeholder="$t('login.phone')">
        <i slot="prefix"
           class="icon-shouji"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.code"
                auto-complete="off"
                :placeholder="$t('login.code')">
        <i slot="prefix"
           class="icon-yanzhengma"
           style="margin-top:6px;"></i>
        <template slot="append">
          <span @click="handleSend"
                class="msg-text"
                :class="[{display:msgKey}]">{{msgText}}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small"
                 type="primary"
                 @click.native.prevent="handleLogin"
                 class="login-submit">{{$t('login.submit')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isvalidatemobile } from "@/util/validate";
import { mapGetters } from "vuex";
import {getPhoneCode} from "@/api/login";
import {dataFormatter} from "@/util/tools";
import {getLocal} from "@/util/store";
import {errorMsg} from "@/util/msg";
export default {
  name: "codelogin",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error("请输入6位数的验证码"));
      } else {
        callback();
      }
    };
    return {
      msgText: "",
      msgTime: "",
      msgKey: false,
      loginForm: {
        phone: "",
        code: ""
      },
      loginRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        code: [{ required: true, trigger: "blur", validator: validateCode }]
      },
      loading: false,
    };
  },
  created() {
    this.msgText = this.config.MSGINIT;
    this.msgTime = this.config.MSGTIME;
  },
  mounted() {},
  computed: {
    ...mapGetters(["tagWel"]),
    config() {
      return {
        MSGINIT: this.$t("login.msgText"),
        MSGSCUCCESS: this.$t("login.msgSuccess"),
        MSGTIME: 60
      };
    }
  },
  props: [],
  methods: {
    handleSend() {
      if (this.msgKey) return;
      const that = this
      const formData = getLocal('formData')
      const captcha = new TencentCaptcha(formData.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          that.loading = true
          that.msgText = that.msgTime + that.config.MSGSCUCCESS;
          that.msgKey = true;
          const time = setInterval(() => {
            that.msgTime--;
            that.msgText = that.msgTime + this.config.MSGSCUCCESS;
            if (this.msgTime === 0) {
              that.msgTime = that.config.MSGTIME;
              that.msgText = that.config.MSGINIT;
              that.msgKey = false;
              clearInterval(time);
            }
          }, 1000);
          getPhoneCode({
            "data": {
              "attributes": {
                "mobile": that.loginForm.phone,
                "type": "login",
                captcha_rand_str: res.randstr,
                captcha_ticket: res.ticket
              }
            }
          }).then(() => {
            that.loading = true
          })
        } else {
          errorMsg('验证失败')
        }
      })
      captcha.show()
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("LoginByPhone", this.loginForm).then(() => {
            this.$router.push({ path: this.tagWel.value });
          });
        }
      });
    }
  }
};
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
</style>
