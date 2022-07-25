<style lang="scss" scoped src="@/assets/styles/stage.scss">
</style>
<style lang="scss">
  .stageTableInput {
    margin-top: 0;
  }
  .stageTableInput input {
    text-align: center;
  }
</style>

<template>
<v-container v-show="editMode">
  <!-- <v-btn @click="pageRefresh" class="mb-3">Palaa</v-btn> -->
    <v-container class="stageTable d-flex">
      <v-col class="stageTableRemoveCol">
      <v-row v-for="n in this.sprintRows.length" :key="n"  class="stageTableRemove"><RemoveRowAlert @saved="removeRow(n, ...arguments)"/></v-row>
      </v-col>
      <v-container class="d-flex flex-column">
        <v-data-table
            :headers="headers"
            :items="sprintRows"
            :items-per-page="10"
            class="elevation-1"
            hide-default-footer
            disable-pagination
        >
        <template v-slot:top>
          <!-- top row -->
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
                              <!-- notifications cell -->
                                    <div v-show="showTableNotificationCell(header.value)" :class="[isCellValid(item[header.value], header.value), selectedCell(item['week'], header.value)]">
                                      <v-text-field
                                      v-model="item[header.value]"
                                      single-line
                                      hide-details 
                                      @change="onTableChange"
                                      @input="focusNotification = item[header.value]"
                                      @focus="focusNotification = item[header.value], focusNotifId = item['week'], focusCellH = header.value"
                                    class="stageTableInput"></v-text-field>
                                    </div>
                              <!-- editable cell -->
                                    <div v-show="showTableEdit(header.value)" :class="[isCellValid(item[header.value], header.value), selectedCell(item['week'], header.value)]">
                                      <v-text-field
                                      v-model="item[header.value]"
                                      single-line
                                      hide-details @change="onTableChange"
                                    class="stageTableInput"></v-text-field>
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
        <v-container class="d-flex justify-space-between mt-3">
        <v-container>
        <v-btn id="stageAddRowBtn" v-on:click="addRow">Lisää rivi</v-btn>
        </v-container>
        <saveTableAlert @saved="saveTableEdit" :validity="valid"/>
        <v-btn class="stageCancelBtn"  v-on:click="cancelTableEdit">Peruuta</v-btn>
      </v-container>
      <NotificationsField :notifText="focusNotification" :notifId="focusNotifId" @updatedText="updateNotification"/>
    </v-container> <!-- end of flex-column -->
    </v-container> <!-- end of flex-row-->
    </v-container>
</template>

<script>
import NotificationsField from './NotificationsField'
import SaveTableAlert from './SaveTableAlert'
import RemoveRowAlert from './RemoveRowAlert'
import SaveTableMessage from './SaveTableMessage'
export default {
  name: 'stageTable',
  props: {sprint: { type: Object},
          editMode: {type: Boolean}
    },
  components: {
    NotificationsField,
    SaveTableAlert,
    RemoveRowAlert,
    SaveTableMessage
  },
  data () {
     return {
        focusNotification: '',
        focusNotifId: 0,
        focusCellH: 0,
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
        valid: true,
        headers: [
          { text: 'Huomiot', sortable: false, value: 'notifications', width: '50px'},
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
        oldVals: [
        ]
      }
  },
  mounted () {
    //get originally estimated hours and left hours of stage
      this.$axios.post('/api/getStage', { stageId: this.stageId}).then(response => {
          this.estimateOriginalStageH = response.data.estimateOriginal
          this.leftStageH = response.data.estimateOriginal
      }).catch(error => console.log(error))
      
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
        this.oldVals.push(
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
    // //check if cell is for notifications 
    showTableNotificationCell(header) {
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
    if (h != "notifications" && !/^\d+(\.\d+)?$/.test(val)) {
      return "tableCellValidEdit";
    }
  },
  //show indicator on selected notification cell
  selectedCell: function selectedCell(val, h) {
    if (this.focusNotifId == val && this.focusCellH == h) {
      console.log("SELECTED CELL")
      return "selectedCell";
    }
  },
  // change null values to 0
  changeNull: function changeNull(data) {
    let allRows = [];
    let rowKeys = Object.keys(data[0]);
    for (let k in data) {
      let rowVals = Object.values(data[k]);
      let rowVals2 = Object.values(data[k]);
      let oneRow = {};
      for (let i in rowVals) {
        if (rowKeys[i] == "notifications" ) {
          if(rowVals[i] === null || rowVals[i] === '') {
            rowVals2[i] = '';
          }
        }
        else if(rowVals[i] === null || rowVals[i] === '') {
          rowVals2[i] = 0;
        }
        else {
          parseInt(rowVals2[i]);
        }
      }
      for (let i = 0; i < rowKeys.length; i++) {
        oneRow[rowKeys[i]] = rowVals2[i]
      }
      allRows.push(oneRow);
    }
    return allRows;
  },
  // Calculate total hours of each column
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
      //pass changes to stage info component
      this.passDataToStageInfo();
    },
    //**************** stage-table-edit *******************
    //add new row
    addRow: function addRow() {
      this.sprintRows.push({
            sprintId: 0,
            notifications: '',
            week: 0,
            sprint: 0,
            plannedH: 0,
            resourcedH: 0,
            workedH: 0,
            plannedForTList: 0,
            completedH: 0,
            leftForTList: 0,
            corrections: 0,
            newTasks: 0,
            extraWork: 0,
            left: 0,
            changes: 0
          })
    },
    //remove row
    removeRow: function removeRow(i,isTrue) {
      console.log(isTrue)
      if (isTrue) {
      this.sprintRows.splice(i-1,1);
      }
    },
    //change nulls to 0 and calculate totals when table content changes
    onTableChange: function onTableChange() {
      let sprintRowsNoNulls = this.changeNull(this.sprintRows);
      this.sprintRows = sprintRowsNoNulls;
      this.calculateTotals(sprintRowsNoNulls);
    },
    //cancel all changes
    cancelTableEdit: function cancelTableEdit() {
      this.getSprints();
    },
    //tell to parent if data was saved to show notification
    saveSuccess: function saveSuccess(e) {
      console.log(e);
      if (e == true) {
        this.$emit('tableSaved', true)
      }
      else {
        this.$emit('tableSaved', false)
      }
    },
    //update notification cell if data changed in notifications textarea
    updateNotification: function updateNotification(newVal) {
      const ind = this.sprintRows.findIndex((e => e.week === this.focusNotifId));
      this.sprintRows[ind].notifications = newVal;
    },
    //save added row to database
    saveNewRow: function saveNewRow(keys, vals) {
    var post = { stageId: this.stageId}

    for (let k in keys) {
      if (keys[k] != "sprintId" && keys[k] != "leftForTList" && keys[k] != "left" && keys[k] != "changes") {
        if (keys[k] == "notifications") {
          post[keys[k]] = vals[k];
        }
        else {
          post[keys[k]] = parseInt(vals[k]);
        }
      }
    }
    this.$axios.post('/api/addTableRow', post).then(response => {
      console.log(response.data);
      this.saveSuccess(response.data);
      //update values in code so that saving works properly if user decides to edit and save again
      this.getSprints();
    }).catch(error => console.log(error))
    },
    //save removal of row to database
    saveRemovedRow: function saveRemovedRow(id) {
      console.log("remove from db");
      this.$axios.post('/api/removeTableRow', { sprintId: id }).then(response => {
          console.log(response.data);
          this.saveSuccess(response.data);
          //update values in code so that saving works properly if user decides to edit and save again
          this.getSprints();
        }).catch(error => console.log(error))
    },
    saveTableEdit: function saveTableEdit(isTrue) {
      //check if user confirmed to save
      if (isTrue) {
      //headers array
      let rowKeys = Object.keys(this.sprintRows[0]);
      let allRowVals = [];
      let sprintId = 0;
      //sprint ids array
      let rowIds = [];
      //sprint ids before changes
      let oldIds = [];
      //loop through values in table
      for (let k in this.sprintRows) {
      rowIds.push(this.sprintRows[k].sprintId);
      let rowVals = Object.values(this.sprintRows[k]);
      allRowVals.push(rowVals);

      //update old values and skip possible new row
      if (typeof this.oldVals[k] != 'undefined') {
        let oVals = Object.values(this.oldVals[k]);
        for (let r in rowVals) {
          if (rowKeys[r] == "sprintId") {
            sprintId = rowVals[r];
          }
          else if (rowKeys[r] != "leftForTList" && rowKeys[r] != "left" && rowKeys[r] != "changes") {
            //check if input is new and valid
            if (rowVals[r] != oVals[r] && (rowKeys[r] == "notifications" || /^\d+(\.\d+)?$/.test(rowVals[r]))) {
              console.log(rowVals[r]);
              console.log(rowKeys[r]);
              this.$axios.post('/api/saveTable', { key: rowKeys[r], val: rowVals[r], sprintId: sprintId, stageId: this.stageId}).then(response => {
                  console.log("RESPONSE "+response.data);
                  if (response.data = true) {
                    this.$emit('tableSaved', true)
                    //update values in code so that saving works properly if user decides to edit and save again
                    this.getSprints();
                  }
              }).catch(error => console.log(error), this.$emit('tableSaved', false))
            }
          }
        }
      }
    }
    //save removal of row
    for (let o in this.oldVals) {
      oldIds.push(this.oldVals[o].sprintId);
        if (!rowIds.includes(oldIds[o])) {
          console.log("oldVals 0")
          this.saveRemovedRow(oldIds[o])
        }
    }
    //save added row
    for (let i in rowIds) {
      if (!oldIds.includes(rowIds[i])) {
        console.log("SAVE NEW ROW")
        let vals = allRowVals[i];
        this.saveNewRow(rowKeys, vals);
      }
    }
  }},
  //refresh page 
  // pageRefresh() {
  //   this.$emit('editMode', false)
  //   window.location.reload();
  // },
  // pass changes to stage info component
  passDataToStageInfo() {
    console.log("passdatatostageinfo " +this.totalChanges);
    this.$emit('allChanges', {changes: this.totalChanges, completed: this.totalCompletedH, worked: this.totalWorkedH, resourced: this.totalResourcedH, planned: this.totalPlannedH})
  }
}}
</script>
