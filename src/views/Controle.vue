<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="error") Contrôle non existant. Mauvaise URL ?
  v-container(v-if="controle")
    h1.display-2.text-xs-center.mb-3 Contrôle n°{{ controle.id }}
    v-stepper(v-model="controle.state")
      v-stepper-header
        v-stepper-step(step="1" complete) Création
        v-divider
        v-stepper-step(step="2") Rapport en cours
        v-divider
        v-stepper-step(step="3") Validé
        v-divider
        v-stepper-step(step="4") Terminé

    v-layout.row.wrap.mt-3.grid-list-lg
      v-flex.xs12.md6.pa-2
        v-card
          v-toolbar(flat)
            v-toolbar-title
              | Détails du contrôle
            v-spacer
            v-toolbar-items
              v-btn(flat :to="`/controles/${this.controleId}/details`" title="Modifier le contrôle")
                v-icon(medium) edit
          v-card-text
            fh-detail-controle(:controle="controle" readonly)

      v-flex.xs12.md6.pa-2
        v-card
          v-toolbar(flat)
            v-toolbar-title Etablissement contrôlé
          v-card-text
            v-container.pa-0.grid-list-sm
              v-layout
                v-flex S3IC
                v-flex.text-xs-right {{ controle.etablissement.id }}
              v-layout
                v-flex Nom usuel
                v-flex.text-xs-right
                  router-link(:to="`/etablissements/${controle.etablissementId}`") {{ controle.etablissement.nom }}
              v-layout
                v-flex Raison sociale
                v-flex.text-xs-right {{ controle.etablissement.raison }}
              v-layout
                v-flex Adresse
                v-flex.text-xs-right {{ controle.etablissement.adresse }}
              v-layout
                v-flex Activité principale
                v-flex.text-xs-right {{ controle.etablissement.activite }}
              v-layout
                v-flex Régime Seveso
                v-flex.text-xs-right Haut

    h4.display-1.my-4
      | Échanges
      v-btn(icon title="Démarrer un nouvel échange" @click="addDiscussion()")
        v-icon add

    v-expansion-panel(expand)
      v-expansion-panel-content.fh-echange(expand v-for="(echange, index) in controle.echanges" :key="index")
        v-layout.column(slot="header")
          .fh-echange__sujet
            | {{ echange.sujet }}
            span.ml-2.grey--text ({{ echange.reponses.length }} réponse{{ echange.reponses.length > 1 ? 's': '' }})
          a.fh-echange__referenceReglementaire(v-for="referenceReglementaire in echange.referencesReglementaires"
                                               href="https://www.legifrance.gouv.fr/eli/arrete/2017/6/28/TREP1719163A/jo/texte/fr"
                                               target="_blank")
            | {{ referenceReglementaire }}

          .fh-echange__constat(v-if="echange.constat")
            v-layout.align-center
              span.subheading.mr-2 Constat finalisé :
              span(v-if="echange.constat.type === 'conforme'")
                v-chip(small color="green" dark text-color="white")
                  v-avatar
                    v-icon(large) check_circle
                  | Conforme
              span(v-else)
                v-chip(small color="red" dark text-color="white")
                  v-avatar
                    v-icon(large) error
                  | Non conforme

            div(v-if="echange.constat.type !== 'conforme'")
              v-layout.align-center
                span.subheading.mr-2 Observation :
                v-flex
                  div {{ echange.constat.observation }}
              v-layout.align-center
                span.subheading.mr-2 Délai de mise en conformité :
                v-flex
                  | Avant le&nbsp;
                  time(:datetime="echange.constat.echeance") {{ echange.constat.echeance }}

        v-card.px-3
          v-card-text
            .subheading Fil de discussion
            div(v-for="(message, index) in echange.reponses" :key="index")
              v-layout.pl-2.my-3
                div.mr-2 {{ message.date.toLocaleString() }}
                strong.mr-2 {{ message.author }} :
                div {{ message.text }}
                div.ml-4(v-if="message.attachments")
                  v-btn(flat
                        v-for="(attachment, index) in message.attachments" :key="attachment.id"
                        @click="openAttachment(attachment)"
                        )
                    v-icon(v-if="attachment.type == 'pdf'") picture_as_pdf
                    v-icon(v-if="attachment.type == 'image'") photo
                    span.ml-2 {{ attachment.filename }}
              v-divider
            v-layout.pl-2.mt-2.align-end
              v-textarea(box label="Message" v-model="newMessage" auto-grow hideDetails rows="1" clearable)
              v-btn.mb-0
                v-icon attach_file
              v-btn.mb-0(@click="addMessage(echange, newMessage); newMessage = ''" :disabled="!newMessage" color="primary" title="Envoyer")
                v-icon send
            v-btn(color="secondary")
              | Ajouter un constat

    h4.display-1.my-4
      | Commentaires
    p Les commentaires sont internes et ne sont seulement visibles que par les inspecteurs.
    v-card
      v-card-text
        div(v-for="(comment, index) in controle.comments" :key="index")
          v-layout.pl-2.my-2
            div.mr-2 {{ comment.date.toLocaleString() }}
            strong.mr-2 {{ comment.author }} :
            div {{ comment.text }}
            div.ml-4(v-if="comment.attachments")
              v-btn(flat
                    v-for="(attachment, index) in comment.attachments" :key="attachment.id"
                    @click="openAttachment(attachment)"
                    )
                v-icon(v-if="attachment.type == 'pdf'") picture_as_pdf
                v-icon(v-if="attachment.type == 'image'") photo
                span.ml-2 {{ attachment.filename }}
          v-divider
        v-layout.pl-2.mt-2.align-end
          v-textarea(box label="Commentaire" v-model="newComment" auto-grow hideDetails rows="1" clearable)
          v-btn.mb-0
            v-icon attach_file
          v-btn.mb-0(@click="addComment();" :disabled="!newComment" color="primary" title="Envoyer")
            v-icon send

  v-dialog(v-model="showAttachmentDialog" scrollable width="800px")
    v-card(v-if="dialogAttachment")
      v-toolbar(color="primary" dark)
        v-toolbar-title.headline Visualisation : {{ dialogAttachment.filename }}
        v-spacer
        v-toolbar-items
          v-btn(flat dark @click="closeAttachment()")
            v-icon close
      v-card-text
        pdf(v-if="dialogAttachment.type == 'pdf'" src="/test/lorem-ipsum.pdf")
        v-img(v-if="dialogAttachment.type == 'image'" :src="`https://picsum.photos/800/600?image=${dialogAttachment.id}`")
</template>

<script>
import pdf from 'vue-pdf'
import { getControle } from '@/api/controles'
import FhDetailControle from '@/components/FhDetailControle.vue'

export default {
  components: {
    FhDetailControle,
    pdf
  },
  props: {
    controleId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      error: false,
      newMessage: '', // TODO partagé, il faudra faire un composant
      showAttachmentDialog: false,
      dialogAttachment: null,
      newComment: '',
      controle: null // fetched on init
    }
  },
  async created () {
    this.controle = await getControle(this.controleId, { etablissement: true })
    if (!this.controle) {
      this.error = true
    }
  },
  methods: {
    removeTheme (theme) {
      const index = this.controle.themes.indexOf(theme)
      if (index !== -1) {
        this.controle.themes.splice(index, 1)
      }
    },
    removeInspecteur (inspecteur) {
      const index = this.controle.inspecteurs.indexOf(inspecteur.id)
      if (index !== -1) {
        this.controle.inspecteurs.splice(index, 1)
      }
    },
    addDiscussion () {
      this.controle.echanges.unshift({
        question: {
          author: 'Alain Champion',
          text: 'Nouvel échange...',
          date: new Date(),
          attachments: []
        },
        reponses: []
      })
    },
    addMessage (echange, message) {
      echange.reponses.push({
        author: 'Alain Champion',
        date: new Date(),
        text: message,
        attachments: []
      })
    },
    openAttachment (attachment) {
      this.dialogAttachment = attachment
      // wait for content fetch to show the dialog
      setTimeout(() => {
        this.showAttachmentDialog = true
      }, 200)
    },
    closeAttachment () {
      this.showAttachmentDialog = false
      // wait the end of the transition to clear the data
      setTimeout(() => {
        this.dialogAttachment = null
      }, 500)
    },
    addComment () {
      this.controle.comments.push({
        author: 'Alain Champion',
        text: this.newComment,
        date: new Date(),
        attachments: []
      })
      this.newComment = ''
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
