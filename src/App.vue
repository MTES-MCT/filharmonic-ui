<template lang="pug">
#app
  router-view(:key="$route.fullPath")
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
