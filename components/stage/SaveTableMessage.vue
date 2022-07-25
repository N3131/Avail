<template>
<div>
    <v-alert
  text dense
  type="success" v-show="isSaved" transition="fade-transition"
>Tallentaminen onnistui</v-alert>
</div>
</template>

<script>
  export default {
    props: ['isSaved']
  }
</script>
