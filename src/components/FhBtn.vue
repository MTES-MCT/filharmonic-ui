<template lang="pug">
v-btn(@click="executeAction()"
      :loading="loading" :disabled="loading || disableif"
      :icon="icon" :large="large" :title="title"
      :color="color" :block="block" :dark="dark"
      :depressed="depressed"
      )
  slot
</template>

<script>
export default {
  name: 'FhBtn',
  props: {
    action: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    large: {
      type: Boolean
    },
    icon: {
      type: Boolean
    },
    color: {
      type: String,
      default: undefined
    },
    block: {
      type: Boolean
    },
    disableif: {
      type: Boolean
    },
    dark: {
      type: Boolean
    },
    depressed: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async executeAction () {
      this.loading = true
      try {
        await this.action()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
