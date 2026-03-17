async function editPreparation(taskID) {
  let refTask = TASK[0][`Task${taskID}`];
  document.getElementById("mainContent").innerHTML = createTaskTemplate(`${refTask.title}`,`${refTask.description}`, `${refTask.dueDate}`);
  setupSubtaskEnter();
  setupAssignedDropdownClose();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority(`.priorityButton.${refTask.priority.toLowerCase()}`);
  setupDueDateInput();
  await loadContacts();
  task.assignedTo = [];
  for (let index = 0; index < refTask.assignedTo.length; index++) {
    task.assignedTo.push(`${refTask.assignedTo[index]}`);
    
  }
  renderSelectedContactsBelowInput();
  selectCategory(refTask.category);
  task.subTasks = [];
   for (let index = 0; index < refTask.subTasks.length; index++) {
    task.subTasks.push(`${refTask.subTasks[index]}`);
    
  }
  
  renderSubTasks();
}