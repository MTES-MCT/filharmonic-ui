<template lang="pug">
.fh-point-de-controle.elevation-1(v-if="showPointDeControle")
  fh-toolbar(:class="{'fh-point-de-controle--brouillon': !pointDeControle.publie}")
    v-btn(flat title="Déplier/replier" @click="toggleShowMessages()")
      v-icon.fh-toggle-icon(large :class="{'fh-toggle-icon--reverse': showMessages}") keyboard_arrow_down

    .flex.pa-2
      v-form(v-if="editMode" ref="pointDeControleEditeForm" v-model="validPointDeControleEditeForm")
        fh-point-de-controle-form(:pointDeControle="pointDeControleEdite")
      v-layout.column(v-else)
        .fh-point-de-controle__sujet
          | {{ pointDeControle.sujet }}
          fh-icone-nouveaux-messages(v-if="pointDeControle.messagesNonLus" :messages="pointDeControle.messagesNonLus")
          v-icon.ml-4(v-if="!pointDeControle.publie"
                      title="Ce point de contrôle n'est pas publié"
                      ) visibility_off
        .fh-point-de-controle__referenceReglementaire(v-for="referenceReglementaire in pointDeControle.references_reglementaires") {{ referenceReglementaire }}

      .fh-point-de-controle__constat(v-if="peutVoirConstat" :style="`border-left-color: ${typeConstatPointDeControle.color}`")
        v-layout.align-center
          span.subheading.mr-2 Constat finalisé :
          v-chip(small :color="typeConstatPointDeControle.color" dark text-color="white")
            v-avatar
              v-icon(large) {{ typeConstatPointDeControle.icon }}
            | {{ typeConstatPointDeControle.label }}

        v-layout.align-center.my-2(v-if="pointDeControle.constat.remarques")
          span.subheading.mr-2 Remarques&nbsp;:
          v-flex
            div {{ pointDeControle.constat.remarques }}
        v-layout.align-center(v-if="pointDeControle.constat.delai")
          span.subheading.mr-2 Délai de mise en conformité :
          v-flex {{ pointDeControle.constat.delai }}

    .d-flex(v-if="editMode")
      v-btn(flat title="Annuler l'édition" @click="quitEditMode")
        v-icon(medium) clear
      v-btn(depressed color="success" title="Mettre à jour" @click="modifierPointDeControle" :disabled="!validPointDeControleEditeForm")
        v-icon(medium) check

    v-menu.d-flex(bottom left offset-y transition="slide-y-transition" v-if="peutEditer")
      v-btn.fh-fill-height(slot="activator" flat title="Éditer/supprimer")
        v-icon settings
      v-layout.column
        v-btn.ma-0(depressed large title="Modifier le point de contrôle"
                  @click="enterEditMode"
                  )
          v-icon(left) edit
          | Modifier
        v-btn.ma-0(v-if="peutPublier"
                  depressed large title="Publier le point de contrôle"
                  @click="publierPointDeControle"
                  )
          v-icon(left) visibility
          | Publier
        v-btn.ma-0(v-if="peutSupprimerConstat"
                  depressed large title="Supprimer le constat"
                  @click="supprimerConstat"
                  )
          v-icon(left) delete gavel
          | Supprimer le constat
        v-btn.ma-0(depressed color="error" large title="Supprimer le point de contrôle"
                  @click="supprimerPointDeControle"
                  )
          v-icon(left) delete
          | Supprimer

  v-expand-transition
    v-card.elevation-0.fh-point-de-controle__body(v-if="showMessages")
      v-card-text
        fh-messages.elevation-0(:pointDeControleId="pointDeControle.id" :etatInspection="etatInspection" :messages="pointDeControle.messages")

        div(v-if="!pointDeControle.constat")
          v-slide-y-transition(hide-on-leave)
            v-card.my-3.elevation-4(v-if="showNewConstatForm")
              v-toolbar(flat color="secondary" dense dark)
                v-toolbar-title Nouveau constat
                v-spacer
                v-toolbar-items
                  v-btn(flat title="Annuler le constat" @click="resetNewConstat()")
                    v-icon(medium) delete

              v-card-text
                v-radio-group.mt-0(row v-model="newConstat.type" hide-details required :rules="notEmpty")
                  v-radio(v-for="(typeConstats, key) in typesConstats" :key="key" :label="typeConstats.label" :value="key")

                v-container.pa-0(grid-list-md)
                  v-layout.mt-3.wrap
                    v-flex.sm-12
                      v-textarea(box label="Remarques" v-model="newConstat.remarques" auto-grow hideDetails rows="3" clearable)
                    v-flex.shrink(v-if="newConstat.type !== 'conforme'")
                      v-select(:items="delais"
                               v-model="newConstat.delai"
                               box label="Délai"
                              )

              v-card-actions.justify-center.pb-3
                v-btn(color="primary" @click="ajouterConstat()")
                  v-icon(left) gavel
                  | Sauvegarder le constat

          v-btn.mt-4(color="secondary" v-if="peutAjouterConstat" @click="showNewConstatForm = true")
            v-icon(left) gavel
            | Ajouter un constat

</template>

<script>
import { isAfterState, isBeforeState, typesConstats } from '@/api/inspections'
import FhIconeNouveauxMessages from '@/components/FhIconeNouveauxMessages.vue'
import FhMessages from '@/components/FhMessages.vue'
import FhPointDeControleForm from '@/components/FhPointDeControleForm.vue'
import FhToolbar from '@/components/FhToolbar.vue'
import * as _ from '@/util'

export default {
  name: 'FhPointDeControle',
  components: {
    FhIconeNouveauxMessages,
    FhMessages,
    FhPointDeControleForm,
    FhToolbar
  },
  props: {
    pointDeControle: {
      type: Object,
      required: true
    },
    etatInspection: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      pointDeControleEdite: null,
      validPointDeControleEditeForm: true,
      showMessages: false,
      showNewConstatForm: false,
      typesConstats,
      newConstat: {
        type: 'conforme'
      },
      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ],
      delais: [
        '1 mois',
        '3 mois',
        '6 mois'
      ]
    }
  },
  computed: {
    editMode () {
      return this.pointDeControleEdite !== null
    },
    typeConstatPointDeControle () {
      return this.pointDeControle.constat ? typesConstats[this.pointDeControle.constat.type] : {}
    },
    showPointDeControle () {
      return !this.$permissions.isExploitant || this.pointDeControle.publie
    },
    peutEditer () {
      return this.$permissions.isInspecteur && isBeforeState(this.etatInspection, 'attente_validation') && !this.editMode
    },
    peutPublier () {
      return this.$permissions.isInspecteur && !this.pointDeControle.publie && isBeforeState(this.etatInspection, 'attente_validation')
    },
    peutAjouterConstat () {
      return this.$permissions.isInspecteur && this.etatInspection === 'en_cours' && !this.pointDeControle.constat && !this.showNewConstatForm
    },
    peutVoirConstat () {
      return this.pointDeControle.constat && (!this.$permissions.isExploitant || isAfterState(this.etatInspection, 'attente_validation'))
    },
    peutSupprimerConstat () {
      return this.pointDeControle.constat && this.$permissions.isInspecteur && this.etatInspection === 'en_cours'
    }
  },
  methods: {
    quitEditMode () {
      this.pointDeControleEdite = null
    },
    enterEditMode () {
      this.pointDeControleEdite = _.cloneDeep({
        sujet: this.pointDeControle.sujet,
        references_reglementaires: this.pointDeControle.references_reglementaires
      })
    },
    async modifierPointDeControle () {
      if (this.$refs.pointDeControleEditeForm.validate()) {
        await this.$api.inspections.modifierPointDeControle(this.pointDeControle.id, this.pointDeControleEdite)
        this.quitEditMode()
      }
    },
    async publierPointDeControle () {
      await this.$api.inspections.publierPointDeControle(this.pointDeControle.id)
    },
    async supprimerPointDeControle () {
      if (await this.$confirm('Êtes-vous sûr de vouloir supprimer ce point de contrôle ?')) {
        await this.$api.inspections.supprimerPointDeControle(this.pointDeControle.id)
      }
    },
    async toggleShowMessages () {
      this.showMessages = !this.showMessages
    },
    resetNewConstat () {
      this.newConstat = {
        type: 'conforme'
      }
      this.showNewConstatForm = false
    },
    async ajouterConstat () {
      await this.$api.inspections.ajouterConstat(this.pointDeControle.id, this.newConstat)
      this.resetNewConstat()
    },
    async supprimerConstat () {
      if (await this.$confirm('Êtes-vous sûr de vouloir supprimer ce constat ?')) {
        await this.$api.inspections.supprimerConstat(this.pointDeControle.id)
      }
    }
  }
}
</script>

<style lang="stylus">
.fh-point-de-controle
  &--brouillon
    opacity 0.5

  &__sujet
    font-size 1.3em

  &__referenceReglementaire
    font-size 0.9em

  &__constat
    margin-top 1em
    padding-left 1em
    border-left 5px solid darken(#f0f0f0, 50%)
</style>
