import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Etablissements from '@/views/Etablissements.vue'
import Etablissement from '@/views/Etablissement.vue'
import Login from '@/views/Login.vue'
import Page404 from '@/views/Page404.vue'
import Controles from '@/views/Controles.vue'
import Controle from '@/views/Controle.vue'
import NouveauControle from '@/views/NouveauControle.vue'
import { requireAuth } from '@/api/authentication'

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
      component: Layout,
      beforeEnter: requireAuth,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/',
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
          component: Etablissement,
          props: true
        },
        {
          path: '/etablissements/:id/controles/new',
          name: 'nouveau-controle',
          component: NouveauControle
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
  ]
})
