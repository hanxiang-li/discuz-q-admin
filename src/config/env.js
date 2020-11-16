// 配置编译环境和线上环境之间的切换

let baseUrl = '/dzq';
let iconfontVersion = ['567566_pwc3oottzol', '2015585_ms860ovyi49'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
  baseUrl = `/dzq`; // 开发环境地址
} else if (env.NODE_ENV == 'production') {
  baseUrl = `/`; //生产环境地址
} else if (env.NODE_ENV == 'test') {
  baseUrl = `/`; //测试环境地址
}
export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
