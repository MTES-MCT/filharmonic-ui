import FhPage from '@/components/FhPage'

/*
Ce mixin permet à toutes les pages d'utiliser facilement le composant fh-page.
*/
export default {
  components: {
    FhPage
  },
  data () {
    return {
      wait: null
    }
  }
}
