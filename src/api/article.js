// 获取文章分类
import request from '@/utils/request'

export const artGetChannelsService = () => request.get('/my/cate/list')
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })
