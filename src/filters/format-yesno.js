import Vue from 'vue'

export default Vue.filter('format-yesno', function (value) {
  if (typeof value !== 'boolean') {
    throw new TypeError(`Expected a boolean, got \`${typeof value}\``)
  }
  return value ? 'Oui' : 'Non'
})
