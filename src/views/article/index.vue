<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="article-wrap">
      <!-- 标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image
          class="avatar"
          fit="cover"
          round
          slot="icon"
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">{{ article.pubdate | realativeTime }}</div>
        <van-button @click="onFollow" class="follow-btn" :loading="isFollowLoading" :type="article.is_followed ? 'default' : 'info'" round size="small" :icon="article.is_followed ? '' : 'plus'">{{ article.is_followed ? '已关注' : '关注'}}</van-button>
      </van-cell>
      <div ref="article-content" class="markdown-body" v-html="article.content">
      </div>

      <!-- 文章评论列表 -->
      <comment-list @reply-click="onReplyClick" @update-total-count='totalCommentCount = $event' :source="articleId" :list='commentList'></comment-list>
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click='isPostShow = true'
      >
        写评论
      </van-button>
      <van-icon
        class="comment-icon"
        name="comment-o"
        :info="totalCommentCount"
        color="#777"
      ></van-icon>
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'pink' : '#777'"
        @click="onCollect"
      ></van-icon>
      <van-icon
        :color="article.attitude === 1 ? 'blue' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      ></van-icon>
      <van-icon
        name="share"
        color="#777"
        class="share-icon"
      ></van-icon>
    </div>

    <!-- 发部评论 -->
    <div>
      <van-popup v-model="isPostShow" position="bottom">
        <PostComment @post-success='onPustSuccess' :target='articleId'></PostComment>
      </van-popup>
    </div>

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <CommentReply :comment="replyComment" @close="isReplyShow = false"></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { ImagePreview } from 'vant'

import { addFollow, deleteFollow } from '@/api/user'

import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

// ImagePreview([
//   'https://img01.yzcdn.cn/vant/apple-1.jpg',
//   'https://img01.yzcdn.cn/vant/apple-2.jpg'
// ])
export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [String, Number, Object]
    }
  },
  data () {
    return {
      article: {},
      isFollowLoading: false,
      isCollectLoading: false,
      isLikeLoading: false,
      isPostShow: false, // 控制发布评论显示状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0,
      isReplyShow: false, // 控制回复的显示
      replyComment: {}
    }
  },
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      this.$nextTick(() => {
        this.handlePreviewImage()
      })
    },
    // 处理图片预览
    handlePreviewImage () {
      const articleContent = this.$refs['article-content']

      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    async onFollow () {
      this.isFollowLoading = true
      // 已关注 取消关注
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
        // this.article.is_followed = false
      } else {
        await addFollow(this.article.aut_id)
        // this.article.is_followed = true
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    async onCollect () {
      this.isCollectLoading = true
      // 已关注 取消关注
      if (this.article.is_collected) {
        await deleteCollect(this.articleId)
        // this.article.is_followed = false
      } else {
        await addCollect(this.articleId)
        // this.article.is_followed = true
      }
      this.article.is_collected = !this.article.is_collected
      this.isCollectLoading = false
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.isLikeLoading = true
      // 已关注 取消关注
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        // this.article.is_followed = false
        this.article.attitude = -1
      } else {
        await addLike(this.articleId)
        // this.article.is_followed = true
        this.article.attitude = 1
      }
      this.isLikeLoading = false
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    onPustSuccess (comment) {
      this.commentList.unshift(comment)
      this.totalCommentCount++
      this.isPostShow = false
    },
    onReplyClick (comment) {
      this.replyComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 160px;
  }
  .van-icon {
    font-size: 20px;
  }
  .comment-icon {
    bottom: -2px;
  }
  .share-icon {
    bottom: -2px;
  }
}
</style>
