<style lang="scss" scoped src="@/assets/styles/stage.scss">
</style>
<style lang="scss">
 .notificationDialog .v-small-dialog__activator .v-small-dialog__activator__content {
    display: inline-block;
    line-height: 1.5em;
    height: 3em;
    overflow: hidden;
  }
</style>

<template>
<v-container v-show="!editMode">
  <!-- <v-btn @click="$emit('editMode', true)" class="mb-3">Muokkaa</v-btn> -->
    <v-container class="stageTable">
        <v-data-table
            :headers="headers"
            :items="sprintRows"
            hide-default-footer
            disable-pagination
            class="elevation-1"
        >
        <template v-slot:top>
            <v-row no-gutters class="stageTableTopRow">
              <v-col>
                Severa
              </v-col>
              <v-col>
                Favro/Kanban
              </v-col>
              <v-col>
                Favro/Backlog
              </v-col>
              </v-row>
          </template>
          <!-- table info for every cell -->
          <template v-slot:body="{ items, headers }">
                    <tbody>
                        <tr v-for="(item,idx) in items" :key="idx"  class="stageTableRows">
                            <td v-for="(header,key) in headers" :key="key">
                              <!-- notification cell -->
                              <div v-show="showTableNotificationCell(header.value)" :class="isCellValid(item[header.value], header.value)" class="notificationDialog">
                              <v-edit-dialog 
                                  :return-value.sync="item[header.value]"
                                  @save="saveTableCell(header.value, item.sprintId, item[header.value])"
                                  large light
                                > {{item[header.value]}}
                                  <template v-slot:input>
                                    <v-text-field
                                      v-model="item[header.value]"
                                      label="Edit"
                                      single-line
                                    ></v-text-field>
                                  </template>
                                </v-edit-dialog>
                                </div>
                              <!-- editable cell -->
                              <div v-show="showTableEdit(header.value)" :class="isCellValid(item[header.value], header.value)">
                              <v-edit-dialog 
                                  :return-value.sync="item[header.value]"
                                  @save="saveTableCell(header.value, item.sprintId, item[header.value])"
                                  large light
                                > {{item[header.value]}}
                                  <template v-slot:input>
                                    <v-text-field
                                      v-model="item[header.value]"
                                      label="Edit"
                                      single-line
                                    ></v-text-field>
                                  </template>
                                </v-edit-dialog>
                                </div>
                                <!-- uneditable cell -->
                                <div v-show="showTableNoEdit(header.value)" class="stageUneditableCell">
                                  <p class="ma-0">{{item[header.value]}}</p>
                                </div>
          </td>
                        </tr>
                         <tr  class="stageTableRows">
                          <td>Yhteensä</td>
                          <td><div>{{ sprintRows.length }}   </div></td>
                          <td><div>{{ totalSprint }}         </div></td>
                          <td><div>{{ totalPlannedH }}       </div></td>
                          <td><div>{{ totalResourcedH }}     </div></td>
                          <td><div>{{ totalWorkedH }}        </div></td>
                          <td><div>{{ totalPlannedForTList }}</div></td>
                          <td><div>{{ totalCompletedH }}     </div></td>
                          <td><div>{{ totalLeftForTlist }}   </div></td>
                          <td><div>{{ totalCorrections }}    </div></td>
                          <td><div>{{ totalNewTasks }}       </div></td>
                          <td><div>{{ totalExtraWork }}      </div></td>
                          <td><div>{{ totalLeft }}           </div></td>
                          <td><div>{{ totalChanges }}        </div></td>
                        </tr>
                    </tbody>
                </template>
        </v-data-table> 
    </v-container>
    </v-container>
</template>

<script>
export default {
  name: 'stageTable',
  props: {sprint: { type: Object},
          editMode: {type: Boolean}
    },
  // props: ['editMode'],
  data () {
     return {
        totalSprint: 0,
        totalPlannedH: 0,
        totalResourcedH: 0,
        totalWorkedH: 0,
        totalPlannedForTList: 0,
        totalCompletedH: 0,
        totalLeftForTlist: 0,
        totalCorrections: 0,
        totalNewTasks: 0,
        totalExtraWork: 0,
        totalLeft: '',
        totalChanges: 0,
        stageId: this.sprint.stage,
        estimateOriginalStageH: 0,
        leftStageH: 0,
        headers: [
          { text: 'Huomiot', align: 'start', sortable: false, value: 'notifications', width: '50px'},
          { text: 'Viikko', sortable: false, value: 'week', width: '50px' },
          { text: 'Sprintti', sortable: false, value: 'sprint', width: '50px' },
          { text: 'Suunniteltu (h)', sortable: false, value: 'plannedH', width: '50px' },
          { text: 'Resursoitu (h)', sortable: false, value: 'resourcedH', width: '50px' },
          { text: 'Tehdyt tunnit', sortable: false, value: 'workedH', width: '50px' },
          { text: 'Työlistalle suunnitellut', sortable: false, value: 'plannedForTList', width: '50px' },
          { text: 'Valmiit tunnit', sortable: false, value: 'completedH', width: '50px' },
          { text: 'Työlistalle jääneet', sortable: false, value: 'leftForTList', width: '50px' },
          { text: 'Korjaukset', sortable: false, value: 'corrections', width: '50px' },
          { text: 'Uudet tehtävät', sortable: false, value: 'newTasks', width: '50px' },
          { text: 'Lisätyöt', sortable: false, value: 'extraWork', width: '50px' },
          { text: 'Jäljellä', sortable: false, value: 'left', width: '50px' },
          { text: 'Muutokset', sortable: false, value: 'changes', width: '50px' },
        ],
        sprintRows: [
        ],
      }
  },
  mounted () {
    //get originally estimated hours and left hours of stage
      this.$axios.post('/api/getStage', { stageId: this.stageId}).then(response => {
        console.log(response.data.estimateOriginal)
          this.estimateOriginalStageH = response.data.estimateOriginal
          this.leftStageH = response.data.estimateOriginal
      }).catch(error => console.log(error))
      //get sprints of stage
    this.getSprints();
  },
  methods: {
    //get sprints of stage
    getSprints() {
      this.$axios.post('/api/getSprint', { stageId: this.stageId}).then(response => {
      //change nulls to 0
      let res = this.changeNull(response.data);
      this.sprintToArray(res);
      console.log("MOUNTED");
      }).catch(error => console.log(error))
    },
    //add sprint data to array 
    sprintToArray(allRows) {
      this.sprintRows = [];
      for (let i in allRows) {
        let leftTList = allRows[i].plannedForTList-allRows[i].completedH
        this.leftStageH = this.leftStageH-allRows[i].completedH+allRows[i].corrections+allRows[i].newTasks+allRows[i].extraWork
        this.sprintRows.push(
            {
            sprintId: allRows[i].sprintID,
            notifications: allRows[i].notifications,
            week: allRows[i].week,
            sprint: allRows[i].sprint,
            plannedH: allRows[i].plannedH,
            resourcedH: allRows[i].resourcedH,
            workedH: allRows[i].workedH,
            plannedForTList: allRows[i].plannedForTList,
            completedH: allRows[i].completedH,
            leftForTList: leftTList,
            corrections: allRows[i].corrections,
            newTasks: allRows[i].newTasks,
            extraWork: allRows[i].extraWork,
            left: this.leftStageH,
            changes: leftTList+allRows[i].corrections+allRows[i].newTasks+allRows[i].extraWork
            }
        )
      }
      this.calculateTotals(this.sprintRows);
    },
    //check if notification cell 
    showTableNotificationCell: function showTableNotificationCell(header) {
      if (header=="notifications") {
        return true;
      }
      else {
        return false;
      }
    },
    //check if cell editable
    showTableEdit: function showTableEdit(header) {
    if (header=="leftForTList" || header=="left" || header=="changes" || header=="notifications") {
        return false;
    }
    else {
      return true;
    }
  },
  //check if cell uneditable
  showTableNoEdit: function showTableNoEdit(header) {
    if (header=="leftForTList" || header=="left" || header=="changes") {
      return true;
    }
    else {
      return false;
    }
  },
  //check if cell input is valid and add indicator if it's not
  isCellValid: function isCellValid(val, h) {
    // if (h != "notifications" && !/^\d+$/.test(val)) {
    if (h != "notifications" && !/^\d+(\.\d+)?$/.test(val)) {
      return "tableCellValid";
    }
  },
  //save edited cell
  saveTableCell: function saveTableCell(h, id, val) {
    if (h == "notifications" || /^\d+(\.\d+)?$/.test(val)) {
      //save empty number cell as 0
     if (val === '' && h != "notifications") {val = 0}
   
    this.$axios.post('/api/saveTable', { key: h, sprintId: id, val: val, stageId: this.stageId}).then(response => {
          console.log(response.data);
      }).catch(error => console.log(error))
    let sprintRowsNoNulls = this.changeNull(this.sprintRows);
    this.calculateTotals(sprintRowsNoNulls);
    }
    else {
      console.log(val + " is not a number!")
    }
  },
  //show null number values as 0
  changeNull: function changeNull(data) {
    let allRows = [];
    let rowKeys = Object.keys(data[0]);
    for (let k in data) {
      let rowVals = Object.values(data[k]);
      let rowVals2 = Object.values(data[k]);
      let oneRow = {};
      for (let i in rowVals) {
        if (rowKeys[i] == "notifications" ) {
          console.log("notifications")
          if(rowVals[i] === null || rowVals[i] === '') {
            rowVals2[i] = '';
          }
        }
        else if(rowVals[i] === null || rowVals[i] === '') {
          rowVals2[i] = 0;
        }
      }
      for (let i = 0; i < rowKeys.length; i++) {
        oneRow[rowKeys[i]] = rowVals2[i]
      }
      allRows.push(oneRow);
    }
    return allRows;
  },
  calculateTotals: function calculateTotals(sprintRows) {
    this.totalPlannedH = 0
    this.totalResourcedH = 0
    this.totalWorkedH = 0
    this.totalPlannedForTList = 0
    this.totalCompletedH = 0
    this.totalLeftForTlist = 0
    this.totalCorrections = 0
    this.totalNewTasks = 0
    this.totalExtraWork = 0
    this.totalChanges = 0
    this.leftStageH = this.estimateOriginalStageH
    for (let k in sprintRows) {
      let leftTList = parseFloat(sprintRows[k].plannedForTList)-parseFloat(sprintRows[k].completedH)
      this.sprintRows[k].leftForTList = leftTList
      console.log(this.leftStageH)
      this.leftStageH = this.leftStageH-parseFloat(sprintRows[k].completedH)+parseFloat(sprintRows[k].corrections)+parseFloat(sprintRows[k].newTasks)+parseFloat(sprintRows[k].extraWork)
      this.sprintRows[k].left = this.leftStageH
      this.sprintRows[k].changes = leftTList+parseFloat(sprintRows[k].corrections)+parseFloat(sprintRows[k].newTasks)+parseFloat(sprintRows[k].extraWork)
      this.totalPlannedH = this.totalPlannedH + parseFloat(sprintRows[k].plannedH)
      this.totalResourcedH = this.totalResourcedH + parseFloat(sprintRows[k].resourcedH)
      this.totalWorkedH = this.totalWorkedH + parseFloat(sprintRows[k].workedH)
      this.totalPlannedForTList = this.totalPlannedForTList + parseFloat(sprintRows[k].plannedForTList)
      this.totalCompletedH = this.totalCompletedH + parseFloat(sprintRows[k].completedH)
      this.totalLeftForTlist = this.totalLeftForTlist + leftTList
      this.totalCorrections = this.totalCorrections + parseFloat(sprintRows[k].corrections)
      this.totalNewTasks = this.totalNewTasks + parseFloat(sprintRows[k].newTasks)
      this.totalExtraWork = this.totalExtraWork + parseFloat(sprintRows[k].extraWork)
      this.totalChanges = this.totalChanges+leftTList+parseFloat(sprintRows[k].corrections)+parseFloat(sprintRows[k].newTasks)+parseFloat(sprintRows[k].extraWork)
    }
    // total sprint
      let last = false;
      let lastCount = 1;
      while(!last) {
        if (sprintRows[sprintRows.length-lastCount].sprint > 0) {
          this.totalSprint = sprintRows[sprintRows.length-lastCount].sprint
          last = true;
        }
        else {
          lastCount++;
        }
      }
      this.passDataToStageInfo();
  },
  passDataToStageInfo() {
    this.$emit('allChanges', {changes: this.totalChanges, completed: this.totalCompletedH, worked: this.totalWorkedH, resourced: this.totalResourcedH, planned: this.totalPlannedH})
    }
  },
}
</script>
