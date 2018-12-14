export default {
  install (Vue, options = {}) {
    const store = options.store
    if (!store) {
      throw new Error('Missing `store` option')
    }

    const permissions = {}
    ;['isInspecteur', 'isApprobateur', 'isExploitant']
      .forEach(getter => {
        if (typeof store.getters['authentication/' + getter] === 'undefined') {
          throw new Error(`Getter '${'authentication/' + getter}' not found in the store`)
        }
        Object.defineProperty(permissions, getter, {
          get () {
            return store.getters['authentication/' + getter]
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
