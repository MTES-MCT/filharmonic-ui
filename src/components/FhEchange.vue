<template lang="pug">
v-expansion-panel(expand v-if="echange && !error")
  v-expansion-panel-content.fh-echange
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
      v-card-text.subheading Fil de discussion
        fh-message(v-for="message in echange.reponses" v-bind:key="message.id" v-bind:message="message")
        v-layout.pl-2.mt-2.align-end
          v-textarea(box label="Message" v-model="newMessage" auto-grow hideDetails rows="1" clearable)
          v-btn.mb-0
            v-icon attach_file
          v-btn.mb-0(@click="addMessage(echange, newMessage); newMessage = ''" :disabled="!newMessage" color="primary" title="Envoyer")
            v-icon send
        v-btn(color="secondary")
          | Ajouter un constat

</template>

<script>
import FhMessage from '@/components/FhMessage.vue'

export default {
  name: 'FhEchange',
  components: {
    FhMessage
  },
  props: {
    echange: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      error: false,
      errorMessage: '',
      newMessage: '' // TODO partagé, il faudra faire un composant
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
