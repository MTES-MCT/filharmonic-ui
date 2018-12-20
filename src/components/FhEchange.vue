<template lang="pug">
v-expansion-panel(expand v-if="showEchange")
  v-expansion-panel-content.fh-echange
    v-layout.column(slot="header")
      .fh-echange__sujet
        | {{ echange.sujet }}
        v-icon.ml-4(v-if="echange.messagesNonLus"
                    :title="`${echange.messagesNonLus} nouveaux messages`"
                    color="primary"
                    ) feedback

      a.fh-echange__referenceReglementaire(v-for="referenceReglementaire in echange.referencesReglementaires"
                                            href="https://www.legifrance.gouv.fr/eli/arrete/2017/6/28/TREP1719163A/jo/texte/fr"
                                            target="_blank")
        | {{ referenceReglementaire }}

      .fh-echange__constat(v-if="echange.constat" :style="`border-left-color: ${typeConstatEchange.color}`")
        v-layout.align-center
          span.subheading.mr-2 Constat finalisé :
          v-chip(small :color="typeConstatEchange.color" dark text-color="white")
            v-avatar
              v-icon(large) {{ typeConstatEchange.icon }}
            | {{ typeConstatEchange.label }}

        v-layout.my-2(v-if="echange.constat.remarques")
          span.subheading.mr-2 Remarques&nbsp;:
          v-flex
            div {{ echange.constat.remarques }}
        v-layout.align-center(v-if="echange.constat.echeance")
          span.subheading.mr-2 Délai de mise en conformité :
          v-flex
            | Avant le&nbsp;
            time(:datetime="echange.constat.echeance") {{ echange.constat.echeance }}

    v-card.px-3
      v-card-text
        fh-messages(:echangeId="echange.id" :etatInspection="etatInspection" :messages="echange.messages")

        div(v-if="!echange.constat")
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
                      v-menu(
                        v-model="showNewConstatEcheancePicker"
                              :close-on-content-click="false"
                              lazy
                              transition="scale-transition"
                              offset-y
                            )
                        v-text-field(slot="activator"
                                      v-model="newConstat.echeance"
                                      label="Échéance"
                                      prepend-icon="event"
                                      readonly
                                      hint=""
                                      required
                                    )
                        v-date-picker(v-model="newConstat.echeance" @input="showNewConstatEcheancePicker = false" no-title)

              v-card-actions.justify-center.pb-3
                v-btn(color="primary" @click="ajouterConstat()")
                  v-icon(left) gavel
                  | Sauvegarder le constat

          v-btn.mt-4(color="secondary" v-if="peutAjouterConstat" @click="showNewConstatForm = true")
            v-icon(left) gavel
            | Ajouter un constat

</template>

<script>
import { typesConstats } from '@/api/inspections'
import FhMessages from '@/components/FhMessages.vue'

export default {
  name: 'FhEchange',
  components: {
    FhMessages
  },
  props: {
    echange: {
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
      showNewConstatForm: false,
      typesConstats,
      newConstat: {
        type: 'conforme'
      },
      showNewConstatEcheancePicker: false,
      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    typeConstatEchange () {
      return this.echange.constat ? typesConstats[this.echange.constat.type] : {}
    },
    showEchange () {
      return !this.$permissions.isExploitant || !this.echange.brouillon
    },
    peutAjouterConstat () {
      return !this.$permissions.isExploitant && this.etatInspection === 'en_cours' && !this.echange.constat && !this.showNewConstatForm
    }
  },
  methods: {
    resetNewConstat () {
      this.newConstat = {
        type: 'conforme'
      }
      this.showNewConstatForm = false
    },
    async ajouterConstat () {
      await this.$api.inspections.ajouterConstat(this.echange.id, this.newConstat)
      this.resetNewConstat()
    }
  }
}
</script>

<style lang="stylus">
.fh-echange
  background-color #f0f0f0 !important
  &:hover
    background-color darken(#f0f0f0, 5%) !important

  &__sujet
    font-size 1.3em

  &__referenceReglementaire
    font-size 0.9em
    align-self start

  &__constat
    margin-top 1em
    padding-left 1em
    border-left 5px solid darken(#f0f0f0, 50%)
</style>
