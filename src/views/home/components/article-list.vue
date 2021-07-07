<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText" :success-duration="1500">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
        <article-item v-for="(article, index) in articles" :key="index" :article="article"></article-item>
        <!-- <van-cell v-for="(article, index) in articles" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'

import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false,
      finished: false,
      timestamp: null,
      isRefreshLoading: false, // 下拉刷新的状态
      refreshSuccessText: '' // 下拉刷新成功提示
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.articles.push(...results)

      this.loading = false

      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.articles.unshift(...results)

      this.isRefreshLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
