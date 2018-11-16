import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from '@/views/AuthLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Home from '@/views/Home.vue'
import Installations from '@/views/Installations.vue'
import Login from '@/views/Login.vue'
import Page404 from '@/views/Page404.vue'
import Inspections from '@/views/Inspections.vue'
import Inspection from '@/views/Inspection.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: AuthLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: '/installations',
          name: 'installations',
          component: Installations
        },
        {
          path: '/inspections',
          name: 'inspections',
          component: Inspections
        },
        {
          path: '/inspections/:id',
          name: 'inspection',
          component: Inspection
        }
      ]
    },
    {
      path: '*',
      name: 'page404',
      component: Page404
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
