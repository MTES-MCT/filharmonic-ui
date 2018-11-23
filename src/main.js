import Vue from 'vue'
import './plugins/vuetify'
import './filters/capitalize'
import './filters/format-origine'
import './filters/format-yesno'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
