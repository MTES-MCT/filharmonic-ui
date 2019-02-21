import Vue from 'vue'
import * as Sentry from '@sentry/browser'

import API from './api/api'
import events from './events'
import APIPlugin from './plugins/api'
import ConfirmPlugin from './plugins/confirm'
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
import { ApplicationError, UnauthorizedError } from './errors'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './styles/main.styl'

if (process.env.NODE_ENV === 'production') {
  const sentryURL = '{{SENTRY_URL}}' // this URL will be replaced in the Docker image
  if (!sentryURL.startsWith('{{')) {
    Sentry.init({
      dsn: sentryURL,
      integrations: [new Sentry.Integrations.Vue({ Vue })]
    })
  }
}
Vue.config.productionTip = false

class Application {
  async init () {
    this.api = new API()
    this.store = await createStore({
      api: this.api
    })
    Vue.use(APIPlugin, {
      api: this.api
    })
    Vue.use(ConfirmPlugin)
    Vue.use(PermissionsPlugin, {
      store: this.store
    })
    this.router = createRouter(this.store)

    this.setupErrorHandler()

    new Vue({
      router: this.router,
      store: this.store,
      render: h => h(App)
    }).$mount('#app')
    document.body.classList.remove('app-loading')
  }

  setupErrorHandler () {
    Vue.config.errorHandler = err => {
      this.errorHandler(err)
    }
    window.addEventListener('error', event => {
      event.preventDefault()
      this.errorHandler(event.error)
    })
    window.addEventListener('unhandledrejection', event => {
      event.preventDefault()
      this.errorHandler(event.reason)
    })
  }

  async errorHandler (error) {
    if (!(error instanceof ApplicationError)) {
      console.error(error.stack) // eslint-disable-line no-console
    }
    events.bus.$emit(events.Alert, 'error', error.message)
    if (error instanceof UnauthorizedError) {
      await this.api.authentication.logout()
      this.router.push('/login?redirect=/')
    }
  }
}

;(async function () {
  try {
    await (new Application().init())
  } catch (err) {
    console.error('Failed to start application', err) // eslint-disable-line no-console
  }
})()
