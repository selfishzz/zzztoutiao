<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >
        {{isEdit ? '完成' : '编辑'}}
      </van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item :class="{ active: index === active }" :icon="(isEdit && index !== 0) ? 'clear' : ''" v-for="(channel, index) in userChannels" :key="index" :text="channel.name" @click="onUserChannelClick(channel, index)" />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in recommandChannels" :key="index" :text="channel.name" @click="onAdd(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channels'
import { mapState } from 'vuex'

import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number
    }
  },
  data () {
    return {
      // 所有频道
      allChannels: [],
      // 控制编辑显示状态
      isEdit: false
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 请求数据
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      this.userChannels.push(channel)
      // 持久化
      if (this.user) {
        // 登录了
        await addUserChannel({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length
            }
          ]
        })
      } else {
        // 未登录
        setItem('user-channels', this.userChannels)
      }
    },
    // 处理点击按钮逻辑
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        this.deleteChannel(channel, index)
      } else {
        this.switchChannel(index)
      }
    },
    // 删除频道
    async deleteChannel (channel, index) {
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      if (this.user) {
        //  登陆了
        await deleteUserChannel(channel.id)
      } else {
        // 没登录
        setItem('user-channels', this.userChannels)
      }
    },
    // 切换频道
    switchChannel (index) {
      this.$emit('update-active', index)

      this.$emit('close')
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道列表
    recommandChannels () {
      return this.allChannels.filter(channel => {
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;

  .channel-title {
    font-size: 16px;
    color: #333333;
  }

  .van-grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }

  .active {
    /deep/ .van-grid-item__text {
      color: pink !important;
    }
  }
}
</style>
