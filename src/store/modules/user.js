import { setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { isURL, validatenull } from '@/util/validate'
import { deepClone } from '@/util/util'
import webiste from '@/config/website'
import {dataFormatter} from "@/util/tools";
import { errorMsg} from "@/util/msg";
import {getUserInfo, loginByUsername} from "@/api/login";
import topMenu from "@/router/page/topMenu";
import Menu from "@/router/page/Menu";


function addPath (ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'label',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$")
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children] && ele[propsDefault.children].forEach(child => {
      if (!isURL(child[propsDefault.path])) {
        child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`
      }
      addPath(child);
    })
  }

}
const user = {
  state: {
    userInfo: getStore({ name: 'userInfo' }) || {},
    permission: {},
    roles: [],
    menuId: getStore({ name: 'menuId' }) || [],
    menu: getStore({ name: 'menu' }) || [],
    menuAll: getStore({ name: 'menuAll' }) || [],
    token: getStore({ name: 'token' }) || '',
  },
  actions: {
    //根据用户名登录
    LoginByUsername ({ commit }, userInfo) {
      return new Promise((resolve,reject) => {
        loginByUsername({data: {attributes: {...userInfo}}}).then(res => {
          const {token_type, access_token, users} = dataFormatter(res)
          getUserInfo(users.id).then(res => {
            const userInfo = dataFormatter(res)
            let flag = false
            for (let i = 0; i < userInfo.groups.length; i++) {
              if (userInfo.groups[i].id === '1'){
                flag = true
                break;
              }
            }
            if (flag){
              const token = token_type + ' ' + access_token
              commit('SET_TOKEN', token);
              commit('DEL_ALL_TAG');
              commit('CLEAR_LOCK');
              commit('SET_USERIFNO', userInfo);
              resolve();
            } else {
              errorMsg('没有权限')
              reject()
            }
          })
        }).catch(() => {
          errorMsg('账号或密码错误')
          reject()
        })
      })
    },
    //刷新token
    RefeshToken ({ state, commit }) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_MENUID', {})
        commit('SET_MENUALL', []);
        commit('SET_MENU', [])
        commit('SET_TAG_LIST', [])
        commit('SET_ROLES', [])
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
    //注销session
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_MENUID', {})
        commit('SET_MENUALL', []);
        commit('SET_MENU', [])
        commit('SET_TAG_LIST', [])
        commit('SET_ROLES', [])
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
    GetTopMenu () {
      return new Promise(resolve => {
        resolve(topMenu)
      })
    },
    //获取系统菜单
    GetMenu ({ commit }, parentId) {
      return new Promise(resolve => {
        let menu = deepClone(Menu[`${parentId || 0}`] || []);
        menu.forEach(ele => {
          addPath(ele, true);
        })
        commit('SET_MENU', menu)
        resolve(menu)
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({ name: 'token', content: state.token })
    },
    SET_MENUID (state, menuId) {
      state.menuId = menuId;
      setStore({ name: 'menuId', content: state.menuId, type: 'session' })
    },
    SET_USERIFNO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({ name: 'userInfo', content: state.userInfo, type: 'session' })
    },
    SET_MENUALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({ name: 'menuAll', content: state.menuAll })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({ name: 'menu', content: state.menu })
      if (validatenull(menu)) return
      //合并动态路由去重
      let menuAll = state.menuAll;
      menuAll = menuAll.concat(menu).reverse();
      let newMenu = [];
      for (let item1 of menuAll) {
        let flag = true;
        for (let item2 of newMenu) {
          if (item1.label == item2.label || item1.path == item2.path) {
            flag = false;
          }
        }
        if (flag) newMenu.push(item1);
      }
      console.log(newMenu)
      state.menuAll = newMenu
      setStore({ name: 'menuAll', content: state.menuAll, type: 'session' })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = {};
      permission.forEach(ele => {
        state.permission[ele] = true;
      });
    }
  }

}
export default user
