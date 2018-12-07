export default {
  install (Vue, options = {}) {
    const store = options.store
    if (!store) {
      throw new Error('Missing `store` option')
    }

    const permissions = {}
    ;['isInspecteur', 'isApprobateur', 'isExploitant']
      .forEach(getter => {
        if (typeof store.getters[getter] === 'undefined') {
          throw new Error(`Getter '${getter}' not found in the store`)
        }
        Object.defineProperty(permissions, getter, {
          get () {
            return store.getters[getter]
          }
        })
      })

    Object.defineProperty(Vue.prototype, '$permissions', {
      get () {
        return permissions
      }
    })
  }
}
