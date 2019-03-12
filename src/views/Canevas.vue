<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container
      h1.display-1.font-weight-bold.mb-4 Référentiel des canevas
      p Cette page permet de lister et supprimer les canevas utilisables à la création d'une inspection.

      .elevation-2
        template(v-for="(canevas, indexCanevas) in listeCanevas")
          v-layout.row.align-center.fh-canevas(:key="canevas.id")
            .body-2.mr-4.fh-canevas__nom {{ canevas.nom }}
            ul
              li(v-for="(point_de_controle, index) in canevas.data.points_de_controle" :key="index")
                strong {{ point_de_controle.sujet }} :&nbsp;
                | {{ point_de_controle.references_reglementaires.join(', ') }}
            v-spacer
            v-btn.ml-4(icon @click="deleteCanevas(canevas.id)")
              v-icon close
          v-divider(v-if="indexCanevas + 1 < listeCanevas.length")
</template>

<script>
import BasePage from '@/views/mixins/BasePage.js'

export default {
  mixins: [BasePage],
  data () {
    return {
      listeCanevas: []
    }
  },
  created () {
    this.loadCanevas()
  },
  methods: {
    async loadCanevas () {
      this.wait = this.$api.canevas.list()
      this.listeCanevas = await this.wait
    },
    deleteCanevas (canevasId) {
      this.$confirm('Êtes-vous sûr de vouloir supprimer ce canevas ?', async () => {
        await this.$api.canevas.delete(canevasId)
        await this.loadCanevas()
      })
    }
  }
}
</script>

<style lang="stylus">
.fh-canevas
  padding: 16px
  background-color: #fafafa

  &__nom
    min-width: 150px

</style>
