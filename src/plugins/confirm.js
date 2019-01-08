import FhConfirmDialog from '@/components/FhConfirmDialog.vue'

export default {
  install (Vue, options = {}) {
    const dialog = new (Vue.extend(FhConfirmDialog))()
    dialog.$mount(document.body.appendChild(document.createElement('div')))

    function confirm (message) {
      dialog.$root.$emit('confirm', message)
      return new Promise(resolve => {
        dialog.$root.$on('confirmed', resolve)
      })
    }
    Object.defineProperty(Vue.prototype, '$confirm', {
      get () {
        return confirm
      }
    })
  }
}
