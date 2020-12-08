// 基础路径 注意发布之前要先修改这里
let baseUrl = process.env.NODE_ENV === "development" ? '/' : '/dzq-admin/'
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  baseUrl: baseUrl, // 根据你的实际情况更改这里
  lintOnSave: true,
  productionSourceMap: false,
  // configureWebpack: config => {
  //     if (process.env.NODE_ENV === 'production') {
  //         return {
  //             plugins: [
  //                 new BundleAnalyzerPlugin()
  //             ]
  //         }
  //     }
  // },
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
  },
  devServer: {
    port: 80,
    disableHostCheck: true,
    proxy: {
      '/dzq': {
        target: 'https://bbs.work100.com.cn', // 设置你调用的接口域名和端口号
        changeOrigin: true,   // 跨域
        pathRewrite: {
          '^/dzq': ''
        }
      }
    },
  }
}
