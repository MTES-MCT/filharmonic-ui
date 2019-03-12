<template lang="pug">
v-dialog(:value="showDialog" @input="$emit('close')" width="500")
  v-card
    v-toolbar(dark color="primary")
      v-toolbar-title.white--text Enregistrer un canevas
      v-spacer
      v-btn(icon @click="$emit('close')" title="Fermer")
        v-icon close
    v-divider
    v-card-text.text-xs-center
      p Veuillez saisir un nom. {{ canevas.nom }}
      v-combobox(:items="listeCanevas"
                 :search-input.sync="canevas.nom"
                 box clearable label="Nom" autofocus
                 :filter="filterFunc"
                )
    v-divider
    v-card-actions
      v-spacer
      v-btn(@click="submit" color="primary" :title="isUpdate ? 'Mettre à jour' : 'Enregistrer'" :loading="loading" :disabled="loading || !canevas.nom")
        v-icon(left) done
        span(v-if="isUpdate") Mettre à jour
        span(v-else) Enregistrer
</template>

<script>
import * as _ from '@/util'

export default {
  name: 'FhPopupCreationCanevas',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      listeCanevas: [],
      canevas: {
        nom: ''
      },
      filterFunc (item, queryText, itemText) {
        return _.normalize(itemText).indexOf(_.normalize(queryText)) > -1
      }
    }
  },
  computed: {
    isUpdate () {
      return this.listeCanevas.some(c => c === this.canevas.nom)
    }
  },
  watch: {
    async showDialog (value) {
      if (value) {
        this.canevas.nom = ''
        this.listeCanevas = (await this.$api.canevas.list()).map(c => c.nom)
      }
    }
  },
  methods: {
    submit () {
      this.loading = true
      this.$emit('submit', {
        data: this.canevas,
        done: (closeDialog = false) => {
          this.loading = false
          if (closeDialog) {
            this.$emit('close')
          }
        }
      })
    }
  }
}
</script>
