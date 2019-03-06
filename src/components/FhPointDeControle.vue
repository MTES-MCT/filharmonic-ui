<template lang="pug">
.fh-point-de-controle.elevation-1(:id="`pdc${pointDeControle.id}`")
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
        v-layout.align-center(v-if="pointDeControle.constat.delai_unite")
          span.subheading.mr-2 Délai de mise en conformité :
          v-flex {{ pointDeControle.constat.delai_nombre }} {{ pointDeControle.constat.delai_unite }}

        template(v-if="pointDeControle.constat.echeance_resolution")
          p.red--text.mt-2(v-if="$permissions.isExploitant && !pointDeControle.constat.date_resolution")
            strong
              | Vous avez jusqu'au {{ new Date(pointDeControle.constat.echeance_resolution).toLocaleDateString() }} pour apporter des preuves concernant la résolution de ce point.
          v-layout.mt-2.align-center(v-else)
            span.subheading.mr-2 Échéance de mise en conformité :
            v-flex {{ new Date(pointDeControle.constat.echeance_resolution).toLocaleDateString() }}

        p.green--text.mt-2(v-if="pointDeControle.constat.date_resolution")
          strong
            | Résolu le {{ new Date(pointDeControle.constat.date_resolution).toLocaleString() }}
        v-btn.mt-2(v-if="peutResoudreConstat" color="green" dark @click="resoudreConstat" title="Résoudre la non-conformité")
          v-icon(left small) check_circle_outline
          | Résoudre

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
    v-card.elevation-0.fh-point-de-controle__body(v-show="showMessages")
      v-card-text
        v-card
          v-expansion-panel(:value="deplierMessagesEnCours")
            v-expansion-panel-content
              v-toolbar(flat dense slot="header")
                v-toolbar-title.subheading Messages
              v-card-text
                v-timeline
                  fh-message(v-for="message in messagesEnCours" :key="message.id" :message="message")
                .text-xs-center
                  fh-new-message(v-if="peutAjouterMessageEnCours" @new-message="addMessage")

        .fh-constat(v-if="!pointDeControle.constat")
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
                      h4 Délai
                      v-layout.row.mt-1
                        v-text-field(type="number" v-model="newConstat.delai_nombre"
                                     label="Délai" box single-line style="width: 80px")
                        v-select.ml-1(v-model="newConstat.delai_unite" :items="unitesDelai"
                                      label="Unité" box single-line style="width: 100px")

              v-card-actions.justify-center.pb-3
                v-btn(color="primary" @click="ajouterConstat()")
                  v-icon(left) gavel
                  | Sauvegarder le constat

          v-btn.mt-4(color="secondary" v-if="peutAjouterConstat" @click="showNewConstatForm = true")
            v-icon(left) gavel
            | Ajouter un constat

        template(v-if="showTraitementNonConformites")
          v-alert(:value="true" type="error" outline)
            h3 Traitement des non-conformités
          v-timeline
            fh-message(v-for="message in messagesTraitementNonConformites" :key="message.id" :message="message")
          .text-xs-center
            fh-new-message(v-if="peutAjouterMessageTraitementNonConformites" @new-message="addMessage")

</template>

<script>
import { isAfterState, isBeforeState, typesConstats } from '@/api/inspections'
import FhIconeNouveauxMessages from '@/components/FhIconeNouveauxMessages.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhNewMessage from '@/components/FhNewMessage.vue'
import FhPointDeControleForm from '@/components/FhPointDeControleForm.vue'
import FhToolbar from '@/components/FhToolbar.vue'
import * as _ from '@/util'

export default {
  name: 'FhPointDeControle',
  components: {
    FhIconeNouveauxMessages,
    FhMessage,
    FhNewMessage,
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
    },
    readonly: {
      type: Boolean,
      default: false
    },
    deplier: {
      type: Boolean,
      default: false
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
        type: 'conforme',
        delai_nombre: 3,
        delai_unite: 'mois'
      },
      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ],
      unitesDelai: [
        'jours',
        'mois'
      ]
    }
  },
  computed: {
    editMode () {
      return this.pointDeControleEdite !== null
    },
    deplierMessagesEnCours () {
      return this.etatInspection !== 'traitement_non_conformites' ? 0 : -1
    },
    typeConstatPointDeControle () {
      return this.pointDeControle.constat ? typesConstats[this.pointDeControle.constat.type] : {}
    },
    showPointDeControle () {
      return !this.$permissions.isExploitant || this.pointDeControle.publie
    },
    peutEditer () {
      return !this.readonly && this.$permissions.isInspecteur && isBeforeState(this.etatInspection, 'attente_validation') && !this.editMode
    },
    peutPublier () {
      return this.$permissions.isInspecteur && !this.pointDeControle.publie && isBeforeState(this.etatInspection, 'attente_validation')
    },
    peutAjouterMessageEnCours () {
      return isBeforeState(this.etatInspection, 'attente_validation') && !this.$permissions.isApprobateur
    },
    constatNonConforme () {
      return this.pointDeControle.constat && this.pointDeControle.constat.type !== 'conforme'
    },
    peutAjouterMessageTraitementNonConformites () {
      return this.etatInspection === 'traitement_non_conformites' && this.constatNonConforme && !this.$permissions.isApprobateur
    },
    peutAjouterConstat () {
      return this.$permissions.isInspecteur && this.etatInspection === 'en_cours' && !this.pointDeControle.constat && !this.showNewConstatForm
    },
    peutVoirConstat () {
      return this.pointDeControle.constat && (!this.$permissions.isExploitant || isAfterState(this.etatInspection, 'attente_validation'))
    },
    peutSupprimerConstat () {
      return this.pointDeControle.constat && this.$permissions.isInspecteur && this.etatInspection === 'en_cours'
    },
    peutResoudreConstat () {
      return this.etatInspection === 'traitement_non_conformites' && this.constatNonConforme && !this.pointDeControle.constat.date_resolution && this.$permissions.isInspecteur
    },
    messagesEnCours () {
      return this.pointDeControle.messages.filter(m => !m.etape_traitement_non_conformites)
    },
    messagesTraitementNonConformites () {
      return this.pointDeControle.messages.filter(m => m.etape_traitement_non_conformites)
    },
    showTraitementNonConformites () {
      return isAfterState(this.etatInspection, 'attente_validation') && this.constatNonConforme
    }
  },
  created () {
    this.showMessages = this.deplier
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
        type: 'conforme',
        delai_nombre: 3,
        delai_unite: 'mois'
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
    },
    async addMessage (message) {
      await this.$api.inspections.ajouterMessage(this.pointDeControle.id, message)
    },
    async resoudreConstat () {
      await this.$api.inspections.resoudreConstat(this.pointDeControle.id)
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
