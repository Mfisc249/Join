let currentTaskId;
let subtaskStatusList = [];
let allContactDetails = [];

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
async function openTaskDetails(taskID) {
    let reftaskDetails = document.getElementById('allTaskDetails');
    reftaskDetails.innerHTML = taskDetailsTamplate(taskID);
    await getTaskDetailsContacts(taskID);
    await renderSubtasks(taskID);
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

/** Contacts section logic. */
/** Loads and renders all contacts assigned to the given task. */
async function getTaskDetailsContacts(taskID) {
   document.getElementById('subTasks').innerHTML = `<img src="./assets/img/loading-3-bars.svg" alt="loadingscreen">`;
   let reftaskDetailsContainer = document.getElementById('taskDetailsAT');
   reftaskDetailsContainer.innerHTML = `<img src="./assets/img/loading-3-bars.svg" alt="loadingscreen">`;
   let refAssignedTo = await DataGET(`Tasks/Task${taskID}/assignedTo`);
   let assignedToCount = (refAssignedTo.match(/,/g)||[]).length +1;
   allContactDetails =[];
   for (let index = 0; index < assignedToCount; index++) {
        let contact = refAssignedTo.split(',')[index];
        allContactDetails.push(await DataGET(`Contacts/${contact}`));
    }
    reftaskDetailsContainer.innerHTML = "";
    renderTaskDetailsContacts(reftaskDetailsContainer)
}

/** Renders all loaded contact details into the container. */
function renderTaskDetailsContacts(reftaskDetailsContainer) {
    allContactDetails.forEach(element => {
        reftaskDetailsContainer.innerHTML += taskDetailContactsTamplate(element.initials, element.name, element.color);
    });
    
}

/** Subtasks section logic. */
/** Toggles visibility between unchecked and checked subtask icons. */
function toggleSubtaskCheckboxVisibility(uncheckedCheckboxId, checkedCheckboxId) {
    document.getElementById(uncheckedCheckboxId).classList.toggle('displayNone');
    document.getElementById(checkedCheckboxId).classList.toggle('displayNone');
}

/** Renders all subtasks for a task and initializes their status. */
async function renderSubtasks(taskID) {
    let subTaskReviewStatus = TASK[0][`Task${taskID}`].subTasksReview; //await DataGET(`Tasks/Task${taskID}/subTasksReview`);
    subtaskStatusList = [];
    let subTasksString = TASK[0][`Task${taskID}`].subTasks; //await DataGET(`Tasks/Task${taskID}/subTasks`);
    let subTaskCount = (subTasksString.match(/,/g)||[]).length +1;
    document.getElementById('subTasks').innerHTML = "";
    for (let index = 0; index < subTaskCount; index++) {
        let subtaskId = index;
        let subTask = subTasksString.split(',')[index];
        subtaskStatusList.push(subTaskReviewStatus[0].split(',')[index]);
        document.getElementById('subTasks').innerHTML += subtaskTamplate(index, subTask, subtaskId);
        updateSubtaskCheckboxDisplay(subtaskId);
    }
    currentTaskId = taskID;
    
}

/** Updates checkbox icons for a subtask based on its status. */
function updateSubtaskCheckboxDisplay(subtaskId) {
   let checkedCheckbox = document.getElementById(`stCheckboxC${subtaskId}`);
   let uncheckedCheckbox = document.getElementById(`stCheckboxU${subtaskId}`);
    if (subtaskStatusList[subtaskId] === 'U') {
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
        console.log(subtaskStatusList);
    }else{
        subtaskStatusList[subtaskId] = 'U';
        console.log(subtaskStatusList);
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