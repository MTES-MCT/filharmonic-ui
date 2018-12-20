import Vue from 'vue'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  locale: 'fr',
  locales: {
    'fr': require('date-fns/locale/fr')
  }
})
