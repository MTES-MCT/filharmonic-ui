import Vue from 'vue'

import API from './api/api'
import events from './events'
import APIPlugin from './plugins/api'
import PermissionsPlugin from './plugins/permissions'
import './plugins/timeago'
import './plugins/vuetify'
import './filters/capitalize'
import './filters/format-origine'
import './filters/format-yesno'
import './filters/pluralize'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import './registerServiceWorker'
import { ApplicationError } from './errors'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './styles/main.styl'

Vue.config.productionTip = false
function errorHandler (error) {
  if (!(error instanceof ApplicationError)) {
    console.error(error.stack) // eslint-disable-line no-console
  }
  events.bus.$emit(events.Alert, 'error', error.message)
}
Vue.config.errorHandler = errorHandler
window.addEventListener('error', errorEventHandler => {
  event.preventDefault()
  errorHandler(event.error)
})
window.addEventListener('unhandledrejection', errorEventHandler => {
  event.preventDefault()
  errorHandler(event.reason)
})

;(async function () {
  try {
    const api = new API()
    const store = await createStore({
      api
    })
    Vue.use(APIPlugin, { api })
    Vue.use(PermissionsPlugin, { store })
    new Vue({
      router: createRouter(store),
      store,
      render: h => h(App)
    }).$mount('#app')
    document.body.classList.remove('app-loading')
  } catch (err) {
    console.error('Failed to start application', err) // eslint-disable-line no-console
  }
})()
