<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon @click="$emit('close')" slot="left" name="cross"></van-icon>
    </van-nav-bar>

    <!-- 当前评论项 -->
    <CommentItem :comment="comment"></CommentItem>

    <!-- 所有评论回复 -->
    <van-cell title="所有回复"></van-cell>
  </div>
</template>

<script>
import CommentItem from './comment-item'
export default {
  name: 'CommentReply',
  components: {
    CommentItem
  },
  props: {
    comment: {
      type: Object
    }
  }
}
</script>

<style lang="less" scoped>

</style>
