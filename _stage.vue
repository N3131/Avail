<template>
  <div>
    <!-- Pass the current stage to components -->
    <StageInfo :sprint="$route.params" :allChanges="sprintChanges"/>
    <SprintCharts :sprint="$route.params" />
    <!-- no edit mode -->
    <v-btn @click="eMode = true" class="mb-3" v-show="!this.eMode">Muokkaa</v-btn>
    <StageTable :sprint="$route.params" @allChanges="passInfo" :editMode="this.eMode" @editMode="setMode" />
    <!-- edit mode -->
    <SaveTableMessage class="mt-6" :isSaved="this.isSaved"/>
    <v-btn @click="pageRefresh" class="mb-3" v-show="this.eMode">Palaa</v-btn>
    <StageTableEdit :sprint="$route.params" @allChanges="passInfo" :editMode="this.eMode" @tableSaved="tableS" />
  </div>
</template>
<script>
import SaveTableMessage from '../components/stage/SaveTableMessage.vue'
import StageInfo from '../components/stage/stageInfo.vue'
import StageTable from '../components/stage/StageTable.vue'
export default {
  name: 'StagePage',
  components: {
    SaveTableMessage,
    StageInfo,
    StageTable
  },
  data () {
      return {
        isSaved: false,
        eMode: false,
        sprintChanges: {
          changes: 0,
          completed: 0,
          worked: 0,
          resourced: 0,
          planned: 0
        }
      }
  },
  methods: {
    //check if table saved
    tableS: function tableS(e) {
      if (e == true) {
        this.isSaved = true;
        this.setMsgTimeout();
      }
    },
    //pass data from table to stage info
    passInfo({changes, completed, worked, resourced, planned}) {
      console.log(changes + " " + completed)
      this.sprintChanges.changes = changes;
      this.sprintChanges.completed = completed;
      this.sprintChanges.worked = worked;
      this.sprintChanges.resourced = resourced;
      this.sprintChanges.planned = planned;
    },
    setMode(e) {
      this.eMode = e;
    },
    pageRefresh() {
      window.location.reload();
      // this.eMode = false;
    },
    //show saving message
    setMsgTimeout: function setMsgTimeout() {
      if (this.isSaved) {
        setTimeout(() => this.isSaved = false, 2000)
      }
    }
  }
}
</script>
