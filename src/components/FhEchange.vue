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

      .fh-echange__constat(v-if="constat" :style="`border-left-color: ${constat.type.color}`")
        v-layout.align-center
          span.subheading.mr-2 Constat finalisé :
          v-chip(small :color="constat.type.color" dark text-color="white")
            v-avatar
              v-icon(large) {{ constat.type.icon }}
            | {{ constat.type.label }}

        v-layout.my-2(v-if="constat.remarques")
          span.subheading.mr-2 Remarques&nbsp;:
          v-flex
            div {{ constat.remarques }}
        v-layout.align-center(v-if="constat.echeance")
          span.subheading.mr-2 Délai de mise en conformité :
          v-flex
            | Avant le&nbsp;
            time(:datetime="constat.echeance") {{ constat.echeance }}

    v-card.px-3
      v-card-text
        v-card
          v-toolbar(flat dense)
            v-toolbar-title.subheading Messages {{ echange.id > 0 ? 'visibles' : 'invisibles' }} pour l'exploitant
            v-btn(small icon v-if="echange.id > 0" @click="toggleBrouillon" :color="colorBrouillon" :title="`${echange.brouillon ? 'Brouillon' : 'Publié'}`")
              v-icon {{ echange.brouillon ? 'visibility_off' : 'visibility' }}
            v-dialog(v-model="dialogNewMessage" v-if="showNewMessageForm" width="500")
              v-btn(small icon slot="activator" title="Nouveau message" :color="colorBrouillon")
                v-icon add
              v-card
                v-toolbar(dark color="primary")
                  v-toolbar-title(class="white--text") Nouveau message
                  v-spacer
                  v-btn(icon @click="dialogNewMessage = false" title="Fermer")
                    v-icon close
                v-divider
                v-card-text
                  v-textarea(box label="Message" v-model="newMessage" auto-grow hideDetails rows="1" clearable)
                  v-checkbox(v-model="confidential" label="Confidentiel" :disabled="echange.id < 0")
                v-divider
                v-card-actions
                  v-spacer
                  v-btn(icon title="Pièce jointe" @click="openAttachmentPopup")
                    v-icon attach_file
                  input(ref="file" type="file" @change="onFilesChange" multiple hidden)
                  v-btn(icon @click="addMessage(newMessage, confidential)" :disabled="!newMessage" color="primary" title="Envoyer")
                    v-icon send

          v-card-text
            v-timeline
              fh-message(v-for="(message, indexMessage) in messages" :key="message.id" :index="indexMessage" :colorBrouillon="colorBrouillon" v-if="message.echangeId === echange.id")

        div(v-if="!constat")
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
                  v-radio(v-for="(typeConstat, key) in typesConstat" :key="key" :label="typeConstat.label" :value="typeConstat.id")

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
                v-btn(color="primary" @click="addConstat")
                  v-icon(left) gavel
                  | Sauvegarder le constat

          v-btn.mt-4(color="secondary" v-if="!constat && !showNewConstatForm" @click="showNewConstatForm = true")
            v-icon(left) gavel
            | Ajouter un constat

</template>

<script>
import FhMessage from '@/components/FhMessage.vue'
import { SAVE } from '@/store/action-types'
import { createNamespacedHelpers } from 'vuex'
import { typesConstat, Constat } from '@/models/constat'

const { mapState: mapAuthenticationState } = createNamespacedHelpers('authentication')
const { mapState: mapEchangeState, mapActions: mapEchangeActions } = createNamespacedHelpers('inspection/echange')
const { mapState: mapMessageState, mapActions: mapMessageActions } = createNamespacedHelpers('inspection/echange/message')
const { mapState: mapEtatState } = createNamespacedHelpers('inspection/etat')
const { mapState: mapConstatState, mapActions: mapConstatActions } = createNamespacedHelpers('inspection/echange/constat')
const { mapActions: mapEvenementActions } = createNamespacedHelpers('inspection/evenement')

export default {
  name: 'FhEchange',
  components: {
    FhMessage
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showNewConstatForm: false,
      newConstat: new Constat(),
      showNewConstatEcheancePicker: false,
      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ],
      newMessage: '',
      confidential: true,
      dialogNewMessage: false,
      attachments: []
    }
  },
  computed: {
    typesConstat () {
      return typesConstat
    },
    showEchange () {
      return !this.$permissions.isExploitant || !this.echange.brouillon
    },
    ...mapEtatState({
      etat: state => state.rows[0]
    }),
    ...mapAuthenticationState({
      user: state => state.rows[0].user
    }),
    ...mapConstatState({
      constats: 'rows'
    }),
    ...mapEchangeState({
      echanges: 'rows'
    }),
    constat () {
      return this.constats[this.index]
    },
    ...mapMessageState({ messages: 'rows' }),
    showNewMessageForm () {
      return this.etat.order < 4
    },
    colorBrouillon () {
      return this.echange.brouillon ? 'primary' : 'success'
    },
    echange () {
      return this.echanges[this.index]
    }
  },
  methods: {
    openAttachmentPopup () {
      this.$refs.file.click()
    },
    addAttachment (...files) {
      files.forEach((file, index) => {
        this.attachments.push({
          id: new Date().getTime() + index,
          filename: file.name,
          type: file.type,
          url: URL.createObjectURL(file)
        })
      })
    },
    onFilesChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.addAttachment(...files)
      e.target.value = ''
    },
    resetNewConstat () {
      this.newConstat = new Constat()
      this.showNewConstatForm = false
    },
    ...mapConstatActions({ saveConstat: SAVE }),
    ...mapMessageActions({
      saveMessage: SAVE
    }),
    ...mapEvenementActions({
      saveEvenement: SAVE
    }),
    ...mapEchangeActions({
      saveEchange: SAVE
    }),
    async addConstat () {
      this.newConstat.echangeId = this.echange.id
      await this.saveConstat(this.newConstat)
      this.resetNewConstat()
    },
    async addMessage (messageText, confidential) {
      const messageId = await this.saveMessage({
        echangeId: this.echange.id,
        authorId: this.user.id,
        text: messageText,
        confidential: confidential,
        attachments: []
      })
      this.newMessage = ''
      this.dialogNewMessage = false
      const type = confidential ? 2 : 1
      this.saveEvenement({ type: type, inspectionId: this.echange.inspectionId, data: { messageId: messageId }, author: this.user })
    },
    toggleBrouillon () {
      this.saveEchange({
        echange: { id: this.echange.id, brouillon: !this.echange.brouillon },
        index: this.index
      })
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
