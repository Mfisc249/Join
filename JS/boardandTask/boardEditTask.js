let curentTaskID = 0;

async function editPreparation(taskID) {
  let refTaskEditTask = TASK[0][`Task${taskID}`];
  document.getElementById("mainContent").innerHTML = createTaskTemplate(`${refTaskEditTask.title}`,`${refTaskEditTask.description}`, `${refTaskEditTask.dueDate}`);
  task.title = refTaskEditTask.title;
  task.description = refTaskEditTask.description;
  task.dueDate = refTaskEditTask.dueDate;
  setupSubtaskEnter();
  setupAssignedDropdownClose();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority(`.priorityButton.${refTaskEditTask.priority.toLowerCase()}`);
  task.priority = refTaskEditTask.priority;
  setupDueDateInput();
  await loadContacts();
  prepareAssignedToEditTask(refTaskEditTask);
  selectCategory(refTaskEditTask.category);
  task.category = refTaskEditTask.category;
  prepareSubTasksEditTask(refTaskEditTask);

  document.querySelector('.taskButton').remove();
  document.querySelector('.mainTitle').remove();
  
  createSaveDataEditTaskButton(taskID);
}

function prepareAssignedToEditTask(refTaskEditTask) {
  task.assignedTo = [];
  for (let index = 0; index < refTaskEditTask.assignedTo.length; index++) {
    task.assignedTo.push(`${refTaskEditTask.assignedTo[index]}`);
    
  }
  renderSelectedContactsBelowInput();
}

function prepareSubTasksEditTask(refTaskEditTask){
if(refTaskEditTask.subTasks != [] && refTaskEditTask.subTasks != undefined && refTaskEditTask.subTasks != null && refTaskEditTask.subTasks.length != 0){
  task.subTasks = [];
   for (let index = 0; index < refTaskEditTask.subTasks.length; index++) {
    task.subTasks.push(`${refTaskEditTask.subTasks[index]}`);
    renderSubTasks();
   }
  }
  
}

function createSaveDataEditTaskButton(taskID) {
  curentTaskID = taskID;
  let refsaveButtonEditTask = document.createElement('div');
  refsaveButtonEditTask.innerHTML = `<div onclick ="getDataEditTask(); saveDataEditTask()" class ="ButtonBlueFilled">OK <img src="./assets/img/check-2.svg" alt="OK"></div>`
  // refsaveButtonEditTask.className = "ButtonBlueFilled";
  // refsaveButtonEditTask.innerHTML =`OK <img src="./assets/img/check-2.svg" alt="OK">`;
  // refsaveButtonEditTask.onclick = saveDataEditTask;
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
  let checkboxString = task.subTasks.map(() => "U").toString();
  let refTaskEditTask = TASK[0][`Task${curentTaskID}`];

  await DataPUT(`/Tasks/Task${curentTaskID}`, {
    'title': task.title,
    'id': curentTaskID,
    'dueDate':  task.dueDate,
    'priority': task.priority,
    'category': task.category,
    'description': task.description,
    'field': refTaskEditTask.field,
    'assignedTo': task.assignedTo,
    'subTasks': task.subTasks,
    'subTasksReview': {
      0: checkboxString,
    }})
}