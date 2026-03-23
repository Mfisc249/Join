let curentTaskID = 0;
let isEditTaskMode = false;
let editSubTaskReview = [];

async function editPreparation(taskID) {
  let refTaskEditTask = TASK[0][`Task${taskID}`];
  prepareEditTaskDialog();
  renderEditTaskForm(refTaskEditTask, taskID);
  applyEditTaskBaseData(refTaskEditTask);
  initializeEditTaskFormInteractions(refTaskEditTask);
  await loadContacts();
  applyEditTaskSelections(refTaskEditTask);
}

function prepareEditTaskDialog() {
  const boardDialog = document.getElementById("boardAddTask");
  if (boardDialog) {
    boardDialog.classList.add("edit-task-dialog");
  }
  isEditTaskMode = true;
  editSubTaskReview = [];
}

function renderEditTaskForm(refTaskEditTask, taskID) {
  document.getElementById("mainContent").innerHTML = createTaskTemplate(`${refTaskEditTask.title}`,`${refTaskEditTask.description}`, `${refTaskEditTask.dueDate}`);
  document.querySelector('.taskButton').remove();
  document.querySelector('.mainTitle').remove();
  createSaveDataEditTaskButton(taskID);
}

function applyEditTaskBaseData(refTaskEditTask) {
  task.title = refTaskEditTask.title;
  task.description = refTaskEditTask.description;
  task.dueDate = refTaskEditTask.dueDate;
}

function initializeEditTaskFormInteractions(refTaskEditTask) {
  setupSubtaskEnter();
  setupAssignedDropdownClose();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority(`.priorityButton.${refTaskEditTask.priority.toLowerCase()}`);
  task.priority = refTaskEditTask.priority;
  setupDueDateInput();
}

function applyEditTaskSelections(refTaskEditTask) {
  prepareAssignedToEditTask(refTaskEditTask);
  selectCategory(refTaskEditTask.category);
  task.category = refTaskEditTask.category;
  prepareSubTasksEditTask(refTaskEditTask);
}

function prepareAssignedToEditTask(refTaskEditTask) {
  if (refTaskEditTask.assignedTo == [] || refTaskEditTask.assignedTo == undefined || refTaskEditTask.assignedTo == null) {
    return;
  }
  task.assignedTo = [];
  for (let index = 0; index < refTaskEditTask.assignedTo.length; index++) {
    task.assignedTo.push(`${refTaskEditTask.assignedTo[index]}`);
    
  }
  renderSelectedContactsBelowInput();
}

function prepareSubTasksEditTask(refTaskEditTask){
  let existingSubTasks = safeArray(refTaskEditTask.subTasks);
  let existingReview = safeText(refTaskEditTask?.subTasksReview?.[0], '').split(',');

  task.subTasks = [...existingSubTasks];
  editSubTaskReview = task.subTasks.map((_, index) => existingReview[index] === 'C' ? 'C' : 'U');
  renderSubTasks();
}

function createSaveDataEditTaskButton(taskID) {
  curentTaskID = taskID;
  let refsaveButtonEditTask = document.createElement('div');
  refsaveButtonEditTask.innerHTML = `<div onclick ="getDataEditTask(); closedialog('boardAddTask'); saveDataEditTask()" class ="ButtonBlueFilled">OK <img src="./assets/img/check-2.svg" alt="OK"></div>`
  document.querySelector(".buttonRequiredField").appendChild(refsaveButtonEditTask);
}

function getDataEditTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const dateInput = document.getElementById("DueDate");

  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;
  task.category = selectedCategory;
}

async function saveDataEditTask(){
  let refTaskEditTask = TASK[0][`Task${curentTaskID}`];
  let checkboxString = getEditTaskSubtaskReviewString(task.subTasks, refTaskEditTask);
  let payload = createEditTaskPayload(refTaskEditTask, checkboxString);
  await DataPUT(`/Tasks/Task${curentTaskID}`, payload);
  boardInit();
}

function createEditTaskPayload(refTaskEditTask, checkboxString) {
  let payload = createBaseEditTaskPayload(refTaskEditTask);
  payload.subTasksReview = { 0: checkboxString };
  return payload;
}

function createBaseEditTaskPayload(refTaskEditTask) {
  return {
    'title': task.title,
    'id': curentTaskID,
    'dueDate': task.dueDate,
    'priority': task.priority,
    'category': task.category,
    'description': task.description,
    'field': refTaskEditTask.field,
    'assignedTo': task.assignedTo,
    'subTasks': task.subTasks,
  };
}

function getEditTaskSubtaskReviewString(subTasks, refTaskEditTask) {
  if (!Array.isArray(subTasks) || subTasks.length === 0) {
    return '';
  }

  let fallbackReview = safeText(refTaskEditTask?.subTasksReview?.[0], '').split(',');
  let normalizedReview = buildNormalizedSubtaskReview(subTasks, fallbackReview);
  return normalizedReview.toString();
}

function buildNormalizedSubtaskReview(subTasks, fallbackReview) {
  let normalizedReview = [];
  for (let index = 0; index < subTasks.length; index++) {
    normalizedReview.push(resolveSubtaskReviewStatus(index, fallbackReview));
  }
  return normalizedReview;
}

function resolveSubtaskReviewStatus(index, fallbackReview) {
  if (editSubTaskReview[index] === 'C') {
    return 'C';
  }
  if (editSubTaskReview[index] === 'U') {
    return 'U';
  }
  return fallbackReview[index] === 'C' ? 'C' : 'U';
}

function handleSubtaskAddedInEditMode() {
  if (!isEditTaskMode) {
    return;
  }

  editSubTaskReview.push('U');
}

function handleSubtaskDeletedInEditMode(index) {
  if (!isEditTaskMode) {
    return;
  }

  editSubTaskReview.splice(index, 1);
}

