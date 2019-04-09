<template lang="pug">
v-container.pa-0(:class="containerClass")
  v-layout.align-center
    v-flex.subheading.mr-2 Date
    v-flex.text-xs-right(v-if="readonly") {{ inspection.date }}
    v-flex.text-xs-right(v-else)
      v-menu(v-model="showDatePicker"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
            )
        v-text-field(slot="activator"
                      v-model="inspection.date"
                      label="Date"
                      prepend-icon="event"
                      readonly
                      hint=""
                      :rules="notEmpty"
                      required
                    )
        v-date-picker(v-model="inspection.date" @input="showDatePicker = false" no-title)

  v-layout.align-center
    v-flex.subheading.mr-2 Type
    v-flex.text-xs-right(v-if="readonly") {{ inspection.type | capitalize }}
    v-flex.justify-end(v-else)
      v-radio-group.justify-end.mt-0(row v-model="inspection.type" hide-details)
        v-radio(label="Approfondi" value="approfondi")
        v-radio(label="Courant" value="courant")
        v-radio(label="Ponctuel" value="ponctuel")

  v-layout.align-center
    v-flex.subheading.mr-2 Annoncé
    v-flex.text-xs-right(v-if="readonly") {{ inspection.annonce | format-yesno }}
    v-flex(v-else)
      v-checkbox.mt-0.pr-3.justify-end(v-model="inspection.annonce" label="Annoncé" hide-details :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Origine
    v-flex.text-xs-right(v-if="readonly") {{ inspection.origine | format-origine }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row hide-details v-model="inspection.origine")
        v-radio(label="Plan de contrôle" value="plan_de_controle")
        v-radio(label="Circonstancielle" value="circonstancielle")

  v-layout.align-center(v-if="inspection.origine === 'circonstancielle'")
    v-flex.subheading.mr-2 Circonstances
    v-flex.text-xs-right(v-if="readonly") {{ inspection.circonstance | capitalize }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row v-model="inspection.circonstance" hide-details required :rules="notEmpty" :readonly="readonly")
        v-radio(label="Incident" value="incident")
        v-radio(label="Plainte" value="plainte")
        v-radio(label="Autre" value="autre")

  v-layout.align-center(v-if="inspection.circonstance === 'autre'")
    v-flex.subheading.mr-2 Détail des circonstances
    v-flex.text-xs-right(v-if="readonly") {{ inspection.detail_circonstance }}
    v-flex(v-else)
      v-text-field(v-model="inspection.detail_circonstance" required :rules="notEmpty" :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Inspecteurs
    v-flex.text-xs-right(v-if="readonly")
      v-chip(v-for="inspecteur in inspection.inspecteurs" :key="inspecteur.id" small)
        | {{ inspecteur.fullname }}
    v-flex(v-else)
      v-autocomplete(v-model="inspection.inspecteurs" :items="inspecteurs"
                    chips deletable-chips dense multiple hide-selected
                    item-text="fullname" return-object
                    placeholder="Inspecteurs..."
                    required :rules="inspecteursRules"
                    )

  v-layout.align-center
    v-flex.subheading.mr-2 Personnes rencontrées
    v-spacer
    .fh-multiline(v-if="readonly") {{ inspection.personnes_rencontrees }}
    v-flex(v-else)
      v-textarea(box v-model="inspection.personnes_rencontrees")

  v-layout.align-center
    v-flex.subheading.mr-2 Thèmes
    v-flex.text-xs-right(v-if="readonly")
      v-chip(v-for="theme in inspection.themes" :key="theme" small)
        | {{ theme }}
    v-flex.text-xs-right(v-else)
      v-autocomplete(v-model="inspection.themes" :items="themes"
                    chips small-chips deletable-chips dense multiple hide-selected
                    :search-input.sync="themeSearch"
                    placeholder="Thèmes..."
                    required :rules="themesRules" :filter="filterFunc"
                    )

  v-layout.align-center
    v-flex.subheading.mr-2 Contexte
    v-spacer
    .fh-multiline(v-if="readonly") {{ inspection.contexte }}
    v-flex(v-else)
      v-textarea(box v-model="inspection.contexte")

</template>

<script>
import * as _ from '@/util'

export default {
  name: 'FhDetailInspection',
  props: {
    inspection: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showDatePicker: false,
      themeSearch: null,

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ],
      inspecteursRules: [
        v => v.length > 0 || 'Il faut choisir au moins un inspecteur'
      ],
      themesRules: [
        v => v.length > 0 || 'Il faut choisir au moins un thème'
      ],
      filterFunc (item, queryText, itemText) {
        return _.normalize(itemText).indexOf(_.normalize(queryText)) > -1
      },

      // fetched on init
      inspecteurs: [],
      themes: []
    }
  },
  computed: {
    inspectionOrigine () {
      return this.inspection.origine
    },
    inspectionCirconstance () {
      return this.inspection.circonstance
    },
    containerClass () {
      return `grid-list-${this.readonly ? 'sm' : 'xl'}`
    }
  },
  watch: {
    inspectionOrigine (val, oldVal) {
      if (oldVal === 'circonstancielle') {
        this.inspection.circonstance = ''
        this.inspection.detail_circonstance = ''
      } else {
        this.inspection.circonstance = 'incident'
      }
    },
    inspectionCirconstance (val, oldVal) {
      if (oldVal === 'autre') {
        this.inspection.detail_circonstance = ''
      }
    }
  },
  async created () {
    if (!this.readonly) {
      [this.inspecteurs, this.themes] = await Promise.all([this.$api.users.listInspecteurs(), (await this.$api.themes.list()).map(t => t.nom)])
    }
  },
  methods: {
    removeTheme (theme) {
      const index = this.inspection.themes.indexOf(theme)
      if (index !== -1) {
        this.inspection.themes.splice(index, 1)
      }
    },
    removeInspecteur (inspecteurId) {
      this.inspection.inspecteurs = this.inspection.inspecteurs.filter(i => i.id !== inspecteurId)
    }
  }
}
</script>
