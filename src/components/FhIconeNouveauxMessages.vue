<template lang="pug">
v-icon.ml-4(v-if="messages"
            :medium="big" color="primary" :title="title"
            ) feedback
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
