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
        v-radio(label="Plan de inspection" value="plan_de_inspection")
        v-radio(label="Circonstancielle" value="circonstancielle")

  v-layout.align-center(v-if="inspection.origine === 'circonstancielle'")
    v-flex.subheading.mr-2 Circonstances
    v-flex.text-xs-right(v-if="readonly") {{ inspection.circonstances | capitalize }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row v-model="inspection.circonstances" hide-details required :rules="notEmpty" :readonly="readonly")
        v-radio(label="Incident" value="incident")
        v-radio(label="Plainte" value="plainte")
        v-radio(label="Autre" value="autre")

  v-layout.align-center(v-if="inspection.circonstances === 'autre'")
    v-flex.subheading.mr-2 Détail des circonstances
    v-flex.text-xs-right(v-if="readonly") {{ inspection.detailCirconstances }}
    v-flex(v-else)
      v-text-field(v-model="inspection.detailCirconstances" required :rules="notEmpty" :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Inspecteurs
    v-flex.text-xs-right(v-if="readonly")
      v-chip(v-for="inspecteur in inspecteursInspection" :key="inspecteur.id" small)
        v-avatar
          img(:src="inspecteur.photoURL")
        | {{ inspecteur.name }}
    v-flex(v-else)
      v-autocomplete(v-model="inspection.inspecteurs" :items="inspecteurs"
                    chips dense multiple
                    item-text="name" item-value="id"
                    placeholder="Inspecteurs..."
                    required :rules="inspecteursRules"
                    :readonly="readonly"
                    )
        template(slot="selection" slot-scope="data")
          v-chip(:close="!readonly" @input="removeInspecteur(data.item)")
            v-avatar
              img(:src="data.item.photoURL")
            | {{ data.item.name }}
        template(slot="item" slot-scope="data")
          v-list-tile-avatar
            img(:src="data.item.photoURL")
          v-list-tile-content
            v-list-tile-title(v-html="data.item.name")

  v-layout.align-center
    v-flex.subheading.mr-2 Thèmes
    v-flex.text-xs-right
      v-combobox(v-model="inspection.themes" :items="themes"
                chips small-chips deletable-chips dense multiple
                :search-input.sync="themeSearch"
                placeholder="Thèmes..."
                required :rules="themesRules"
                :readonly="readonly"
                append-outer-icon="filter_list"
                :append-outer-icon-cb="() => moreThemes = !moreThemes")
        template(slot="selection" slot-scope="{ item, index }")
          v-chip(v-if="index < max")
            span {{ item }}
          span(v-if="index === max" class="grey--text caption") +{{ inspection.themes.length - max }} autres
        template(v-if="!readonly" slot="no-data")
            v-list-tile.subheading Créer le thème
              v-chip(label small) {{ themeSearch }}

  v-layout.align-center
    v-flex.subheading.mr-2 Contexte
    v-flex.text-xs-right(v-if="readonly") {{ inspection.contexte }}
    v-flex(v-else)
      v-textarea(box v-model="inspection.contexte" required :rules="notEmpty" :readonly="readonly")

</template>

<script>
import { listInspecteurs } from '@/api/users'
import { listThemes } from '@/api/themes'

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

      // fetched on init
      inspecteurs: [],
      themes: [],
      moreThemes: false
    }
  },
  computed: {
    inspectionOrigine () {
      return this.inspection.origine
    },
    inspectionCirconstances () {
      return this.inspection.circonstances
    },
    containerClass () {
      return `grid-list-${this.readonly ? 'sm' : 'xl'}`
    },
    inspecteursInspection () {
      if (!this.inspecteurs.length) {
        return []
      }
      return this.inspection.inspecteurs
        .map(inspecteurId => {
          return this.inspecteurs.find(inspecteur => inspecteur.id === inspecteurId)
        })
    },
    max () {
      return this.moreThemes ? this.inspection.themes.length : 2
    }
  },
  watch: {
    inspectionOrigine (val, oldVal) {
      if (oldVal === 'circonstancielle') {
        this.inspection.circonstances = ''
        this.inspection.detailCirconstances = ''
      } else {
        this.inspection.circonstances = 'incident'
      }
    },
    inspectionCirconstances (val, oldVal) {
      if (oldVal === 'autre') {
        this.inspection.detailCirconstances = ''
      }
    }
  },
  async created () {
    [this.inspecteurs, this.themes] = [await listInspecteurs(), await listThemes()]
  },
  methods: {
    removeTheme (theme) {
      const index = this.inspection.themes.indexOf(theme)
      if (index !== -1) {
        this.inspection.themes.splice(index, 1)
      }
    },
    removeInspecteur (inspecteur) {
      const index = this.inspection.inspecteurs.indexOf(inspecteur.id)
      if (index !== -1) {
        this.inspection.inspecteurs.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
