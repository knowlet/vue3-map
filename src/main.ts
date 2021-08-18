import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import LoadScript from 'vue-plugin-load-script'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(ElementPlus)
  .use(router)
  .use(LoadScript)
  .mount('#app')
