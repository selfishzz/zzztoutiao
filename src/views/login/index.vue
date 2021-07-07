<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 登录表单 -->
    <van-form
      @submit="onLogin"
      :show-error="false"
      :show-error-message="false"
      @failed="onFailed"
      validate-first
      ref="login-form"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
        name="mobile"
        center
      />
      <van-field
        center
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
        name="code"
      >
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish = "isCountDownShow = false"
          />
          <van-button v-else size="small" round class="send-btn" @click.prevent="onSendSms" :loading="isSendSmsLoading">
            发送验证码
          </van-button>
        </template>
      </van-field>

      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>
          登录
        </van-button>
      </div>
    </van-form>

  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: ''// 验证码
      },
      // 验证规则
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 控制倒计时和发送验证码显示状态
      isCountDownShow: false,
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  methods: {
    // 点击登录按钮
    async onLogin () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长 0时 不会消失
      })
      try {
        const { data } = await login(this.user)
        Toast.success('登录成功')
        // 将token放到Vuex
        this.$store.commit('setUser', data.data)

        // 跳转回原来页面
        this.$router.back()
      } catch (error) {
        console.log(error)
        Toast.fail('登录失败,手机号或验证码错误')
      }
    },
    // 表单验证失败
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 展示按钮的loading状态
        await sendSms(this.user.mobile)
        // 倒计时处理
        this.isCountDownShow = true
      } catch (error) {
        let message = ''
        if (error && error.response && error.response.status === 429) {
          message = '发送太频繁了，请稍后重试'
        } else if (error.name === 'mobile') {
          message = error.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn-wrap {
  padding: 26px 16px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
    .van-button__text {
      font-size: 15px;
    }
  }
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
}
</style>
