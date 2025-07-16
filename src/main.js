import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import '@/assets/main.scss'

const app = createApp(App)

app.use(pinia) // 使用 pinia 状态管理
app.use(router)
app.mount('#app')
