<template lang="pug">
v-container
  fh-point-de-controle(v-for="pointDeControle in inspection.points_de_controle" :key="pointDeControle.id" :pointDeControle="pointDeControle" :etatInspection="inspection.etat")

  v-slide-y-transition(hide-on-leave)
    v-card.my-3.elevation-4(v-if="showNewPointDeControleForm")
      v-toolbar(flat color="secondary" dense dark)
        v-toolbar-title Nouveau point de contrôle
        v-spacer
        v-toolbar-items
          v-btn(flat title="Supprimer le point de contrôle" @click="resetNewPointDeControle()")
            v-icon(medium) delete

      v-card-text
        v-container.pa-0(grid-list-md)
          v-form(ref="newPointDeControleForm" v-model="validNewPointDeControleForm")
            fh-point-de-controle-form(:pointDeControle="newPointDeControle")

      v-card-actions.justify-center.pb-3
        v-btn(color="primary" @click="saveNewPointDeControle()" :disabled="!validNewPointDeControleForm")
          v-icon(left) done
          | Ajouter

    v-btn.mt-4(v-if="peutAjouterPointDeControle" @click="showNewPointDeControleForm = true")
      v-icon(left) add
      | Ajouter un point de contrôle

  section(v-if="peutVoirSuites")
    h4.display-1.my-4 Suites
    fh-suite(:inspection="inspection" :modifiable="peutModifierSuites")
</template>

<script>
import { isAfterState } from '@/api/inspections'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhPointDeControle from '@/components/FhPointDeControle.vue'
import FhPointDeControleForm from '@/components/FhPointDeControleForm.vue'
import FhSuite from '@/components/FhSuite.vue'

export default {
  components: {
    FhEtatInspection,
    FhMessage,
    FhPointDeControle,
    FhPointDeControleForm,
    FhSuite
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      validNewPointDeControleForm: false,
      showNewPointDeControleForm: false,
      newPointDeControle: {
        sujet: '',
        references_reglementaires: [
          ''
        ],
        messages: []
      },

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    inspectionModifiable () {
      return this.inspection.etat === 'preparation' || this.inspection.etat === 'en_cours'
    },
    peutAjouterPointDeControle () {
      return this.$permissions.isInspecteur && this.inspectionModifiable && !this.inspection.suite && !this.showNewPointDeControleForm
    },
    peutModifierSuites () {
      return this.$permissions.isInspecteur && this.inspectionModifiable
    },
    peutVoirSuites () {
      return this.inspection.etat !== 'preparation' && (!this.$permissions.isExploitant || isAfterState(this.inspection.etat, 'attente_validation'))
    }
  },
  methods: {
    resetNewPointDeControle () {
      this.newPointDeControle = {
        sujet: '',
        references_reglementaires: [
          ''
        ],
        messages: []
      }
      this.showNewPointDeControleForm = false
    },
    async saveNewPointDeControle () {
      if (this.$refs.newPointDeControleForm.validate()) {
        await this.$api.inspections.ajouterPointDeControle(this.inspection.id, this.newPointDeControle)
        this.resetNewPointDeControle()
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
