import Vue from 'vue'
import Router from 'vue-router'
import page from '@/components/page'

Vue.use(Router)

export default new Router({
  mode: "hash",
  routes: [
    {
      path: '/',
      name: 'page',
      component: page
    }
  ]
})

