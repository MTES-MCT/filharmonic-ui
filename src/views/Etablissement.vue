<template lang="pug">
  div
    p.display-1.mt-4.text-xs-center(v-if="error") Etablissement non existant. Mauvaise URL ?
    v-container
      fh-detail-etablissement(v-if="!error", :etablissement="etablissement", :expand="expandEtablissement")
      v-list(two-line subheader v-if="!error")
        v-subheader
          v-flex Contrôles
          v-btn(:to="`/etablissements/${id}/controles/new`" round color="primary" small title="Démarrer un contrôle")
            v-icon(left) add
            | Nouveau contrôle
        v-list-tile(:to="`/controles/${controle.id}`" v-for="controle in controles" :key="controle.id")
          v-list-tile-action
            fh-etat-controle(:state="controle.state")
          v-list-tile-content
            v-list-tile-title Contrôle n° {{ controle.id }} du {{ controle.date }}
        v-divider

</template>

<script>
import { getEtablissement } from '@/api/etablissements'
import { getControlesByEtablissement } from '@/api/controles'
import FhEtatControle from '@/components/FhEtatControle.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
export default {
  components: {
    FhEtatControle,
    FhDetailEtablissement
  },
  data () {
    return {
      error: false,
      controles: [],
      id: '',
      etablissement: null,
      expandEtablissement: [ true ]
    }
  },
  async created () {
    this.id = this.$route.params.id
    if (!this.id) {
      this.error = true
    }
    this.etablissement = await getEtablissement(this.id)
    if (!this.etablissement) {
      this.error = true
    }
    this.controles = await getControlesByEtablissement(this.id)
    if (!this.controles) {
      this.error = true
    }
  }
}
</script>
