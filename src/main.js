import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 自动设置rem基本值
import 'amfe-flexible'

import './styles/index.less'
import './utils/dayjs'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
