/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import { serialize } from '@/util/util'
import { Notification  } from 'element-ui'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { baseUrl } from '@/config/env';
import { dataFormatter } from '@/util/tools'
import store from "@/store";
import i18n from "@/lang";
const request = axios.create({
  baseURL: baseUrl,
  timeout: 30000
})

//跨域请求，允许保存cookie
request.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTPrequest拦截
request.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  if (store.getters.token && !isToken) {
    config.headers[website.Authorization] = store.getters.token // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  if (config.method === 'get' && config.data){
    config.url += '?' + serialize(config.data)
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPresponse拦截
request.interceptors.response.use(
    response => {
      NProgress.done();
      try {
        if (response.config.params.isForm){
          return {data: dataFormatter(response.data)}
        }
      } catch (e) {
        return response.data
      }
    },
    (error) => {
      NProgress.done();
      let info = []
      const data = error.response.data.errors
      for (let i = 0; i < data.length; i++) {
        const value = data[i]
        try {
          value.detail.forEach(k => {
            info.push(k.message || k)
          })
        } catch (e){
          info.push(value.detail.message ? value.detail.message : value.detail || value.detail.error_description || value.code)
        }
      }
      let txt = ''
      info.forEach((i, k) => {
        txt += '<br>' + (k + 1 ) + '.' + i18n.tc(i + '') + '<br>'
      })
      Notification({
        center: true,
        message: '温馨提示：有 ' + info.length + ' 条错误信息<br>' + txt,
        dangerouslyUseHTMLString: true,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
)

export default request;
