<template lang="pug">
v-container
  v-alert.ma-2.mb-4(v-if="!$permissions.isExploitant && inspection.validation_rejetee" :value="true" type="error")
    | La demande de validation a été rejetée.&nbsp;
    span(v-if="inspection.motif_rejet_validation") Motif: {{ inspection.motif_rejet_validation }}

  p(v-if="showMessagePointsDeControleNonModifiables") Les points de contrôle ne sont pas modifiables tant qu'une suite est présente.

  fh-point-de-controle(v-for="pointDeControle in inspection.points_de_controle" :key="pointDeControle.id"
                      :pointDeControle="pointDeControle" :etatInspection="inspection.etat"
                      :readonly="!peutModifierPointsDeControle" :deplier="pointDeControle.id === pointDeControleDeplieId")

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
        fh-btn(color="primary" :action="saveNewPointDeControle" :disableif="!validNewPointDeControleForm")
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
import FhBtn from '@/components/FhBtn.vue'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhPointDeControle from '@/components/FhPointDeControle.vue'
import FhPointDeControleForm from '@/components/FhPointDeControleForm.vue'
import FhSuite from '@/components/FhSuite.vue'

export default {
  components: {
    FhBtn,
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
      pointDeControleDeplieId: null,
      messageDeplieId: null,
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
    showMessagePointsDeControleNonModifiables () {
      return this.inspection.etat === 'en_cours' && this.$permissions.isInspecteur && !this.peutModifierPointsDeControle
    },
    inspectionModifiable () {
      return this.inspection.etat === 'preparation' || this.inspection.etat === 'en_cours'
    },
    peutModifierPointsDeControle () {
      return this.inspectionModifiable && !this.inspection.suite
    },
    peutAjouterPointDeControle () {
      return this.peutModifierPointsDeControle && !this.showNewPointDeControleForm
    },
    peutModifierSuites () {
      return this.$permissions.isInspecteur && this.inspectionModifiable
    },
    peutVoirSuites () {
      return this.inspection.etat !== 'preparation' && (!this.$permissions.isExploitant || isAfterState(this.inspection.etat, 'attente_validation'))
    }
  },
  created () {
    const matchMessage = /#pdc([0-9]+)-m([0-9]+)/.exec(this.$route.hash)
    if (matchMessage) {
      this.pointDeControleDeplieId = parseInt(matchMessage[1], 10)
      this.messageDepliedId = parseInt(matchMessage[2], 10)
    }
    const matchPointDeControle = /#pdc([0-9]+)/.exec(this.$route.hash)
    if (matchPointDeControle) {
      this.pointDeControleDeplieId = parseInt(matchPointDeControle[1], 10)
    }
  },
  mounted () {
    if (this.messageDepliedId) {
      try {
        // attente que la transition dépliage termine
        setTimeout(() => {
          this.$vuetify.goTo(`#m${this.messageDepliedId}`, {
            offset: 300
          })
        }, 300)
      } catch (e) {}
    } else if (this.pointDeControleDeplieId) {
      try {
        this.$vuetify.goTo(`#pdc${this.pointDeControleDeplieId}`, {
          offset: 300
        })
      } catch (e) {}
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
