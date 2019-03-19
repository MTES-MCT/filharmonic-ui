<template lang="pug">
v-dialog(:value="showDialog" @input="$emit('close')" width="500")
  v-card
    v-toolbar(dark color="primary")
      v-toolbar-title(class="white--text") {{ title }}
      v-spacer
      v-btn(icon @click="$emit('close')" title="Fermer")
        v-icon close
    v-divider
    slot
</template>

<script>
export default {
  name: 'FhDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
