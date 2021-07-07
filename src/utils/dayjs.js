// 初始化dayjs相关配置

import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import realativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(realativeTime)
dayjs.locale('zh-cn')

// 包装过滤器
Vue.filter('realativeTime', value => {
  return dayjs(value).from(dayjs())
})

Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).from(format)
})
