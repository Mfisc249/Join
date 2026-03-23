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
    taskCatagory(taskID, document.getElementById('taskDetailsCatagory'));
    renderSubtasksTaskDetails(taskID);
    getTaskDetailsContacts(taskID, 1);
    taskCheckPriority(taskID, document.getElementById(`taskDetailsPriorityContainer${taskID}`));
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
function deleteTask(ID) {
    let taskElement = document.getElementById(ID);
    if (taskElement) {
        taskElement.remove();
    }
    checkFieldIsEmpty();
    DataDELETE(`Tasks/Task${ID}`);
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
    if (!reftaskDetailsATContainer || !contactDetails) {
        return;
    }
    reftaskDetailsATContainer.innerHTML += taskDetailContactsTamplate(contactDetails.initials, contactDetails.name, contactDetails.color);

}

/** Subtasks section logic. */
/** Toggles visibility between unchecked and checked subtask icons. */
function toggleSubtaskCheckboxVisibility(uncheckedCheckboxId, checkedCheckboxId) {
    document.getElementById(uncheckedCheckboxId).classList.toggle('displayNone');
    document.getElementById(checkedCheckboxId).classList.toggle('displayNone');
}

/** Renders all subtasks for a task and initializes their status. */
function renderSubtasksTaskDetails(taskID) {
    let task = getTaskById(taskID);
    let subTasks = safeArray(task.subTasks);
    let subTaskReviewStatus = safeText(task?.subTasksReview?.[0], '').split(',');
    subtaskStatusList = [];
    let subTasksString = safeArray(task.subTasks);
    let subTasksContainer = document.getElementById('subTasks');

    if (hasNoSubtasks(subTasks) || !subTasksContainer) {
        return;
    }
    renderSubtasksIntoContainer(subTasksContainer, subTasksString, subTaskReviewStatus);
    setCurrentTaskId(taskID);
}

/** Hides the subtasks heading when the current task has no subtasks. */
function hasNoSubtasks(subTasks) {
    if (subTasks.length === 0) {
        document.getElementById('subTasksHeadline').classList.add('displayNone');
        return true;
    }
    return false;
}

/** Renders every subtask entry into the task details container. */
function renderSubtasksIntoContainer(subTasksContainer, subTasksString, subTaskReviewStatus) {
    subTasksContainer.innerHTML = "";
    for (let subtaskID = 0; subtaskID < subTasksString.length; subtaskID++) {
        renderSingleSubtask(subtaskID, subTasksString[`${subtaskID}`], subTaskReviewStatus);
    }
}

/** Renders one subtask row and stores its current completion status. */
function renderSingleSubtask(subtaskID, subTask, subTaskReviewStatus) {
    subtaskStatusList.push(subTaskReviewStatus[subtaskID] === 'C' ? 'C' : 'U');
    document.getElementById('subTasks').innerHTML += subtaskTamplate(subtaskID, subTask);
    updateSubtaskCheckboxDisplay(subtaskID);
}

/** Stores the currently opened task ID for later subtask updates. */
function setCurrentTaskId(taskID) {
    currentTaskId = taskID;
}

/** Updates checkbox icons for a subtask based on its status. */
function updateSubtaskCheckboxDisplay(subtaskID) {
    let checkedCheckbox = document.getElementById(`stCheckboxC${subtaskID}`);
    let uncheckedCheckbox = document.getElementById(`stCheckboxU${subtaskID}`);
    if (!checkedCheckbox || !uncheckedCheckbox) {
        return;
    }

    let isUnchecked = subtaskStatusList[subtaskID] === 'U';
    toggleSubtaskCheckboxClasses(checkedCheckbox, uncheckedCheckbox, isUnchecked);
}

/** Applies the correct visible state to the checked and unchecked subtask icons. */
function toggleSubtaskCheckboxClasses(checkedCheckbox, uncheckedCheckbox, isUnchecked) {
    checkedCheckbox.classList.toggle("displayNone", isUnchecked);
    uncheckedCheckbox.classList.toggle("displayNone", !isUnchecked);
}

/** Toggles the completion status of a subtask. */
function toggleSubtaskStatus(checkboxId, subtaskId) {
    let firstClassOfElement = document.getElementById(checkboxId).classList.item(0);
    if (firstClassOfElement != 'displayNone') {
        subtaskStatusList[subtaskId] = 'C';
    } else {
        subtaskStatusList[subtaskId] = 'U';
    }
}

/** Saves the current subtask status list and updates the progress bar. */
async function storeSubtask() {
    if (!hasValidCurrentTaskId()) {
        return;
    }

    let checkboxString = subtaskStatusList.toString();
    let refTaskStoreSubtask = getTaskById(currentTaskId);
    if (Object.keys(refTaskStoreSubtask).length === 0) {
        return;
    }

    await saveSubtaskReviewAndUpdateProgress(refTaskStoreSubtask, checkboxString);
}

/** Checks whether a valid task is currently selected in the task details dialog. */
function hasValidCurrentTaskId() {
    return currentTaskId !== undefined && currentTaskId !== null;
}

/** Updates in-memory and persisted subtask states and refreshes the progress bar. */
async function saveSubtaskReviewAndUpdateProgress(refTaskStoreSubtask, checkboxString) {
    updateStoredSubtaskReview(refTaskStoreSubtask, checkboxString);
    await persistSubtaskReview(checkboxString);
    updateSubtaskProgressbar(currentTaskId);
}

/** Writes the current subtask review string into the loaded task object. */
function updateStoredSubtaskReview(refTaskStoreSubtask, checkboxString) {
    refTaskStoreSubtask.subTasksReview = { 0: checkboxString };
}

/** Persists the current subtask review string for the opened task. */
async function persistSubtaskReview(checkboxString) {
    await DataPUT(`Tasks/Task${currentTaskId}/subTasksReview`, {
        0: `${checkboxString}`
    });
}

