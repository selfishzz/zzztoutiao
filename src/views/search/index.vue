<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result :searchText="searchText" v-if="isResultShow"></search-result>

    <!-- 联想建议 -->
    <search-suggestion @search="onSearch" :searchText="searchText" v-else-if="searchText"></search-suggestion>

    <!-- 搜索历史 -->
    <search-history :search-histories="searchHistories" v-else @search="onSearch" @update-histories="searchHistories = $event"></search-history>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import { setItem, getItem } from '@/utils/storage'
import { getSearchHistories } from '@/api/search'

import SearchSuggestion from './component/search-suggestion'
import SearchHistory from './component/search-history'
import SearchResult from './component/search-result'

export default {
  name: 'SearchIndex',
  data () {
    return {
      // 搜索输入框内容
      searchText: '',
      // 控制搜索结果显示状态
      isResultShow: false,
      searchHistories: getItem('search-histories') || [] // 搜索历史记录
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadSearchHistories()
  },
  methods: {
    onSearch (searchText) {
      this.searchText = searchText

      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }

      // 记录搜索历史记录
      this.searchHistories.unshift(searchText)

      // 如果没登录 保存本地
      // setItem('search-histories', this.searchHistories)

      this.isResultShow = true
    },
    async loadSearchHistories () {
      let searchHistories = getItem('search-histories') || []
      if (this.user) {
        const { data } = await getSearchHistories()
        // if (localHistories) {

        // }
        searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      }
      this.searchHistories = searchHistories
    }
  },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
