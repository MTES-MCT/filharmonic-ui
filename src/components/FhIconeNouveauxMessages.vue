<template lang="pug">
v-badge(v-if="messages" color="primary" overlap)
  template(v-slot:badge)
    | {{ messages }}
  v-icon.ml-2(:large="big" :title="title") mail
</template>

<script>
export default {
  name: 'FhIconeNouveauxMessages',
  props: {
    messages: {
      type: Number,
      required: true
    },
    big: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title () {
      return this.messages > 1 ? `${this.messages} nouveaux messages` : '1 nouveau message'
    }
  }
}
</script>
