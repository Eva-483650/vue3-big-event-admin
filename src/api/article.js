import request from '@/utils/request'

// channel
export const artGetChannelsService = () => request.get('/my/cate/list')
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)
// params: 用于将查询参数添加到 URL 中
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// article
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })
// 注意data需要是一个formData对象
export const artPublishService = (data) => request.post('/my/article/add', data)
export const artGetDetailService = (id) =>
  request.get('/my/article/info', { params: { id } })
export const artEditService = (data) => request.put('/my/article/info', data)
export const artDeleteService = (id) =>
  request.delete('/my/article/info', { params: { id } })
