import Layout from '@/page/index/'
export default [{
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard',
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/index')
  }]
}]
