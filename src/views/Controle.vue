<template lang="pug">
v-container
  h1.text-xs-center.display-1.font-weight-bold.mb-3 Contrôle n°{{ controle.id }} du {{ controle.date.toLocaleDateString() }}

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
          v-toolbar-title Détails du contrôle
        v-card-text
          v-container.pa-0.grid-list-sm
            v-layout.align-center
              v-flex Date du contrôle
              v-flex.text-xs-right {{ controle.date.toLocaleDateString() }}
            v-layout.align-center
              v-flex État
              v-flex.text-xs-right
                v-chip(color="green" text-color="white") En cours
            v-layout.align-center
              v-flex Type
              v-flex
                v-radio-group.mt-0.justify-end(row hide-details v-model="controle.type")
                  v-radio(label="Approfondi" value="approfondi")
                  v-radio(label="Courant" value="courant")
                  v-radio(label="Ponctuel" value="ponctuel")
            v-layout.align-center
              v-flex Annoncé
              v-flex.text-xs-right
                v-radio-group.mt-0.justify-end(row hide-details v-model="controle.annonce")
                  v-radio(label="Oui" value="true")
                  v-radio(label="Non" value="false")
            v-layout.align-center
              v-flex Origine
              v-flex.text-xs-right
                v-radio-group.mt-0.justify-end(row hide-details v-model="controle.origine")
                  v-radio(label="Plan de contrôle" value="plan_de_controle")
                  v-radio(label="Circonstancielle" value="circonstancielle")
            v-layout.align-center(v-if="controle.origine == 'circonstancielle'")
              v-flex Circonstances
              v-flex.text-xs-right
                v-radio-group.mt-0.justify-end(row hide-details v-model="controle.circonstances")
                  v-radio(label="Incident" value="incident")
                  v-radio(label="Plainte" value="plainte")
                  v-radio(label="Autre" value="autre")
            v-layout.align-center
              v-flex Inspecteurs
              v-flex.text-xs-right
                v-chip(close)
                  v-avatar
                    img(src="https://randomuser.me/api/portraits/men/85.jpg")
                  | Alain Champion
                v-chip(close)
                  v-avatar
                    img(src="https://randomuser.me/api/portraits/women/85.jpg")
                  | Corine Dupont
            v-layout.align-center
              v-flex Thèmes
              v-flex.text-xs-right
                v-combobox(v-model="controle.themes" :items="themes"
                           chips small-chips deletable-chips dense multiple hide-details
                           :search-input.sync="themeSearch"
                          )
                  template(slot="no-data")
                    v-list-tile
                      .subheading Créer le thème
                      v-chip(label small) {{ themeSearch }}

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
                router-link(to="/etablissements/1") {{ controle.etablissement.nom }}
            v-layout
              v-flex Raison sociale
              v-flex.text-xs-right
                router-link(to="/etablissements/1") {{ controle.etablissement.raison }}
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
  v-expansion-panel
    v-expansion-panel-content(expand v-for="(echange, index) in controle.echanges" :key="index")
      v-layout(slot="header")
        div.mr-2 {{ echange.question.date.toLocaleString() }}
        strong.mr-2 {{ echange.question.author }} :
        div {{ echange.question.text }}
        div.ml-2.grey--text ({{ echange.reponses.length }} réponse{{ echange.reponses.length > 1 ? 's': '' }})
      v-card
        v-card-text
          div(v-for="(message, index) in echange.reponses" :key="index")
            v-divider
            v-layout.pl-2.my-2
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
import { mapState } from 'vuex'

export default {
  components: {
    pdf
  },
  data () {
    return {
      newMessage: '', // TODO partagé, il faudra faire un composant
      showAttachmentDialog: false,
      dialogAttachment: null,
      newComment: '',
      themeSearch: null,
      controle: {
        id: '1',
        date: new Date('2018-11-15'),
        type: 'approfondi',
        annonce: true,
        origine: 'plan_de_controle',
        state: 2, // en cours
        themes: [
          "Rejets dans l'air",
          "Rejets dans l'eau",
          'Incendie',
          'COV'
        ],
        etablissement: {
          id: '0999.00001',
          nom: 'Etablissement A',
          raison: 'Etablissement A',
          activite: 'Fabrication de matrices composites',
          regimeSeveso: '',
          adresse: '123 rue de Paris'
        },
        comments: [
          {
            author: 'Corine Dupont',
            text: "Attention à l'article 243.",
            date: new Date('2018-11-14T08:50:00')
          },
          {
            author: 'Alain Champion',
            text: "L'article 843 s'applique également.",
            date: new Date('2018-11-16T16:50:00')
          }
        ],
        echanges: [
          {
            question: {
              author: 'Alain Champion',
              text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
              date: new Date('2018-11-16T14:00:00'),
              attachments: []
            },
            reponses: [
              {
                author: 'Monsieur Entreprise',
                text: 'Voici le document en question.',
                date: new Date('2018-11-16T16:50:00'),
                attachments: [
                  {
                    id: 1,
                    filename: 'analyses_2018.pdf',
                    type: 'pdf'
                  }
                ]
              },
              {
                author: 'Alain Champion',
                text: 'Merci.',
                date: new Date('2018-11-17T12:55:00')
              }
            ]
          },
          {
            question: {
              author: 'Alain Champion',
              text: "Auriez-vous l'obligeance de me fournir une photo de la cuve ?",
              date: new Date('2018-11-16T14:10:00'),
              attachments: []
            },
            reponses: [
              {
                author: 'Monsieur Entreprise',
                text: 'Voici une photo.',
                date: new Date('2018-11-17T08:50:00'),
                attachments: [
                  {
                    id: 2,
                    filename: 'photo_cuve.jpg',
                    type: 'image'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'themes'
    ])
  },
  methods: {
    removeTheme (theme) {
      const index = this.themes.indexOf(theme)
      if (index !== -1) {
        this.themes.splice(index, 1)
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
