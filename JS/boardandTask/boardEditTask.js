
let curentTaskID = 0;
async function editPreparation(taskID) {
  let refTask = TASK[0][`Task${taskID}`];
  document.getElementById("mainContent").innerHTML = createTaskTemplate(`${refTask.title}`,`${refTask.description}`, `${refTask.dueDate}`);
  setupSubtaskEnter();
  setupAssignedDropdownClose();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority(`.priorityButton.${refTask.priority.toLowerCase()}`);
  task.priority = refTask.priority;
  setupDueDateInput();
  await loadContacts();
  prepareAssignedToEditTask(refTask);
  selectCategory(refTask.category);
  prepareSubTasksEditTask(refTask);

  document.querySelector('.taskButton').remove();
  document.querySelector('.mainTitle').remove();
  
  createSaveDataEditTaskButton(taskID);

}

function prepareAssignedToEditTask(refTask) {
  task.assignedTo = [];
  for (let index = 0; index < refTask.assignedTo.length; index++) {
    task.assignedTo.push(`${refTask.assignedTo[index]}`);
    
  }
  renderSelectedContactsBelowInput();
}

function prepareSubTasksEditTask(refTask){
if(refTask.subTasks != [] && refTask.subTasks != undefined && refTask.subTasks != null && refTask.subTasks.length != 0){
  task.subTasks = [];
   for (let index = 0; index < refTask.subTasks.length; index++) {
    task.subTasks.push(`${refTask.subTasks[index]}`);
    renderSubTasks();
   }
  }
  
}

function createSaveDataEditTaskButton(taskID) {
  curentTaskID = taskID;
  let refsaveButtonEditTask = document.createElement('div');
  refsaveButtonEditTask.className = "ButtonBlueFilled";
  refsaveButtonEditTask.innerHTML =`OK <img src="./assets/img/check-2.svg" alt="OK">`;
  refsaveButtonEditTask.onclick = saveDataEditTask;
  document.querySelector(".buttonRequiredField").appendChild(refsaveButtonEditTask);
}

async function saveDataEditTask(){
  let refTaskKey = `Task${curentTaskID}`;
  await saveTaskToFirebase(task, curentTaskID, refTaskKey)
}