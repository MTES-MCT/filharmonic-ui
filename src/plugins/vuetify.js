import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@/styles/main.styl'
import fr from 'vuetify/es5/locale/fr'

Vue.use(Vuetify, {
  theme: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  customProperties: true,
  iconfont: 'md',
  lang: {
    locales: { fr },
    current: 'fr'
  }
})
