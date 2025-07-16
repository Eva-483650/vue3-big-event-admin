import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL,
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 10000
})

// 请求拦截器 在请求或响应被 then 或 catch 处理前拦截它们
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // TODO 2. 携带token 添加公共请求头 token在仓库里呀！
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  // 对请求错误做些什么
  // 这是 JavaScript 里 Promise 的一个静态方法，它会：
  // 立刻创建一个 状态为 rejected（拒绝） 的 Promise；
  // 并且这个 Promise 的拒因（原因）就是你传进来的 err。
  // 我不要处理这个错误了，我把它继续往后扔，让 .catch() 来处理。
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 对响应数据做点什么
    // code为0表示成功
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // TODO 3. 处理业务失败 统一错误处理 比如token过期、服务器异常
    // 业务失败的情况，直接抛出错误
    ElMessage.error(res.data.message || '请求失败，请稍后再试')
    return Promise.reject(res.data)
  },
  // 对响应错误做点什么
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401权限不足 或 token过期 => 拦截到登录
    if (err.response.status === 401) {
      router.push('/login')
    }
    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '请求失败，请稍后再试')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL } // 导出基础地址
