import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from '@/views/AuthLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Etablissements from '@/views/Etablissements.vue'
import Etablissement from '@/views/Etablissement.vue'
import Login from '@/views/Login.vue'
import Page404 from '@/views/Page404.vue'
import Controles from '@/views/Controles.vue'
import Controle from '@/views/Controle.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: AuthLayout,
      redirect: '/login',
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
          path: '/etablissements',
          name: 'etablissements',
          component: Etablissements
        },
        {
          path: '/etablissements/:id',
          name: 'etablissement',
          component: Etablissement
        },
        {
          path: '/controles',
          name: 'controles',
          component: Controles
        },
        {
          path: '/controles/:controleId',
          name: 'controle',
          component: Controle,
          props: true
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
