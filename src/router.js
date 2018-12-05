import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Etablissements from '@/views/Etablissements.vue'
import Etablissement from '@/views/Etablissement.vue'
import Login from '@/views/Login.vue'
import Page404 from '@/views/Page404.vue'
import Inspections from '@/views/Inspections.vue'
import Inspection from '@/views/Inspection.vue'
import NouvelleInspection from '@/views/NouvelleInspection.vue'
import DetailInspection from '@/views/DetailInspection.vue'
import ActiviteInspection from '@/views/ActiviteInspection.vue'

Vue.use(Router)

export function createRouter (store) {
  const requireAuthenticatedUser = (to, from, next) => {
    if (store.state.authentication.valid) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  const redirectAuthenticatedUserToDashboard = (to, from, next) => {
    if (store.state.authentication.valid) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }

  return new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter: redirectAuthenticatedUserToDashboard
      },
      {
        path: '/',
        component: Layout,
        beforeEnter: requireAuthenticatedUser,
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
            path: '/etablissements/:id/inspections/new',
            name: 'nouvelle-inspection',
            component: NouvelleInspection
          },
          {
            path: '/inspections',
            name: 'inspections',
            component: Inspections
          },
          {
            path: '/inspections/:inspectionId',
            name: 'inspection',
            component: Inspection,
            props: true
          },
          {
            path: '/inspections/:inspectionId/details',
            name: 'details-inspection',
            component: DetailInspection,
            props: true
          },
          {
            path: '/inspections/:inspectionId/activite',
            name: 'activite-inspection',
            component: ActiviteInspection,
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
}
