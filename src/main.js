// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 浏览器兼容
import 'babel-polyfill'
import Vue from 'vue'

import App from './App'
import router from './router'
// http
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/store'

// 引入 公共脚本
import '@/utils/utils.js'

Vue.use(Vuex)
// Vue.use(Do1Ui)

// 关闭提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: {
    App
  },
  template: '<App/>'
})
