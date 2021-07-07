// 用户相关请求模块

import request from '@/utils/request'

// 登录注册
export const login = data => {
  return request({
    method: 'POST',
    url: 'app/v1_0/authorizations',
    data
  })
}

// 发送短信
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

// 获取登录用户信息
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
