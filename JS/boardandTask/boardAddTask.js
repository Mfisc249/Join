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
  for (let index = 0; index < refTask.assignedTo.length; index++) {
    task.assignedTo.push(`${refTask.assignedTo[index]}`);
    
  }
  renderSelectedContactsBelowInput();
}