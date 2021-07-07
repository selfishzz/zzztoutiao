<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell class="base-info" center :border="false">
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div slot="title" class="name">{{ currentUser.name }}</div>
        <van-button class="update-btn" size="small" round>编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item" text="文字">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item" text="文字">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item" text="文字">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item" text="文字">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录 -->
    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <img class="mobile" src="./mobile.png" alt="">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item class="nav-grid-item" icon="star-o" text="收藏" />
      <van-grid-item class="nav-grid-item" icon="browsing-history-o" text="历史" />
    </van-grid>

    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb-4" title="小军同学" is-link to="" />
    <van-cell @click="onLogout" v-if="user" class="logout-cell" title="退出登录"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { getCurrentUser } from '@/api/user'
export default {
  name: 'My',
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      currentUser: {}
    }
  },
  methods: {
    // 点击退出按钮逻辑
    onLogout () {
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗'
      }).then(() => {
        // on confirm确认退出
        this.$store.commit('setUser', null)
      }).catch(() => {
        // on cancel取消执行
      })
    },
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    }
  },
  created () {
    this.loadCurrentUser()
  }
}
</script>

<style lang="less" scoped>
.my-info {
  background: url("./banner.png") no-repeat;
  background-size: cover;
  .base-info {
    box-sizing: border-box;
    height: 115px;
    background-color: unset;
    padding-top: 38px;
    padding-bottom: 11px;
    .avatar {
      box-sizing: border-box;
      width: 66px;
      height: 66px;
      border: 1px solid #fff;
      margin-right: 11px;
    }
    .name {
      font-size: 15px;
      color: #fff;
    }
    .update-btn {
      height: 16px;
      font-size: 10px;
      color: #666666;
    }
  }
  .data-info {
    .data-info-item {
      height: 65px;
      color: #fff;
      .text-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
  }
  /deep/ .van-grid-item__content {
    background-color: unset;
  }
}
.not-login {
  height: 180px;
  background: url("./banner.png") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .mobile {
    width: 66px;
    height: 66px;
  }
  .text {
    font-size: 14px;
    color: #fff;
  }
}
/deep/ .nav-grid {
  .nav-grid-item {
    height: 70px;
    .van-icon {
      font-size: 22px;
    }
    .van-icon-star-o {
      color: #eb5253;
    }
    .van-icon-browsing-history-o {
      color: #ff9d1d;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333333;
    }
  }
}
.logout-cell {
  text-align: center;
  color: #d86262;
}
.mb-4 {
  margin-bottom: 4px;
}
</style>
