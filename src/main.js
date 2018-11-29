import Vue from 'vue'
import './plugins/vuetify'
import './filters/capitalize'
import './filters/format-origine'
import './filters/format-yesno'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './styles/main.styl'

Vue.config.productionTip = false

;(async function () {
  try {
    const store = await createStore()
    new Vue({
      router: createRouter(store),
      store,
      render: h => h(App)
    }).$mount('#app')
    document.body.classList.remove('app-loading')
  } catch (err) {
    console.error('Failed to start application', err)
  }
})()
