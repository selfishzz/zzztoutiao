<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button type="info" icon='search' slot="title" round size="small" class="search-btn" to="/search">搜索</van-button>
    </van-nav-bar>

    <!-- 文章频道 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>

      <div slot="nav-right" class="wap-nav-pla"></div>
      <div class="wap-nav-wrap" slot="nav-right" @click="isChannelEditshow = true">
        <van-icon name="wap-nav"></van-icon>
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup v-model="isChannelEditshow" position="bottom" class="channel-edit-opoup" closeable close-icon-position="top-left" get-container="body" style="height: 100%">
      <channel-edit :active="active" @update-active="onUpdateActive" @close="isChannelEditshow = false" :user-channels="channels"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { getUserChannels } from '@/api/user'
import { getItem } from '@/utils/storage'

import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'Home',
  data () {
    return {
      active: 0, // 控制激活的标签
      channels: [], // 频道列表
      isChannelEditshow: false
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        const loaclChannels = getItem('user-channels')
        if (loaclChannels) {
          channels = loaclChannels
        } else {
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }

      this.channels = channels
    },
    onUpdateActive (index) {
      this.active = index
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__title {
  max-width: none;
}
.search-btn {
  width: 277px;
  height: 32px;
  background: #5babfb;
  border: none;
  .van-icon {
    font-size: 16px;
  }
  .van-button__text {
    font-size: 14px;
  }
}
.channel-tabs {
  /deep/ .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }
  /deep/ .van-tabs__line {
    width: 15px !important;
    height: 3px;
    background: #3296fa;
    bottom: 20px;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .9;
    .van-icon {
      font-size: 24px;
    }
    &::before {
      content: '';
      width: 1px;
      height: 29px;
      background: url("./logo.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .wap-nav-pla {
    width: 33px;
    flex-shrink: 0;
  }
}
</style>
