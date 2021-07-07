<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell @click="onDelete(history, index)" v-for="(history, index) in searchHistories" :key="index" :title="history">
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  methods: {
    onDelete (history, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 持久化
        setItem('search-histories', this.searchHistories)
        return
      }
      // 非删除状态
      this.$emit('search', history)
    }
  },
  props: {
    searchHistories: {
      type: Array
    }
  }
}
</script>

<style lang="less" scoped>

</style>
