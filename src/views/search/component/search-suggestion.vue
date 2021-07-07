<template>
  <div class="search-suggestion">
    <van-cell icon="search" :title="suggestion" v-for="(suggestion, index) in suggestions" :key="index" @click="$emit('search', suggestion)">
      <div slot="title" v-html="highlight(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'

import { getSearchSuggestions } from '@/api/search'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String
    }
  },
  data () {
    return {
      // 数据列表
      suggestions: []
    }
  },
  watch: {
    // 监听输入框文本变化
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 1000),
      immediate: true
    }
  },
  methods: {
    highlight (str) {
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(reg, `<span style="color: pink">${this.searchText}</span>`)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
