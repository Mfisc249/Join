let currentTaskId;
let subtaskStatusList = [];

/** Opens the dialog with animation */
function opendialog(ID) {
    const refdialog = document.getElementById(ID);
    refdialog.showModal();
    refdialog.classList.remove('closed');
    refdialog.classList.add('opend');
}

/** Closes the dialog with animation */
function closedialog(ID) {
    const refdialog = document.getElementById(ID);
    refdialog.classList.add('closed');
    refdialog.classList.remove('opend');
    setTimeout(() => {
        refdialog.close();
    }, 200)
}

/** Opens the task details dialog and loads all data. */
function openTaskDetails(taskID) {
    let reftaskDetails = document.getElementById('allTaskDetails');
    reftaskDetails.innerHTML = taskDetailsTamplate(taskID);
    renderSubtasks(taskID);
    getTaskDetailsContacts(taskID, 1);
}

/** Hides one element and shows another. */
function displayNone(ID1, ID2) {
    document.getElementById(ID1).classList.add('displayNone');
    document.getElementById(ID2).classList.remove('displayNone');
}

/** Shows the first element and hides the second. */
function removeDisplayNone(ID1, ID2) {
    document.getElementById(ID1).classList.remove('displayNone');
    document.getElementById(ID2).classList.add('displayNone');
}

/** Deletes a task from the DOM and backend. */
function deleteTask(ID){
    document.getElementById(ID).remove();
    checkFieldIsEmpty();
    DataDELETE(`Task${ID}`);
}

/** Sends a DELETE request to remove data at the given path. */
async function DataDELETE(path = "") {
    let response = await fetch(BOARDURLBASE + path + '.json', {
        method: "DELETE"
    });

}

/** Renders all loaded contact details into the container. */
function renderTaskDetailsContacts(contactDetails) {
   let reftaskDetailsATContainer = document.getElementById('taskDetailsAT');
   reftaskDetailsATContainer.innerHTML += taskDetailContactsTamplate(contactDetails.initials, contactDetails.name, contactDetails.color);
    
}

/** Subtasks section logic. */
/** Toggles visibility between unchecked and checked subtask icons. */
function toggleSubtaskCheckboxVisibility(uncheckedCheckboxId, checkedCheckboxId) {
    document.getElementById(uncheckedCheckboxId).classList.toggle('displayNone');
    document.getElementById(checkedCheckboxId).classList.toggle('displayNone');
}

/** Renders all subtasks for a task and initializes their status. */
function renderSubtasks(taskID) {
    let subTaskReviewStatus = TASK[0][`Task${taskID}`].subTasksReview; //await DataGET(`Tasks/Task${taskID}/subTasksReview`);
    subtaskStatusList = [];
    let subTasksString = TASK[0][`Task${taskID}`].subTasks; //await DataGET(`Tasks/Task${taskID}/subTasks`);
    let subTaskCount = (subTasksString.match(/,/g)||[]).length +1;
    document.getElementById('subTasks').innerHTML = "";
    for (let subtaskID = 0; subtaskID < subTaskCount; subtaskID++) {
        let subTask = subTasksString.split(',')[subtaskID];
        subtaskStatusList.push(subTaskReviewStatus[0].split(',')[subtaskID]);
        document.getElementById('subTasks').innerHTML += subtaskTamplate(subtaskID, subTask);
        updateSubtaskCheckboxDisplay(subtaskID);
    }
    currentTaskId = taskID;
    
}

/** Updates checkbox icons for a subtask based on its status. */
function updateSubtaskCheckboxDisplay(subtaskID) {
   let checkedCheckbox = document.getElementById(`stCheckboxC${subtaskID}`);
   let uncheckedCheckbox = document.getElementById(`stCheckboxU${subtaskID}`);
    if (subtaskStatusList[subtaskID] === 'U') {
        checkedCheckbox.classList.add("displayNone");
        uncheckedCheckbox.classList.remove("displayNone");
    }else{
        checkedCheckbox.classList.remove("displayNone");
        uncheckedCheckbox.classList.add("displayNone");
    }
}

/** Toggles the completion status of a subtask. */
function toggleSubtaskStatus(checkboxId, subtaskId) {
    let firstClassOfElement = document.getElementById(checkboxId).classList.item(0);
    if (firstClassOfElement != 'displayNone' ) {
        subtaskStatusList[subtaskId] = 'C';
    }else{
        subtaskStatusList[subtaskId] = 'U';
    }
}

/** Saves the current subtask status list and updates the progress bar. */
async function storeSubtask() {
    let checkboxString = subtaskStatusList.toString();
    TASK[0][`Task${currentTaskId}`].subTasksReview = {0: checkboxString};
    await DataPUT(`Tasks/Task${currentTaskId}/subTasksReview`,{
          0 : `${checkboxString}`
        }
        );

    updateSubtaskProgressbar(currentTaskId);
}