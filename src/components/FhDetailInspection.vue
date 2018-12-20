<template lang="pug">
v-container.pa-0(:class="containerClass")
  v-layout.align-center
    v-flex.subheading.mr-2 Date
    v-flex.text-xs-right(v-if="readonly") {{ detail.date }}
    v-flex.text-xs-right(v-else)
      v-menu(v-model="showDatePicker"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
            )
        v-text-field(slot="activator"
                      v-model="detail.date"
                      label="Date"
                      prepend-icon="event"
                      readonly
                      hint=""
                      :rules="notEmpty"
                      required
                    )
        v-date-picker(v-model="detail.date" @input="showDatePicker = false" no-title)

  v-layout.align-center
    v-flex.subheading.mr-2 Type
    v-flex.text-xs-right(v-if="readonly") {{ detail.type | capitalize }}
    v-flex.justify-end(v-else)
      v-radio-group.justify-end.mt-0(row v-model="detail.type" hide-details)
        v-radio(label="Approfondi" value="approfondi")
        v-radio(label="Courant" value="courant")
        v-radio(label="Ponctuel" value="ponctuel")

  v-layout.align-center
    v-flex.subheading.mr-2 Annoncé
    v-flex.text-xs-right(v-if="readonly") {{ detail.annonce | format-yesno }}
    v-flex(v-else)
      v-checkbox.mt-0.pr-3.justify-end(v-model="detail.annonce" label="Annoncé" hide-details :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Origine
    v-flex.text-xs-right(v-if="readonly") {{ detail.origine | format-origine }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row hide-details v-model="detail.origine")
        v-radio(label="Plan de contrôle" value="plan_de_controle")
        v-radio(label="Circonstancielle" value="circonstancielle")

  v-layout.align-center(v-if="detail.origine === 'circonstancielle'")
    v-flex.subheading.mr-2 Circonstances
    v-flex.text-xs-right(v-if="readonly") {{ detail.circonstances | capitalize }}
    v-flex(v-else)
      v-radio-group.mt-0.justify-end(row v-model="detail.circonstances" hide-details required :rules="notEmpty" :readonly="readonly")
        v-radio(label="Incident" value="incident")
        v-radio(label="Plainte" value="plainte")
        v-radio(label="Autre" value="autre")

  v-layout.align-center(v-if="detail.circonstances === 'autre'")
    v-flex.subheading.mr-2 Détail des circonstances
    v-flex.text-xs-right(v-if="readonly") {{ detail.detailCirconstances }}
    v-flex(v-else)
      v-text-field(v-model="detail.detailCirconstances" required :rules="notEmpty" :readonly="readonly")

  v-layout.align-center
    v-flex.subheading.mr-2 Inspecteurs
    v-flex.text-xs-right(v-if="readonly")
      v-chip(v-for="inspecteur in inspecteurs" :key="inspecteur.id" small)
        v-avatar
          img(:src="inspecteur.photoURL")
        | {{ inspecteur.name }}
    v-flex(v-else)
      v-autocomplete(v-model="inspecteurs" :items="listInspecteurs"
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
      v-combobox(v-model="themes" :items="listThemes"
                chips small-chips deletable-chips dense multiple
                :search-input.sync="themeSearch"
                placeholder="Thèmes..."
                required :rules="themesRules"
                :readonly="readonly"
                append-outer-icon="filter_list"
                @click:append-outer="moreThemes = !moreThemes")
        template(slot="selection" slot-scope="{ item, index }")
          v-chip(v-if="index < max")
            span {{ item }}
          span(v-if="index === max" class="grey--text caption") +{{ numberOtherThemes }} {{ others }}
        template(v-if="!readonly" slot="no-data")
            v-list-tile.subheading Créer le thème
              v-chip(label small) {{ themeSearch }}

  v-layout.align-center
    v-flex.subheading.mr-2 Contexte
    v-flex.text-xs-right(v-if="readonly") {{ detail.contexte }}
    v-flex(v-else)
      v-textarea(box v-model="detail.contexte" required :rules="notEmpty" :readonly="readonly")

</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { mapInspecteursMultiRowFields, mapThemesMultiRowFields } from '@/store/modules/inspection'
const { mapState: mapDetailState } = createNamespacedHelpers('inspection/detail')
export default {
  name: 'FhDetailInspection',
  props: {
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
      listThemes: [],
      listInspecteurs: [],
      moreThemes: false
    }
  },
  computed: {
    ...mapDetailState({
      detail: state => state.rows[0]
    }),
    ...mapThemesMultiRowFields({
      themes: 'rows'
    }),
    ...mapInspecteursMultiRowFields({
      inspecteurs: 'rows'
    }),
    inspectionOrigine () {
      return this.detail.origine
    },
    inspectionCirconstances () {
      return this.detail.circonstances
    },
    containerClass () {
      return `grid-list-${this.readonly ? 'sm' : 'xl'}`
    },
    max () {
      return this.moreThemes ? this.themes.length : 2
    },
    numberOtherThemes () {
      return this.themes.length - this.max
    },
    others () {
      return this.numberOtherThemes > 1 ? 'autres' : 'autre'
    }
  },
  watch: {
    inspectionOrigine (val, oldVal) {
      if (oldVal === 'circonstancielle') {
        this.detail.circonstances = ''
        this.detail.detailCirconstances = ''
      } else {
        this.detail.circonstances = 'incident'
      }
    },
    inspectionCirconstances (val, oldVal) {
      if (oldVal === 'autre') {
        this.detail.detailCirconstances = ''
      }
    }
  },
  async created () {
    [this.listInspecteurs, this.listThemes] = await Promise.all([this.$api.users.listInspecteurs(), await this.$api.themes.list()])
  },
  methods: {
    removeTheme (theme) {
      const index = this.themes.indexOf(theme)
      if (index !== -1) {
        this.themes.splice(index, 1)
      }
    },
    removeInspecteur (inspecteur) {
      const index = this.inspecteurs.indexOf(inspecteur.id)
      if (index !== -1) {
        this.inspecteurs.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
