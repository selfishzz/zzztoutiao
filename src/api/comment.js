// 文章评论相关

import request from '@/utils/request'

export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

export const deleteCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}

// 添加评论或评论回复
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
