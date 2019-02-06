import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

import Login from '@/views/Login.vue'

Vue.use(VueRouter)
Vue.use(Vuetify)
const router = new VueRouter()

describe('Login view', () => {
  it('renders', () => {
    const wrapper = mount(Login, {
      router
    })
    expect(wrapper.text()).toContain('Fil\'HarmonicConnexion via le portail Cerbère')
  })
})
