import { createRouter, createWebHistory } from 'vue-router'
import BatchForm from '/src/components/BatchForm.vue'
import HelloWorld from '/src/components/HelloWorld.vue'
import Home from '/src/components/Home.vue'
import NewForm from '/src/components/NewForm.vue'
import NotFound from '/src/components/NotFound.vue'

const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: HelloWorld
  },
  {
    path: '/new',
    name: '新增订单',
    component: NewForm
  },
  {
    path: '/batch',
    name: '批量新增',
    component: BatchForm
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

export default createRouter({ history, routes })