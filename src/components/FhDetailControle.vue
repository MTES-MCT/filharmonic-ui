<template lang="pug">
v-container.pa-0(:class="containerClass")
  v-layout.align-center
    v-flex.subheading.mr-2 Date du contrôle
    v-flex.text-xs-right(v-if="readonly") {{ controle.date }}
    v-flex.text-xs-right(v-else)
      v-menu(v-model="showDatePicker"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
            )
        v-text-field(slot="activator"
                      v-model="controle.date"
                      label="Date du contrôle"
                      prepend-icon="event"
                      readonly
                      hint=""
                      :rules="notEmpty"
                      required
                    )
        v-date-picker(v-model="controle.date" @input="showDatePicker = false" no-title)

  v-layout.align-center
    v-flex.subheading.mr-2 Type
    v-flex.text-xs-right(v-if="readonly") {{ controle.type | capitalize }}
    v-flex.justify-end(v-else)
      v-radio-group.justify-end.mt-0(row v-model="controle.type" hide-details)
        v-radio(label="Approfondi" value="approfondi")
        v-radio(label="Courant" value="courant")
        v-radio(label="Ponctuel" value="ponctuel")

  v-layout.align-center
    v-flex.subheading.mr-2 Annoncé
    v-flex.text-xs-right(v-if="readonly") {{ controle.annonce | format-yesno }}
    v-flex(v-else)
      v-checkbox.mt-0.pr-3.justify-end(v-model="controle.annonce" label="Annoncé" hide-details :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Origine
    v-flex.text-xs-right(v-if="readonly") {{ controle.origine | format-origine }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row hide-details v-model="controle.origine")
        v-radio(label="Plan de contrôle" value="plan_de_controle")
        v-radio(label="Circonstancielle" value="circonstancielle")

  v-layout.align-center(v-if="controle.origine === 'circonstancielle'")
    v-flex.subheading.mr-2 Circonstances
    v-flex.text-xs-right(v-if="readonly") {{ controle.circonstances | capitalize }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row v-model="controle.circonstances" hide-details required :rules="notEmpty" :readonly="readonly")
        v-radio(label="Incident" value="incident")
        v-radio(label="Plainte" value="plainte")
        v-radio(label="Autre" value="autre")

  v-layout.align-center(v-if="controle.circonstances === 'autre'")
    v-flex.subheading.mr-2 Détail des circonstances
    v-flex.text-xs-right(v-if="readonly") {{ controle.detailCirconstances }}
    v-flex(v-else)
      v-text-field(v-model="controle.detailCirconstances" required :rules="notEmpty" :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Inspecteurs
    v-flex.text-xs-right(v-if="readonly")
      v-chip(v-for="inspecteur in inspecteursControle" :key="inspecteur.id" small)
        v-avatar
          img(:src="inspecteur.photoURL")
        | {{ inspecteur.name }}
    v-flex(v-else)
      | {{ controle.inspecteurs }}
      v-autocomplete(v-model="controle.inspecteurs" :items="inspecteurs"
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
    v-flex.text-xs-right(v-if="readonly")
      v-chip(v-for="(theme, index) in controle.themes" :key="index" small) {{ theme }}
    v-flex.text-xs-right(v-else)
      v-combobox(v-model="controle.themes" :items="themes"
                chips small-chips deletable-chips dense multiple
                :search-input.sync="themeSearch"
                placeholder="Thèmes..."
                required :rules="themesRules"
                :readonly="readonly"
                )
        template(slot="no-data")
          v-list-tile
            .subheading Créer le thème
            v-chip(label small) {{ themeSearch }}
</template>

<script>
import { listInspecteurs } from '@/api/users'
import { listThemes } from '@/api/themes'

export default {
  name: 'FhDetailControle',
  props: {
    controle: {
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
      themes: []
    }
  },
  computed: {
    controleOrigine () {
      return this.controle.origine
    },
    controleCirconstances () {
      return this.controle.circonstances
    },
    containerClass () {
      return `grid-list-${this.readonly ? 'sm' : 'xl'}`
    },
    inspecteursControle () {
      if (!this.inspecteurs.length) {
        return []
      }
      return this.controle.inspecteurs
        .map(inspecteurId => {
          return this.inspecteurs.find(inspecteur => inspecteur.id === inspecteurId)
        })
    }
  },
  watch: {
    controleOrigine (val, oldVal) {
      if (oldVal === 'circonstancielle') {
        this.controle.circonstances = ''
        this.controle.detailCirconstances = ''
      } else {
        this.controle.circonstances = 'incident'
      }
    },
    controleCirconstances (val, oldVal) {
      if (oldVal === 'autre') {
        this.controle.detailCirconstances = ''
      }
    }
  },
  async created () {
    [this.inspecteurs, this.themes] = [await listInspecteurs(), await listThemes()]
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
    }
  }
}
</script>

<style lang="stylus">

</style>
