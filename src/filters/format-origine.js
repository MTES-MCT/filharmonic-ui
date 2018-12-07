import Vue from 'vue'

const origines = {
  plan_de_controle: 'Plan de contrôle',
  circonstancielle: 'Circonstancielle'
}
export default Vue.filter('format-origine', function (value) {
  return origines[value] || 'Inconnue'
})
