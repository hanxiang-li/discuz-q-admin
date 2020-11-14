/**
 * 全站路由配置
 *
 * meta参数说明
 * keepAlive是否缓冲页面
 * isTab是否加入到tag导航
 * isAuth是否需要授权
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router';
import i18n from '@/lang' // Internationalization
import Store from '../store/';
Vue.use(VueRouter)
//创建路由
export const createRouter = () => new VueRouter({
  mode: 'history',
  base: "/pc-admin",
  routes: [...PageRouter, ...ViewsRouter]
})
const Router = createRouter()
AvueRouter.install(Vue, {
  router: Router,
  store: Store,
  i18n: i18n,
  keepAlive: false,
});
Router.$avueRouter.formatRoutes(Store.state.user.menuAll, true);
Router.addRoutes([...PageRouter, ...ViewsRouter]);
export function resetRouter () {
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher // reset router
  AvueRouter.install(Vue, {
    router: Router,
    store: Store,
    i18n: i18n,
    keepAlive: false,
  });
}
export default Router
