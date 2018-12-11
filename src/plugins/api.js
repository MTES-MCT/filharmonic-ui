export default {
  install (Vue, options = {}) {
    const api = options.api
    if (!api) {
      throw new Error('Missing `api` option')
    }
    Object.defineProperty(Vue.prototype, '$api', {
      get () {
        return api
      }
    })
  }
}
