<template>
    <v-container>
      <!-- stage name -->
        <h2>{{ this.data[0].name }}</h2>
        <!-- start and end date -->
        <v-card-subtitle>{{ dateConverter(this.data[0].startDate) }} - {{ dateConverter(this.data[0].endDate) }}</v-card-subtitle>
        <v-card class="mt-5 mb-5 pa-5">
            <h3>Vaiheen tiedot</h3>
            <v-container class="d-flex justify-space-around">
            <div>
                <v-chip small :color="statusColor(data[0].statusID)">
                    <span>{{ showStatusCode(data[0].statusID) }}</span>
                </v-chip>
            </div>
            <div>
              <!-- small headers -->
                <p>Myydyt tunnit: </p>
                <p>Alkuperäinen tuntiarvio: </p>
                <p>Tuntiarvio(sis. muutokset): </p> <!--   totalChanges + this.data[0].estimateOriginal -->
                <p>Erotus: </p> <!-- this.data[0].soldHours - tuntiarvio sis muutokset -->
            </div>
            <div>
              <!-- number values -->
                <p>{{ this.data[0].soldHours }}</p>
                <p>{{ this.data[0].estimateOriginal }}</p>
                <p>{{this.allChanges.changes - this.data[0].estimateOriginal }}</p> 
                <p>{{ this.data[0].soldHours - this.allChanges.changes - this.data[0].estimateOriginal }}</p>

            </div>
            <div>
              <!-- small headers -->
                <p>Tehdyt tunnit vs. toteutuneet tunnit: </p> <!-- totalCompletedH - totalWorkedH  -->
                <p>Resursoimatta kokonaisarviosta: </p> <!-- arvio sis muutokset - totalResourcedH -->
                <p>Resursoimatta suunnitelluista tunneista: </p> <!-- totalPlannedH - totalResourcedH -->
                <p>Suunniteltu vs. kokonaisarvio: </p> <!-- arvio sis muutokset - totalPlannedH -->
            </div>
            <div>
                <!-- number values -->
                <p>{{this.allChanges.completed-this.allChanges.worked}}</p>
                <p>{{this.allChanges.changes-this.data[0].estimateOriginal-this.allChanges.resourced}}</p>
                <p>{{this.allChanges.planned-this.allChanges.resourced}}</p>
                <p>{{this.allChanges.changes-this.data[0].estimateOriginal-this.allChanges.planned}}</p>
            </div>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
export default {
  name: 'stageInfo',
  props: {
      sprint: {type: Object},
      allChanges: {type: Object},
  },
  data() {
    return {
        stageId: this.sprint.stage,
        data: [{
            name: '',
        }],
    }
  },
  mounted() {
      this.getStageData();
  },
  methods: {
    //get data from db of stage
    getStageData() {
          this.$axios.post('/api/getStageInfo', { stageId: this.stageId}).then(response => {
                this.data = response.data
            }).catch(error => console.log(error))
    },
    //convert date
    dateConverter(date) {
      const originalDate = new Date(date)
      const dateToLocale = originalDate.toLocaleDateString('fi-FI')
      return dateToLocale
    },
    //status codes
    showStatusCode (status) {
      if (status === 0) { return 'Ei ole alkanut' }
      else if (status === 1) { return 'Työn alla' }
      else if (status === 2) { return 'Tauolla' }
      else if (status === 3) { return 'Valmis' }
      else if (status === 4) { return 'Keskeytynyt' }
      else { return '' }
    },
    // Change status color based on value
    statusColor (value) {
      if (value === 0) { return '#e5a84b' }
      else if (value === 1) { return '#f2d879' }
      else if (value === 2) { return '#f2d879' }
      else if (value === 3) { return '#84bc76' }
      else if (value === 4) { return '#f68181' }
      else { return '#e4e4e4' }
    }
  }
}
</script>
