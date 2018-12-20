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
import DashboardInspection from '@/views/DashboardInspection.vue'
import DetailInspection from '@/views/DetailInspection.vue'
import EditDetailInspection from '@/views/EditDetailInspection.vue'
import CommentairesInspection from '@/views/CommentairesInspection.vue'
import RecapitulatifInspection from '@/views/RecapitulatifInspection.vue'
import ActiviteInspection from '@/views/ActiviteInspection.vue'

Vue.use(Router)

export function createRouter (store) {
  const requireAuthenticatedUser = (to, from, next) => {
    if (store.getters['authentication/isAuthenticated']) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  const redirectAuthenticatedUserToDashboard = (to, from, next) => {
    if (store.getters['authentication/isAuthenticated']) {
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
            path: '/etablissements/:etablissementId',
            name: 'etablissement',
            component: Etablissement,
            props: true
          },
          {
            path: '/etablissements/:etablissementId/inspections/new',
            name: 'nouvelle-inspection',
            component: NouvelleInspection,
            props: true
          },
          {
            path: '/inspections',
            name: 'inspections',
            component: Inspections
          },
          {
            path: '/inspections/:inspectionId',
            component: Inspection,
            props: true,
            children: [
              {
                path: '',
                name: 'dashboard-inspection',
                component: DashboardInspection
              },
              {
                path: 'details',
                name: 'details-inspection',
                component: DetailInspection
              },
              {
                path: 'details/edit',
                name: 'edit-details-inspection',
                component: EditDetailInspection
              },
              {
                path: 'commentaires',
                name: 'commentaires-inspection',
                component: CommentairesInspection
              },
              {
                path: 'recapitulatif',
                name: 'recapitulatif-inspection',
                component: RecapitulatifInspection
              },
              {
                path: 'activite',
                name: 'activite-inspection',
                component: ActiviteInspection
              }
            ]
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
