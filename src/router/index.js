import Vue from 'vue'
import Router from 'vue-router'
import index from './index/index' // 引用首页模块路由数组对象

Vue.use(Router)
// 定义子路由模块集合
var childrenRouter = []
// 合并路由
childrenRouter = childrenRouter.concat(index)

var router = new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: childrenRouter
})

export default router
