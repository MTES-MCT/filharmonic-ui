<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container.grid-list-lg
      v-breadcrumbs.pt-0(:items="breadcrumbs" divider=">" large)
      h1.display-1.font-weight-bold.mb-4 Création d'une inspection

      p(v-if="precedenteInspection")
        | Cette inspection va reprendre les points de contrôle de l'inspection du&nbsp;
        router-link(:to="`/inspections/${precedenteInspection.id}`") {{ precedenteInspection.date }}
        |  dont les constats non conformes n'ont pas été résolus dans les délais impartis.

      v-layout.row.wrap.grid-list-lg
        v-flex.xs12.md7.pa-2
          v-card
            v-toolbar(flat)
              v-toolbar-title
                | Détails de l'inspection
            v-card-text
              v-form(ref="form" v-model="validForm" lazy-validation)
                fh-detail-inspection(:inspection="inspection")

                v-layout.align-center
                  v-flex.subheading.mr-2 Canevas
                  v-flex.text-xs-right
                    v-autocomplete(v-model="inspection.canevas_id" :items="canevas"
                                  placeholder="Canevas..." item-value="id" item-text="nom" clearable
                                  )

                fh-btn(block :action="createInspection" :disableif="!validForm" color="primary") Créer l'inspection

        v-flex.xs12.md5.pa-2
          v-card
            v-toolbar(flat)
              v-toolbar-title
                | Détails de l'établissement
            v-card-text
              fh-detail-etablissement(:etablissement="inspection.etablissement")
</template>

<script>
import FhBtn from '@/components/FhBtn.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import BasePage from '@/views/mixins/BasePage'
import { ForbiddenError } from '@/errors.js'

export default {
  components: {
    FhBtn,
    FhDetailInspection,
    FhDetailEtablissement
  },
  mixins: [BasePage],
  props: {
    etablissementId: {
      type: String,
      required: true
    },
    inspectionId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      canevas: null, // fetched on init
      inspection: {
        date: '',
        type: 'courant',
        annonce: true,
        origine: 'plan_de_controle',
        circonstance: '',
        detail_circonstance: '',
        inspecteurs: [
          this.$store.state.authentication.user
        ],
        themes: [],
        etablissement_id: parseInt(this.etablissementId, 10),
        etablissement: null, // fetched on init
        canevas_id: 0,
        precedente_inspection_id: 0
      },
      precedenteInspection: null, // fetched on init
      validForm: false
    }
  },
  computed: {
    breadcrumbs () {
      return [
        {
          text: this.inspection.etablissement.raison,
          'active-class': null,
          to: `/etablissements/${this.inspection.etablissement.id}`
        },
        {
          text: `Nouvelle inspection`,
          disabled: true
        }
      ]
    }
  },
  async created () {
    console.log('inspectionId = ', this.inspectionId)
    if (this.$permissions.isExploitant) {
      this.wait = Promise.reject(new ForbiddenError('Il faut être inspecteur'))
      return
    }
    const dataToFetch = [
      this.$api.etablissements.get(this.etablissementId, {
        inspections: true
      }),
      this.$api.canevas.list()
    ]
    if (this.inspectionId) {
      dataToFetch.push(this.$api.inspections.get(this.inspectionId))
    }
    this.wait = Promise.all(dataToFetch)
    const result = await this.wait
    this.inspection.etablissement = result[0]
    this.canevas = result[1]
    if (this.inspectionId) {
      this.precedenteInspection = result[2]
      this.inspection.precedente_inspection_id = parseInt(this.inspectionId, 10)
    }
  },
  methods: {
    async createInspection () {
      if (this.$refs.form.validate()) {
        const inspectionId = await this.$api.inspections.create(this.inspection)
        this.$router.push(`/inspections/${inspectionId}`)
      }
    }
  }
}
</script>
