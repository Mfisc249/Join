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
}