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

    v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title Entreprise contrôlée
        v-card-text
          v-container.pa-0.grid-list-sm
            v-layout
              v-flex S3IC
              v-flex.text-xs-right {{ controle.installation.id }}
            v-layout
              v-flex Raison sociale
              v-flex.text-xs-right
                router-link(to="/installations/1") {{ controle.installation.nom }}
            v-layout
              v-flex Adresse
              v-flex.text-xs-right {{ controle.installation.adresse }}
            v-layout
              v-flex Activité principale
              v-flex.text-xs-right {{ controle.installation.activite }}
            v-layout
              v-flex Régime Seveso
              v-flex.text-xs-right Haut

  h4.display-1.my-4 Échanges
  v-expansion-panel
    v-expansion-panel-content(expand v-for="(echange, index) in controle.echanges" :key="index")
      v-layout(slot="header")
        div.mr-2 {{ echange.question.date.toLocaleDateString() }}
        div {{ echange.question.author }} : {{ echange.question.text }}
      v-card
        v-card-text(v-for="(message, index) in echange.reponses" :key="index")
          v-layout
            div.mr-2 {{ message.date.toLocaleDateString() }}
            div {{ message.author }} : {{ message.text }}
            div.ml-4(v-if="message.attachments")
              v-btn(flat v-for="attachment in message.attachments" :key="index")
                v-icon(v-if="attachment.type == 'pdf'") picture_as_pdf
                v-icon(v-if="attachment.type == 'image'") photo
                span.ml-2 {{ attachment.filename }}
        v-layout.align-end
          v-textarea(box label="Message" v-model="newMessage" auto-grow rows="1")
          v-btn.mb-4
            v-icon attach_file
          v-btn.mb-4(@click="addMessage(echange, newMessage); newMessage = ''" color="primary") Envoyer

</template>

<script>
export default {
  data () {
    return {
      newMessage: '', // TODO partagé, il faudra faire un composant
      controle: {
        id: '1',
        date: new Date('2018-11-15'),
        type: 'approfondi',
        annonce: true,
        origine: 'plan_de_controle',
        state: 2, // en cours
        installation: {
          id: '0999.00001',
          nom: 'Installation A',
          activite: 'Fabrication de matrices composites',
          regimeSeveso: '',
          adresse: '123 rue de Paris'
        },
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
  methods: {
    addMessage (echange, message) {
      echange.reponses.push({
        author: 'Alain Champion',
        date: new Date(),
        text: message,
        attachments: []
      })
    }
  }
}
</script>
