<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item @reply-click="$emit('reply-click', $event)"  v-for="(comment, index) in list" :key="index" :comment="comment"></comment-item>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'

import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: 10, // 获取下一页
      limit: 10
    }
  },
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getComments({
        type: 'a',
        source: this.source,
        offset: this.offset,
        limit: this.limit
      })
      this.$emit('update-total-count', data.data.total_count)
      const { results } = data.data
      this.list.push(...results)
      this.loading = false
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
