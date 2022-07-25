<template>
<div>
    <v-textarea
        clearable
        clear-icon="mdi-close-circle"
        outlined
        rows="2"
        label="Huomiot"
        class="mt-6"
        style="max-width: 70%" 
        :value="notifText"
        @input="$emit('updatedText', $event)"
    ></v-textarea>
</div>
</template>

<script>
export default {
    props: ['notifText', 'notifId'],
  }
</script>
