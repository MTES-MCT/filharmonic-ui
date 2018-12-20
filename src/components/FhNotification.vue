<template lang="pug">
v-list-tile
  v-list-tile-content
    v-list-tile-title {{ notification.evenement.type }}
    v-list-tile-sub-title {{ notification.created_at.toLocaleString() }}
  v-list-tile-action
    v-btn(icon title="Marquer comme lu" @click="$emit('marquerCommeLue')")
      v-icon(color="primary") remove_red_eye
</template>

<script>
export default {
  name: 'FhNotification',
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>
