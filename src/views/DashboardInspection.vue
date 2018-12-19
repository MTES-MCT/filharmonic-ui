<template lang="pug">
v-container
  fh-echange(v-for="echange in inspection.echanges" :key="echange.id" :echange="echange" :etatInspection="inspection.etat")

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
            v-layout.column
              v-text-field(label="Sujet" hideDetails clearable
                            v-model="newPointDeControle.sujet"
                            required
                            :rules="notEmpty"
                          )

              v-text-field(v-for="(referenceReglementaire, index) in newPointDeControle.referencesReglementaires" :key="index"
                            label="Référence réglementaire" hideDetails clearable
                            v-model="newPointDeControle.referencesReglementaires[index]"
                            :append-outer-icon="newPointDeControle.referencesReglementaires.length > 1 ? 'delete' : null"
                            @click:append-outer="newPointDeControle.referencesReglementaires.splice(index, 1)"
                            required
                            :rules="notEmpty"
                          )
              .d-block
                v-btn(flat title="Ajouter une référence réglementaire" @click="newPointDeControle.referencesReglementaires.push('')")
                  v-icon(medium left) add
                  | Nouvelle référence réglementaire

      v-card-actions.justify-center.pb-3
        v-btn(color="primary" @click="saveNewPointDeControle()" :disabled="!validNewPointDeControleForm")
          v-icon(left) done
          | Ajouter

    v-btn.mt-4(v-if="peutAjouterPointDeControle" @click="showNewPointDeControleForm = true")
      v-icon(left) add
      | Ajouter un point de contrôle

  section(v-if="showSuites")
    h4.display-1.my-4 Suites
    fh-suite(:inspection="inspection" :modifiable="peutModifierSuites")
</template>

<script>
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhEchange from '@/components/FhEchange.vue'
import FhSuite from '@/components/FhSuite.vue'

export default {
  components: {
    FhEtatInspection,
    FhMessage,
    FhEchange,
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
        referencesReglementaires: [
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
      return !this.$permissions.isExploitant && this.inspectionModifiable && !this.inspection.suite && !this.showNewPointDeControleForm
    },
    peutModifierSuites () {
      return !this.$permissions.isExploitant && this.inspectionModifiable
    },
    showSuites () {
      return this.inspection.etat !== 'preparation' && (this.inspection.suite || !this.$permissions.isExploitant)
    }
  },
  methods: {
    resetNewPointDeControle () {
      this.newPointDeControle = {
        sujet: '',
        referencesReglementaires: [
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
