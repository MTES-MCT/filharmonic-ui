<template lang="pug">
v-container.grid-list-xl
  v-layout.align-center
    v-flex.subheading Date du contrôle
    v-flex.text-xs-right
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
    v-flex.subheading Type
    v-flex
      v-radio-group.justify-end.mt-0(row hide-details v-model="controle.type")
        v-radio(label="Approfondi" value="approfondi")
        v-radio(label="Courant" value="courant")
        v-radio(label="Ponctuel" value="ponctuel")

  v-layout.align-center
    v-flex.subheading Annoncé
    v-flex
      v-checkbox.pr-3.justify-end(v-model="controle.annonce" label="Annoncé" hide-details)

  v-layout.align-center
    v-flex.subheading Origine
    v-flex
      v-radio-group.mt-0.justify-end(row hide-details v-model="controle.origine")
        v-radio(label="Plan de contrôle" value="plan_de_controle")
        v-radio(label="Circonstancielle" value="circonstancielle")

  v-layout.align-center(v-if="controle.origine === 'circonstancielle'")
    v-flex.subheading Circonstances
    v-flex
      v-radio-group.mt-0.justify-end(row v-model="controle.circonstances" hide-details required :rules="notEmpty")
        v-radio(label="Incident" value="incident")
        v-radio(label="Plainte" value="plainte")
        v-radio(label="Autre" value="autre")

  v-layout.align-center(v-if="controle.circonstances === 'autre'")
    v-flex.subheading Détail des circonstances
    v-flex
      v-text-field(v-model="controle.detailCirconstances" required :rules="notEmpty")

  v-layout.align-center
    v-flex.subheading Inspecteurs
    v-flex
      v-autocomplete(v-model="controle.inspecteurs" :items="inspecteurs"
                    chips deletable-chips dense multiple
                    item-text="name" item-value="id"
                    placeholder="Inspecteurs..."
                    required :rules="inspecteursRules"
                    )
        template(slot="selection" slot-scope="data")
          v-chip(close @input="removeInspecteur(data.item)")
            v-avatar
              img(:src="data.item.photoURL")
            | {{ data.item.name }}
        template(slot="item" slot-scope="data")
          v-list-tile-avatar
            img(:src="data.item.photoURL")
          v-list-tile-content
            v-list-tile-title(v-html="data.item.name")

  v-layout.align-center
    v-flex.subheading Thèmes
    v-flex.text-xs-right
      v-combobox(v-model="controle.themes" :items="themes"
                chips small-chips deletable-chips dense multiple
                :search-input.sync="themeSearch"
                placeholder="Thèmes..."
                required :rules="themesRules"
                )
        template(slot="no-data")
          v-list-tile
            .subheading Créer le thème
            v-chip(label small) {{ themeSearch }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FhDetailControle',
  props: {
    controle: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      valid: true,
      name: '',
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
      ]
    }
  },
  computed: {
    ...mapState([
      'themes'
    ]),
    ...mapGetters([
      'inspecteurs'
    ]),
    controleOrigine () {
      return this.controle.origine
    },
    controleCirconstances () {
      return this.controle.circonstances
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
