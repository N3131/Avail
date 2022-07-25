<template>
    <v-dialog
      v-model="dialog"
      max-width="310"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          class="mr-3"
          v-bind="attrs"
          v-on="on"
        >
          Tallenna
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h6">
          Tallennetaanko muutokset?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="saveChanges"
          >
            Jatka
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            Peruuta
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
    methods: {
     saveChanges (event) {
         this.$emit('saved', true)
         this.dialog = false
     }
   }
  }
</script>