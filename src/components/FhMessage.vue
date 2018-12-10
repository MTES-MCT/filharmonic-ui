<template lang="pug">
  v-timeline-item(fill-dot :icon="icon" :color="color")
    v-card(dark :color="color")
      v-card-title(primary-title v-if="author" class="title")
        div
          div(class="headline")
            span {{ message.text }}
            fh-attachment(flat
              v-for="attachment in message.attachments" :key="attachment.id" :attachment="attachment")
      v-chip(:color="color" small text-color="white")
        v-avatar
          img(:src="author.photoURL" :alt="author.name")
        | {{ author.name }}
      span Le {{ message.date.toLocaleString() }}
      v-card-actions
        v-spacer
        v-switch(v-if="inspecteur" v-model="message.lu" :label="label")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import { getUser } from '@/api/users'
import { mapState } from 'vuex'

export default {
  name: 'FhMessage',
  components: {
    FhAttachment
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      author: null
    }
  },
  computed: {
    color () {
      return this.message.lu ? 'grey' : 'blue'
    },
    icon () {
      return this.message.lu ? 'drafts' : 'markunread'
    },
    label () {
      return this.message.lu ? 'Lu' : 'Non lu'
    },
    ...mapState({
      userInspecteur: state => state.authentication.user.type === 'inspecteur'
    })
  },
  async created () {
    this.author = await getUser(this.message.authorId)
  },
  methods: {
    inspecteur () {
      return this.author.type === 'inspecteur' && this.userInspecteur
    }
  }
}
</script>
