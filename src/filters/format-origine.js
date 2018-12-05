import Vue from 'vue'

const origines = {
  plan_de_inspection: 'Plan de inspection',
  circonstancielle: 'Circonstancielle'
}
export default Vue.filter('format-origine', function (value) {
  return origines[value] || 'Inconnue'
})
