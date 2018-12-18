import Vue from 'vue'

export default Vue.filter('pluralize', function (value, label) {
  if (typeof value !== 'number') {
    throw new TypeError(`expected number, got: \`${typeof value}\``)
  }
  return label + (value > 1 ? 's' : '')
})
