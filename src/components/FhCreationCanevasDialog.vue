<template lang="pug">
fh-dialog(:show-dialog="showDialog" title="Enregistrer un canevas" @close="$emit('close')")
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
    fh-btn(:action="submit" color="primary" :title="isUpdate ? 'Mettre à jour' : 'Enregistrer'" :disableif="!canevas.nom")
      v-icon(left) done
      span(v-if="isUpdate") Mettre à jour
      span(v-else) Enregistrer
</template>

<script>
import * as _ from '@/util'
import FhBtn from '@/components/FhBtn.vue'
import FhDialog from '@/components/FhDialog.vue'

export default {
  name: 'FhCreationCanevasDialog',
  components: {
    FhBtn,
    FhDialog
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    action: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
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
    async submit () {
      try {
        await this.action(this.canevas)
        this.$emit('close')
      } finally {
      }
    }
  }
}
</script>
