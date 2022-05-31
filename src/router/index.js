import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isURL } from '@/utils/regular'
import { userMenusApi } from '@/api/login'

const refresh = true

/* 通用 */
const global = [
  { path: '/', redirect: { name: 'login' }, meta: { title_cn: '重定向', title_en: 'Redirect' } },
  { path: '/login', name: 'login', component: () => import('@/views/global/login.vue'), meta: { title_cn: '登录', title_en: 'Login' } },
  { path: '/401', name: '401', component: () => import('@/views/global/401.vue'), meta: { title_cn: '401', title_en: '401' } },
  { path: '/404', name: '404', component: () => import('@/views/global/404.vue'), meta: { title_cn: '404', title_en: '404' } },
  { path: '/500', name: '500', component: () => import('@/views/global/500.vue'), meta: { title_cn: '500', title_en: '500' } }
]

/* 主入口 */
const main = {
  path: '/layout',
  name: 'layout',
  component: () => import('@/views/layout/index.vue'),
  meta: { title_cn: '主入口整体布局', title_en: 'Overall layout of main entrance' },
  children: [
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/modules/home/index.vue'),
      meta: {
        id: 'home',
        title_cn: '首页',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/banner',
      name: 'banner',
      component: () => import('@/views/modules/banner/index.vue'),
      meta: {
        id: 'banner',
        title_cn: '轮播图管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('@/views/modules/service/index.vue'),
      meta: {
        id: 'service',
        title_cn: '客服管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@/views/modules/manage/index.vue'),
      meta: {
        id: 'manage',
        title_cn: '账号管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/organ',
      name: 'organ',
      component: () => import('@/views/modules/organ/index.vue'),
      meta: {
        id: 'organ',
        title_cn: '组织管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/modules/user/index.vue'),
      meta: {
        id: 'user',
        title_cn: '用户管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/viplevel',
      name: 'viplevel',
      component: () => import('@/views/modules/viplevel/index.vue'),
      meta: {
        id: 'viplevel',
        title_cn: '会员等级管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/notice',
      name: 'notice',
      component: () => import('@/views/modules/notice/index.vue'),
      meta: {
        id: 'notice',
        title_cn: '通知管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: () => import('@/views/modules/coupons/index.vue'),
      meta: {
        id: 'coupon',
        title_cn: '优惠券管理',
        title_en: '',
        isTab: true,
        type: 1,
        isDynamic: false,
        keepAlive: true,
        multiple: false
      }
    }
  ]
}

const routes = global.concat(main)

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * @description: 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {RouteLocationNormalized} route
 * @param {Array} commonRoutes
 * @return {*}
 */
// function currentRouteType(route, commonRoutes = []) {
//   let temp = []
//   for (let i = 0; i < commonRoutes.length; i++) {
//     if (route.path === commonRoutes[i].path) {
//       return 'global'
//     } else if (commonRoutes[i].children && commonRoutes[i].children.length >= 1) {
//       temp = temp.concat(commonRoutes[i].children)
//     }
//   }
//   return temp.length >= 1 ? currentRouteType(route, temp) : 'main'
// }

/**
 * @description: 动态添加路由
 * @param {Array} menus
 * @param {Array} routeList
 * @return {*}
 */
// function addRoutes(menus = [], routeList = []) {
//   let list = []
//   menus.forEach((item, _index) => {
//     if (item.children && item.children.length > 0) {
//       list = list.concat(item.children)
//     }
//     if (item.url && /\S/u.test(item.url)) {
//       const route = {
//         path: '/' + item.url.replace(/\//g, '-'),
//         name: item.url.replace(/\//g, '-'),
//         component: () => import(`@/views/modules/${ item.url }.vue`) || null,
//         meta: {
//           id: item.id,
//           title_cn: item.name_cn,
//           title_en: item.name_en,
//           isDynamic: true,
//           isTab: item.is_tab === 1,
//           type: item.type,
//           keepAlive: item.is_alive === 1,
//           multiple: item.is_multiple === 1
//         }
//       }
//       if (isURL(item.url)) {
//         route['path'] = `/i-${ item.id }`
//         route['name'] = `i-${ item.id }`
//         route['component'] = () => import(`@/views/modules/iframe/index.vue`)
//         route['meta']['iframeUrl'] = item.url
//       }
//       routeList.push(route)
//     }
//   })
//   if (list.length >= 1) {
//     addRoutes(list, routeList)
//   } else {
//     main.children = main.children.concat(routeList)
//     console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
//     console.log(main.children)
//     console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
//     router.addRoute(main)
//   }
// }

/**
 * @description: 清除动态添加的路由
 * @param {Array} menus
 * @param {Array} routeList
 * @return {*}
 */
// function clearRouter() {
//   const routers = router.getRoutes().filter(item => item.meta.isDynamic)
//   routers.forEach(item => {
//     router.removeRoute(item.name)
//   })
//   // 其实只要这一行就可以
//   main.children = main.children.filter(item => !item.meta.isDynamic)
// }

// router.beforeEach( (to, _from, next) => {
//   // 标题控制
//   document.title = to.meta.title_cn || document.title
//   // 跳转到登录页清除所有信息
//   if (to.name === 'login') {
//     clearRouter()
//     store.dispatch('setting/exit')
//   }
//   NProgress.start()
//   // 处理动态路由页 刷新跳转 401 问题
//   if (refresh) {
//     // 添加 401 重定向
//     router.addRoute({ path: '/:pathMatch(.*)', redirect: { name: '401' } })
//   }
//   next()
// })

// router.afterEach((_to, _from) => {
//   NProgress.done()
// })

// 添加异常处理
// const originalPush = router.push
// router.push = (to) => {
//   try {
//     return originalPush(to)
//   } catch (error) {
//     console.log(`%c${ error }`, 'color:red')
//     return originalPush({ name: '401' })
//   }
// }

export default router
